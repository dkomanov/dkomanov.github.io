---
draft: true
type: blog
date: 2020-07-17
title: "Writing Async App in Scala. Part 4: Rewrite Blocking App"
description: TBD
tags: ["scala", "async", "blocking", "rewrite", "refactoring"]
canonicalUrl: TBD
---

> [Part 1. Coding.](/p/writing-async-app-in-scala-part-1-coding) \
> [Part 2. Exception Handling.](/p/writing-async-app-in-scala-part-2-exception-handling) \
> [Part 3. Threading Model.](/p/writing-async-app-in-scala-part-3-threading-model) \
> Part 4. Rewriting Existing App. \
> Part 5. What's next?

It's been a while since the last blog post. Now it's time to cover one less technical but arguable more important topic: how to rewrite an existing blocking application to be async. As mentioned before, I leave the reasoning behind this rewrite behind, assuming this is what we need.

This post is mostly about the mechanics of the rewrite: how to prepare code before rewrite, what's need to be done to rewrite code in a safe manner, how to avoid code duplication, etc. Also, it's not really related to Scala, all these principles apply to a rewrite for any language, however, it has a few examples in Scala, obviously.

## The Goal

TBD: explain the rewrite should be safe, code clean and experience nice.

The goal of the rewrite

## Prepare an Existing App

We know some software engineering principles like [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) or [Do One Thing](https://blog.codinghorror.com/curlys-law-do-one-thing/) and [other](https://www.d.umn.edu/~gshute/softeng/principles.html). All of them describe how to write code. However, it applies not only to code itself. It also may be applied to a process of writing code.

How'd we apply it here? Well... What we want to do is to safely rewrite an application, minimizing amount of bugs. In order to do it, we need to avoid doing anything other than rewrite - separate concerns! It's very important not to perform any refactoring along the way, leave it for the later stage.

What is desirable to have before the rewrite:
* The design of an application should be more or less okay, so you don't need to redesign it along the way.
* Test coverage should be sufficient. It's necessary to be sure that nothing will break in a business logic during rewrite (it's hard to predict what's going to break in production from the technical point of view in an async application).

If your existing application lacks tests or has some problems in its internal design, it's better to fix those issues first, before the rewrite.

You may ask, why is it bad to introduce some improvements in async version of the application? Personally, I am an advocate for the incremental changes: I do like to rewrite stuff from the scratch, however, it's safer and more predictable in terms of timeline and efforts needed. Also, it allows to reuse tests, including unit tests.

## What we're going to rewrite

For simplicity, our blocking application is an RPC server (just to avoid unnecessary details of protocol) connected to a database:

```scala
// RPC
trait MovieApi {
  def rate(id: Long, rating: Int): Unit
  def get(id: Long): Movie
}
case class Movie(id: Long, title: String, year: Int, rating: Double)

// Database
trait MovieDao {
  def rate(id: Long, rating: Int): Unit
  def find(id: Long): MovieDto
}
case class MovieDto(id: Long, title: String, year: Int, ratingSum: Long, ratedCount: Long)
```

Essentially, we need to rewrite only this part and its implementation. What should be prepared in advance is infrastructure for an async application: async RPC server, async database driver (if exists, if not - we will use [blocking](https://medium.com/wix-engineering/writing-async-app-in-scala-part-3-threading-model-ef9e9033bd33#0f07) one) and other necessary parts like HTTP client, RPC client, etc.

## Where to start?

Suppose, you already have a skeleton for a new service that just waits for the implementation of the async version of `MovieApi`. Now we need to understand, how to approach rewrite, which things

We write a separate deployable.
All infrastructure should be prepared in advance (skipping this part, only introduce RequestContext).

make sure that old service has more or less good design and coverage
cycle:
* write async implementation
* use it in sync version and run all tests
* delete sync version, rewrite tests, rewire sync code
* commit it all in order to preserve history
