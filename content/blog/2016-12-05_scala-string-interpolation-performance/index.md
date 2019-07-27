---
type: blog
date: 2016-12-05
title: "Scala: String Interpolation Performance"
description: "Performance comparison between different kinds of string concatenation/formatting in Java/Scala..."
tags: ["scala", "java", "benchmark", "performance", "csharp"]
canonicalUrl: https://medium.com/@dkomanov/scala-string-interpolation-performance-21dc85e83afd
---
> Performance comparison between different kinds of string concatenation/formatting in Java/Scala

String concatenation is a basic building block in every modern programming
language. Many different projects, especially in Web, produce a lot of strings.
And it’s interesting, how this problem is solved in different languages.
In our case, in Java and Scala (because it’s much easier to compare, and
these I use day-to-day).

There are a [lot](https://www.google.com/?q=java+string+concatenation+performance) of [posts](https://www.google.com/?q=scala+string+interpolation+performance)
on Internet about this topic. But still, there are something interesting to say
about it (I hope you won’t be bored). Yes, this is about performance and microbenchmarking,
I [know](http://wiki.jvmlangsummit.com/images/1/1d/PerformanceAnxiety2010.pdf).

Basically, this post is about how to make robust string concatenation
(with macros!) and performance comparison. You may skip this big part right to
Graphs and Conclusion.

## What is string concatenation?

In JVM [String](http://docs.oracle.com/javase/8/docs/api/java/lang/String.html) object is immutable. If you need to
create a new String with a content of two other strings, you need to create
a third one. In Java you may concatenate not only string but any
objects — Java compiler will convert an object to its string representation
automatically. Scala compiler also does it.

What will compiler do, when we write such code in Java:

```java
int a = 1;
String b = "s";
String str = a + b;
```

This code will be converted to this code:

```java
int a = 1;
String b = "s";
String str = new StringBuilder()
  .append(a)
  .append(b)
  .toString();
```

Nothing new, it’s well-known thing. But, it’s important to understand,
what is happening there:

1. new StringBuilder creates a class with a char array of 16 elements.
2. append method converts an argument to chars and stores into an internal array.
  If an array is not big enough, it will create a bigger array.
3. toString creates a String object, but char array is not shared between
  StringBuilder and this new String object (because it’s mutable in StringBuilder).

So, in order to concatenate 2 objects, we need to create an intermediate object,
big enough to store the string representation of our 2 objects.

## How to improve default concatenation

We have 2 heavy operations from the list above: allocation of a buffer in
StringBuilder (and reallocations!) and a creation of String
(making copy of StringBuilder’s buffer).

Let’s put some efforts to deal with it. Because I had a lot of experience
in .NET, I know, how string concatenation is implemented there.

### What’s about C#.NET?

In C# the same problem solved in a slightly different way. Actually, many
problems in .NET solved slightly differently.

This concatenation will be converted by the [compiler](https://ericlippert.com/2013/06/17/string-concatenation-behind-the-scenes-part-one/)
to call to static method Concat (yes, in .NET they use CamelCase instead of
camelCase in Java, yet another little difference):

```csharp
String str = String.Concat(a, b);
```

And inside Concat we may see, how it [works](https://referencesource.microsoft.com/#mscorlib/system/string.cs,3133):

```csharp
public static String Concat(String str0, String str1) {
    if (IsNullOrEmpty(str0)) {
        if (IsNullOrEmpty(str1)) {
            return String.Empty;
        }
        return str1;
    }
    if (IsNullOrEmpty(str1)) {
        return str0;
    }
    int str0Length = str0.Length;
    String result = FastAllocateString(str0.Length + str1.Length);
    FillStringChecked(result, 0,        str0);
    FillStringChecked(result, str0Length, str1);
    return result;
}
```

What is interesting here is resulting string length precomputation. They create
a char buffer of resulting size, fill it and use in String object without copying. Obviously, this should work much faster (and it’s).

Let’s try to do something similar in Scala.

### Optimized string concatenation

So, what do we need is precompute a StringBuilder length to avoid any reallocations.

```scala
def concat(o1: Object, o2: Object, o3: Object,
           o4: Object, o5: Object, o6: Object): String = {
  concatNonNull(orNull(o1), orNull(o2), orNull(o3),
                orNull(o4), orNull(o5), orNull(o6))
}
private def orNull(o: Object): String =
  if (o == null) "null" else o.toString
private def concatNonNull(s1: String, s2: String,
                          s3: String, s4: String,
                          s5: String, s6: String): String = {
  new StringBuilder(s1.length + s2.length + s3.length + s4.length + s5.length + s6.length)
    .append(s1)
    .append(s2)
    .append(s3)
    .append(s4)
    .append(s5)
    .append(s6)
    .toString
}
```

This is a version for 6 arguments (we may generate as many as we want).
Precalculation of a StringBuilder buffer size should give us some performance
boost (we will see it later).

### Fast StringBuilder.toString

Let’s take a look at StringBuilder.toString [implementation](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/lang/StringBuilder.java?av=f#404):

```java
@Override
public String toString() {
    // Create a copy, don't share the array
    return new String(value, 0, count);
}
```

And in String’s constructor [we see](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/lang/String.java#190):

```java
public String(char value[], int offset, int count) {
    // ... validations omitted
    this.value = Arrays.copyOfRange(value, offset, offset+count);
}
```

Aha! Arrays.copyOfRange creates a new char[] and copy data there. We know for sure,
that char array will be filled up and we can use it directly
(we’re good ppl, we won’t modify it after string creation). In String class,
there is a [constructor](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/lang/String.java#597),
that don’t do copy, but… it’s package-private. Meaning, we can’t use it. Or can we?

We may try to use [fast reflection](http://stackoverflow.com/questions/22244402/how-can-i-improve-performance-of-field-set-perhap-using-methodhandles) (MethodHandle)
to access to private constructor! Looks [pretty easy](https://github.com/dkomanov/scala-string-format/blob/master/scala-string-format/src/main/scala/com/komanov/stringformat/FastStringFactory.java):

```java
public static String fastNewString(char[] chars) throws Throwable {
    Constructor<String> constructor = String.class
            .getDeclaredConstructor(char[].class, boolean.class);
    constructor.setAccessible(true);
    // it should be cached
    MethodHandle newString = MethodHandles.lookup()
            .unreflectConstructor(constructor);
    return (String) newString.invokeExact(chars, true);
}
```

Spoiler: it doesn’t work! Details below.

### That’s it?

So, that’s it, no more optimizations? Of course not! What else to we do
in concatenation? The toString method calls for each argument. This also could
be optimized. How?

Imagine, you pass an integer there, which is primitive. In order to pass it,
you need to [box it](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) and then we call Integer.toString
method. What’s wrong with toString? It allocates new memory. StringBuilder has
an optimization for appending primitive values, it calculates how many chars
needed to print an integer (in order to reallocate internal buffer, if necessary)
and then uses internal method Integer.getChars, passing internal char array there.
So, there are no additional allocations for printing integer.

Having such generic method, we can’t utilize StringBuilder power to not do
unnecessary allocations. But, we’re in Scala world, we may use
[macroses](http://docs.scala-lang.org/overviews/macros/overview.html)! The very good explanation is in
[this StackOverflow topic](http://stackoverflow.com/questions/15329027/string-interpolation-and-macro-how-to-get-the-stringcontext-and-expression-loca).

## Scala String Interpolation

But before I move to macros implementation of string concatenation, let’s take
a look at Scala’s way of string formatting which is called
[String Interpolation](http://docs.scala-lang.org/overviews/core/string-interpolation.html):

```scala
val value1 = 1
val value2 = "abc"
s"start${value1}middle${value2}end"
```

This is an equivalent of Java of Scala simple string concatenation, but looks
much better:

```scala
"start" + value1 + "middle" + value2 + "end"
```

Scala compiler transforms such interpolation to this code:

```scala
new StringContext("start", "middle", "end").s(value1, value2)
```

Oh no. Again, more allocations? Yes. At least 2: one for an array of string
constants and another for an array of arguments. And also, inside method s,
there is a processing of string constants (yes, on each call). Doesn’t look as
highly optimal.

### Macros to rule them all

We may create a macros, that will generate another code for string interpolation.
We still can use this neat syntax, but do whatever we want to concatenate these
string constants and arguments.

For example, we can precalculate length of StringBuilder, and then append
arguments there and be sure, that there won’t be any other allocation.

The [code of macros](https://github.com/dkomanov/scala-string-format/blob/master/scala-string-format/src/main/scala/com/komanov/stringformat/macros/MacroConcat.scala) is relatively small
(around 100 lines), but it’s hard to demonstrate it well. I will explain what
it does. This code:

```scala
def value1: Int
def value2: Object
sfi"a${value1}b${value2}c"
```

Will be transformed to this code:

```scala
val local_2 = {
  val tmp = value2
  if (tmp eq null) "null" else tmp.toString
}
new java.lang.StringBuilder(12 + local_2.length)
  .append("a")
  .append(value1)
  .append("b")
  .append(local_2)
  .append("c")
  .toString
```

Important parts of generated code:

1. sfi stands for “super fast interpolation” :)
2. Precalculated length constant — 12 — consists of 3 characters for strings
  “a”, “b” and “c” and 9 characters allocated for int (value1). It may be not
  enough (for bigger int), but this is a simplification for now.
3. We don’t box integer and don’t call toString, but using append method
  overload for int. It should be faster.

Obviously, macros could be much richer — we can calculate exactly length of
integer (and all primitive values) to not over/under allocate buffer. We may
determine whether it’s safe to not create local variables (if it’s already local
variable or field) to reduce bytecode size.

But, for testing purposes, I think it’s good enough.

### Let’s microbenchmark it!

Basically, I will test this case:

```java
public static String concat(int value1, String value2,
        Object nullObject) {
    return value1 + "a" + value2 + "b" + value2 + nullObject;
}
```

With various input arguments, resulting string will be of 7, 17, 29, 75, 212,
1004 and 1006 characters long, which should cover a lot of use cases.

#### What to test

Besides various input arguments there will be benchmarks for different kinds
of concatenation/formatting (all listed in this [test](https://github.com/dkomanov/scala-string-format/blob/master/scala-string-format-core/src/test/scala/com/komanov/stringformat/FormatsTest.scala)):

* Java concatenation, as in code fragment above;
* [String.format](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/lang/String.java#2927) method;
* java.text.[MessageFormat](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/8u40-b25/java/text/MessageFormat.java#MessageFormat);
* [slf4j](http://www.slf4j.org/) message formatter (just because it’s a popular logging framework);
* Scala concatenation;
* [s](http://docs.scala-lang.org/overviews/core/string-interpolation.html#the-s-string-interpolator) string interpolator;
* [f](http://docs.scala-lang.org/overviews/core/string-interpolation.html#the-f-interpolator) string interpolator;
* [raw](http://docs.scala-lang.org/overviews/core/string-interpolation.html#the-raw-interpolator) string interpolator;
* optimized concatenation 1 (with length precalculated);
* optimized concatenation 2 (without copying of char array);
* optimized concatenation via string interpolation + macros (soInterpolator);
* super fast interpolation via macros (sfiInterpolator).

#### Charts and tables

As you can see, optimized concatenation works better on strings longer than
16 characters. String interpolations, based on macros (so and sfi), are the best.
Scala’s interpolations (s, f and raw) are slow, its performance lower than
regular string concatenation and approximately the same as slf4j.

The more convenient chart is [here](/charts/scala-string-format/).

![Different kind of string formatting performance, divided by resulting string length, nanos|wide](./string-formatting.png)

Data table for a resulting string length 212:

```
Benchmark                                Score     Error  Units
javaConcat                             165.320 ±   0.578  ns/op
stringFormat                          1364.206 ±  19.899  ns/op
messageFormat                         1370.831 ±  11.360  ns/op
scalaConcat                            169.005 ±   1.481  ns/op
concatOptimized1                        94.336 ±   1.419  ns/op
concatOptimized2                       131.683 ±   4.288  ns/op
concatOptimizedMacros                   68.702 ±   3.256  ns/op
slf4j                                  275.377 ±  10.165  ns/op
sInterpolator                          268.072 ±  12.385  ns/op
fInterpolator                         1375.487 ±  10.255  ns/op
rawInterpolator                        271.416 ±   1.797  ns/op
sfiInterpolator                         58.674 ±   0.562  ns/op
```

## Curious facts

### s interpolator is slow

For me it was unexpected. I thought, such generic thing should work as fast as
possible, but…

Now, after my research, I understand, why it works so poorly. But I don’t
understand, why it wasn’t implemented on compiler level, or at least with macros.

Additionally, I’ve performed couple more tests:

```scala
class EmptyStringBenchmark extends BenchmarkBase {
  @Benchmark
  def baseline: String = {
    ""
  }

  @Benchmark
  def sInterpolator: String = {
    s""
  }

  @Benchmark
  def sfiInterpolator: String = {
    import com.komanov.stringformat.macros.MacroConcat._
    sfi""
  }
}

class ConstStringBenchmark extends BenchmarkBase {
  @Benchmark
  def baseline: String = {
    "abc"
  }

  @Benchmark
  def sInterpolator: String = {
    s"abc"
  }

  @Benchmark
  def sfiInterpolator: String = {
    import com.komanov.stringformat.macros.MacroConcat._
    sfi"abc"
  }
}
```

And the results:

```
Benchmark                               Score     Error  Units
EmptyStringBenchmark.baseline           2.899 ±   0.011  ns/op
EmptyStringBenchmark.sInterpolator     36.181 ±   0.083  ns/op <---
EmptyStringBenchmark.sfiInterpolator    2.895 ±   0.009  ns/op
ConstStringBenchmark.baseline           2.897 ±   0.008  ns/op
ConstStringBenchmark.sInterpolator     48.307 ±   0.112  ns/op <---
ConstStringBenchmark.sfiInterpolator    2.892 ±   0.006  ns/op
```

Besides allocations of arrays, sInterpolator also processes constant strings
(non-arguments) to replace special characters. So, for constant string s“a\tb”
it will be even worse.

Macros do that processing during compilation time.

### Other Scala interpolators

According to documentation, fInterpolator is based on String.format. And its
performance actually correlates.

rawInterpolator don’t do any string processing, that’s why it’s slightly better
than sInterpolator.

### MethodHandle trick is not working

At the beginning, I’ve trusted to StackOverflow [response](http://stackoverflow.com/questions/22244402/how-can-i-improve-performance-of-field-set-perhap-using-methodhandles)
about the performance of MethodHandle. But the only thing I noticed is a performance
degradation between concatOptimized1 and concatOptimized2
(StringBuilder.toString won over new String(shared_char_array)).

So, I’ve tested MethodHandle performance by myself, and I got “good” results:

```
Benchmark     Score     Error  Units
baseline      2.907 ±   0.021  ns/op
fastSb        8.213 ±   0.088  ns/op
fastString    5.129 ±   0.568  ns/op
newString   246.314 ±   3.909  ns/op
sbToString  253.588 ±   7.551  ns/op
```

_fastString_ is an invocation of private constructor of String and _newString_
is an invocation of public constructor of String, that copies input char array.

But when I tested it on code like:

```scala
val sb = new StringBuilder(len1 + len2)
  .append(...)
  .append(...)
FastStringFactory.fastNewString(sb)
```

I received performance degradation. Apparently, JVM doesn’t optimized it in
this case. Sadly.

But there is a lesson learned: don’t trust in microbenchmarks — verify!

### Scala’s StringBuilder is slower

I even wrote a [small post]({% link _posts/2016-12-03-scala-stringbuilder-vs-java-stringbuilder-performance.md %})
about it. Despite the fact, that it’s a wrapper of java.lang.StringBuilder,
it’s significantly slower.

Btw, inside sInterpolator Java’s StringBuilder is used. Apparently, they knew it! :)


### “They” know that java.lang.StringBuilder is better

Scala concatenation (+ operator) works at the same performance as Java
concatenation [since 2.12](https://github.com/scala/scala/pull/4737).

And also sInterpolator uses java.lang.StringBuilder inside.

### Better performance as I expected for sfiInterpolator

Inside sfiInterpolator implementation, I’ve decided to make it simple,
and I am not calculating the precise length for integer and just
preallocate 9 characters. And I’ve made a single test with Int.MAX_VALUE,
which requires 10 characters. I expected some significant performance degradation
since we need to reallocate buffer from 1004 to 2008 chars (yes, I actually
verified, that this reallocation happened). But, according to benchmarks,
there wasn’t any degradation. Which is really strange.

## Conclusion

Performance optimization is always a fun journey (at least for me): you read
code, reason about it, try to write an alternative solution, measure, analyze.
But, it’s not fun to realize, that such basic things aren’t optimized as it
could be. I don’t know the motivation (maybe just lack of time), but I’m
disappointed a bit.

Anyway, Scala has a powerful tool (macros), and it could be fixed.

---

Test configuration:
* Ubuntu 16.04
* Linux Kernel 4.4.0–51-generic
* JDK 1.8.0_91
* Scala Library 2.12
* Hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM

As always, all code is on [GitHub](https://github.com/dkomanov/scala-string-format). Graphs and tables are [here](/charts/scala-string-format/). Comments, suggestions and blaming are welcome.

Originally posted on [Medium](https://medium.com/@dkomanov/scala-string-interpolation-performance-21dc85e83afd).
