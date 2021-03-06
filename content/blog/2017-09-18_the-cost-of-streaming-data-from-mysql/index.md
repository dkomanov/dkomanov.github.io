---
type: blog
date: 2017-09-18
title: The Cost of Streaming Data from MySQL
description: How streaming from MySQL (on client side) affects performance comparing to non-streaming...
cover: ./cover.jpg
tags: ["mysql", "event sourcing", "streaming", "java", "scala", "connectorj", "mariadb", "embedded mysql"]
canonicalUrl: https://www.wix.engineering/post/the-cost-of-streaming-data-from-mysql
---
> Repost of my [blog post](https://www.wix.engineering/post/the-cost-of-streaming-data-from-mysql) in [Wix Engineering Blog](https://www.wix.engineering) with some [extra](#extra) information. Cover image via [pixabay](https://pixabay.com/en/mountains-road-night-evening-sky-691186/).

Though the question of “How to query data from a database?” is quite an old one, we still have a reason to investigate it nowadays. True, it is common to query a list of rows from a database since that usually means less code and configuration and it's also the default approach. However, in certain scenarios, this method is just not optimal. In these cases, we don’t need all rows in memory right away, and sometimes we just can’t afford it.

When addressing the issue of querying a significant amount of data, limited by your server capacity, you may have to go with one of the following solutions: Limiting row count could work, but you won’t get all the data; pagination is another solution. However, you’ll need to perform several queries instead of a single one; and finally, streaming seems like a good option as you still send a single query and receive all the data. However, with streaming, your single query has many underlying requests under the hood to MySQL DB, which may result in longer data processing time. Since requests are performed from a driver, it’s not related to MySQL DB storage engine.

While looking into these solutions, I realized there weren't any benchmark tests for streaming at all. So I decided to test the performance cost for streaming in JVM.

## What is streaming

By default, MySQL Java drivers retrieve the data from the database all at once, and you get a ResultSet with all rows inside. On the [MySQL documentation](http://dev.mysql.com/doc/connector-j/5.1/en/connector-j-reference-implementation-notes.html), it mentions the possibility of not retrieving data all at once - this is called [streaming](http://stackoverflow.com/questions/2447324/streaming-large-result-sets-with-mysql).

Note: all source code examples are in Scala.

### Here’s how it works:

```scala
// conn is java.sql.Connection
val conn = getConnection(driver)
val st: java.sql.Statement = conn.createStatement(
 java.sql.ResultSet.TYPE_FORWARD_ONLY,
 java.sql.ResultSet.CONCUR_READ_ONLY
)
st.setFetchSize(Integer.MIN_VALUE)

val rs: java.sql.ResultSet = st.executeQuery("SELECT * FROM table WHERE id = 123")
```

When you configure the Statement like that on the executeQuery method call, you get a streaming ResultSet which contains only the first row. In this ResultSet, the next row will be loaded from a database only on the next method call.

### When is it applicable?

There are many use cases where you can use streaming besides data streaming: data migrations, [data export](http://knes1.github.io/blog/2015/2015-10-19-streaming-mysql-results-using-java8-streams-and-spring-data.html), batch processing (when you need to provide rows one by one), and one particularly interesting to me - Event Sourcing.

The straightforward way of getting an actual state of an object in event sourcing is to play all events from an event stream. However, because this is a fold operation and not all events are needed right away, you will need to apply events one by one.

Common sense suggests that applying streaming to event sourcing cannot possibly be “free." There should be some performance cost for it, otherwise, why do we need a special mode in the MySQL driver?

## So… Let’s test!

Considering all the benefits, if we could determine that the cost isn't very high, streaming would be a good solution for querying data. But in order to test the performance of streaming, we need to have something to compare it with.

Obviously, we can't compare a general use case of streaming, so instead, we will test getting a list of rows via streaming and via the default mode (getting everything at once). This should show us any overhead of the MySQL driver and additional network interaction between our application and the MySQL server.

### How to test?

Let’s start with the actual test code. Have a look at the test code for default querying (selecting everything at once):

```scala
def selectAtOnce(driver: MysqlDriver, limit: Int): List[TestTableRow] = {
  val st = getConnection(driver).createStatement()
  val rs = st.executeQuery(s"SELECT id, name FROM $TableName LIMIT $limit")
  // at this point in rs we have all rows!
  val result = mutable.ListBuffer[TestTableRow]()
  while (rs.next()) {
   result += mapRow(rs)
  }
  result.toList
}
```

In the selectAtOnce method, we simply establish the connection to the database, select limit rows, and map it to the result list.
This is what the test code should look like so that the driver knows it should turn on streaming. The only distinction is the setFetchSite (Int.MinValue) method call, which makes all the difference:

```scala
def selectViaStreaming(driver: MysqlDriver): List[TestTableRow] = {
  val st = getConnection(driver).createStatement()
  st.setFetchSize(Int.MinValue)
  val rs = st.executeQuery(s"SELECT id, name FROM $TableName LIMIT $limit")
  // in rs we don’t have any data until the next() method call
  val result = mutable.ListBuffer[TestTableRow]()
  while (rs.next()) {
   result += mapRow(rs)
  }
  result.toList
}
```

In selectViaStreaming, we do the same, but we hint the driver that we need the special streaming ResultSet. This ResultSet fetches data only on the next method call.

### What To Test

Taking into account we have more than one driver for MySQL server, results may vary. After reading [another performance](https://mariadb.org/on-performance-of-jdbc-drivers/) test from MariaDB blog, I decided to test all three available drivers: [ConnectorJ](https://dev.mysql.com/downloads/connector/j/), [MariaDB](https://mariadb.com/kb/en/mariadb/about-mariadb-connector-j/), and [Drizzle](https://github.com/krummas/DrizzleJDBC), but when I started testing, I discovered that Drizzle doesn’t support streaming - so only ConnectorJ and MariaDB remained relevant.

For each driver, I ran two sets of tests: one for the default querying (.atOnce) and one for the streaming (.stream). Each set consisted of several test cases to query different amount of rows (via LIMIT clause); from 1 to 1000.

To check the network influence, I performed tests in three different configurations:
* Benchmark and MySQL on the same server (local).
* Benchmark and MySQL on different servers connected through Wi-Fi (wifi = simulation of a “slow” network with ping greater than a millisecond).
* Benchmark and MySQL on different servers but connected through the wire (wire = fast network).

## Results

Let’s take a look at the benchmark results.

### Local

Times grows linearly with rows count. Apparently, there are no network problems - traffic on localhost is very fast.

![Local|wide](./local.png)

### Wi-Fi (slow network with latency)

Since the network is unpredictable, it’s hard to see any reasonable correlation between streaming and non-streaming. However, in general, times grows linearly as well.

![wifi|wide](./wifi.png)

### Wire

Here we see a stable difference between streaming and non-streaming. The performance of ConnectorJ’s atOnce is the best. The difference between streaming and non-streaming doesn’t seem to be significant. ConnectorJ’s difference for streaming decreases with more rows: from two times degrade with small amount of rows, to ten percent for hundreds of rows. Here we see a substantial difference between streaming and non-streaming.

In the case of MariaDB the difference is insignificant. We may see the difference between streaming and non-streaming decreasing from two times for small amount of rows to tens of percent for big amount of rows.

ConnectorJ’s non-streaming is slightly better than everything else.

![wire|wide](./wire.png)

You can play with charts [here](/charts/mysql-streaming).

## Conclusion

As expected, streaming performance has a strong correlation with network bandwidth and latency. In the case of a local MySQL installation, the difference is insignificant, and times grows linearly with the row count for both drivers. For slow networks, it’s harder to distinguish between streaming and non-streaming, since network latency is unpredictable. In fast networks, the difference could indeed reach up to twice as long - but it decreases with the row count.

So, if you have a local installation of a MySQL server or a powerful network between the application server and the MySQL server, then you may want to consider using streaming for your service from scratch. The difference in performance is not critical, plus you won’t need to worry about scaling so it won’t hurt your service reliability in the future.

### Testing Environment (or, how I tested it)

If you, like me, are interested in reviewing the test environment, here are a few words on the matter: I used [JMH tool](http://openjdk.java.net/projects/code-tools/jmh/) for running benchmarks, and all the results are pretty reproducible. I ran JMH benchmarks from a laptop with i7 2.6 GHz (2 cores) and 16GB of RAM. For wire configuration, I used AWS cloud with two micro instances (one for the server, and one for JHM benchmark).

The use case for the event sourcing simulation is 1000 rows with unique ID’s and 200 bytes of payload (which is an average size for events that we have in projects at Wix).

To test the correctness of my benchmark I used an open source library [wix-embedded-mysql](https://github.com/wix/wix-embedded-mysql). It is a highly useful tool that enables you not to think about MySQL server installation (it downloads, runs, and shutdowns a real MySQL server instance in your test).

You can check out my [GitHub repo](/charts/mysql-streaming) for more details.

## Extra

What I decided not to put in the original post is one annoyingly strange graph that I got several times on a wire (like 2 or 3 times in a row). But then I failed to reproduce it (I tried many times), but without success. JFYI...

![Weird case on wire](./weird.png)

My only assumption here was that there was something really strange with network and MariaDB went mad, but then same thing we would see on Wi-Fi chart.
