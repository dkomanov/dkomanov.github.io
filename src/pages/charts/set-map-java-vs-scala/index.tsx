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

type ScalaVersion = '2.12' | '2.13';
type ScalaVersionDir = '2-12' | '2-13';
type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];
const scalas: ScalaVersion[] = ['2.12', '2.13'];

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

const yDescScala = {
  title: 'scala version',
  prop: 'scala',
  values: scalas,
};

const SetMapJavaVsScalaImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [scalaVersion, scalaVersionSet] = useState<ScalaVersion>('2.13');
  const [size, sizeSet] = useState('1000000');
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/map-performance-java-vs-scala">
          &laquo;Map Performance: Java vs Scala&raquo;
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
      <Choose
        label="Scala version:"
        items={scalas.map((v) => ({
          label: v,
          value: v,
          default: v === '2.13',
        }))}
        onChange={(value: ScalaVersion) => scalaVersionSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Map Lookup Performance</h4>

      <p>
        Benchmarks for java.util.HashMap vs Map.asJava vs immutable.Map vs
        mutable.Map.
      </p>

      <h5>openjdk-17: 2.12 vs 2.13</h5>

      <p>
        Comparing performance of Map between scala 2.12 and 2.13, using
        openjdk-17.
      </p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Map successful lookup (hit) -- openjdk-17, nanos"
        xDesc={xDesc('Map')}
        yDesc={yDescScala}
      />

      <h5>All JDKs</h5>

      <p>
        Comparing performance of Map for different versions of JDK: openjdk-8 vs
        openjdk-11 vs openjdk-17. Use switcher above to change scala version.
      </p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) =>
          p.scala === scalaVersion && p.what === 'hit' && p.size === size
        }
        title="Map successful lookup (hit), nanos"
        xDesc={xDesc('Map')}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) =>
          p.scala === scalaVersion && p.what === 'miss' && p.size === size
        }
        title="Map failed lookup (miss), nanos"
        xDesc={xDesc('Map')}
        yDesc={yDesc}
      />

      <h4>Set Lookup Performance</h4>

      <p>
        Same benchmark but for Set. Notice that HashSet internally uses HashMap,
        so the performance, supposedly, should be the same.
      </p>

      <h5>openjdk-17: 2.12 vs 2.13</h5>

      <p>
        Comparing performance of Set between scala 2.12 and 2.13, using
        openjdk-17.
      </p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.what === 'hit' && p.size === size}
        title="Set successful lookup (hit) -- openjdk-17, nanos"
        xDesc={xDesc('Set')}
        yDesc={yDescScala}
      />

      <h5>All JDKs</h5>

      <p>
        Comparing performance of Set for different versions of JDK: openjdk-8 vs
        openjdk-11 vs openjdk-17. Use switcher above to change scala version.
      </p>

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) =>
          p.scala === scalaVersion && p.what === 'hit' && p.size === size
        }
        title="Set successful lookup (hit), nanos"
        xDesc={xDesc('Set')}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) =>
          p.scala === scalaVersion && p.what === 'miss' && p.size === size
        }
        title="Set failed lookup (miss), nanos"
        xDesc={xDesc('Set')}
        yDesc={yDesc}
      />

      <p>
        Full JMH logs:
        <a href={filePath('2-12', 'jdk8.log.txt')}>
          openjdk-8 (scala 2.12)
        </a>,{' '}
        <a href={filePath('2-12', 'jdk11.log.txt')}>openjdk-11 (scala 2.12)</a>,{' '}
        <a href={filePath('2-12', 'jdk17.log.txt')}>openjdk-17 (scala 2.12)</a>,{' '}
        <a href={filePath('2-13', 'jdk8.log.txt')}>openjdk-8 (scala 2.13)</a>,{' '}
        <a href={filePath('2-13', 'jdk11.log.txt')}>openjdk-11 (scala 2.13)</a>,{' '}
        <a href={filePath('2-13', 'jdk17.log.txt')}>openjdk-17 (scala 2.13)</a>.
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

const filePath = (scala: ScalaVersionDir, name: string) =>
  `/data/charts/set-map-java-vs-scala-${scala}/${name}`;

const fetchAndCombineResults = () => {
  return Promise.all([
    loadJson(filePath('2-12', 'jdk8.json')),
    loadJson(filePath('2-12', 'jdk11.json')),
    loadJson(filePath('2-12', 'jdk17.json')),
    loadJson(filePath('2-13', 'jdk8.json')),
    loadJson(filePath('2-13', 'jdk11.json')),
    loadJson(filePath('2-13', 'jdk17.json')),
  ]).then((values: any[]) => {
    function setJdk(index: number, jdk: JdkVersion, scala: ScalaVersion) {
      const list: JmhBenchmarkRun[] = values[index].data;
      list.forEach((v) => (v.params = { jdk, scala, ...v.params }));
      return list;
    }

    return {
      data: [
        ...setJdk(0, 'openjdk-8', '2.12'),
        ...setJdk(1, 'openjdk-11', '2.12'),
        ...setJdk(2, 'openjdk-17', '2.12'),
        ...setJdk(3, 'openjdk-8', '2.13'),
        ...setJdk(4, 'openjdk-11', '2.13'),
        ...setJdk(5, 'openjdk-17', '2.13'),
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
