---
type: blog
date: "2015-09-10"
title: "Small design issues"
description: "Learning about function overloading in Scala on a real case with specs2 Mockito wrapper..."
tags: ["scala", "specs2", "testing"]
cover: cover.jpg
---
Recently I’ve found that I cannot use anonymous matching function with specs2
Mockito’s [answers](https://etorreborre.github.io/specs2/guide/SPECS2-3.6.1/org.specs2.guide.UseMockito.html#callbacks) function. I wanted to do something like this:

```scala
mock.getValue(any) answers {
 case i: Int => i + 1
}
```

But compiler issued an error that argument type of anonymous function should be
fully known. A small “investigation” showed that answers function has 2 overloads:
Any => T and (Any, Any) => T. In this case the only thing you may do it’s use
regular pattern matching:

```scala
mock.getValue(any) answers (_ match {
 case i: Int => i + 1
})
```

And it could be the end of a story but IDEA highlighted it with a warning/suggestion
to convert it to an anonymous pattern matching function. After conversion I’ve got
the same non-compilable code. So I decided to [introduce](https://github.com/etorreborre/specs2/pull/388) a new method (responds)
to a specs2 Mockito library that allow me to use anonymous p-m function.
And in a couple days it was merged.

It’s hard to predict how your library will be used. An overloading always
seemed to me as a good and pretty thing. But in Scala world it could be not so
good as in Java/C#/C++ worlds. And thanks to IDEA’s bug that forced me to
contribute a little to specs2 :)

Related links:

* [A documentation on mockito wrapper](https://etorreborre.github.io/specs2/guide/SPECS2-3.6.1/org.specs2.guide.UseMockito.html#callbacks)
* [Pull request to specs2 with responds method](https://github.com/etorreborre/specs2/pull/388)
* [IDEA inspection’s issue](https://youtrack.jetbrains.com/issue/SCL-8869)
* [Cover image](https://pixabay.com/en/pisa-leaning-tower-of-pisa-tower-1998120/)
