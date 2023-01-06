import { Link } from 'gatsby';
import React, { useState } from 'react';
import {
  ChartAndTable,
  ChooseSlider,
  Jdks,
  JdkVersion,
  JmhChartComponentProps,
  JmhChartPage,
  StatelessChoose,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';
import { EmptyJmhExtractorFuncHolder, JmhAxisDescriptor } from '../../../util/jmh';
import { ChooseCompressionRatio, comparisonValues, DefaultCompressionRatio } from './CompressionRatio';
import { DefaultRealDataset, filterByDataset, MakeDatasetChoose, yRealDesc } from './RealData';

const AllActions = [
  {
    label: 'decode',
    value: 'decode',
  },
  {
    label: 'encode',
    value: 'encode',
  },
  {
    label: 'encode + brotli_11',
    value: 'encode-all',
  },
];

const xDesc: JmhAxisDescriptor = {
  title: 'Compression Algorithm',
  prop: 'algorithm',
  values: [
    'gzip',
    'deflate',
    'deflateWithSize',
    'snappy',
    'zstd',
    'brotli_0',
    'brotli_6',
    'brotli_11',
    'lz4_fast',
    'lz4_high9',
    'lz4_high17',
  ],
};

const xDescDeflateComparison: JmhAxisDescriptor = {
  title: 'Compression Algorithm',
  prop: 'comparison',
  values: [...comparisonValues('deflate', 'deflate'), ...comparisonValues('mysql', 'deflateWithSize')],
};

const xDescLz4Comparison: JmhAxisDescriptor = {
  title: 'Compression Algorithm',
  prop: 'comparison',
  values: [
    ...comparisonValues('lz4_fast', 'lz4_fast'),
    ...comparisonValues('lz4_high9', 'lz4_high9'),
    ...comparisonValues('lz4_high17', 'lz4_high17'),
  ],
};

const xDescBrotliComparison: JmhAxisDescriptor = {
  title: 'Compression Algorithm',
  prop: 'comparison',
  values: [
    ...comparisonValues('brotli_0', 'brotli_0'),
    ...comparisonValues('brotli_6', 'brotli_6'),
    ...comparisonValues('brotli_11', 'brotli_11'),
  ],
};

const xDescLz4VsBrotliComparison: JmhAxisDescriptor = {
  title: 'Compression Algorithm',
  prop: 'comparison',
  values: [...comparisonValues('lz4 9', 'lz4_high9'), ...comparisonValues('brotli 6', 'brotli_6')],
};

const getChooseItemsForLength = (desc: JmhAxisDescriptor, defaultValue: string) => {
  return desc.values.map((i) => {
    return {
      label: i as string,
      value: i as string,
      default: i === defaultValue,
    };
  });
};

const yStubDesc: JmhAxisDescriptor = {
  title: 'Stub Input Size',
  prop: 'length',
  values: [
    '1024',
    '2048',
    '3072',
    '4096',
    '5120',
    '6144',
    '7168',
    '8192',
    '9216',
    '10240',
    '20480',
    '30720',
    '40960',
    '51200',
    '61440',
    '71680',
    '81920',
    '92160',
    '102400',
  ],
};

function generateThroughputNormalizer() {
  const r = [];
  for (let i = 1; i <= 9; ++i) {
    r.push({
      label: `${i}00 MB/s`,
      value: (i * 100 * 1024 * 1024).toString(),
    });
  }
  for (let i = 1; i < 5; ++i) {
    r.push({
      label: `${i} GB/s`,
      value: (i * 1024 * 1024 * 1024).toString(),
    });
  }

  r.push({
    label: 'no limit',
    value: (1024 * 1024 * 1024 * 1024).toString(),
  });

  return r;
}

const ThroughputNormalizer = generateThroughputNormalizer();

const yJdkDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: Jdks,
};

const hAxisDataLength = { title: 'Data length, bytes' };
const vAxisThroughput = { title: 'throughput, bytes per second' };
const vAxisTime = { title: 'time, microseconds' };

const JavaCompressionPerformanceImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [action, actionSet] = useState(AllActions[0].value);
  const [throughputNormalizationBytes, throughputNormalizationBytesSet] = useState(
    parseInt(ThroughputNormalizer[4].value)
  );
  const encoding = action !== 'decode';
  const [extractor, extractorSet] = useState(EmptyJmhExtractorFuncHolder);

  const [realDataLength, realDataLengthSet] = useState('4287156');
  const [dataset, datasetSet] = useState(DefaultRealDataset);

  const [stubDataLength, stubDataLengthSet] = useState('102400');
  const [compressionRatio, compressionRatioSet] = useState(DefaultCompressionRatio);

  const xAlgoDesc: JmhAxisDescriptor =
    action === 'encode'
      ? {
          ...xDesc,
          values: xDesc.values.filter((v) => v !== 'brotli_11'),
        }
      : xDesc;

  const filterByJdk = (p: any) => p.jdk === jdk;
  const filterByAction = (p: any) => p.action === (encoding ? 'encode' : 'decode');

  const filterByRatio = (p: any) => p.compressionRatio === compressionRatio;

  const throughputExtractor = (pm: any) => {
    const inputOrOutput = (input: boolean) => (input ? pm.totalInputBytes : pm.totalOutputBytes);
    const input = inputOrOutput(encoding);
    const output = inputOrOutput(!encoding);
    const ratio = input / output;
    const limit = throughputNormalizationBytes;
    if (input > limit) {
      return Math.min(input, limit * ratio);
    } else {
      return input;
    }
  };

  const actionTitle = encoding ? 'Encoding' : 'Decoding';

  const items = (list: string[]) => list.map((v) => ({ label: v, value: v }));
  const JdkChoose = <StatelessChoose label="JDK:" items={items(Jdks)} value={jdk} onChange={jdkSet} />;
  const ActionChoose = <StatelessChoose label="Action:" items={AllActions} value={action} onChange={actionSet} />;
  const DatasetChoose = MakeDatasetChoose(dataset, datasetSet);
  const ThroughputNormalizerChoose = (
    <ChooseSlider
      label="IO limit:"
      items={ThroughputNormalizer.map((i) => ({ ...i, default: i.value === throughputNormalizationBytes.toString() }))}
      onChange={(v) => throughputNormalizationBytesSet(parseInt(v))}
    />
  );

  const RealDataSlider = (
    <ChooseSlider
      label="Data length:"
      items={getChooseItemsForLength(yRealDesc, realDataLength)}
      onChange={realDataLengthSet}
    />
  );
  const StubDataSlider = (
    <ChooseSlider
      label="Data length:"
      items={getChooseItemsForLength(yStubDesc, stubDataLength)}
      onChange={stubDataLengthSet}
    />
  );

  const PerformanceChart = (realData: boolean) => {
    return (
      <div>
        <h3>{actionTitle} Performance (time, microseconds)</h3>

        {realData ? (
          <div>
            {' '}
            {JdkChoose}
            {ActionChoose}
            {DatasetChoose}
          </div>
        ) : (
          <div>
            {JdkChoose}
            {ActionChoose}
            {ChooseCompressionRatio(compressionRatio, compressionRatioSet)}
          </div>
        )}

        <ChartAndTable
          chartType="LineChart"
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) =>
            p.realData == realData &&
            filterByJdk(p) &&
            filterByAction(p) &&
            (realData ? filterByDataset(dataset, p) : filterByRatio(p))
          }
          title="Time, microseconds"
          xDesc={xAlgoDesc}
          yDesc={realData ? yRealDesc : yStubDesc}
          options={{
            chartArea: { height: '80%' },
            hAxis: hAxisDataLength,
            vAxis: vAxisTime,
          }}
        />
      </div>
    );
  };

  const ThroughputChart = (realData: boolean) => {
    return (
      <div>
        <h3>
          {actionTitle} Throughput ({encoding ? 'input' : 'output'} bytes)
        </h3>

        {realData ? (
          <div>
            {' '}
            {JdkChoose}
            {ActionChoose}
            {DatasetChoose}
          </div>
        ) : (
          <div>
            {JdkChoose}
            {ActionChoose}
            {ChooseCompressionRatio(compressionRatio, compressionRatioSet)}
          </div>
        )}
        {ThroughputNormalizerChoose}

        <ChartAndTable
          chartType="LineChart"
          dataTable={jmhList}
          extractor={throughputExtractor}
          filter={(p: any) =>
            p.realData === realData &&
            filterByJdk(p) &&
            filterByAction(p) &&
            (realData ? filterByDataset(dataset, p) : filterByRatio(p))
          }
          xDesc={xAlgoDesc}
          yDesc={realData ? yRealDesc : yStubDesc}
          options={{
            chartArea: { height: '80%' },
            hAxis: hAxisDataLength,
            vAxis: vAxisThroughput,
          }}
        />
      </div>
    );
  };

  const PerformanceByJdkChart = (realData: boolean, length: string) => {
    return (
      <div>
        <h3>{actionTitle} Performance By JDK</h3>

        {ActionChoose}
        {realData ? (
          RealDataSlider
        ) : (
          <div>
            {ChooseCompressionRatio(compressionRatio, compressionRatioSet)}
            {StubDataSlider}
          </div>
        )}

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) =>
            p.realData == realData && p.length === length && filterByAction(p) && (realData || filterByRatio(p))
          }
          xDesc={xAlgoDesc}
          yDesc={yJdkDesc}
          options={{
            hAxis: hAxisDataLength,
            legend: {
              textStyle: {
                fontSize: 12,
              },
            },
          }}
        />
      </div>
    );
  };

  const ComparisonPerformance = (xDesc: JmhAxisDescriptor) => {
    return (
      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => !p.realData && filterByJdk(p) && filterByAction(p)}
        xDesc={xDesc}
        yDesc={yStubDesc}
        options={{
          chartArea: { height: '80%' },
          hAxis: hAxisDataLength,
          vAxis: vAxisTime,
        }}
      />
    );
  };

  const ComparisonThroughput = (xDesc: JmhAxisDescriptor) => {
    return (
      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={throughputExtractor}
        filter={(p: any) => !p.realData && filterByJdk(p) && filterByAction(p)}
        xDesc={xDesc}
        yDesc={yStubDesc}
        options={{
          chartArea: { height: '80%' },
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />
    );
  };

  return (
    <div className="markdown">
      <h2>Introduction</h2>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/java-compression">&laquo;Java Compression Performance&raquo;</Link> blog post.
      </p>

      <p>
        The performance tests are performed via <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6.
      </p>

      <ul>
        <li>
          <a href="#real-data">Charts for real data</a>
        </li>
        <li>
          <a href="#stub-data">Charts for stub (random) data</a>
        </li>
      </ul>

      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h2>Charts for real data</h2>

      {PerformanceChart(true)}
      {ThroughputChart(true)}
      {PerformanceByJdkChart(true, realDataLength)}

      <h2>Charts for stub (random) data</h2>

      {PerformanceChart(false)}
      {ThroughputChart(false)}
      {PerformanceByJdkChart(false, stubDataLength)}

      <h2>Comparisons</h2>

      <h3>{actionTitle}: deflate vs deflate+size (MySQL Compress)</h3>
      {ComparisonPerformance(xDescDeflateComparison)}

      <h3>{actionTitle}: lz4 Performance</h3>
      {ComparisonPerformance(xDescLz4Comparison)}

      <h3>{actionTitle}: lz4 Throughput</h3>
      {ComparisonThroughput(xDescLz4Comparison)}

      <h3>{actionTitle}: brotli Performance</h3>
      {ComparisonPerformance(xDescBrotliComparison)}

      <h3>{actionTitle}: brotli Throughput</h3>
      {ComparisonThroughput(xDescBrotliComparison)}

      <h3>{actionTitle}: lz4 vs brotli Throughput</h3>
      {ComparisonThroughput(xDescLz4VsBrotliComparison)}

      <p>
        Full JMH logs:
        <a href={filePath('jdk8.log.txt')}>openjdk-8</a> (<a href={filePath('jdk8.json')}>json</a>),{' '}
        <a href={filePath('jdk11.log.txt')}>openjdk-11</a> (<a href={filePath('jdk11.json')}>json</a>),{' '}
        <a href={filePath('jdk17.log.txt')}>openjdk-17</a> (<a href={filePath('jdk17.json')}>json</a>). Compression
        ratios and data lengths in a{' '}
        <a href="https://docs.google.com/spreadsheets/d/1pFOAgxVYsos38oraeva1_RHC9P4J3oN2Oj2fQ65L8OI">speadsheet</a>.
      </p>
    </div>
  );
};

const filePath = (name: string) => `/data/charts/java-compression/${name}`;

const JavaCompressionPerformance = JmhChartPage(JavaCompressionPerformanceImpl, {
  fetchFunc: () => loadJson(filePath('jmh.min.json')),
  exportDimensionsFunc: (_, params) => params,
  headerText: 'Java Compression Performance (Charts)',
});

export default JavaCompressionPerformance;
