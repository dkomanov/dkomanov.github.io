import { Link } from 'gatsby';
import React, { useState } from 'react';
import { JmhBenchmarkRun } from '../../..';
import {
  ChartAndTable,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';

type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];

const xDesc = {
  title: 'Library',
  prop: 'lib',
  values: [
    {
      name: 'BridJ',
      value: 'bridj',
    },
    {
      name: 'JavaCPP',
      value: 'javaCpp',
    },
    {
      name: 'Java MXBean',
      value: 'javaMxBean',
    },
    {
      name: 'JNA',
      value: 'jna',
    },
    {
      name: 'JNA direct',
      value: 'jnaDirect',
    },
    {
      name: 'JNI',
      value: 'jni',
    },
    {
      name: 'JNI (empty call)',
      value: 'jniEmpty',
    },
    {
      name: 'JNR',
      value: 'jnr',
    },
  ],
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const NativeAccessImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/java-native-access-performance">
          &laquo;Java Native Access Performance&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16
        GB RAM. Scala version: 2.13.6.
      </p>

      <h3>Chart</h3>

      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        title="Native call, nanos"
        xDesc={xDesc}
        yDesc={yDesc}
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
  //'com.komanov.nativeaccess.jmh.NativeBenchmarks.bridj'

  const lib = benchmark.substring(benchmark.lastIndexOf('.') + 1); // bridj

  return {
    lib,
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/native-access/${name}`;

const fetchAndCombineResults = () => {
  return Promise.all([
    loadJson(filePath('jdk8.json')),
    loadJson(filePath('jdk11.json')),
    loadJson(filePath('jdk17.json')),
  ]).then((values: any[]) => {
    function setJdk(index: number, jdk: JdkVersion) {
      const list: JmhBenchmarkRun[] = values[index].data;
      console.log(list);
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

const NativeAccess = JmhChartPage(NativeAccessImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Java Native Access Performance (Charts)',
});

export default NativeAccess;
