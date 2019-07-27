---
type: blog
date: 2016-12-03
title: Scala StringBuilder vs Java StringBuilder Performance
description: O_O performance benchmark of StringBuilder wrapper in Scala...
tags: ["scala", "java", "benchmark", "performance", "common-sense"]
canonicalUrl: https://medium.com/@dkomanov/scala-stringbuilder-vs-java-stringbuilder-performance-3167a96abfc2
---
Yet another post about performance and microbenchmarks. Yes, I [know](http://wiki.jvmlangsummit.com/images/1/1d/PerformanceAnxiety2010.pdf).

Very small JMH benchmark:

```scala
@BenchmarkMode(Array(Mode.AverageTime))
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Fork(value = 2, jvmArgs = Array("-Xmx2G"))
@Measurement(iterations = 7, time = 3, timeUnit = TimeUnit.SECONDS)
@Warmup(iterations = 3, time = 3, timeUnit = TimeUnit.SECONDS)
class StringBuilderBenchmark {

  @Benchmark
  def javaStringBuilder: String = {
    new java.lang.StringBuilder()
      .append("abc").append("def")
      .toString
  }

  @Benchmark
  def javaStringBuilder2: String = {
    new java.lang.StringBuilder()
      .append(495-char-length-string).append(495-char-length-string)
      .toString
  }

  @Benchmark
  def scalaStringBuilder: String = {
    new scala.collection.mutable.StringBuilder()
      .append("abc").append("def")
      .toString
  }

  @Benchmark
  def scalaStringBuilder: String = {
    new scala.collection.mutable.StringBuilder()
      .append(495-char-length-string).append(495-char-length-string)
      .toString
  }
}
```

And the result:

```
Benchmark            Mode  Cnt    Score   Error  Units
javaStringBuilder    avgt   14    8.754 ± 0.465  ns/op
javaStringBuilder2   avgt   14  237.280 ± 0.828  ns/op
scalaStringBuilder   avgt   14   27.299 ± 0.096  ns/op
scalaStringBuilder2  avgt   14  720.742 ± 3.528  ns/op
```

Wow. Apparently, JVM doesn’t do some optimization over wrapped StringBuilder.
I’ve noticed this performance degradation on a more complex test, so, I don’t
think it’s just about “microbenchmarking is evil”.

The saddest part, that Scala developers “suffer” just to have StringBuilder
as a [collection](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/mutable/StringBuilder.scala).
But do we really need collection features from it? I doubt it.

Source code is on [GitHub](https://github.com/dkomanov/scala-string-format).

Originally posted on [Medium](https://medium.com/@dkomanov/scala-stringbuilder-vs-java-stringbuilder-performance-3167a96abfc2).
