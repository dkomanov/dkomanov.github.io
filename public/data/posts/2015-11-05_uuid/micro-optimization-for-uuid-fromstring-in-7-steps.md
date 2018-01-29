I spent some time on optimizing [UUID._fromString_](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html#fromString-java.lang.String-)
function and I want to share my experience about it. TL;DR — we will improve
it’s performance 4+ times in 7 steps.

First of all: such optimizations (micro-level) are not worth (most of the time)
of doing it. [Wiki article](https://en.wikipedia.org/wiki/Program_optimization) about
optimization is quite good. The first rule of optimization — don’t do it.
Nevertheless, sometimes it could be fascinating.

So, we have an [implementation](http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/default/src/share/classes/java/util/UUID.java) of
UUID._fromString_ (parses from string values like this:
“01234567–89ab-cdef-abcd-ef1234567890” it’s a 128-bit blob) in JDK:

```java
public static UUID fromString(String name) {
    String[] components = name.split("-");
    if (components.length != 5)
        throw new IllegalArgumentException("Invalid UUID string: "+name);
    for (int i=0; i<5; i++)
        components[i] = "0x"+components[i];

    long mostSigBits = Long.decode(components[0]).longValue();
    ...
```

The first thing is striking — they use the String._split_ method to divide a string
into components. Of course, it’s not the most efficient way to parse a string:
* It uses regular expressions;
* It creates an array and new strings (for our case it’s 1 allocation for an
  array and 5 allocations for components).

## [0](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava0Utils.java). Replace String.split with a compiled pattern

OK, let’s try to deal with a regular expression by using at least a compiled
regular expression:

```java
private static final Pattern SPLIT_PATTERN = Pattern.compile("-");

public static UUID fromStringFast(String s)
{
    String[] components = SPLIT_PATTERN.split(s);
```

… and this didn't help. On the contrary, it made it worse: 473 ns against 353 ns
(this is average among 20m repetitions). I looked up to a String._split_ source
and found out that JDK was written by good developers: they’ve done an
optimization for 1 and 2-symbol regular expressions so they don’t actually
use a regular expressions. Good.

## [1](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava1Utils.java). Use indexOf/substring instead of split

So, we need to deal with redundant memory allocations by using _indexOf_
method without creating an array (code is simplified, all the check are
omitted, but in performance tests it presents).

```java
int component1EndIndex = s.indexOf('-');
int component2EndIndex = s.indexOf('-', component1EndIndex + 1);
int component3EndIndex = s.indexOf('-', component2EndIndex + 1);
int component4EndIndex = s.indexOf('-', component3EndIndex + 1);

long mostSigBits = decode(s, 0, component1EndIndex);
mostSigBits <<= 16;
mostSigBits |=
    decode(s, component1EndIndex + 1, component2EndIndex);
...
private static long decode(String s, int from, int to) {
    return Long.decode("0x" + s.substring(from, to));
}
```

Instead of creating an array with 5 strings, we’re looking for 4 hyphens
and making substrings. Now we have a gain 340 ns against 353 ns (4%).
The gain is not really good, obviously, JIT done something there.
But still, we removed not only because of an array allocation — before an array
creation in split method the ArrayList is created and then it’s content
is copying to the new array (so, this is at least 2 allocations: one for
the default ArrayList size (10 elements) and one for the result (5 elements)).

## [2](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava2Utils.java). Don’t use concatenation

The next strange thing is concatenation. In the original _fromString_ function
components are “normalizing” by prepending with the “0x” string to say
to Long._decode_ function that the number is hexadecimal. I don’t really
understand the author’s thought — why don’t just use Long._parseLong_ method
with the specified radix? So, this is what we will try to do:

```java
long mostSigBits = substringAndParseLong(s, 0, component1EndIndex);
mostSigBits <<= 16;
mostSigBits |= substringAndParseLong(s, component1EndIndex + 1, component2EndIndex);
...
static long substringAndParseLong(String s, int from, int to) {
    return parseLong(s.substring(from, to), 16);
}
```

Much simpler. And faster — 171 ns against 340 ns (50%).

## [3](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava3Utils.java). Don’t use substring

The only allocations (which are slow operations) left in our implementation
are calls to a _substring_ method. The _substring_ creates a new String
object and copies an internal character array.

Unfortunately, JDK doesn’t provide _parseLong_ without using the whole String.
If we want to avoid allocations, we need to implement parseLong by ourselves
(of course, I took the [JDK’s one](http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/default/src/share/classes/java/lang/Long.java#l548)).

```java
long parseLong(String s, final int from, final int to)
```

Instead of using String indicies from 0 to _length_, we’re using indicies from
_from_ to _to_.

And now we don’t have any allocations within UUID parsing! The final average time
for the method is 145 nanoseconds, which is almost 3 times faster that the
original implementation.

But maybe we can improve it more?

## [4](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava4Utils.java). Specific replacement for the Character.digit

In the original _parseLong_ method there is this line:

```java
digit = Character.digit(s.charAt(i++), radix);
```

The function digit returns the actual number for the specified character and
radix (5 for ‘5’, 11 for ‘b’ or ‘B’ etc) . Because of a generic nature,
there are many unnecessary checks, because in this case
we’re using fixed radix — 16. After custom implementation of a digit function
we got more gain — 111 ns against 171 ns.

## [5](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava5Utils.java). Remove redundant checks for parseLong

And the last thing. We used a generic version of a _parseLong_ function. But.
We know (for sure) that this is a special use-case: radix is fixed (16),
numbers should be positive (minus sign is used as a separator) and there
couldn’t be overflow (we simple check the string’s length for it). Code became
much simpler and faster: 112 nanoseconds against 171 ns from the Step 3.

## [Final](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJavaFinalUtils.java). Combine Steps 4 and 5

And now let’s combine Steps 4 and 5: use optimized version of the _parseLong_
function and an own implementation of the _digit_ function. And we get the final
result: 82 ns against original’s 353 ns (more than 4 times faster).

What I really don’t like here is the specific implementation of the _digit_
function. It consumes additional memory for a cache (not much, but still) and
looks really weird.

Personally, I like the Step 5 — use optimized version of a _parseLong_ and
JDK’s Character._digit_.

## Summary

Shortly about our steps:

* Step 0 (unsuccessful): replace String._split_(“-”) with
Pattern._compile_(“-”)._split_ (String._split_ is optimized for it);
* Step 1: replace String._split_ with _indexOf_/_substring_
(-2 allocations for the ArrayList and the Array of Strings);
* Step 2: remove concatenation (additional allocations) and using _parseLong_
instead of heavy decode;
* Step 3: don’t use _substring_ at all (no more allocations) — create own
_parseLong_ implementation;
* Step 4: replace Character._digit_ with the specific only hex implementation;
* Step 5: remove all generic code from our _parseLong_ implementation;
* Final: combine Step 4 and Step 5.

Final time table:

```
Version    | Avg time, ns | Gain to previous | Gain to original
Original   |   353        | 0                | 0
Step 0     |   473        | -120 (-34%)      | -120 (-34%)
Step 1     |   340        |                  | 13 (4%)
Step 2     |   171        | 169 (50%)        | 182 (~2 times)
Step 3     |   145        | 26 (15%)         | 208 (~2.5 times)
Step 4     |   111        | 34 (23%)         | 242 (~3 times)
Step 5     |   112        | -1 (-1%)         | 241 (~3 times)
Final      |    81        | 0                | 272 (~4.5 times)
```

## Conclusion

I think that developers of the JDK were a bit lazy when they implemented
UUID._fromString_. Maybe they decided that it’s not really important part of
the JDK, so no need to spend a more time on it. But at least the step 2 should
be done. A strange usage of _decode_ function is really surprising.

I know that the premature optimization is the root of the evil. Nevertheless,
I believe that in such important frameworks (like JDK) everything should be
optimized. When such code is present from version to version it’s sad
(and this is why C++ developers laugh on us).

You can find the full code [here](https://github.com/dkomanov/scala-junk/).

Originally posted on [Medium](https://medium.com/@dkomanov/micro-optimization-for-uuid-fromstring-in-7-steps-277c9c72e982).
