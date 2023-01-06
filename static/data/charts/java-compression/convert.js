const fs = require('fs');

function convertFile(name, jdk) {
  return convert(JSON.parse(fs.readFileSync(name)), jdk);
}

function convert(list, jdk) {
  return list.map(({ benchmark, params, primaryMetric, secondaryMetrics }) => {
    //'com.komanov.compression.jmh.RealDataCompressionBenchmark.decode'
    const action = benchmark.substring(benchmark.lastIndexOf('.') + 1); // decode
    const realData = benchmark.indexOf('.RealData') !== -1;
  
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
        jdk,
        action,
        realData,
        comparison: params.compressionRatio ? `${params.algorithm}-${params.compressionRatio}` : undefined,
      },
      primaryMetric: {
        score: primaryMetric.score,
        scorePercentiles: primaryMetric.scorePercentiles,
        totalInputBytes: getAvg('totalInputBytes'),
        totalOutputBytes: getAvg('totalOutputBytes'),
      }
    };
  });
}

const jdk8 = convertFile('jdk8.json', 'openjdk-8');
const jdk11 = convertFile('jdk11.json', 'openjdk-11');
const jdk17 = convertFile('jdk17.json', 'openjdk-17');

fs.writeFileSync('jmh.min.json', JSON.stringify([...jdk8, ...jdk11, ...jdk17]));
