const fs = require('fs');

function convert(network, data) {
  return data.map(({ benchmark, params, primaryMetric, secondaryMetrics }) => {
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
        network,
      },
      primaryMetric: {
        score: primaryMetric.score,
        scorePercentiles: primaryMetric.scorePercentiles,
        totalBytesReturned: getAvg('totalBytesReturned'),
        totalBytesFromMysql: getAvg('totalBytesFromMysql'),
      }
    };
  });
}

const local = convert('localhost', JSON.parse(fs.readFileSync('localhost.json')));
const aws = convert('aws', JSON.parse(fs.readFileSync('aws.json')));
const ethernet = convert('ethernet', JSON.parse(fs.readFileSync('ethernet.json')));
const wifi = convert('wifi', JSON.parse(fs.readFileSync('wifi.json')));

fs.writeFileSync('jmh.min.json', JSON.stringify([...local, ...aws, ...ethernet, ...wifi]));
