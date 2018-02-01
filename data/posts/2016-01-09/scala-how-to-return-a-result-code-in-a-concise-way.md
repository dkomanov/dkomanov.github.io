First of all, I don’t want to [raise](http://stackoverflow.com/questions/253314/exceptions-or-error-codes)
a [topic](http://www.joelonsoftware.com/items/2003/10/13.html) “Exceptions versus Error Codes”.
But if you need to return a result code and you use Scala, I have an elegant solution for you to do so.

We have a simple contract:

```scala
def processRequest(userId: UUID, requestId: UUID): BusinessResult
```

Where BusinessResult is plain Java enumeration:

```java
public enum BusinessResult
{
    Ok, UserNotFound, RequestNotFound, NotOwner
}
```

## Java-style

The old-school implementation of this method would be:

```java
def processRequestOld(userId: UUID, requestId: UUID): BusinessResult = {
  val userOpt = getUser(userId)
  if (userOpt.isEmpty) {
    return BusinessResult.UserNotFound
  }

  val requestOpt = getRequestById(requestId)
  if (requestOpt.isEmpty) {
    return BusinessResult.RequestNotFound
  }

  if (checkAccess(requestOpt.get, userOpt.get).isFailure) {
    return BusinessResult.NotOwner
  }

  BusinessResult.Ok
}
```

Pros:
* Very clear to a reader (even for unfamiliar with Scala)

Cons:
* In Scala World it’s uncommon to use return keyword
* Also using of Option.get function is uncommon and considered as a bad practice mostly

## Use exceptions internally

Another solution is to use exceptions:

```scala
def processRequestWithException(userId: UUID, requestId: UUID): BusinessResult = {
  case class BusinessException(result: BusinessResult) extends RuntimeException

  try {
    val user = getUser(userId).getOrElse(throw new BusinessException(BusinessResult.UserNotFound))
    val request = getRequestById(requestId).getOrElse(throw new BusinessException(BusinessResult.RequestNotFound))
    checkAccess(request, user).toOption.getOrElse(throw new BusinessException(BusinessResult.NotOwner))
    BusinessResult.Ok
  } catch {
    case be: BusinessException => be.result
  }
}
```

Pros:
* More concise;
* Not using Option._get_ function;
* You may extract the code without try..catch and use it for a transition to
exception-based error control (if you’re going to that transition).

Cons:
* Usage of exceptions without actual need.

## Scala collections

I tried to realize, how to use collections API for such tasks, i.e. using
Option._fold_ method:

```scala
def processRequestCollections(userId: UUID, requestId: UUID): BusinessResult = {
  getUser(userId).fold(BusinessResult.UserNotFound)(user => {
    getRequestById(requestId).fold(BusinessResult.RequestNotFound)(request => {
      checkAccess(request, user).toOption.fold(BusinessResult.NotOwner)(_ => BusinessResult.Ok)
    })
  })
}
```

It looks concise, but in this approach you will increase indent for each result code.

## Either FTW

The common use case for [Either](http://www.scala-lang.org/api/2.11.7/index.html#scala.util.Either) is a replacement for
Option where None will contain some meaningful value (by convention it’s Left).

We will use [for comprehensions](http://danielwestheide.com/blog/2013/01/02/the-neophytes-guide-to-scala-part-7-the-either-type.html) on RightProjection
of our Either. If we have Left (which means an error) then this value will
be returned, otherwise there will be a call to flatMap function with the next
RightProjection etc.

```scala
def processRequestEither(userId: UUID, requestId: UUID): BusinessResult = {
  val result: Either[BusinessResult, BusinessResult] = for {
    user <- either(getUser(userId), BusinessResult.UserNotFound)
    request <- either(getRequestById(requestId), BusinessResult.RequestNotFound)
    _ <- either(checkAccess(request, user).toOption, BusinessResult.NotOwner)
  } yield BusinessResult.Ok

  result.fold(identity, identity)
}

private def either[T](opt: Option[T], result: BusinessResult) =
  opt.fold[Either[BusinessResult, T]](Left(result))(Right(_)).right
```

Pretty straightforward.

A _result_ type declaration is not necessary, I’ve put it just to show what
do we have in the end of the for clause.

## Adding some implicit magic…

With some implicit “[magic](https://gist.github.com/dkomanov/b3cb5b0b536a62b090eb)” we can transform
this code to a bit more concise form:

```scala
def processRequestNew(userId: UUID, requestId: UUID): BusinessResult = {
  for {
    user <- getUser(userId) orResult BusinessResult.UserNotFound
    request <- getRequestById(requestId) orResult BusinessResult.RequestNotFound
    _ <- checkAccess(request, user) orResult BusinessResult.NotOwner
  } yield BusinessResult.Ok
}
```

All the magic is implicit classes that provides _orResult_ function to create
Either from Option and Try and an implicit conversion for Either[T, T]
(to not write fold(identity, identity)).

Of course, this approach will work not only with enums but with any type.

## Conclusion

So, we made a path from old-school Java-style to a concise Scala-style for such
scenario of error handling: less verbosity, no ifs.

All the code you may find in a [single place](https://github.com/dkomanov/scala-junk/commit/9de20fdb466adc06b7092fb111e3c3731c13861a) on GitHub.

Originally posted on [Medium](https://medium.com/@dkomanov/scala-how-to-return-a-result-code-in-a-concise-way-233e8981f73c).
