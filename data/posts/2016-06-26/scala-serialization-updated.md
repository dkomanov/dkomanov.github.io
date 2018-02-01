I’ve just created [charts](/charts/scala-serialization/). There I’ve put my recent benchmark results from the
[Scala Serialization article](/p/scala-serialization).

Things changed:
* Results gathered via [JMH](http://openjdk.java.net/projects/code-tools/jmh/).
* Added benchmark for two-way action: serialization and deserialization.
* In JMH I use 2 threads instead of 1 (so, I check libraries in multi-threaded environment).
* Chill doesn’t behave well (sometimes deserialization fails with
  “Buffer underflow” exception, it is related to multi-threading,
  but I didn’t have enough time to investigate).
* Libraries versions are updated (boopickle, pickling, scalapb).
* Scala Pickling [improved](https://medium.com/@biasedrandom/hi-dmitry-7de5bc33a71d) significantly.

Thanks to everyone for comments, pull requests and shares.

Originally posted on [Medium](https://medium.com/@dkomanov/scala-serialization-updated-b37e3ff7671d).
