const fs = require('fs');

const data = JSON.parse(fs.readFileSync('jdk17.json'));

const converted = data.map(({ benchmark, params, primaryMetric, secondaryMetrics }) => {
  //'com.komanov.mysql.blob.jmh.MysqlBlobBenchmarks.app_compressed'
  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1); // app_compressed

  const getAvg = (name) => {
    // AuxCounters count warmup as well, so the first value in the array is
    // "zero".
    const [rd] = secondaryMetrics[name].rawData;
    const avg = (rd[rd.length - 1] - rd[0]) / (rd.length - 1);
    return avg;
  };

  return {
    params: {
      ...params,
      method,
      comparison: `${method}-${params.compressionRatio}`,
    },
    primaryMetric: {
      score: primaryMetric.score,
      scorePercentiles: primaryMetric.scorePercentiles,
      totalBytesReturned: getAvg('totalBytesReturned'),
      totalBytesFromMysql: getAvg('totalBytesFromMysql'),
    }
  };
});

fs.writeFileSync('jdk17.min.json', JSON.stringify(converted));
