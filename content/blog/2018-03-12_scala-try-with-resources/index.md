---
type: blog
date: 2018-03-12
title: Scala try-with-resources
description: My 2 cents on how to properly manage resources in Scala, or a story of reimplementing try-with-resources in Scala.
tags: ["scala", "java", "exception", "error", "io"]
canonicalUrl: https://medium.com/@dkomanov/scala-try-with-resources-735baad0fd7d
---
> UPD: Apparently in top5 from Google there are no correct examples, changed text accordingly.

Resource management is a very important topic in software development. Also, it is hard to add something new to it. The topic is covered pretty well in all kinds of blog posts, articles, and tech papers. Nevertheless, I have something to say, not new, but I believe it's worth repeating.

## Intro

A usual pattern for working with files (or other resources), for example, is following:

```scala
val file: InputStream = _
try {
  // read from stream
} finally {
  file.close()
}
```

But this is not the "right" way of working with resources, because if there are exceptions both in try-block and finally-block, then the latter will "overthrow" the exception from try-block (that exception will be lost). Not nice.

## More plot into a subject

It's quite common to use [IOUtils.closeQuietly](https://commons.apache.org/proper/commons-io/javadocs/api-2.5/org/apache/commons/io/IOUtils.html#closeQuietly(java.io.Closeable)) for this matter:

```scala
var file: InputStream = _
try {
  // read from stream
} finally {
  IOUtils.closeQuietly(file)
}
```

By doing this exception in finally-block is just ignored. Which is also not always good.

I've recently [upgraded](https://commons.apache.org/proper/commons-io/upgradeto2_6.html) Apache Commons library in one of my projects and I noticed that the IOUtils.closeQuietly method became [deprecated](https://docs.oracle.com/javase/7/docs/technotes/guides/javadoc/deprecation/deprecation.html). So, now I finally have to do something with it to make it right.

## try-with-resources

