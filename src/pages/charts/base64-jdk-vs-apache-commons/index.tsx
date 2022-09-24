import React, { useState } from 'react';
import { Link } from 'gatsby';
import { JmhBenchmarkRun } from '../../..';
import {
  getChooseItems,
  ChartAndTable,
  Choose,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';

type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];
const Lengths = ['1', '10', '50', '100', '500', '1000', '10000'];
const DefaultLength = '10000';

const xDesc = {
  title: 'Library and Operation',
  prop: 'method',
  values: [
    {
      name: 'j.u.Base64 regular decode',
      value: 'jdkDecode',
    },
    {
      name: 'j.u.Base64 urlSafe decode',
      value: 'jdkUrlDecode',
    },
    {
      name: 'Commons regular decode',
      value: 'commonsDecode',
    },
    {
      name: 'Commons urlSafe decode',
      value: 'commonsUrlDecode',
    },
    {
      name: 'j.u.Base64 regular encode',
      value: 'jdkEncode',
    },
    {
      name: 'j.u.Base64 urlSafe encode',
      value: 'jdkUrlEncode',
    },
    {
      name: 'Commons regular encode',
      value: 'commonsEncode',
    },
    {
      name: 'Commons urlSafe encode',
      value: 'commonsUrlEncode',
    },
  ],
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const Base64PerformanceImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [length, lengthSet] = useState(DefaultLength);
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/base64-encoding-performance-jdk-vs-apache-commons">
          &laquo;Base64 Encoding Performance: JDK vs Apache Commons&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16
        GB RAM. Scala version: 2.13.6.
      </p>

      <h3>Charts</h3>

      <Choose
        label="Data length:"
        items={getChooseItems(Lengths, (v) => v === DefaultLength)}
        onChange={(value: string) => lengthSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Encoding/Decoding Performance for various JDKs</h4>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.length === length}
        title="Encoding/Decoding, nanos"
        xDesc={xDesc}
        yDesc={yDesc}
      />

      <h4>Performance for different data sizes</h4>

      <Choose
        label="JDK:"
        items={getChooseItems(jdks, (_, index) => index === 0)}
        onChange={(value: JdkVersion) => jdkSet(value)}
      />

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.jdk === jdk}
        title="Encoding/Decoding, nanos"
        xDesc={xDesc}
        yDesc={{
          title: 'Data length',
          prop: 'length',
          values: Lengths,
        }}
        options={{
          hAxis: {
            title: 'Data length',
          },
          vAxis: {
            title: 'time, nanoseconds',
            //maxValue: 2000,
          },
        }}
      />

      <p>
        Full JMH logs:
        <a href={filePath('jdk8.log.txt')}>openjdk-8</a>,{' '}
        <a href={filePath('jdk11.log.txt')}>openjdk-11</a>,{' '}
        <a href={filePath('jdk17.log.txt')}>openjdk-17</a>.
      </p>
    </div>
  );
};

function exportDimensions(benchmark: string, params: any) {
  //'com.komanov.jwt.base64.jmh.Base64Benchmarks.jdkUrlEncode'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1); // jdkUrlEncode

  return {
    method,
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/base64-jdk-vs-apache-commons/${name}`;

const fetchAndCombineResults = () => {
  return Promise.all([
    loadJson(filePath('jdk8.json')),
    loadJson(filePath('jdk11.json')),
    loadJson(filePath('jdk17.json')),
  ]).then((values: any[]) => {
    function setJdk(index: number, jdk: JdkVersion) {
      const list: JmhBenchmarkRun[] = values[index].data;
      list.forEach((v) => (v.params = { ...v.params, jdk }));
      return list;
    }

    return {
      data: [
        ...setJdk(0, 'openjdk-8'),
        ...setJdk(1, 'openjdk-11'),
        ...setJdk(2, 'openjdk-17'),
      ],
    };
  });
};

const Base64Performance = JmhChartPage(Base64PerformanceImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Base64 Encoding Performance: JDK vs Apache Commons (Charts)',
});

export default Base64Performance;
