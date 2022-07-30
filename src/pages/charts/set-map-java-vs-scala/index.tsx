import React, { useState } from 'react';
import { Link } from 'gatsby';
import { JmhBenchmarkRun } from '../../..';
import {
  ChartAndTable,
  Choose,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';

const jdks = ['openjdk-17', 'openjdk-11', 'openjdk-8'];

const xDesc = (kind: 'Set' | 'Map') => {
  return {
    title: 'Collection',
    prop: 'method',
    values: [
      {
        name: `java.util.Hash${kind}`,
        value: `java${kind}`,
      },
      {
        name: `WrappedHash${kind}`,
        value: `javaWrapped${kind}`,
      },
      {
        name: `immutable.${kind}`,
        value: `scala${kind}`,
      },
      {
        name: `mutable.${kind}`,
        value: `scalaMutable${kind}`,
      },
    ],
  };
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const SetMapJavaVsScalaImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [size, sizeSet] = useState('1000000');
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        set-map-lookup-performance-java-vs-scala
        <Link to="/p/benchmarking-string-regionmatches">
          &laquo;Set/Map lookup performance: Java vs Scala&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16
        GB RAM.
      </p>

      <h3>Charts</h3>

      <Choose
        label="Collection size:"
        items={[
          {
            label: '1000',
            value: '1000',
          },
          {
            label: '10000',
            value: '10000',
          },
          {
            label: '100000',
            value: '100000',
          },
          {
            label: '1000000',
            value: '1000000',
            default: true,
          },
        ]}
        onChange={(value: string) => sizeSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Successful Lookup (hit)</h4>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Set successful lookup (hit), nanos"
        xDesc={xDesc('Set')}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Map successful lookup (hit), nanos"
        xDesc={xDesc('Map')}
        yDesc={yDesc}
      />

      <h4>Failed Lookup (miss)</h4>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'miss' && p.size === size}
        title="Set failed lookup (miss), nanos"
        xDesc={xDesc('Set')}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'miss' && p.size === size}
        title="Map failed lookup (miss), nanos"
        xDesc={xDesc('Map')}
        yDesc={yDesc}
      />

      <p>
        Full JMH logs: <a href={filePath('jdk8.log.txt')}>openjdk-8</a>,{' '}
        <a href={filePath('jdk11.log.txt')}>openjdk-11</a>,{' '}
        <a href={filePath('jdk17.log.txt')}>openjdk-17</a>.
      </p>
    </div>
  );
};

function exportDimensions(benchmark: string, params: any) {
  //'com.komanov.collection.jmh.SetMapJavaVsScalaBenchmarks.javaMapHit'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1);
  const hit = method.endsWith('Hit');
  const name = method.substring(0, method.length - (hit ? 3 : 4));

  return {
    method: name,
    what: hit ? 'hit' : 'miss',
    ...params,
  };
}

const filePath = (name: string) =>
  `/data/charts/set-map-java-vs-scala-2-12/${name}`;

const fetchAndCombineResults = () => {
  return Promise.all([
    loadJson(filePath('jdk8.json')),
    loadJson(filePath('jdk11.json')),
    loadJson(filePath('jdk17.json')),
  ]).then((values: any[]) => {
    function setJdk(index: number, jdk: string, scala: string) {
      const list: JmhBenchmarkRun[] = values[index].data;
      list.forEach((v) => (v.params = { jdk, scala, ...v.params }));
      return list;
    }

    return {
      data: [
        ...setJdk(0, 'openjdk-8', '2.12'),
        ...setJdk(1, 'openjdk-11', '2.12'),
        ...setJdk(2, 'openjdk-17', '2.12'),
      ],
    };
  });
};

const SetMapJavaVsScala = JmhChartPage(SetMapJavaVsScalaImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Set/Map lookup performance: Java vs Scala (Charts)',
});

export default SetMapJavaVsScala;
