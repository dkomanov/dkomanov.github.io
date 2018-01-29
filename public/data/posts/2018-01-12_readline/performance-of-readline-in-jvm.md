> I want to articulate in the beginning, that this post isn’t really insightful (not like my other benchmarking posts). But since I did some work I decided to share some thoughts anyway.

What if you need to read text file line by line? Obviously, this problem was solved a long time ago, there is probably nothing new to tell. In this short blog post I want to cover several approaches and some numbers for it. Let's start!

Almost all examples are in Scala.

## How to read lines?

There are several ways how to read lines. I will describe briefly those methods I chose for benchmarking. You may skip this part directly to benchmark charts.

### [BufferedReader](https://docs.oracle.com/javase/7/docs/api/java/io/BufferedReader.html)

Exists for the very beginning of JVM, it's a part of Java old IO, basically, a stream with a readLine method, which returns next line from underlying stream of null at the end of file (EOF).

```scala
val stream = Files.newBufferedReader(path, StandardCharsets.UTF_8)
try {
  var line: String = stream.readLine()
  while (line != null) {
    // do something with line
    line = stream.readLine()
  }
} finally {
  stream.close()
}
```

### [Files.readAllLines](https://docs.oracle.com/javase/7/docs/api/java/nio/file/Files.html#readAllLines(java.nio.file.Path,%20java.nio.charset.Charset))

A readAllLines method simply returns a list of all lines from a file. Under the
hood it uses same BufferedReader.

### [Files.lines](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html#lines-java.nio.file.Path-java.nio.charset.Charset-)

A lines method returns a Stream of lines, so you may write processing in a
functional style.

```java
try (Stream<String> lines = Files.lines(path)) {
    lines.forEach(System.out::println);
}
```

### Any other alternalive?

I tried to write some ad-hoc implementation, based on Files.[readAllBytes](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html#readAllBytes-java.nio.file.Path-). What I essentially do: convert byte array to char array, iterate over char array, extracting strings, separated by newline.

The problem with this approach, that I need to allocate memory for strings 3 times: once for the array of bytes, second time for the array of chars and lastly slice char array into String objects.

## Benchmark

## Results

Let’s take a look at the benchmark results. More charts you may find [here](https://dkomanov.github.io/stuff/read-lines).

## Conclusion

### Testing Environment (or, how I tested it)

If you, like me, are interested in reviewing the test environment, here are a few words on the matter: I used [JMH tool](http://openjdk.java.net/projects/code-tools/jmh/) for running benchmarks, and all the results are pretty reproducible. I ran JMH benchmarks from a laptop with i7 2.6 GHz (2 cores) and 16GB of RAM.

The use case for the event sourcing simulation is 1000 rows with unique ID’s and 200 bytes of payload (which is an average size for events that we have in projects at Wix).

You can check out my [GitHub repo](https://github.com/dkomanov/stuff) for more details. Originally posted on [Medium](https://medium.com/@dkomanov/performance-of-readline-in-jvm-9ebbbe95076c).
