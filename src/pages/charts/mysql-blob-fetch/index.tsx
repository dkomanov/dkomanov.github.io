import { Link } from 'gatsby';
import React, { useState } from 'react';
import {
  ChartAndTable,
  Choose,
  ChooseSlider,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';
import {
  EmptyJmhExtractorFuncHolder,
  JmhAxisDescriptor,
  JmhExtractorFunc,
} from '../../../util/jmh';

function generateSmallLengths() {
  const list = [];
  for (let kb = 1; kb <= 100; ++kb) {
    list.push({
      name: `${kb}KB`,
      value: (kb * 1024).toString(),
      default: kb === 10,
    });
  }
  return list;
}

function generateBigLengths() {
  const list = [];
  for (let mb = 0; mb <= 4; ++mb) {
    for (let kb = 0; kb <= 9; ++kb) {
      const len = mb * 1024 * 1024 + kb * 100 * 1024;
      if (len != 0) {
        list.push({
          name: mb === 0 ? `${kb}00KB` : `${mb}.${kb}MB`,
          value: len.toString(),
        });
      }
    }
  }
  list.push({
    name: '5MB',
    value: (5 * 1024 * 1024).toString(),
    default: true,
  });
  return list;
}

const AllSmallLengths = generateSmallLengths();
const AllBigLengths = generateBigLengths();

const AllCompressionRatios = [
  {
    name: '1.3',
    value: 'LOW_COMPRESSION_1_3',
  },
  {
    name: '2.1',
    value: 'MEDIUM_COMPRESSION_2_1',
  },
  {
    name: '3.4',
    value: 'HIGH_COMPRESSION_3_4',
    default: true,
  },
  {
    name: '6.2',
    value: 'EXTRA_HIGH_COMPRESSION_6_2',
  },
];

const xDesc: JmhAxisDescriptor = {
  title: 'Fetch Kind',
  prop: 'method',
  values: [
    {
      name: 'Uncompressed',
      value: 'uncompressed',
    },
    {
      name: 'Compressed',
      value: 'compressed',
    },
    {
      name: 'zlib (java)',
      value: 'app_compressed_in_java',
    },
    {
      name: 'zlib (mysql)',
      value: 'app_compressed_in_mysql',
    },
    {
      name: 'lz4',
      value: 'lz4_compressed',
    },
  ],
};

const xDescComparison: JmhAxisDescriptor = {
  title: 'Fetch Kind',
  prop: 'comparison',
  values: [
    {
      name: 'Uncompressed',
      value: 'uncompressed-LOW_COMPRESSION_1_3',
    },
    {
      name: 'lz4 ~1',
      value: 'lz4_compressed-LOW_COMPRESSION_1_3',
    },
    {
      name: 'lz4 ~1.5',
      value: 'lz4_compressed-MEDIUM_COMPRESSION_2_1',
    },
    {
      name: 'lz4 ~2.5',
      value: 'lz4_compressed-HIGH_COMPRESSION_3_4',
    },
    {
      name: 'lz4 ~3.9',
      value: 'lz4_compressed-EXTRA_HIGH_COMPRESSION_6_2',
    },
  ],
};

const yDescSmall: JmhAxisDescriptor = {
  title: 'All small lengths',
  prop: 'length',
  values: AllSmallLengths,
};

const yDescBig: JmhAxisDescriptor = {
  title: 'All big lengths',
  prop: 'length',
  values: AllBigLengths,
};

const hAxisDataLength = { title: 'Data length, bytes' };
const vAxisThroughput = { title: 'throughput, bytes per second' };
const vAxisTime = { title: 'time, microseconds' };

const MysqlBlobFetchImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [length, lengthSet] = useState(
    AllBigLengths.find((v) => v.default)!.value
  );
  const [smallLength, smallLengthSet] = useState(
    AllSmallLengths.find((v) => v.default)!.value
  );
  const [compressionRatio, compressionRatioSet] = useState(
    AllCompressionRatios.find((i) => i.default)?.value
  );
  const [extractor, extractorSet] = useState(EmptyJmhExtractorFuncHolder);
  const usecExtractor = (pm: any) => {
    return extractor.func ? extractor.func(pm) * 1000 : NaN;
  };

  return (
    <div className="markdown">
      <h2>Introduction</h2>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/mysql-blob-fetch-performance-in-java">
          &laquo;MySQL BLOB Fetch Performance In Java&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16
        GB RAM. Scala version: 2.13.6.
      </p>

      <ul>
        <li>
          <a href="#up-to-5mb">Charts for 100KB-5MB data lengths</a>
        </li>
        <li>
          <a href="#up-to-100kb">Charts for 1KB-100KB data lengths</a>
        </li>
      </ul>

      <h2 id="up-to-5mb">Charts for 100KB-5MB</h2>

      <Choose
        label="Compression Ratio (for zlib):"
        items={AllCompressionRatios.map((i) => {
          return {
            label: i.name,
            value: i.value,
            default: i.default,
          };
        })}
        onChange={(value: string) => compressionRatioSet(value)}
      />
      <TimeUnits
        onChange={(func: JmhExtractorFunc) => extractorSet({ func })}
      />

      <h3>Fetch BLOBs of different lengths</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={usecExtractor}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescBig}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisTime,
        }}
      />

      <h3>MySQL data throughput over the wire</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesFromMysql}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescBig}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h3>Effective throughput after decompression</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesReturned}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescBig}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h3>Fetch performance for different compression ratios</h3>

      <ChooseSlider
        label="Data length:"
        items={AllBigLengths.map((i) => {
          return {
            label: i.name,
            value: i.value,
            default: i.default === true,
          };
        })}
        onChange={(value: string) => lengthSet(value)}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={usecExtractor}
        filter={(p: any) => p.length === length}
        xDesc={xDesc}
        yDesc={{
          title: 'Compression Ratio',
          prop: 'compressionRatio',
          values: AllCompressionRatios,
        }}
        options={{
          hAxis: {
            title: 'Compression Ratio',
          },
          vAxis: vAxisTime,
        }}
      />

      <h3>Uncompressed vs LZ4 with different compression ratios</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={usecExtractor}
        xDesc={xDescComparison}
        yDesc={yDescBig}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisTime,
        }}
      />

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesReturned}
        xDesc={xDescComparison}
        yDesc={yDescBig}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h2 id="up-to-100kb">Charts for 1KB-100KB</h2>

      <h3>Fetch BLOBs of different lengths</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={usecExtractor}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescSmall}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisTime,
        }}
      />

      <h3>MySQL data throughput over the wire</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesFromMysql}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescSmall}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h3>Effective throughput after decompression</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesReturned}
        filter={(p: any) => p.compressionRatio === compressionRatio}
        xDesc={xDesc}
        yDesc={yDescSmall}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h3>Fetch performance for different compression ratios</h3>

      <ChooseSlider
        label="Data length:"
        items={AllSmallLengths.map((i) => {
          return {
            label: i.name,
            value: i.value,
            default: i.default === true,
          };
        })}
        onChange={(value: string) => smallLengthSet(value)}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={usecExtractor}
        filter={(p: any) => p.length === smallLength}
        xDesc={xDesc}
        yDesc={{
          title: 'Compression Ratio',
          prop: 'compressionRatio',
          values: AllCompressionRatios,
        }}
        options={{
          hAxis: {
            title: 'Compression Ratio',
          },
          vAxis: vAxisTime,
        }}
      />

      <h3>Uncompressed vs LZ4 with different compression ratios</h3>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={usecExtractor}
        xDesc={xDescComparison}
        yDesc={yDescSmall}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisTime,
        }}
      />

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={(pm: any) => pm.totalBytesReturned}
        xDesc={xDescComparison}
        yDesc={yDescSmall}
        options={{
          hAxis: hAxisDataLength,
          vAxis: vAxisThroughput,
        }}
      />

      <h3>Legend</h3>

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
        {'  '}data MEDIUMBLOB NOT NULL{'\n'}) ENGINE=InnoDB
        ROW_FORMAT=COMPRESSED;
        {'\n'}
        {'\n'}
        -- data is compressed with zlib algorithm{'\n'}
        CREATE TABLE app_compressed_blobs ({'\n'}
        {'  '}id INT NOT NULL PRIMARY KEY,{'\n'}
        {'  '}data MEDIUMBLOB NOT NULL{'\n'}) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
        {'\n'}
        {'\n'}
        -- data is compressed with LZ4 algorithm{'\n'}
        CREATE TABLE lz4_compressed_blobs ({'\n'}
        {'  '}id INT NOT NULL PRIMARY KEY,{'\n'}
        {'  '}data MEDIUMBLOB NOT NULL{'\n'}) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
        {'\n'}
        {'\n'}
      </pre>

      <ul>
        <li>
          <strong>Uncompressed</strong>: select data column from{' '}
          <i>uncompressed_blobs</i> table: data is not compressed neither in
          MySQL nor on application level.
        </li>
        <li>
          <strong>Compressed</strong>: select data column from{' '}
          <i>compressed_blobs</i> table: data is compressed in MySQL, on select
          MySQL decompresses it and returns data uncompressed over the wire.
        </li>
        <li>
          <strong>zlib</strong>: select data column from{' '}
          <i>app_compressed_blobs</i> table: data is compressed on application
          level using{' '}
          <a href="https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_compress">
            MySQL's algorithm
          </a>
          , on select MySQL returns compressed data over the wire (no decompress
          in MySQL); data is decompressed in application.
        </li>
        <li>
          <strong>lz4</strong>: select data column from{' '}
          <i>lz4_compressed_blobs</i> table: data is compressed on application
          level using{' '}
          <a href="https://github.com/lz4/lz4-java">LZ4 algorithm</a>, on select
          MySQL returns compressed data over the wire (no decompress in MySQL);
          data is decompressed in application.
        </li>
      </ul>

      <p>
        Full JMH logs: <a href={filePath('jdk17.log.txt')}>openjdk-17</a> (
        <a href={filePath('jdk17.json')}>json</a>).
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
