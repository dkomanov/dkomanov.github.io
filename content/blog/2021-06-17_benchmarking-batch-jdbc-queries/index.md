---
type: blog
date: 2021-06-17
title: Benchmarking batch JDBC queries
description: Benchmarks for different kinds of batch queries to MySQL
cover: ./cover.jpg
tags: ["scala", "java", "jdbc", "mysql", "benchmark"]
canonicalUrl: https://dkomanov.medium.com/benchmarking-batch-jdbc-queries-a2b5911ada26
---

One of our services recently started to perform multiple inserts and deletes in MySQL database. To the point of a noticeable
response time increase. [Batching](https://docs.oracle.com/cd/E11882_01/java.112/e16548/oraperf.htm#JJDBC28753) of SQL
queries is nothing new, but I decided to wander around this topic a bit in Internet, and stumbled upon something I never
heard before (or blissfully forgot). A [rewriteBatchedStatements](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-connp-props-performance-extensions.html#cj-conn-prop_rewriteBatchedStatements)
property of MySQL JDBC driver. Here I am, benchmarking this thing and checking other options...

Disclaimer 1. To be honest, this post doesn't contain anything new or special in it. I've just discovered something
interesting and would like to share it.

Disclaimer 2. This time I haven't prepared standalone code example, as I did it for a specific task inside of
[our](https://www.wix.engineering/post/virtual-monorepo-for-bazel) [bazel](https://bazel.build/) monorepo using some of
our internal tooling. Sorry. But there's nothing special in those benchmarks.

## What happened?

Initially we used queries like this (all examples are for [scalikejdbc](http://scalikejdbc.org/) but it doesn't really
matter):

```scala
case class Entity(id: String, val1: String, val2: Boolean, val3: Array[Byte])

def add(entity: Entry): Unit = autoCommit { implicit session =>
  sql"""
     INSERT INTO tbl (id, col1, col2, col3)
              VALUES (${entity.id}, ${entity.val1}, ${entity.val2}, ${entity.val3})
  """
    .update()
    .apply()
}

def remove(id: String): Unit = autoCommit { implicit session =>
  sql"""DELETE FROM tbl WHERE id = $id"""
    .update()
    .apply()
}
```

As system evolved, we started calling those DAO methods in a loop (gotcha!). Eventually number of entities grew, and we
got a problem :)

## Batching

Batching is an attempt to reduce number of round-trips from application to a database. So, what driver does is -- instead
of sending a bunch of separate queries, it sends it this way:
```sql
INSERT INTO tbl (...) VALUES(...);
INSERT INTO tbl (...) VALUES(...);
```

Note the `;` at the end of the query. Those are still separate queries, but it's sent as a single request. To code change
is not that big:
```scala
def add(entities: Seq[Entity]): Unit = localTx { implicit session =>
  val params = entities.map { entity =>
    Seq(
      "id" -> entity.id,
      "val1" -> entity.val1,
      "val2" -> entity.val2,
      "val3" -> entity.val3,
    )
  }
  sql"""
    INSERT INTO tbl (id, col1, col2, col3)
             VALUES ({id}, {val1}, {val2}, {val3})
    """
    .batchByName(params: _*)
    .apply()
}
```

Similar thing we can do for DELETE:
```scala
def remove(ids: Seq[String]): Unit = localTx { implicit session =>
  val params = ids.map(v => Seq(v))
  sql"""DELETE FROM tbl WHERE id = ?"""
    .batch(params: _*)
    .apply()
}
```

## Better DELETE (IN clause)

Actually, for delete we can do much more robust thing:
```scala
def remove(ids: Seq[String]): Unit = autoCommit { implicit session =>
  val inClause = SQLSyntax.csv(ids.map(id => sqls"""$id"""): _*)
  sql"""DELETE FROM tbl WHERE id IN ($inClause)"""
    .update()
    .apply()
}
```

## rewriteBatchedStatements

I stumbled upon this parameter on [StackOverflow](https://stackoverflow.com/questions/26307760/mysql-and-jdbc-with-rewritebatchedstatements-true)
and instantly decided to check how it works. Basically, it rewrites INSERT queries in multi-value queries:
```sql
INSERT INTO tbl (...)
         VALUES (...), (...), (...)
```

Which makes it slightly more concise (less SQL) and [something](https://dev.mysql.com/doc/refman/8.0/en/insert-optimization.html)
inside MySQL makes it faster.

## Benchmarks

First, I verified that `rewriteBatchedStatements` actually works by enabling [profile logs](https://stackoverflow.com/questions/10903206/enabling-mysql-general-query-log-with-jdbc/13025521)
in driver, it showed that final queries. Second, I built a very simple benchmark that tests different flavors of batching
for `INSERT` and for `DELETE` with different number of entries. Each entry in my test is about few hundreds of bytes,
multiple columns, nothing fancy.

### INSERT

As you may see in benchmark results below, multi-value INSERT is really the fastest.

`oneByOne` is just a loop outside the DAO. Total time increases linearly (obviously). The problem here is simple -- the
number of transactions in MySQL equals to number of rows that we're inserting. And a transaction takes time.

Solution to this is to start transaction only once and then make queries in the loop within this transaction. This case
represented by `oneByOneInTransaction` in the table. As you may see, its performance is comparable to a regular batching.

```
Benchmark            (numberOfEntities)  Mode  Cnt     Score   Error  Units

batch                                 1  avgt    2    12.797          ms/op
batchRewriting                        1  avgt    2    11.769          ms/op
oneByOneInTransaction                 1  avgt    2    12.624          ms/op
oneByOne                              1  avgt    2    12.184          ms/op

batch                                10  avgt    2    13.433          ms/op
batchRewriting                       10  avgt    2    11.835          ms/op
oneByOneInTransaction                10  avgt    2    15.592          ms/op
oneByOne                             10  avgt    2   125.161          ms/op

batch                               100  avgt    2    29.763          ms/op
batchRewriting                      100  avgt    2    22.480          ms/op
oneByOneInTransaction               100  avgt    2    35.664          ms/op
oneByOne                            100  avgt    2  1281.417          ms/op

batch                              1000  avgt    2   213.938          ms/op
batchRewriting                     1000  avgt    2   148.009          ms/op
oneByOneInTransaction              1000  avgt    2   229.646          ms/op

batch                             10000  avgt    2  2027.138          ms/op
batchRewriting                    10000  avgt    2  1497.429          ms/op
oneByOneInTransaction             10000  avgt    2  2321.587          ms/op
```

### DELETE

In case of DELETE the option `rewriteBatchedStatements` shouldn't affect anything. However, it's still better than regular
batching.

As expected, by using `IN` clause we get the best performance, as it's a single query (just like in case of INSERT with
multi-values).

```
Benchmark            (numberOfEntities)  Mode  Cnt     Score   Error  Units
batch                                 1  avgt    2    21.636          ms/op
batchRewriting                        1  avgt    2    15.237          ms/op
inClause                              1  avgt    2    13.483          ms/op
oneByOneInTransaction                 1  avgt    2    10.938          ms/op
oneByOne                              1  avgt    2    12.273          ms/op

batch                                10  avgt    2    16.328          ms/op
batchRewriting                       10  avgt    2    14.396          ms/op
inClause                             10  avgt    2    11.184          ms/op
oneByOneInTransaction                10  avgt    2    13.085          ms/op
oneByOne                             10  avgt    2   124.575          ms/op

batch                               100  avgt    2    21.893          ms/op
batchRewriting                      100  avgt    2    17.696          ms/op
inClause                            100  avgt    2    13.029          ms/op
oneByOneInTransaction               100  avgt    2    24.492          ms/op
oneByOne                            100  avgt    2  1181.656          ms/op

batch                              1000  avgt    2   104.244          ms/op
batchRewriting                     1000  avgt    2    83.070          ms/op
inClause                           1000  avgt    2    25.444          ms/op
oneByOneInTransaction              1000  avgt    2   130.383          ms/op

batch                             10000  avgt    2   925.338          ms/op
batchRewriting                    10000  avgt    2   854.990          ms/op
inClause                          10000  avgt    2   167.237          ms/op
oneByOneInTransaction             10000  avgt    2  1254.676          ms/op
```

## Conclusion

The way to achieve the best performance with a database is to use the least amount of queries. In case of `INSERT` it's
a multi-value query, in case of `DELETE` it's an `IN` clause with multiple identifiers specified. For `DELETE` queries
it's on us to write it properly, and for `INSERT` queries there is a very nice driver option that converts your batch
query into multi-value query and boosts the performance auto-magically!

Originally posted on [Medium](https://dkomanov.medium.com/benchmarking-batch-jdbc-queries-a2b5911ada26). [Image](https://pixabay.com/photos/logistics-stock-transport-shipping-852936/) by [falco](https://pixabay.com/users/falco-81448/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=852936) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=852936).
