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

const xDesc = {
  title: 'Collection',
  prop: 'method',
  values: [
    {
      name: 'java.util.HashSet',
      value: 'javaSet',
    },
    {
      name: 'immutable.Set',
      value: 'scalaSet',
    },
    {
      name: 'Array[Long]',
      value: 'heapLongArray',
    },
    {
      name: 'Array[UUID]',
      value: 'heapUuidArray',
    },
    {
      name: 'OffHeap Array',
      value: 'offHeap',
    },
    {
      name: 'ByteBuf (netty4)',
      value: 'netty4Single',
    },
    {
      name: 'Buffer (netty5)',
      value: 'netty5Single',
    },
  ],
};

const xDescOffHeap = {
  title: 'Collection',
  prop: 'method',
  values: [
    {
      name: 'OffHeap Array',
      value: 'offHeap',
    },
    {
      name: 'CompositeByteBuf (netty4)',
      value: 'netty4Composite',
    },
    {
      name: 'ByteBuf (netty4)',
      value: 'netty4Single',
    },
    {
      name: 'CompositeBuffer (netty5)',
      value: 'netty5Composite',
    },
    {
      name: 'Buffer (netty5)',
      value: 'netty5Single',
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

const OffheapArrayImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [size, sizeSet] = useState('1000000');
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/replacing-hash-set-with-sorted-array-in-java">
          &laquo;Replacing HashSet with Sorted Array and Binary Search in Java?&raquo;
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
        items={getChooseItems(
          ['1000', '10000', '100000', '1000000'],
          (v) => v === '1000000'
        )}
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
          values: ['1000', '10000', '100000', '1000000'],
        }}
        options={{
          hAxis: {
            title: 'Collection size',
          },
          vAxis: {
            title: 'time, nanoseconds',
            maxValue: 2000,
          },
        }}
      />

      <h4>Off-Heap only, including Composite buffer</h4>

      <p>
        Composite buffer was excluded from the previous graphs, because it's
        extremely slow. Below only off-heap collections:
      </p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Successful lookup for off-heap (hit), nanos"
        xDesc={xDescOffHeap}
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
  //'com.komanov.offheap.jmh.Benchmarks.heapArrayHit'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1);
  const hit = method.endsWith('Hit');
  const name = method.substring(0, method.length - (hit ? 3 : 4));

  return {
    method: name,
    what: hit ? 'hit' : 'miss',
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/offheap-array/${name}`;

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

const OffheapArray = JmhChartPage(OffheapArrayImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Replacing HashSet with Sorted Array and Binary Search (Charts)',
});

export default OffheapArray;
