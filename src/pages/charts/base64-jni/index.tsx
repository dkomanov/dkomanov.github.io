import { Link } from 'gatsby';
import React, { useState } from 'react';
import { JmhBenchmarkRun } from '../../..';
import {
  ChartAndTable,
  Choose, getChooseItems, JmhChartComponentProps,
  JmhChartPage,
  TimeUnits
} from '../../../components';
import { loadJson } from '../../../util';

type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];
const Lengths = ['1', '10', '50', '100', '500', '1000', '10000'];
const DefaultLength = '10000';
type Dataset = 'fixed' | 'random';
const DefaultDataset: Dataset = 'fixed';
type Action = 'all' | 'encode' | 'decode';
const actions: Action[] = ['all', 'encode', 'decode'];

const xDesc = {
  title: 'Library and Operation',
  prop: 'method',
  values: [
    {
      name: 'j.u.Base64 encode',
      value: 'jdk_url_encode',
    },
    {
      name: 'base64 encode',
      value: 'jniBase64_url_encode',
    },
    {
      name: 'base64 encode opt. 1',
      value: 'jniBase64_url_encodeHacky1',
    },
    {
      name: 'base64 encode opt. 2',
      value: 'jniBase64_url_encodeHacky2',
    },
    {
      name: 'base64 encode opt. 3',
      value: 'jniBase64_url_encodeHacky3',
    },
    {
      name: 'j.u.Base64 decode',
      value: 'jdk_url_decode',
    },
    {
      name: 'base64 decode',
      value: 'jniBase64_url_decode',
    },
    {
      name: 'base64 decode opt. 1',
      value: 'jniBase64_url_decode1',
    },
    {
      name: 'base64 decode opt. 2',
      value: 'jniBase64_url_decode2',
    },
    {
      name: 'base64 decode opt. 3',
      value: 'jniBase64_url_decode3',
    },
    {
      name: 'base64 decode opt. 4',
      value: 'jniBase64_url_decode4',
    },
    {
      name: 'base64 decode direct memory',
      value: 'jniBase64_url_decodeHacky1',
    },
    {
      name: 'base64 decode cached direct memory',
      value: 'jniBase64_url_decodeHacky2',
    },
    {
      name: 'crypto2 decode',
      value: 'jniCrypto2_url_decode',
    },
  ],
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const Base64JniPerformanceImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [action, actionSet] = useState(actions[0]);
  const [length, lengthSet] = useState(DefaultLength);
  const [dataset, datasetSet] = useState<Dataset>(DefaultDataset);
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [extractor, extractorSet] = useState({ func: null });

  const filterByAction = (p: any) =>
    action === 'all' || p.method.indexOf(action) !== -1;
  const filteredXDesc = Object.assign({}, xDesc, {
    values:
      action === 'all'
        ? xDesc.values
        : xDesc.values.filter((v) => v.value.indexOf(action) !== -1),
  });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/base64-via-jni-encoding-performance">
          &laquo;Base64 via JNI Encoding Performance&raquo;
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
      <Choose
        label="Data set:"
        items={getChooseItems(['fixed', 'random'], (v) => v === DefaultDataset)}
        onChange={(value: Dataset) => datasetSet(value)}
      />
      <Choose
        label="Method:"
        items={getChooseItems(actions, (_, index) => index === 0)}
        onChange={(value: Action) => actionSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Encoding/Decoding Performance for various JDKs</h4>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.length === length && p.dataset === dataset && filterByAction(p)}
        title="Encoding/Decoding, nanos"
        xDesc={filteredXDesc}
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
        filter={(p: any) => p.jdk === jdk && p.dataset === dataset && filterByAction(p)}
        xDesc={filteredXDesc}
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
            logScale: true,
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
  //'com.komanov.jwt.base64.jni.jmh.Base64JniBenchmarks.jniBase64_url_decode'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1); // jniBase64_url_decode

  return {
    method,
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/base64-jni/${name}`;

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

const Base64JniPerformance = JmhChartPage(Base64JniPerformanceImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Base64 via JNI Encoding Performance (Charts)',
});

export default Base64JniPerformance;
