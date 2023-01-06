```
Benchmark                                                 (algorithm)          (compressionRatio)  (length)  Mode  Cnt            Score     Error  Units
StubDataCompressionBenchmark.decode                          brotli_6         LOW_COMPRESSION_1_3    102400  avgt    5          680.578 ±  31.254  us/op
StubDataCompressionBenchmark.decode:totalInputBytes          brotli_6         LOW_COMPRESSION_1_3    102400  avgt    5   6682031460.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes         brotli_6         LOW_COMPRESSION_1_3    102400  avgt    5   8955904000.000                #
StubDataCompressionBenchmark.decode                          brotli_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5          908.290 ± 297.041  us/op
StubDataCompressionBenchmark.decode:totalInputBytes          brotli_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5   3317033688.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes         brotli_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5   6972620800.000                #
StubDataCompressionBenchmark.decode                          brotli_6        HIGH_COMPRESSION_3_4    102400  avgt    5          564.639 ±  86.453  us/op
StubDataCompressionBenchmark.decode:totalInputBytes          brotli_6        HIGH_COMPRESSION_3_4    102400  avgt    5   3094239030.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes         brotli_6        HIGH_COMPRESSION_3_4    102400  avgt    5  10285670400.000                #
StubDataCompressionBenchmark.decode                          brotli_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5          370.846 ±  22.192  us/op
StubDataCompressionBenchmark.decode:totalInputBytes          brotli_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5   2653750843.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes         brotli_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5  16234188800.000                #
StubDataCompressionBenchmark.decode                   brotli_google_6         LOW_COMPRESSION_1_3    102400  avgt    5         1312.230 ±  41.757  us/op
StubDataCompressionBenchmark.decode:totalInputBytes   brotli_google_6         LOW_COMPRESSION_1_3    102400  avgt    5   3385922616.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes  brotli_google_6         LOW_COMPRESSION_1_3    102400  avgt    5   4538675200.000                #
StubDataCompressionBenchmark.decode                   brotli_google_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5         2266.509 ±  33.879  us/op
StubDataCompressionBenchmark.decode:totalInputBytes   brotli_google_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5   1216652584.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes  brotli_google_6      MEDIUM_COMPRESSION_2_1    102400  avgt    5   2555699200.000                #
StubDataCompressionBenchmark.decode                   brotli_google_6        HIGH_COMPRESSION_3_4    102400  avgt    5         1597.249 ± 140.807  us/op
StubDataCompressionBenchmark.decode:totalInputBytes   brotli_google_6        HIGH_COMPRESSION_3_4    102400  avgt    5   1101695736.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes  brotli_google_6        HIGH_COMPRESSION_3_4    102400  avgt    5   3657318400.000                #
StubDataCompressionBenchmark.decode                   brotli_google_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5         1148.809 ±  19.998  us/op
StubDataCompressionBenchmark.decode:totalInputBytes   brotli_google_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5    837555232.000                #
StubDataCompressionBenchmark.decode:totalOutputBytes  brotli_google_6  EXTRA_HIGH_COMPRESSION_6_2    102400  avgt    5   5134745600.000                #
```