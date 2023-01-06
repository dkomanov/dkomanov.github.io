const fs = require('fs');

const data = JSON.parse(fs.readFileSync('jdk17.json'));

const converted = data.map(({ benchmark, params, primaryMetric, secondaryMetrics }) => {
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
      realData: benchmark.indexOf('RealData') !== -1,
      comparison: `${params.algorithm}-${params.compressionRatio || 'LOW_COMPRESSION_1_3'}`,
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