In Java, since Java7, there is a special language construct for such cases, called try `try-with-resources`. This concept described very well in [this](http://www.oracle.com/technetwork/articles/java/trywithresources-401775.html) tech article. Actually, most of the content of this post is scattered there (not everything, thankfully).

What I tried to do, is to find a way of reusing this pattern, but in Scala. I was quite disappointed, I must say. From 5 first results in [Google](https://www.google.com/search?q=scala+try+with+resources) there wasn't any correct! This is why I decided to go over some mistakes that were made there.

### Mistake 1: swallow exception in finally

As I mentioned in the first example, such code isn't good:

```
finally {
  file.close()
}
```

`close` can throw an exception, therefore exception thrown in try-block might be swallowed. How to deal with it? The solution isn't "neat".

```
var exception: Throwable = null
val file: InputStream = _
try {
  // read from stream
} catch {
  case e =>
    exception = e
    throw e
} finally {
  try {
    file.close()
  } catch {
    case fe =>
      if (exception != null) {
        exception.addSuppressed(fe)
      } else {
        throw fe
      }
  }
}
```

Ok, this is a little bit long one, but what is important here is a call to [addSuppressed](https://docs.oracle.com/javase/7/docs/api/java/lang/Throwable.html#addSuppressed(java.lang.Throwable)) method. So, if there was an exception in try-block, exception from `close` won't swallow it but will be just added to original exception as suppressed. Nice!

This mistake I saw in many places, for example in the most popular [StackOverflow](https://stackoverflow.com/questions/39866000/java-try-with-resource-not-working-with-scala) [response](https://stackoverflow.com/a/39868021/426397).

### Mistake 2: Catching Exception/Throwable

Another thing that people don't pay attention is a catch clause. What can be wrong with it? Actually, a lot.

Let's take as an example the [first link](https://www.phdata.io/try-with-resources-in-scala/) from Google:

```scala
def cleanly[A, B](resource: A)(cleanup: A => Unit)(doWork: A => B): Try[B] = {
    try {
      Success(doWork(resource))
    } catch {
      case e: Exception => Failure(e)
    }
    finally ...
```

Here we see an attempt to wrap execution result to a `Try` monad. What I want to concentrate on in this example is

```
case e: Exception => Failure(e)
```

What does it mean? First of all, some Throwable descendants won't be caught, which might be surprising to a caller. Secondly, there is one particular exception, that shouldn't be caught in that manner, and it's an [InterruptedException](https://docs.oracle.com/javase/7/docs/api/java/lang/InterruptedException.html). There is a good [post](https://stackoverflow.com/a/3976377/426397) about it.

By the way, another mistake is to just catch everything, which is even worse.

So, what to do? Happily, in Scala there is a [NonFatal](http://www.scala-lang.org/api/current/scala/util/control/NonFatal$.html) extractor (thanks to [Twitter](http://twitter.github.io/effectivescala/#Error%20handling-Handling%20exceptions)), which you may safely use instead:

```
case NonFatal(e) => Failure(e)
```

It won't match special exceptions like InterruptedException or OutOfMemoryError, which will be just propagated. What's also good, this extractor is used inside Try and Future, so you don't need to care in your code about it.

### Mistake 3: Not closing resource

In previous part I suggested to use NonFatal extractor, but it has to be used wisely. Another [example](https://codereview.stackexchange.com/questions/79267/scala-trywith-that-closes-resources-automatically) from Google. In attempt to make try-with-resources more idiomatic, the big mistake was introduced:

```scala
def apply[C <: Closeable, R](resource: => C)(f: C => R): Try[R] =
  Try(resource).flatMap(resourceInstance => {
    try {
      val returnValue = f(resourceInstance)
      Try(resourceInstance.close()).map(_ => returnValue)
    } catch {
      case NonFatal(exceptionInFunction) =>
        try {
          resourceInstance.close()
          Failure(exceptionInFunction)
        } catch {
          case NonFatal(exceptionInClose) =>
            exceptionInFunction.addSuppressed(exceptionInClose)
            Failure(exceptionInFunction)
        }
    }
  })
```

Notice that catch clause: on NonFatal exception - close the resource. But what's about fatal exception? What are we supposed to do with resources? Remember, one of the fatal exceptions is InterruptedException? Isn't it normal to cleanup before stopping thread? Of course it is.

The general rule is you should always try to close (release) the resource. Even in case of "fatal" exception.

### Mistake 4: Swallowing exceptions from close

I showed, in the beginning, a use of `closeQuietly` in finally. When can it be bad? Let's put aside the topic of swallowing exceptions in general. Let's assume, that it's either ok or we do proper logging on the swallow. So, what can go wrong?

Here is a very simple example that describes the problem:

```scala
val file = new FileOutputStream("file.bin")
try {
  file.write(1)
} finally {
  try {
    file.close()
  } catch {
    case NonFatal(e) => // log it properly!
  }
}
```

So, what does it mean when [close](http://hg.openjdk.java.net/jdk9/jdk9/jdk/file/tip/src/java.base/share/classes/java/io/FileOutputStream.java) throws an exception? It could mean many things:
* Internal buffer failed to flush bytes on disk.
* Some internal error during closing a file descriptor.

We can't do anything about the latter case. But what's about failing flush on disk? We can definitely say, that our file doesn't contain exactly what we expected to write there.

So, in this case, when we write something in a file (socket, whatever), we shouldn't swallow exception on close, because we can't definitively say whether our business process succeeded or not. So, we should signal to our caller, that we failed.

Also, we may deduct from it, that it's mostly fine to swallow exception in close during reading.

## try-with-resources in Scala

So, how the OK version of try-with-resources in Scala may look like?

```scala
def withResources[T <: AutoCloseable, V](r: => T)(f: T => V): V = {
  val resource: T = r
  require(resource != null, "resource is null")
  var exception: Throwable = null
  try {
    f(resource)
  } catch {
    case NonFatal(e) =>
      exception = e
      throw e
  } finally {
    closeAndAddSuppressed(exception, resource)
  }
}

private def closeAndAddSuppressed(e: Throwable, resource: AutoCloseable): Unit = {
  if (e != null) {
    try {
      resource.close()
    } catch {
      case NonFatal(suppressed) =>
        e.addSuppressed(suppressed)
    }
  } else {
    resource.close()
  }
}
```

A little bit verbose, but it should be a part of a standard library (or your framework), so who cares?

## Recap

Let's recap the main points:
* Don't catch `Exception` or `Throwable`.
* Be cautious in finally clause, don't let exception there to overthrow an original one.
* You may swallow exceptions in close for read operations.

## Conclusion

Despite the fact that resource management is a well-known subject, there are still many mistakes around it. Especially in languages not mature enough (I believe, Scala is one of that kind). Don’t get me wrong, there are libraries in Scala world that handle resource management properly, i.e. [better-files](https://github.com/pathikrit/better-files/) or [scala-arm](https://github.com/jsuereth/scala-arm/). But I believe that it should be a part of the language. Either as a language construct or as a part of a scala-library. It’s too important to not have it.

All code is available on [GitHub](https://github.com/dkomanov/stuff/tree/master/src/com/komanov/io). Originally posted on [Medium](https://medium.com/@dkomanov/scala-try-with-resources-735baad0fd7d).
