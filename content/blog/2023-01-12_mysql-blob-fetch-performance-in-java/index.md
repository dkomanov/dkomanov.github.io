---
type: blog
date: 2023-01-12
title: 'MySQL BLOB Fetch Performance in Java'
description: 'A performance benchmark: fetching BLOB column from MySQL uncompressed vs compressed with different algorithms!'
tags: ['java', 'mysql', 'compression', 'lz4', 'deflate', 'brotli', 'gzip', 'blob', 'benchmark', 'performance']
canonicalUrl: TBD
cover: ./cover.png
---

What's the best way to store binary data in MySQL? This is a question that has multiple answers, depending on what you want to achieve. For example, if you need to optimize for the storage size, you probably need to use some compression algorithm that compresses your data efficiently. In my case, I really need the best performance, meaning the fastest response time to fetch the entire blob from MySQL.

Let's put aside the question of whether MySQL is a good fit for [storing binary data](https://dba.stackexchange.com/questions/2445/should-binary-files-be-stored-in-the-database). The question here, is how to store binary data so the reads from DB are as fast as possible?

The solution might be to use data compression. However, this is something that requires benchmarking, as there is a trade off between using CPU for decompression and network speed. In this benchmark I am going to compare performance between different compression algorithms, compression using MySQL itself and not using compression at all.

This blog post is a continuation of my previous one -- [Java Compression Performance](/p/java-compression-performance). I'm going to use the same compression algorithms and datasets as there.

## BLOB in MySQL

MySQL has [BLOB](https://dev.mysql.com/doc/refman/8.0/en/blob.html) column type which allows to store binary data (check [docs](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html#data-types-storage-reqs-strings) for the maximum length).

Another aspect is the MySQL's storage [row format](https://dev.mysql.com/doc/refman/8.0/en/innodb-row-format.html). `DYNAMIC` row format for `BLOB` stores 20-byte pointer to where it's stored. `COMPRESSED` row format enables [compression](https://dev.mysql.com/doc/refman/8.0/en/innodb-compression-internals.html) on database level, so 20-byte pointer will point to another storage which will be compressed using [deflate with 4-byte length prefix](https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_compress).

## Datasets and Compression Algorithms

This blog post is based on my recent benchmark [Java Compression Performance](/p/java-compression-performance).

In short, there are 2 datasets:
* One is based on the real user data, contains URLs, UUID etc.
* Another is purely random, using different alphabet sizes to achieve different compression ratios.

Application level compression using these algorithms: [gzip](https://en.wikipedia.org/wiki/Gzip), [deflate](https://en.wikipedia.org/wiki/Deflate), [MySQL compression](https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_compress), [zstd](https://github.com/facebook/zstd), [snappy](https://github.com/google/snappy), [brotli](https://github.com/google/brotli) and [lz4](https://lz4.github.io/lz4/). In additional to application-level compression, we're going to use internal MySQL compression as well.

## 


* https://docs.google.com/spreadsheets/d/1pFOAgxVYsos38oraeva1_RHC9P4J3oN2Oj2fQ65L8OI
* https://quixdb.github.io/squash-benchmark/
* [8.4.2.3 Optimizing for BLOB Types](https://dev.mysql.com/doc/refman/8.0/en/optimize-blob.html)
* https://stackoverflow.com/questions/9511476/speed-of-mysql-query-on-tables-containing-blob-depends-on-filesystem-cache
* https://dev.mysql.com/doc/refman/8.0/en/blob.html
* https://dev.mysql.com/doc/refman/8.0/en/innodb-compression-internals.html
* https://medium.com/datadenys/data-compression-in-mysql-6a0668af8f08

## Benchmark

## Conclusion


Play with charts [here](/charts/mysql-blog-fetch). Source code is on [GitHub](). Originally posted on [Medium](TBD). Cover image by [DALL-E](https://openai.com/dall-e-2/): "a manometer with pipe with a dolphin on a background, 3d render" (yay! First time I managed to get something from it, even though it's still not 100%-pretty :)).
