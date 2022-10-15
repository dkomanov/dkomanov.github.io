---
type: blog
draft: true
date: 2022-10-20
title: 'Scala Serialization 2022'
description: 'Performance comparison of popular serialization libraries for Scala. A remake of the post from 2016 with new libraries, different JVMs and new insights'
tags: ["scala", "java", "serialization", "benchmark", "performance"]
canonicalUrl: TBD
cover: ./cover.jpg
---

In age of remakes, sequels, reboots and such things I decided to make my own :) 6 years ago I wrote a pretty big blog post about [Scala Serialization](/p/scala-serialization). I received some positive feedback and some proposal - which libraries to include to benchmark. I wanted to follow up on it for a long time, but... didn't have enough time and motivation to go back. And now it's time :)

In our era of Internet, [JSON](https://www.json.org/) is probably the most used data format. It makes the choice of the library to work with JSON (or any other data format) pretty much important: CPU cycles spent on [serialization](https://en.wikipedia.org/wiki/Serialization)/deserialization may save your bill and environment.

Even though the focus of this benchmark is on Scala libraries, I actually benchmark 50/50 Scala and Java libraries.

## Data Formats and Libraries

A full list of formats and libraries in benchmark:
* [JSON](https://www.json.org/) format: [Jackson](https://github.com/FasterXML/jackson), [Jsoniter](https://github.com/plokhotnyuk/jsoniter-scala), [uPickle](https://github.com/com-lihaoyi/upickle) and [Circe](https://github.com/circe/circe).
* [Protocol Buffers](https://developers.google.com/protocol-buffers/) (protobuf): [ScalaPB](https://github.com/scalapb/ScalaPB) and [protobuf-java](https://developers.google.com/protocol-buffers/docs/reference/java-generated).
* [Thrift](https://thrift.apache.org/): [libthrift](https://github.com/apache/thrift/tree/master/lib/java).
* [MessagePack](https://msgpack.org/): [uPickle](https://github.com/com-lihaoyi/upickle).
* [Cap'n Proto](https://capnproto.org/): [capnproto-java](https://github.com/dwrensha/capnproto-java).
* [Boopickle](https://github.com/suzaku-io/boopickle). Custom binary format without backward-compatibility.
* [Kryo](https://github.com/EsotericSoftware/kryo): [Chill](https://github.com/twitter/chill).
* [CBOR](https://tools.ietf.org/html/rfc7049) and [Smile](https://github.com/FasterXML/smile-format-specification) via [Jackson](https://github.com/FasterXML/jackson-dataformats-binary).
* [Java serialization](https://docs.oracle.com/javase/8/docs/technotes/guides/serialization/index.html) just for reference.

I dropped few libraries that I benchmarked previously:
* [kryo-macros](https://github.com/evolution-gaming/kryo-macros): it's not maintained, apparently, the library was published on bintray, which is [shutdown](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/).
* [Scrooge](https://github.com/twitter/scrooge): doesn't work with `libthrift` greater than `0.10.0`.
* [pickling](https://github.com/scala/pickling): repo is archived, last version is for scala-library `2.11`.

## Data Model

TBD: Why is it important that I use DTO and events?

## Performance

Charts!

## Data Size

Table, charts!

## Conclusion


### Extra



## Read More

* Amazing and rich [benchmarks](https://plokhotnyuk.github.io/jsoniter-scala/) by jsoniter-scala.
* [JVM Serializers](https://github.com/eishay/jvm-serializers)


Play with charts [here](/charts/scala-serialization-2022), [data sizes tables](https://docs.google.com/spreadsheets/d/1ztxHL8oDnhOpiPeG6SEiocbs5qa3Xw7a-Ei0RSX9rdk). Source code is on [GitHub](https://github.com/dkomanov/stuff/tree/c9315e7765ce95bbe2dd1cd4f339d4abc7f9795f/src/com/komanov/serialization). Originally posted on [Medium](TBD). [Cover image]() by []() from [Pixabay](https://pixabay.com/).
