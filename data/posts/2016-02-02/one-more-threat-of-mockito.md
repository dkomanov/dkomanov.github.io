[Mockito](http://mockito.org/) is a great tool. It helps a lot. But nothing
is perfect. Recently I’ve encountered the one scary thing and I want to share it.

Usually, with Mockito, the test structure looks like this:

```scala
"a thing" should {
  "do something" in new Scope {
    // setup data
    // setup mocks (returns/throws)
    thing.doSomething(input) must beCorrect
    got {
      // check calls to mocks
      noMoreCallsTo(mocks)
    }
  }
}
```

By default mock will return a default value (zero, _null_ or empty collection).
If the return type is _Unit_ it won’t do anything.

Ok, where is the issue? I have a mutable structure (yes, yes, this is an issue too),
some code modifies it’s state and stores to the database. I want to write a Unit
test which will check, that the stored data is correct.

```scala
"manager" should {
  "change and store state" in new Scope {
    val data = new MutableContainer(...) // original state
    val dao = mock[Dao]
    val manager = new Manager(dao)
    manager.changeAndStore(data)
    got {
      dao.update(beMutableContainer(...)) // final expected state
      noMoreCallsTo(dao)
    }
  }
}
```

Eventually, I refactored the code inside _changeAndStore_ method.
Everything is green. By chance one of the E2E tests failed and I started
to figure out how the unit test passed before.

At this point, I need to mention what I’ve actually changed. Previously
the mutable class was totally mutable — all fields are mutable and contain
references to mutable classes. I started to rewrite gradually from mutable
structures to immutable (change it at once is too much job). So for a transition
period, I have a mutable container which contains some immutable data.
Simplified version is:

```scala
case class MutableContainer(var list: Seq[String])

object MutableMutator {
  def mutate(c: MutableContainer)(pf: PartialFunction[String, String])= {
    c.list = c.list.map(s => if (pf.isDefinedAt(s)) pf(s) else s)
  }
}
```

The _MutableContainer_ class contain a mutable field with an immutable content.
And the _MutableMutator_ performs a mutation of this field with a new immutable
object, _PartialFunction_ is used to do it.

In the _changeAndStore_ method I made a stupid mistake:

```scala
MutableMutator.mutate(c) {
  case s@"a" =>
    val newValue = s + "b"
    dao.update(c)
    newValue
}
```

As you can see, here I performed a call to a dao before the actual
mutation in _MutableContainer_ was performed. At the end, the _MutableContainer_
will contain all necessary changes but it won’t be stored in a database.
And I cannot catch with the default Mockito setup.

In other words, the problem is I’m checking expectations on mock *after* mutation
was performed. On the call to mock Mockito just stores a reference to all
arguments passed to the method, because an argument is a mutable class, it could
be changed after a call and you will match this argument with another state.

## Ok, what to do?

Besides avoiding of mutable data structures...

By its nature, dao don’t return anything (it throws an exception on errors) and
we don’t need to rely on its return value (so it’s _Unit_). Which means that
Mockito framework doesn’t force us to specify an expectation for a method before a call.

We may turn Mockito to [JMock](http://www.jmock.org/) :)

To do this, we need to make extra setup to our mock:

```scala
val dao = mock[ContainerDao]
  .defaultAnswer(i => throw new Ex(s"Unexpected call: $i"))
doAnswer(_ => {}).when(dao).update(...) // final expected state
```

The first expression creates a mock which will throw an exception by default.
The second expression specifies a concrete expectation. Now, an expectation will
be checked at the same time when the method is calling. If an expectation
matched not successfully, the _defaultAnswer_ will be used and will throw an exception.

## Conclusion

I don’t know enough about JMock to make a decision to switch from Mockito to JMock.
But at least, it’s worth to think about use throwing default answer with Mockito.
And don’t use mutable data structures :)

Originally posted on [Medium](https://medium.com/@dkomanov/one-more-threat-of-mockito-d36d7df1c068).
