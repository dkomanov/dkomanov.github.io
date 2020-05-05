---
draft: true
type: blog
date: 2020-05-02
title: Writing Async App in Scala
description: TBD
tags: ["scala", "async", "exception", "error"]
canonicalUrl: TBD
---

[Asynchronous Programming and Scala](https://alexn.org/blog/2017/01/30/asynchronous-programming-scala.html#5-task-scalas-io-monad)
[Futures and Promises](https://docs.scala-lang.org/overviews/core/futures.html)
[retries](https://medium.com/@john.m.murray786/exponential-back-off-with-scala-futures-7426340d0069)
[timeout](http://justinhj.github.io/2017/07/16/future-with-timeout.html)
[futures](https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-8-welcome-to-the-future/)

## Real world examples

For simplicity let's not think about `implicit ec: ExecutionContext` argument for Future operations yet. I will cover this topic afterwards.

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

Same code, but now we can mix `Future[Boolean]` and `Boolean`. Well, almost... We also need to add corresponding extension methods to `Future[Boolean]` for commutativity:

```scala
implicit class FutureOfBooleanExtensions(val future: Future[Boolean]) extends AnyVal {
  def &&(other: => Boolean): Future[Boolean] =
    future.map(value => value && other)

  def ||(other: => Boolean): Future[Boolean] =
    future.map(value => value || other)
}
```

By analogy you may add another extensions, not only for `Boolean` type, of course.

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

Future[Either] -- https://www.adtran.com/index.php/blog/technology-blog/255-asynchronous-functional-error-handling-in-scala

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
* Don't catch `Exception` or `Throwable`.
* Be cautious in finally clause, don't let exception there to overthrow an original one.
* You may swallow exceptions in close for read operations.

## Conclusion

Despite the fact that resource management is a well-known subject, there are still many mistakes around it. Especially in languages not mature enough (I believe, Scala is one of that kind). Don’t get me wrong, there are libraries in Scala world that handle resource management properly, i.e. [better-files](https://github.com/pathikrit/better-files/) or [scala-arm](https://github.com/jsuereth/scala-arm/). But I believe that it should be a part of the language. Either as a language construct or as a part of a scala-library. It’s too important to not have it.

All code is available on [GitHub](https://github.com/dkomanov/stuff/tree/master/src/com/komanov/future). Originally posted on [Medium](https://medium.com/@dkomanov/scala-try-with-resources-735baad0fd7d).
