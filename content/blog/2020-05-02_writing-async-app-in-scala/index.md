---
draft: true
type: blog
date: 2020-05-02
title: Writing Async App in Scala with Futures
description: TBD
tags: ["scala", "async", "exception", "error"]
canonicalUrl: TBD
---

[retries](https://medium.com/@john.m.murray786/exponential-back-off-with-scala-futures-7426340d0069)
[timeout](http://justinhj.github.io/2017/07/16/future-with-timeout.html)

Today asynchronous programming gets some traction. Some may argue even some hype. However, there are cases when it's really necessary (or, let's put it mildly, favorably). In this blog post I'd like to put aside reasons behind writing an application in an async fashion, it's a separate topic. Here I want to focus on the practical side of this topic - how it looks like, what we have to do in order to make it simpler, and what problems we may encounter. Everything here is based on my personal experience, so I hope it won't be too academic.

Another thing, I'm not going to explore different approaches of achieving asynchronicity (actor model, functional approaches, etc.) I've chosen approach with [Future model](https://docs.scala-lang.org/overviews/core/futures.html) of Scala because of the least additional cost of learning. This concept is easier understandable both for me and for people around me: leap from sync jala (java style on Scala) programming to Futures is just shorter.

This post is written under the assumption that the reader is familiar with the concept of Future/Promise model and familiar with its implementation in Scala. If not, I would advise to read these articles first: [Asynchronous Programming and Scala](https://alexn.org/blog/2017/01/30/asynchronous-programming-scala.html) by [Alexandru Nedelcu](https://alexn.org/) and [The Neophyte's Guide to Scala Part 8: Welcome to the Future
](https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-8-welcome-to-the-future/) by [Daniel Westheide](https://danielwestheide.com/) (entire Neophyte's Guide is awesome!).

After such a long disclaimer, I have one more thing to say. A kind of application that I'm having in mind is simple: a backend for DB (not really important which one) with some REST/RPC exposure to the world (or internal world), which may also communicate via the network with other applications. Regular "web" application.

TBD - make kind of TOC, disclaimer about skipping some parts.

## Regular web application

In our synchronous world, the application may look like this:

```scala
def validateRequest(request: Request): Unit = {
  require(request != null)
}

def regularRpcEndpoint(request: Request): Response = {
  validateRequest(request)

  if (!isPermittedViaRpc) {
    throw new PermissionDeniedException("...")
  }

  val fromDb = retrieveFromDatabase(request.id)
  val payload = convertPayloadFromDb(fromDb)
  Response(payload)
}
```

By the end of this post I hope it will be clear, how to rewrite application in asynchronous way and avoid some dangers of async approach.

## Writing in async fashion

NB: For simplicity let's not think about `implicit ec: ExecutionContext` argument for Future operations yet. I will cover this topic a bit further.

A straight-forward rewrite would look like:
```scala
def regularRpcEndpoint(request: Request): Future[Response] = {
  validateRequest(request)

  isPermittedViaRpc.flatMap { isPermitted =>
    if (!isPermitted) {
      Future.failed(new PermissionDeniedException("..."))
    } else {
      retrieveFromDatabase(request.id)
        .map(convertPayloadFromDb)
        .map(Response)
    }
  }
}
```

In the following examples, I'll show how to write a bit prettier...

### if-statement replacement

Suppose we have old-school future-less code:

```scala
def condition: Boolean = ...

def action1(): Unit = ...
def action2(): Unit = ...

if (condition) {
  action1()
} else {
  action2()
}
```

How it would look like with futures? Suppose, all methods use some kind of IO inside, so:
```scala
def condition: Future[Boolean] = ...

def action1(): Future[Unit] = ...
def action2(): Future[Unit] = ...

condition.flatMap(
  if (_)
    action1()
  else
    action2()
)
```

Pretty straight-forward, right?

### Boolean operations

What if there are multiple conditions?
```scala
def condition1: Boolean = ...
def condition2: Boolean = ...
def condition3: Boolean = ...

if (condition1 && (condition2 || condition3)) ...
```

There aren't much help from scala-library itself here, so let's extend it a bit:
```scala
implicit class FutureOfBooleanExtensions(val future: Future[Boolean]) extends AnyVal {
  def &&(other: => Future[Boolean]): Future[Boolean] =
    future.flatMap(value => if (!value) Future.successful(false) else other)

  def ||(other: => Future[Boolean]): Future[Boolean] =
    future.flatMap(value => if (value) Future.successful(true) else other)
}
```

And now, with these extension methods we will get this:
```scala
def condition1: Future[Boolean] = ...
def condition2: Future[Boolean] = ...
def condition3: Future[Boolean] = ...

val condition = condition1 && (condition2 || condition3)
condition.flatMap(
  if (_)
    ...
  else
    ...
)
```

Nice, right?

We can go further, for example, if some of conditions aren't IO-bound, or already calculated, we can just
extend it a little bit more:
```
implicit class BooleanToFutureExtensions(val v: Boolean) extends AnyVal {
  def &&(other: => Future[Boolean]): Future[Boolean] =
    if (v) other else Future.successful(false)

  def ||(other: => Future[Boolean]): Future[Boolean] =
    if (v) Future.successful(true) else other
}
```

And use it:
```scala
def condition1: Boolean = ...
def condition2: Boolean = ...
def condition3: Future[Boolean] = ...

val condition = condition1 && (condition2 || condition3)
condition.flatMap(
  if (_)
    ...
  else
    ...
)
```

Same code, but now we can mix `Future[Boolean]` and `Boolean`. Well, almost... We also need to add corresponding extension methods to `Future[Boolean]` for commutativity, which is a bit more complex, because we can't overload method with arguments `=> Boolean` and `=> Future[Boolean]`, so we need to use some implicit magic:

```scala
implicit class FutureOfBooleanExtensions(val future: Future[Boolean]) extends AnyVal {
  def &&(other: => BooleanOrFutureOfBoolean): Future[Boolean] =
    v.flatMap(
      if (_)
        other match {
          case Bool(otherValue) => Future.successful(otherValue)
          case Fut(future) => future
        }
      else
        Future.successful(false)
    )
}

@implicitNotFound("This method supports only arguments of type Boolean OR Future[Boolean]")
sealed trait BooleanOrFutureOfBoolean

object BooleanOrFutureOfBoolean {
  case class Bool(value: Boolean) extends BooleanOrFutureOfBoolean
  case class Fut(future: Future[Boolean]) extends BooleanOrFutureOfBoolean

  implicit def `Boolean to BooleanOrFutureOfBoolean`(v: Boolean): BooleanOrFutureOfBoolean = Bool(v)
  implicit def `Future[Boolean] to BooleanOrFutureOfBoolean`(v: Future[Boolean]): BooleanOrFutureOfBoolean = Fut(v)
}
```

### for-comprehensions for the rescue

Another way of making code look like future-less code is using for-comprehensions. This topic is covered quite a lot ([1](https://docs.scala-lang.org/overviews/core/futures.html#functional-composition-and-for-comprehensions), [2](https://contributors.scala-lang.org/t/sequencing-in-for-comprehensions/779), [3](https://stackoverflow.com/a/19046133/426397)). In short, it looks like this:

```scala
def getMovie: Future[Movie]
def getActors(movie: Movie): Future[Seq[Actor]]
def getPlot(movie: Movie): Future[MoviePlot]

for {
  movie <- getMovie
  actors <- getActors(movie)
  plot <- getPlot(movie)
} yield MovieDescription(movie, actors, plot)
```

#### Dealing with filter

Looks very familiar. But in real life, it's more complicated:
```scala
def hasPermissions: Future[Boolean]

for {
  isPermitted <- hasPermissions
  if isPermitted
  movie <- getMovie
  if !movie.hidden
  actors <- getActors(movie)
  plot <- getPlot(movie)
} yield MovieDescription(movie, actors, plot)
```

`if` construct is supported (via `withFilter` method of `Future`), of course, but `Future` will be resolved with `NoSuchElementException`, without ability to understand what's really happened there.

I came up with this solution (yes, another extension method):
```scala
implicit class BooleanFutureExtensions(val future: Future[Boolean]) extends AnyVal {
  def orFail(e: => Throwable): Future[Boolean] =
    future.transform(t => if (t.isSuccess && !t.get) Failure(e) else t)
}
```

And now we can rewrite it in this form:
```scala
for {
  __ <- hasPermissions orFail new PermissionDeniedException("...")
  movie <- getMovie
  if !movie.hidden
  actors <- getActors(movie)
  plot <- getPlot(movie)
} yield MovieDescription(movie, actors, plot)
```

Now there will be `PermissionDeniedException` if user doesn't have permissions, but still `NoSuchElementException` if movie is hidden. One of solutions might be this: instead of just comprehending `getMovie`, we may make it slightly more complex:
```scala
movie <- getMovie.filter(!_.hidden).recoverWith {
  case _: NoSuchElementException => Future.failed(new HiddenMovieException("..."))
}
```

As always, we can simplify it with simple extension method:
```scala
implicit class FutureExtensions[T](val future: Future[T]) extends AnyVal {
  def filterOrFail(f: T => Boolean, e: => Throwable): Future[T] =
    future.flatMap(value => if (f(value)) Future.successful(value) else Future.failed(e))
}
```

Much better now:
```scala
for {
  _ <- hasPermissions orFail new PermissionDeniedException("...")
  movie <- getMovie.filterOrFail(!_.hidden, new HiddenMovieException("..."))
  actors <- getActors(movie)
  plot <- getPlot(movie)
} yield MovieDescription(movie, actors, plot)
```

#### Dealing with Option

Another problem with for-comprehensions is that you can't mix different monads (like `Option`). Because in real life it's quite common to expose methods like:
```scala
def findMovie(title: String): Future[Option[Movie]]
```

In this case, in for-comprehensions in this expression `movie <- findMovie("Dark Waters")` the type of `movie` will be `Option[Movie]`, not `Movie`. Which is understandable, but we need to find out how to deal with it. One way is to expose Option-less version which resolves `Future` with some `Exception`. Another approach is, as you may already've guessed, to create a convenient extension method:
```scala
implicit class FutureOfOptionExtensions[T](val v: Future[Option[T]]) extends AnyVal {
  def orFail(e: => Throwable): Future[T] = v.flatMap(_.fold[Future[T](Future.failed(e), Future.successful)
}
```

And usage:
```scala
for {
  movie <- findMovie("Dark Waters") orFail new MovieNotFoundException("...")
} yield movie
```

## Exception Handling

I deliberately named this section as "Exception Handling" there are different error handling models: exceptions,
error codes, returning [Either](https://www.adtran.com/index.php/blog/technology-blog/255-asynchronous-functional-error-handling-in-scala) of business result or some kind of error etc. Here I want to research a bit how to deal with Future in JVM, because JVM does support exceptions, you can't turn it off, so what are the caveats around Future and exceptions.

Future is like [Try](https://www.scala-lang.org/api/2.12.10/scala/util/Try.html) in terms of exception handling: all methods of Future do catch exceptions and transforms Future into [failed](https://www.scala-lang.org/api/2.12.10/scala/concurrent/Future$.html#failed[T](exception:Throwable):scala.concurrent.Future[T]) Future. Except for the `onComplete` method, exception from your callback will return in propagation to the [reportFailure](https://www.scala-lang.org/api/2.12.10/scala/concurrent/ExecutionContext.html#reportFailure(cause:Throwable):Unit) of your [ExecutionContext](https://www.scala-lang.org/api/2.12.10/scala/concurrent/ExecutionContext.html). So, it's safe to throw an exception in all functions that you pass to Future (map, flatMap etc.).

However, there's a caveat. Whenever it's declared that a function returns `Future`, there is an assumption, that function can't throw an exception -- it returns a Future that eventually will be successful or failed. In most of the application code it doesn't matter whether a function actually throws an exception or returns a failed Future, but not always.

When you're in an Future's execution lifecycle, meaning calling methods of existing Future object like `map`, `flatMap` and `transform`, you're safe in terms of exceptions:
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
```
def rpcFunction(param: AnyRef)(implicit ec: ExecutionContext): Future[AnyRef]
```

And inside such function it's safe to throw exceptions, because the framework does `try..catch` for you (usually). But sometimes you need to escape from this lifecycle. I'll give you an example. Suppose, we have a HttpRequest and we have caching layers (memcached and CDN) and a fallback to a Hadoop calculation (which takes a long time):

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
handle(HttpRequest("/memcached-boom")) // will throw new IllegalArgumentException("Memcached Boom!")
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

### How to safely create futures?

There are couple solutions.

One is to pay extra attention to places in your code, when execution is going outside of the Future's execution context: whenever you're using the `onComplete` method or creating a Promise that will be completed asynchronously, etc.

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

Another angle to handle this problem is a kind of defensive programming: minimize possibility of raising an exception. By using an utility function we may wrap all functions that produces Future:
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

As you may see, none of these approaches is error-prone, it's very easy to forget to use `safeFuture` or miss an `onComplete` call somewhere in a codebase. In general, exceptions aren't good (to say the least) for async programming as stack trace is mostly useless (I will back to this point soon). And there's no way of turning it off as exceptions are deeply embedded in JVM.

For me, personally, I prefer to stick to exceptions, just because we still need to take care of failed futures and adding another error handling model seems redundant.

## Threading Model

direct executor
pool for blocking
separate IO pool vs single pool

## Rewrite a Real Service

make sure that old service has more or less good design and coverage
cycle:
* write async implementation
* use it in sync version and run all tests
* delete sync version, rewrite tests, rewire sync code
* commit it all in order to preserve history

## Other Caveats

* Don't use Await. Never.
* Careful about Promises - don't forget to resolve it by all means.
* Use Timer in order to make sure that you don't have stale promises.

## Recap

Let's recap the main points:
* `Future` functionality is very limited out of the box, so extend it to make the life easier and the code more readable.
* Be careful outside of the Future's execution lifecycle, specifically with the `onComplete` method and usage of `Promise`.

## Conclusion

Despite the fact that resource management is a well-known subject, there are still many mistakes around it. Especially in languages not mature enough (I believe, Scala is one of that kind). Don’t get me wrong, there are libraries in Scala world that handle resource management properly, i.e. [better-files](https://github.com/pathikrit/better-files/) or [scala-arm](https://github.com/jsuereth/scala-arm/). But I believe that it should be a part of the language. Either as a language construct or as a part of a scala-library. It’s too important to not have it.

All code is available on [GitHub](https://github.com/dkomanov/stuff/tree/master/src/com/komanov/future). Originally posted on [Medium](https://medium.com/@dkomanov/scala-try-with-resources-735baad0fd7d).
