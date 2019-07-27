---
type: blog
date: 2015-11-16
title: "Let’s continue with UUID.fromString"
description: "Everything is invented before us: my attempt to contribute UUID.fromString to JDK9..."
tags: ["java", "jdk9", "performance"]
canonicalUrl: https://medium.com/@dkomanov/let-s-continue-with-uuid-fromstring-5d65778e22c9
---
I doubt a bit, but then I decided to try to submit a patch to JDK with
the performance improvement. I’ve read couple [articles](http://openjdk.java.net/contribute/),
cloned [code](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJavaFinalUtils.java) and realized that _fromString_
implementation has been changed in JDK9 :)

The actual implementation of the _fromString_ in JDK9 was
[made](http://hg.openjdk.java.net/jdk9/jdk9/jdk/rev/3b298c230549) in the previous year
(for this [issue](https://bugs.openjdk.java.net/browse/JDK-8006627)). So, let’s see what’s inside.

```java
int len = name.length();
if (len > 36) {
    throw new IllegalArgumentException("UUID string too large");
}

int dash1 = name.indexOf('-', 0);
int dash2 = name.indexOf('-', dash1 + 1);
int dash3 = name.indexOf('-', dash2 + 1);
int dash4 = name.indexOf('-', dash3 + 1);
int dash5 = name.indexOf('-', dash4 + 1);

if (dash4 < 0 || dash5 >= 0) {
    throw new IllegalArgumentException("Invalid UUID string: " + name);
}

long mostSigBits = Long.parseLong(name, 0, dash1, 16) & 0xffffffffL;
mostSigBits <<= 16;
mostSigBits |= Long.parseLong(name, dash1 + 1, dash2, 16) & 0xffffL;
mostSigBits <<= 16;
mostSigBits |= Long.parseLong(name, dash2 + 1, dash3, 16) & 0xffffL;
long leastSigBits = Long.parseLong(name, dash3 + 1, dash4, 16) & 0xffffL;
leastSigBits <<= 48;
leastSigBits |= Long.parseLong(name, dash4 + 1, len, 16) & 0xffffffffffffL;

return new UUID(mostSigBits, leastSigBits);
```

As we can see, an implementation is almost like my implementation [Step 3](https://github.com/dkomanov/scala-junk/blob/master/src/main/scala/com/komanov/uuid/UuidJava3Utils.java).
In JDK9 was introduced the overload of _parseLong_:

```java
long parseLong(CharSequence s, int beginIndex, int endIndex, int radix)
```

So, in the actual implementation of the _fromString_ no allocation is performed
(besides the creation of the new UUID class instance). And it should be ~2.5
times faster than the previous implementation, or maybe even faster if JIT is
optimizing JDKs code more aggressively.

I think if I would submit an improvement by myself, I would make the same thing.
Because it’s strange to have specific implementation of generic functions
_parseLong_ and Character._digit_ just for this class (more code — more support,
more tests, more questions within a code review).

The time table for JDK9 will be:

```
Version    | Avg time, ns | Gain to previous | Gain to original
Original   |   130        | 0                | 0
Step 0     |   548        | -418             | -418
Step 1     |   529        |                  | -399
Step 2     |   247        | 282 (53%)        | -117
Step 3     |   126        | 121 (49%)        | 4 (1%)
Step 4     |   101        | 25 (20%)         | 29 (22%)
Step 5     |   109        | -8 (-8%)         | 21 (16%)
Final      |    78        | 31 (28%)         | 52 (40%)
```

Don’t forget, that performance in JDK9 will change many times prior to release
(this test is performed with jdk-9-ea-bin-b91-linux-x64–04_nov_2015, the final
release [will be](http://openjdk.java.net/projects/jdk9/) in September 2017). And after test
you may realize that the “final” solution is faster but not really faster, just 40%.

Originally posted on [Medium](https://medium.com/@dkomanov/let-s-continue-with-uuid-fromstring-5d65778e22c9).
