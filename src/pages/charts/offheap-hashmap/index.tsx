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

type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];
const allSizes = ['100', '1000', '10000', '100000', '1000000'];

const xDesc = {
  title: 'Collection',
  prop: 'method',
  values: [
    {
      name: 'baseline',
      value: 'baselineEmptyMap',
    },
    {
      name: 'java.util.HashMap',
      value: 'javaMap',
    },
    {
      name: 'immutable.Map',
      value: 'scalaMap',
    },
    {
      name: 'On-Heap',
      value: 'onHeap',
    },
    {
      name: 'Off-Heap',
      value: 'offHeap',
    },
  ],
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

function getChooseItems(
  values: string[],
  isDefault: (value: string, index: number) => boolean
) {
  return values.map((v, index) => {
    return {
      label: v,
      value: v,
      default: isDefault(v, index),
    };
  });
}

const OffheapMapImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [size, sizeSet] = useState('1000000');
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/replacing-hash-map-with-off-heap-hash-map-in-java">
          &laquo;Replacing HashMap with Off-Heap HashMap in Java?&raquo;
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
        label="Collection size:"
        items={getChooseItems(allSizes, (v) => v === '1000000')}
        onChange={(value: string) => sizeSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Lookup Performance</h4>

      <p>Performance of the successful lookup (hit) for all JDKs:</p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Successful lookup (hit), nanos"
        xDesc={xDesc}
        yDesc={yDesc}
      />

      <p>Performance of the failed lookup (miss) for all JDKs:</p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'miss' && p.size === size}
        title="Failed lookup (miss), nanos"
        xDesc={xDesc}
        yDesc={yDesc}
      />

      <h4>Performance for different collection size</h4>

      <Choose
        label="JDK:"
        items={getChooseItems(jdks, (_, index) => index === 0)}
        onChange={(value: JdkVersion) => jdkSet(value)}
      />

      <h5>Hits</h5>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.jdk === jdk}
        title="Successful lookup (hit), nanos"
        xDesc={xDesc}
        yDesc={{
          title: 'Collection size',
          prop: 'size',
          values: allSizes,
        }}
        options={{
          hAxis: {
            title: 'Collection size',
          },
          vAxis: {
            title: 'time, nanoseconds',
            maxValue: 3000,
          },
        }}
      />

      <h5>Misses</h5>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'miss' && p.jdk === jdk}
        title="Failed lookup (miss), nanos"
        xDesc={xDesc}
        yDesc={{
          title: 'Collection size',
          prop: 'size',
          values: allSizes,
        }}
        options={{
          hAxis: {
            title: 'Collection size',
          },
          vAxis: {
            title: 'time, nanoseconds',
            maxValue: 600,
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
  //'com.komanov.offheap.uuidhashmap.jmh.ScalaImmutableMapBenchmark.scalaMapMiss'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1);
  const hit = method === 'baselineEmptyMap' || method.endsWith('Hit');
  const name = method === 'baselineEmptyMap' ? method : method.substring(0, method.length - (hit ? 3 : 4));

  return {
    method: name,
    what: hit ? 'hit' : 'miss',
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/offheap-hashmap/${name}`;

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

const OffheapMap = JmhChartPage(OffheapMapImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Replacing HashMap with Off-Heap HashMap in Java (Charts)',
});

export default OffheapMap;
