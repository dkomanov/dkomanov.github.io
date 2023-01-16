import { Link } from 'gatsby';
import React, { useState } from 'react';
import {
  ChartAndTable2,
  ChooseSlider,
  JmhChartComponentProps,
  JmhChartPage,
  StatelessChoose,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';
import { EmptyJmhExtractorFuncHolder, JmhAxisDescriptor, JmhExtractorFunc } from '../../../util/jmh';
import {
  AllCompressionRatios,
  CompressionRatioChooseComponent,
  comparisonValues,
  DefaultCompressionRatio,
  sideBySide,
} from '../java-compression/CompressionRatio';
import {
  DefaultRealDataset,
  filterByDataset,
  DatasetChooseComponent,
  RealLengthDesc,
} from '../java-compression/RealData';

interface NameValue {
  name: string;
  value: string;
  default?: boolean;
}

type StubDataset = 'all' | 'small' | 'big';

function generateLengths() {
  const list: NameValue[] = [];

  function addKb(n: number) {
    list.push({
      name: `${n}KB`,
      value: (n * 1024).toString(),
    });
  }
  function addMb(mb: number, kb100: number) {
    list.push({
      name: `${mb}.${kb100}MB`,
      value: (mb * 1024 * 1024 + kb100 * 100 * 1024).toString(),
      default: mb === 5 && kb100 === 0,
    });
  }

  addKb(1);
  for (let kb = 5; kb < 100; kb += 5) {
    addKb(kb);
  }
  for (let kb = 100; kb <= 900; kb += 100) {
    addKb(kb);
  }
  for (let mb = 1; mb <= 4; ++mb) {
    for (let kb = 0; kb <= 9; ++kb) {
      addMb(mb, kb);
    }
  }
  addMb(5, 0);
  return list;
}

const AllLengths = generateLengths();

const AlgorithmDesc: JmhAxisDescriptor = {
  title: 'Compression Method',
  prop: 'algorithm',
  values: [
    {
      name: 'Uncompressed',
      value: 'uncompressed',
    },
    {
      name: 'Compressed table',
      value: 'auto_mysql',
    },
    {
      name: 'deflate',
      value: 'deflate',
    },
    {
      name: 'deflate+len MySQL',
      value: 'explicit_mysql',
    },
    {
      name: 'deflate+len Java',
      value: 'deflateWithSize',
    },
    ...['gzip', 'snappy', 'zstd', 'brotli_0', 'brotli_6', 'brotli_11', 'lz4_fast', 'lz4_high9', 'lz4_high17'].map(
      (v) => ({ name: v, value: v })
    ),
  ],
};

const StubLengthDesc: JmhAxisDescriptor = {
  title: 'Data length',
  prop: 'length',
  values: AllLengths,
};

const hAxisDataLength = { title: 'Data length, bytes' };
const vAxisThroughput = { title: 'throughput, bytes per second' };
const vAxisTime = { title: 'time, microseconds' };
const legend = {
  textStyle: {
    fontSize: 14,
  },
};

const MysqlBlobFetchImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [length, lengthSet] = useState(AllLengths.find((v) => v.default)!.value);
  const [compressionRatio, compressionRatioSet] = useState(DefaultCompressionRatio);
  const [stubDataset, stubDatasetSet] = useState<StubDataset>('big');
  const [realDataset, realDatasetSet] = useState(DefaultRealDataset);
  const [extractor, extractorSet] = useState(EmptyJmhExtractorFuncHolder);

  const filterByRatio = (p: any) => p.compressionRatio === compressionRatio;
  const filterByStubDataset = (p: any) =>
    stubDataset === 'all' || (stubDataset === 'small' ? parseInt(p.length) <= 102400 : parseInt(p.length) >= 102400);

  const items = (list: string[]) => list.map((v) => ({ label: v, value: v }));
  const StubDatasetChoose = (
    <StatelessChoose
      label="Data set:"
      items={items(['all', 'small', 'big'])}
      value={stubDataset}
      onChange={stubDatasetSet}
    />
  );
  const RealDatasetChoose = <DatasetChooseComponent dataset={realDataset} datasetSet={realDatasetSet} />;
  const CompressionRatioChoose = (
    <CompressionRatioChooseComponent value={compressionRatio} onChange={compressionRatioSet} />
  );

  const makeChooses = (realData: boolean) => {
    return realData ? (
      <div>{RealDatasetChoose}</div>
    ) : (
      <div>
        {CompressionRatioChoose}
        {StubDatasetChoose}
      </div>
    );
  };
  const makeFilter = (realData: boolean) =>
    realData
      ? (p: any) => p.realData === realData && filterByDataset(realDataset, p)
      : (p: any) => p.realData === realData && filterByRatio(p) && filterByStubDataset(p);

  const PerformanceChart = (realData: boolean) => {
    return (
      <div>
        <h3>Fetch BLOBs of different lengths</h3>

        {makeChooses(realData)}

        <ChartAndTable2
          chartType="Line"
          dataTable={jmhList}
          extractor={extractor.func}
          filter={makeFilter(realData)}
          xDesc={realData ? RealLengthDesc : StubLengthDesc}
          yDesc={AlgorithmDesc}
          options={{
            hAxis: hAxisDataLength,
            vAxis: vAxisTime,
            legend,
          }}
        />
      </div>
    );
  };

  const ThroughputChart = (realData: boolean) => {
    return (
      <div>
        <h3>Effective throughput after decompression</h3>

        {makeChooses(realData)}

        <ChartAndTable2
          chartType="Line"
          dataTable={jmhList}
          extractor={(pm: any) => pm.totalBytesReturned}
          filter={makeFilter(realData)}
          xDesc={realData ? RealLengthDesc : StubLengthDesc}
          yDesc={AlgorithmDesc}
          options={{
            hAxis: hAxisDataLength,
            vAxis: vAxisThroughput,
            legend,
          }}
        />

        <h3>MySQL data throughput over the wire</h3>

        {makeChooses(realData)}

        <ChartAndTable2
          chartType="Line"
          dataTable={jmhList}
          extractor={(pm: any) => pm.totalBytesFromMysql}
          filter={makeFilter(realData)}
          xDesc={realData ? RealLengthDesc : StubLengthDesc}
          yDesc={AlgorithmDesc}
          options={{
            hAxis: hAxisDataLength,
            vAxis: vAxisThroughput,
            legend,
          }}
        />
      </div>
    );
  };

  const ComparisonCharts = (title: string, yDesc: JmhAxisDescriptor) => {
    return (
      <div>
        <h3>{title} with different compression ratios</h3>

        <h4>Performance</h4>

        {StubDatasetChoose}
        <ChartAndTable2
          chartType="Line"
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => filterByStubDataset(p)}
          xDesc={StubLengthDesc}
          yDesc={yDesc}
          alternateColors={yDesc.values.length % 4 === 0 ? 2 : 0}
          options={{
            hAxis: hAxisDataLength,
            vAxis: vAxisTime,
            legend,
          }}
        />

        <h4>Throughput</h4>

        {StubDatasetChoose}
        <ChartAndTable2
          chartType="Line"
          dataTable={jmhList}
          extractor={(pm: any) => pm.totalBytesReturned}
          filter={(p: any) => filterByStubDataset(p)}
          xDesc={StubLengthDesc}
          yDesc={yDesc}
          options={{
            hAxis: hAxisDataLength,
            vAxis: vAxisThroughput,
            legend,
          }}
        />
      </div>
    );
  };

  return (
    <div className="markdown">
      <h2>Introduction</h2>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/mysql-blob-fetch-performance-in-java">&laquo;MySQL BLOB Fetch Performance In Java&raquo;</Link>{' '}
        blog post.
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
        <li>
          <a href="#comparisons">Comparisons for stub (random) data</a>
        </li>
        <li>
          <a href="#legend">Legend</a>
        </li>
      </ul>

      <TimeUnits onChange={(func: JmhExtractorFunc) => extractorSet({ func })} />

      <h2>Charts for real data</h2>

      {PerformanceChart(true)}
      {ThroughputChart(true)}

      <h2>Charts for stub (random) data</h2>

      {PerformanceChart(false)}
      {ThroughputChart(false)}

      <h3>Fetch performance for different compression ratios</h3>

      <ChooseSlider
        label="Data length:"
        items={AllLengths.map((i) => {
          return {
            label: i.name,
            value: i.value,
            default: i.default === true,
          };
        })}
        onChange={(value: string) => lengthSet(value)}
      />

      <ChartAndTable2
        chartType="Bar"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.length === length}
        xDesc={{
          title: 'Compression Ratio',
          prop: 'compressionRatio',
          values: AllCompressionRatios,
        }}
        yDesc={AlgorithmDesc}
        options={{
          hAxis: {
            title: 'Compression Ratio',
          },
          vAxis: vAxisTime,
        }}
      />

      <h2 id="comparisons">Comparisons</h2>

      {ComparisonCharts('Uncompressed vs LZ4', {
        title: 'Compression Method',
        prop: 'comparison',
        values: [
          {
            name: 'Uncompressed',
            value: 'uncompressed-LOW_COMPRESSION_1_3',
          },
          ...comparisonValues('lz4_high9', 'lz4_high9'),
        ],
      })}
      {ComparisonCharts('Compressed Table vs DECOMPRESS', {
        title: 'Compression Method',
        prop: 'comparison',
        values: sideBySide([
          comparisonValues('Compressed table', 'auto_mysql'),
          comparisonValues('deflate+len MySQL', 'explicit_mysql'),
        ]),
      })}

      {ComparisonCharts('Java vs MySQL', {
        title: 'Compression Method',
        prop: 'comparison',
        values: sideBySide([comparisonValues('Java', 'deflateWithSize'), comparisonValues('MySQL', 'explicit_mysql')]),
      })}

      <h2 id="legend">Legend</h2>

      <p>SQL schema:</p>
      <pre>
        -- data is not compressed{'\n'}
        CREATE TABLE uncompressed_blobs ({'\n'}
        {'  '}id INT NOT NULL PRIMARY KEY,{'\n'}
        {'  '}data MEDIUMBLOB NOT NULL{'\n'}) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
        {'\n'}
        {'\n'}
        CREATE TABLE compressed_blobs ({'\n'}
        {'  '}id INT NOT NULL PRIMARY KEY,{'\n'}
        {'  '}data MEDIUMBLOB NOT NULL{'\n'}) ENGINE=InnoDB ROW_FORMAT=COMPRESSED;
        {'\n'}
        {'\n'}
      </pre>

      <ul>
        <li>
          <strong>Uncompressed</strong>: select data column from <i>uncompressed_blobs</i> table: data is not compressed
          neither in MySQL nor on application level.
        </li>
        <li>
          <strong>Compressed table</strong>: select data column from <i>compressed_blobs</i> table: data is compressed
          in MySQL, on select MySQL decompresses it and returns data uncompressed over the wire.
        </li>
        <li>
          <strong>deflate+size</strong>: select data column from <i>uncompressed_blobs</i> table: data is compressed on
          application level using{' '}
          <a href="https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_compress">
            MySQL's algorithm
          </a>
          , on select MySQL returns compressed data over the wire (no decompress in MySQL); data is decompressed in
          application.
        </li>
      </ul>

      <p>
        Full JMH logs: <a href={filePath('jdk17.log.txt')}>openjdk-17</a> (<a href={filePath('jdk17.json')}>json</a>).
      </p>
    </div>
  );
};

const filePath = (name: string) => `/data/charts/mysql-blob-fetch/${name}`;

const MysqlBlobFetch = JmhChartPage(MysqlBlobFetchImpl, {
  fetchFunc: () => loadJson(filePath('jdk17.min.json')),
  exportDimensionsFunc: (_, params) => params,
  headerText: 'MySQL BLOB Fetch Performance In Java (Charts)',
});

export default MysqlBlobFetch;
