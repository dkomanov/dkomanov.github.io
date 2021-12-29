---
type: blog
date: 2020-05-24
title: "Writing Async App in Scala. Part 2: Exception Handling"
description: How to propagate errors in async world? What are caveats of using exceptions in async programming? Use exceptions as a primary propagation mechanism while being on a safe side.
cover: ./cover.jpg
tags: ["scala", "async", "exception", "error"]
canonicalUrl: https://medium.com/@dkomanov/writing-async-app-in-scala-part-2-exception-handling-3fba8504c6fa
---

> In this part we will cover the exception handling for async programming in Scala with Futures. \
> [Part 1. Coding.](/p/writing-async-app-in-scala-part-1-coding) \
> Part 2. Exception Handling. \
> [Part 3. Threading Model.](/p/writing-async-app-in-scala-part-3-threading-model) \
> Part 4. Rewrite Blocking App. \
> Part 5. What's next?

I deliberately named this part as "Exception Handling". There are different error handling models: exceptions, error codes, returning [Either](https://www.adtran.com/index.php/blog/technology-blog/255-asynchronous-functional-error-handling-in-scala) of business result or some kind of error etc. I'm not going to describe all possible options here, I decided to use exceptions (or, to better put it, `Future.failed` with exception inside) as a error propagation mechanism, mainly because:
1. Familiarity. We all use exceptions in pre-async non-functional world.
2. It's impossible to turn off exceptions in JVM, so it will be a part of `Future` anyway.
3. Simplicity. It doesn't require to build any kind of rich system for error handling, there is one out of the box.

Future is like [Try](https://www.scala-lang.org/api/2.12.10/scala/util/Try.html) in terms of exception handling: all methods of Future do catch exceptions and transforms Future into [failed](https://www.scala-lang.org/api/2.12.10/scala/concurrent/Future$.html#failed[T](exception:Throwable):scala.concurrent.Future[T]) Future. Except for the `onComplete` and `foreach` methods, exception from your callback will return in propagation to the [reportFailure](https://www.scala-lang.org/api/2.12.10/scala/concurrent/ExecutionContext.html#reportFailure(cause:Throwable):Unit) of your [ExecutionContext](https://www.scala-lang.org/api/2.12.10/scala/concurrent/ExecutionContext.html). So, it's safe to throw an exception in all functions that you pass to Future (map, flatMap etc.).

However, there's a caveat...

## The Great Caveat

Whenever it's declared that a function returns `Future`, there is an assumption, that function can't throw an exception -- it returns a Future that eventually will be successful or failed. The compiler doesn't enforce such an assumption, and it's possible that this task is too complicated without too much of a boilerplate code. Also it could be even annoying, because in most of the application code it doesn't matter whether a function actually throws an exception or returns a failed Future, but not always.

When you're in a Future's execution lifecycle, meaning calling methods of existing Future object like `map`, `flatMap` and `transform`, you're safe in terms of exceptions:
```scala
Future(42)
  .map[Int](_ => throw new IllegalArgumentException)
  .flatMap[Int](_ => throw new IllegalStateException)
// Effectively: Future.failed(new IllegalArgumentException)
```

But outside of this lifecycle there may be a problem:
```scala
def innocentFunction(param: AnyRef): Future[Int] = {
  require(param != null)
  Future.successful(42)
}

innocentFunction(null)
  .map(_ => throw new IllegalStateException)
// an IllegalArgumentException will be thrown before map call
```

It's very important to be cautious in, let's call it, entry points. Whenever you're outside of Future's execution lifecycle. Usually, a web framework covers most of your application code -- it provides and entry point like this for you:
```scala
def rpcFunction(param: AnyRef)(implicit ec: ExecutionContext): Future[AnyRef]
```

And inside such function it's safe to throw exceptions, because the framework does `try..catch` for you (usually). But sometimes you need to escape from this lifecycle. This is obviously an edge case, vast majority of the code is usually within safe boundaries.

## Exploring an edge case

I'll give you an example. Suppose, we have an HttpRequest and we have caching layers (memcached and CDN) and a fallback to a Hadoop calculation (which takes a long time):

```scala
case class HttpRequest(uri: String)

def handleFromMemcached(r: HttpRequest): Future[Option[Int]] = {
  require(r.uri != "/memcached-boom", "Memcached Boom!")
  Future.successful(if (r.uri == "/memcached") Some(42) else None)
}

def handleFromCdn(r: HttpRequest): Future[Option[Int]] = {
  require(r.uri != "/cnd-boom", "CDN Boom!")
  Future.successful(if (r.uri == "/cdn") Some(42) else None)
}

def handleFromHadoop(r: HttpRequest): Future[Int] =
  Future.successful(42)

def handle(r: HttpRequest): Future[Int] = {
  // suppose here we're inside Future's execution lifecycle, so it's safe to throw exceptions.
  handleFromMemcached(r)
    .flatMap { memcachedResult =>
      memcachedResult.fold {
        handleFromCdn(r).flatMap { cdnResult =>
          cdnResult.fold {
            handleFromHadoop(r)
          }(Future.successful)
        }
      }(Future.successful)
    }
}
```

And then:
```scala
handle(HttpRequest("/memcached-boom")) // will throw IllegalArgumentException("Memcached Boom!")
```

The call itself will throw an exception, but the "framework" code usually wraps it in `try..catch`, so it will be handled correctly. Ok, this code works, but the implementation of the `handle` method is eye-bleeding: imagine we have 10 caching layers (or just intermediate calculations that we would like to reuse), it would be a nesting hell. Instead it would be nice to have something like this:
```scala
val handlers: List[HttpRequest => Future[Option[Int]]] = List(
  handleFromMemcached,
  handleFromCdn,
  r => handleFromHadoop(r).map(Some.apply)
)

def handle(r: HttpRequest): Future[Int] = {
  executeLazily(handlers.map(handler => () => handler(r)))
    .map(_.getOrElse(throw new IllegalStateException("Hadoop should always return Some!")))
}

def executeLazily(list: List[() => Future[Option[Int]]]): Future[Option[Int]]
```

Let's implement this `executeLazily` function in a generic manner:
```scala
def executeLazily[Argument, Return](argument: Argument,
                                    list: List[Argument => Future[Option[Return]]])
                                   (implicit ec: ExecutionContext): Future[Option[Return]] = {
  val promise = Promise[Option[Return]]()
  val iterator = list.iterator

  def completeWith(t: Try[Option[Return]]): Unit = t match {
    case Success(value) =>
      if (value.isDefined || !iterator.hasNext)
        promise.success(value)
      else
        //             ↓ DANGER IS HERE
        iterator.next().apply(argument).onComplete(completeWith)

    case Failure(exception) =>
      promise.failure(exception)
  }

  completeWith(Success(None))

  promise.future
}
```

Here we create a Promise and resolve it once we encounter an exception or the Some result. But the problem here is that we use `onComplete` method, which means that we escape the boundaries of the execution lifecycle, and exception in a callback of the `onComplete` method will be propagated to ExecutionContext, not to the instance of Future. And this is something that we should keep in mind. So, with this implementation this will lead to a biiig problem:
```scala
handle(HttpRequest("/cdn-boom"))
```

And it's quite severe, because the framework will get the Future from our `handle` method, but this Future won't be resolved ever. And this, depending on defined timeouts, throttling and load could lead to something really bad (OutOfMemory, elevated response times etc.)

## More Trivial Example

Actually, there is a simpler case for showing why an async application shouldn't throw exceptions but only return it as failed futures.

```scala
def rpcCall: Future[Option[String]] = ???
def reportException(e: Throwable): Unit = e.printStackTrace()

def getUrlSafe: Future[Option[String]] = {
  rpcCall.recover {
    case e: Throwable =>
      reportException(e)
      None
  }
}
```

As you may see, if the `rpcCall` function will throw an exception, this method won't work as expected. Instead of falling back to `None` it will rethrow an exception. Most likely, at the end it will be properly wrapped in `Future.failed` or handled by the framework. But the end result would be undesired.

## How to safely create futures?

There are couple solutions.

### Train Alertness

One is to pay extra attention to places in your code, when execution is going outside of the Future's execution context: whenever you're using the `onComplete` method or creating a `Promise` that will be completed asynchronously, etc.

In our case, fix this line:
```scala
iterator.next().apply(argument).onComplete(completeWith)
```

To something like this:
```scala
try {
  iterator.next().apply(argument).onComplete(completeWith)
} catch {
  case NonFatal(e) => promise.failure(e)
}
```

As you may see, we added `try..catch` block here in order to prevent a possibility of an unhandled exception when we call `apply` method: if it throws we'll just resolve a `Promise` with the exception and it will be propagated further.

### Put some boilerplate everywhere

Another angle to handle this problem is a kind of defensive programming: minimize possibility of raising an exception. By using an utility function we may wrap all functions that produces a `Future`:
```scala
def safeFuture[T](f: => Future[T]): Future[T] = {
  try {
    f
  } catch {
    case NonFatal(e) => Future.failed(e)
  }
}

def handleFromMemcached(r: HttpRequest): Future[Option[Int]] = safeFuture {
  require(r.uri != "/memcached-boom", "Memcached Boom!")
  Future.successful(if (r.uri == "/memcached") Some(42) else None)
}
```

And now, this function will never throw an exception, but return a failed Future instead.

## Conclusion

As you may see, none of these approaches is error-prone, it's very easy to forget to use `safeFuture` or miss an `onComplete` call somewhere in a codebase. Both compiler and IDE won't help you to identify this problem.

It's important to be very conscious about leaving safe boundaries of the application in terms of an exception handling. Whenever you use `onComplete`/`foreach` or `Promise` (or some callback of a third party library), it's a good indicator that you should be extra careful and pay attention.

Also, in my opinion, exceptions aren't good (to say the least) for async programming specifically, as stack trace is mostly useless (I'll back to this point in the next part), creation of an exception is a bit expensive and we don't really utilize in Scala all its power. However, exceptions are embedded in JVM and `Future`, so it's just seems too much of a burden not to use it in given circumstances.

All code is available on [GitHub](https://github.com/dkomanov/stuff/tree/master/src/com/komanov/future). Originally posted on [Medium](https://medium.com/@dkomanov/writing-async-app-in-scala-part-2-exception-handling-3fba8504c6fa). [Image](https://pixabay.com/photos/building-control-panel-controls-1853330/) by [Pexels](https://pixabay.com/users/Pexels-2286921/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1853330) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1853330).
