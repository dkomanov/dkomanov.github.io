---
draft: true
type: blog
date: 2020-05-02
title: Writing Async App in Scala with Futures
description: TBD
tags: ["scala", "async", "exception", "error"]
canonicalUrl: TBD
---

[retries](https://medium.com/@john.m.murray786/exponential-back-off-with-scala-futures-7426340d0069)
[timeout](http://justinhj.github.io/2017/07/16/future-with-timeout.html)
[rant on threads](https://docs.google.com/presentation/d/1T0D-6Ut6s3gsLgkAgRpj_M5iNpBANU-A78pBQRteIWU)

## Rewrite a Real Service

make sure that old service has more or less good design and coverage
cycle:
* write async implementation
* use it in sync version and run all tests
* delete sync version, rewrite tests, rewire sync code
* commit it all in order to preserve history



* Use Timer in order to make sure that you don't have stale promises.
