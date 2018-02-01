Recently I’ve fixed a flaky test and I want to share some thoughts (very trivial)
about how to make no mistakes. So, we have a simple class Throttler for dealing
high load on a some part of code (basically it’s a wrapper around
[Semaphore](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Semaphore.html)):

```scala
class ThrottledException extends RuntimeException("Throttled!")
class Throttler(count: Int) {
  private val semaphore = new Semaphore(count)
  def apply(f: => Unit): Unit = {
    if (!semaphore.tryAcquire()) throw new ThrottledException
    try {
      f
    } finally {
      semaphore.release()
    }
  }
}
```

I use [specs2](https://etorreborre.github.io/specs2/) for a testing. The first test will be sequential
(very simple):

```scala
class ThrottlerTest extends Specification {
  "Throttler" should {
    "execute sequential" in new ctx {
      var invocationCount = 0
      for (i <- 0 to maxCount) {
        throttler {
          invocationCount += 1
        }
      }
      invocationCount must be_==(maxCount + 1)
    }
  }
  trait ctx {
    val maxCount = 3
    val throttler = new Throttler(maxCount)
  }
}
```

Ok. Now we need to test that our Throttler works well in a multithreaded environment.
Let’s prepare for an async test and add some support code to ctx trait:

```scala
val e = Executors.newCachedThreadPool()
implicit val ec: ExecutionContext=ExecutionContext.fromExecutor(e)
private val waitForeverLatch = new CountDownLatch(1)
override def after: Any = {
  waitForeverLatch.countDown()
  e.shutdownNow()
}
def waitForever(): Unit = try {
  waitForeverLatch.await()
} catch {
  case _: InterruptedException =>
  case ex: Throwable => throw ex
}
```

ExecutionContext is for Future construction, waitForever method is to sleep to the
end of test. In the after function we shutdown an executor service.

A naive way to test multithreaded behavior of the Throttler will be:

```scala
"throw exception once reached the limit [naive,flaky]" in new ctx {
  for (i <- 1 to maxCount) {
    Future {
      throttler(waitForever())
    }
  }
  throttler {} must throwA[ThrottledException]
}
```

We’re creating maxCount Futures that calls function waitForever which is waiting
until the end of test. Of course this naive way almost doesn’t work. Plenty of
times we will be exception expectation error: the last call for a throttler
(with expectation) may occur before one of futures start (and exception will
be thrown in this future).

To fix it we need to wait somehow until all futures starts. Here is an approach
that is familiar to many of us:

```scala
"throw exception once reached the limit [naive, bad]" in new ctx {
  for (i <- 1 to maxCount) {
    Future {
      throttler(waitForever())
    }
  }
  Thread.sleep(1000)
  throttler {} must throwA[ThrottledException]
}
```

Yes, just add a sleep method call with some reasonable duration. Ok, now our test
will pass almost always, but… This approach is wrong at least by two reasons:
* A duration of test will be as long as “reasonable duration”
* Sometimes (in very rare situations like machine is under high load) it
won’t work — this reasonable duration won’t be enough.

If you’re still doubt about it — ask [Google](https://www.google.com/?q=why+thread+sleep+is+a+bad+practice+java) for more
reasoning. Now we will try to synchronize start of futures and our expectation.
Let use CountDownLatch class from java.util.concurrent:

```scala
"throw exception once reached the limit [working]" in new ctx {
  val barrier = new CountDownLatch(maxCount)

  for (i <- 1 to maxCount) {
    Future {
      throttler {
        barrier.countDown()
        waitForever()
      }
    }
  }

  barrier.await(5, TimeUnit.SECONDS) must beTrue

  throttler {} must throwA[ThrottledException]
}
```

We use CountDownLatch for a [barrier synchronization](https://en.wikipedia.org/wiki/Barrier_%28computer_science%29).
Await method will wait until latch count won’t reach zero. And just to mention,
we use a little bit higher timeout for waiting. It’s just to avoid failing in
rare cases, it won’t affect on test duration (it will be much less than a second).

Instead of a conclusion I want to share with my own rule about Thread.sleep.
I use it only to check a hypothesis (in case when I’m not sure) — it takes a bit
less time to insert sleep on a certain place. And in general when I’m thinking
about sleeping I use CountDownLatch. Even for a trivial waiting (like waitForever
function, I could use something like `Thread.sleep(Long.MAX_VALUE)`) because it’s
always better not to use fragile approach at all.

Related links:
* [Code](https://github.com/dkomanov/scala-junk/blob/master/src/test/scala/com/komanov/examples/ThrottlerTest.scala) related to the post.
* Reworked version in [Wix Blog](http://engineering.wix.com/2015/10/07/testing-asynchronous-code/).
* Republished version on [javacodegeeks](http://www.javacodegeeks.com/2015/10/testing-asynchronous-code.html).
* [Cover image](https://pixabay.com/en/ancient-art-background-cosmos-dark-764930/)
