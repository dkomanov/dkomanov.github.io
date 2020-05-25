---
type: blog
date: 2020-05-23
title: "Writing Async App in Scala. Part 1: Coding"
description: How the async code looks like, How to make it more readable and look like non-async code. Extending Future capabilities to match our needs.
cover: ./cover.jpg
tags: ["scala", "async", "coding"]
canonicalUrl: https://medium.com/@dkomanov/writing-async-app-in-scala-part-1-coding-dd09b014d576
---

# Part 1. Coding

> In this part we will cover the most basic part of async programming in Scala with Futures. \
> Part 1. Coding. \
> [Part 2. Exception Handling.](/p/writing-async-app-in-scala-part-2-exception-handling) \
> [Part 3. Threading Model.](/p/writing-async-app-in-scala-part-3-threading-model) \
> Part 4. Rewriting Existing App. \
> Part 5. What's next?

Today asynchronous programming gets some traction. Some may argue even some hype. However, there are cases when it's really necessary (or, let's put it mildly, favorably). In this blog post I'd like to put aside reasons behind writing an application in an async fashion, it's a separate topic. Here I want to focus on the practical side of this topic - how it looks like, what we have to do in order to make it simpler, and what problems we may encounter. Everything here is based on my personal experience, so I hope it won't be too academic.

Another thing, I'm not going to explore different approaches of achieving asynchronicity (actor model, functional approaches, etc.) I've chosen approach with [Future model](https://docs.scala-lang.org/overviews/core/futures.html) of Scala because of the least additional cost of learning. This concept is easier understandable both for me and for people around me: leap from sync jala (java style on Scala) programming to Futures is just shorter.

This post is written under the assumption that the reader is familiar with the concept of Future/Promise model and familiar with its implementation in Scala. If not, I would advise to read these articles first: [Asynchronous Programming and Scala](https://alexn.org/blog/2017/01/30/asynchronous-programming-scala.html) by [Alexandru Nedelcu](https://alexn.org/) and [The Neophyte's Guide to Scala Part 8: Welcome to the Future
](https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-8-welcome-to-the-future/) by [Daniel Westheide](https://danielwestheide.com/) (entire Neophyte's Guide is awesome!).

After such a long disclaimer, I have one more thing to say. A kind of application that I'm having in mind is simple: a backend for DB (not really important which one) with some REST/RPC exposure to the world (or internal world), which may also communicate via the network with other applications. Regular "web" application, without any CPU heavy operations (like image processing or blockchain computations.)

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

By the end of this series I hope it will be clear, how to rewrite application in asynchronous way and avoid some dangers of async approach.

## Writing in async fashion

NB: For simplicity let's not think about `implicit ec: ExecutionContext` argument for Future operations yet. I will cover this topic in next parts.

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

We can go further, for example, if some of conditions aren't IO-bound, or already calculated, we can just extend it a little bit more:
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

Same code, but now we can mix `Future[Boolean]` and `Boolean`. Well, almost... We also need to add corresponding extension methods to `Future[Boolean]` for commutativity, which is a bit more complex, because we can't overload method with arguments `=> Boolean` and `=> Future[Boolean]`, so we need to use some implicit magic (called [type classes](https://nrinaudo.github.io/scala-best-practices/definitions/type_class.html)):

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

I hope you've got the idea: whatever regular boolean operation you need, just extend `Future[Boolean]` and `Boolean` classes to support it, and your code will look beautiful and simple.

## for-comprehensions for the rescue

Another way of making code look like future-less code is usage of for-comprehensions. This topic is covered quite a lot ([1](https://docs.scala-lang.org/overviews/core/futures.html#functional-composition-and-for-comprehensions), [2](https://contributors.scala-lang.org/t/sequencing-in-for-comprehensions/779), [3](https://stackoverflow.com/a/19046133/426397)). In short, it looks like this:

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
  _ <- hasPermissions orFail new PermissionDeniedException("...")
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

#### Another filter-related consideration

What I really don't like about regular `filter` is this `NoSuchElementException`. When we use `recover` or `recoverWith` right after, it means, that this exception is created only to be catched very match soon and will be replaced with something else. In a hell for ~~perfectionists~~ people who waste their time on micro-optimizations there is a never-ending loop

```scala
try {
  throw new NoSuchElementException
} catch {
  case _: NoSuchElementException =>
}
```

To deal with my control freak's issue I've created simple singleton exception without a stack-trace:
```
object ControlException extends Throwable("control", null, false, false) {
  def unapply(e: Throwable): Boolean = e.isInstanceOf[ControlException.type]
}
```

And whenever I extend `Future` in a way that I need to call `recover` method after, I use this `ControlException` which literally has close to zero overhead. Of course, I have convenient extension methods supporting it:
```scala
implicit class FutureExtensions[T](val future: Future[T]) extends AnyVal {
  def recoverFilter(f: => T): Future[T] =
    future.recover {
      case _: NoSuchElementException | ControlException => f
    }

  def recoverFilterWith(f: => Future[T]): Future[T] =
    future.recoverWith {
      case _: NoSuchElementException | ControlException => f
    }
}
```

#### Dealing with Option

Another problem with for-comprehensions is that you can't mix different monads (like `Option`). Because in real life it's quite common to expose methods like:
```scala
def findMovie(title: String): Future[Option[Movie]]
```

In this case, in for-comprehensions in this expression `movie <- findMovie("Dark Waters")` the type of `movie` will be `Option[Movie]`, not `Movie`. Which is understandable, but we need to find out how to deal with it. One way is to expose Option-less version which resolves `Future` with some `Exception`. Another approach is, as you may already have guessed, to create a convenient extension method:
```scala
implicit class FutureOfOptionExtensions[T](val v: Future[Option[T]]) extends AnyVal {
  def orFail(e: => Throwable): Future[T] =
    v.flatMap(_.fold[Future[T](Future.failed(e), Future.successful)
}
```

And usage:
```scala
for {
  movie <- findMovie("Dark Waters") orFail new MovieNotFoundException("...")
} yield movie
```

## Conclusion

This part is the most basic of async programming: coding in async fashion. But still, when I started to write more and more code I realized how vanilla Scala is not sufficient to do most of the work -- I import my extensions in every second file where I write something with Futures.

And because `Future` functionality is very limited out of the box, don't hesitate to extend it to make the life easier and the code more readable.

All code is available on [GitHub](https://github.com/dkomanov/stuff/tree/master/src/com/komanov/future). Originally posted on [Medium](https://medium.com/@dkomanov/writing-async-app-in-scala-part-1-coding-dd09b014d576). [Image](https://pixabay.com/photos/technology-keyboard-computing-785742/) by [Daniel Agrelo](https://pixabay.com/users/Pixies-1021586/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=785742) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=785742).
