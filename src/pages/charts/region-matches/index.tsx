import React, { useState } from 'react';
import { Link } from 'gatsby';
import { JmhBenchmarkRun } from '../../..';
import { ChartAndTable, JmhChartPage, TimeUnits } from '../../../components';
import { loadJson } from '../../../util';

const jdks = ['openjdk-17', 'openjdk-11', 'openjdk-8'];

type MethodName =
  | 'regionMatches'
  | 'substringEquals'
  | 'startsWith'
  | 'endsWith';

const xDesc = (values: MethodName[]) => {
  return {
    title: 'Method',
    prop: 'what',
    values,
  };
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const RegionMatchesImpl = ({ jmhList }: { jmhList: any }) => {
  const [extractor, extractorSet] = useState({ func: null });

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/benchmarking-string-regionmatches">
          &laquo;Benchmarking String.regionMatches&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="http://openjdk.java.net/projects/code-tools/jmh/">JMH</a>. The
        configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4
        core + 4 HT) with 16 GB RAM.
      </p>

      <h3>Charts</h3>

      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.where === 'begin'}
        title="Matching at the beginning of the string, nanos"
        xDesc={xDesc(['regionMatches', 'substringEquals', 'startsWith'])}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.where === 'end'}
        title="Matching at the end of the string, nanos"
        xDesc={xDesc(['regionMatches', 'substringEquals', 'endsWith'])}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.where === 'middle'}
        title="Matching in the middle, nanos"
        xDesc={xDesc(['regionMatches', 'substringEquals'])}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => p.where === 'middle2Sides'}
        title="Matching in the middle (substring for needle), nanos"
        xDesc={xDesc(['regionMatches', 'substringEquals'])}
        yDesc={yDesc}
      />

      <ChartAndTable
        dataTable={jmhList}
        extractor={extractor.func}
        title="Everything in a single chart, nanos"
        xDesc={{
          title: 'Method',
          prop: 'method',
          values: [
            'begin_regionMatches',
            'begin_substringEquals',
            'begin_startsWith',
            'middle_regionMatches',
            'middle_substringEquals',
            'middle2Sides_regionMatches',
            'middle2Sides_substringEquals',
            'end_regionMatches',
            'end_substringEquals',
            'end_endsWith',
          ],
        }}
        yDesc={yDesc}
      />

      <p>
        Full JMH logs:{' '}
        <a href={`/data/charts/region-matches/jdk8.log.txt`}>openjdk-8</a>,{' '}
        <a href={`/data/charts/region-matches/jdk11.log.txt`}>openjdk-11</a>,{' '}
        <a href={`/data/charts/region-matches/jdk17.log.txt`}>openjdk-17</a>.
      </p>
    </div>
  );
};

function exportDimensions(benchmark: string, params: any) {
  //'com.komanov.str.jmh.RegionMatchesBenchmarks.begin_regionMatches'

  const method = benchmark.substring(benchmark.lastIndexOf('.') + 1);
  const [where, what, ...other] = method.split('_');
  if (!where || !what || other.length > 0) {
    throw new Error('Expected 2 parts in a benchmark: ' + benchmark);
  }

  const { jdk } = params;

  return {
    method,
    what,
    where,
    jdk,
  };
}

const fetchAndCombineResults = () => {
  return Promise.all([
    loadJson('/data/charts/region-matches/jdk8.json'),
    loadJson('/data/charts/region-matches/jdk11.json'),
    loadJson('/data/charts/region-matches/jdk17.json'),
  ]).then((values: any[]) => {
    function setJdk(index: number, jdk: string) {
      const list: JmhBenchmarkRun[] = values[index].data;
      list.forEach((v) => (v.params = { jdk }));
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

const RegionMatches = JmhChartPage(RegionMatchesImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Benchmarking String.regionMatches (Charts)',
});

export default RegionMatches;
