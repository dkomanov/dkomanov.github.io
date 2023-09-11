import { Link } from 'gatsby';
import React, { useState } from 'react';
import { JmhBenchmarkRun } from '../../..';
import {
  ChartAndTable,
  Choose,
  getChooseItems,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
} from '../../../components';
import { loadJson } from '../../../util';
import { JmhMetrics } from '../../../util/jmh';

function extractAllocRate(pm: JmhMetrics): number {
  return (pm?.sm || {})['·gc.alloc.rate.norm']?.score || 0;
}

type JdkVersion = 'openjdk-17' | 'openjdk-11';
const jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11'];
const InvalidInputs = [
  //'', // Choose doesn't support empty string OOTB
  '200',
  '200.',
  '200.200',
  '200.200.',
  'a.200.200',
  '200.a.200',
  '200.200.a',
  '200.200.200.200',
  '200.200.99999',
  '200.200.-200',
];
const DefaultInvalidInput = '200.200.99999';
const ValidInputs = ['1.0.0', '200.200.200', '10000.9876.5432', '10000.10000.10000'];
const DefaultValidInput = '10000.10000.10000';
type Group =
  | 'IsNumberBenchmark'
  | 'VersionNoAllocConvertBenchmark'
  | 'VersionParseBenchmark'
  | 'VersionParseNoAllocBenchmark';

const AllMethods = [
  {
    name: 'YOLO',
    value: 'yolo',
  },
  {
    name: 'YOLO without scala.util.Try',
    value: 'yoloNoTry',
  },
  {
    name: 'YOLO no throw',
    value: 'yoloNoThrow',
  },
  {
    name: 'YOLO no throw without scala.util.Try',
    value: 'yoloNoThrowNoTry',
  },
  {
    name: 'RegEx',
    value: 'regex',
  },
  {
    name: 'Optimized 1 (indexOf)',
    value: 'optimized1',
  },
  {
    name: 'Optimized 2 (wo substring)',
    value: 'optimized2',
  },
  {
    name: 'Optimized 3 (Scala, pattern matching)',
    value: 'optimized3',
  },
  {
    name: 'Optimized 3 (Java, switch)',
    value: 'optimized3Java',
  },
  {
    name: 'Optimized 3 (Java, wo switch)',
    value: 'optimized3JavaNoSwitch',
  },
  {
    name: 'Optimized 4 (single pass, switch)',
    value: 'optimized4',
  },
  {
    name: 'Optimized 5 (single pass, split loop)',
    value: 'optimized5',
  },
  {
    name: 'Optimized 6 (single pass, wo switch)',
    value: 'optimized6',
  },
];

function createParseImplDesc(group: Group) {
  return {
    title: 'Parse Implementation',
    prop: 'method',
    values: AllMethods.map((v) => ({ name: v.name, value: `${group}.${v.value}` })),
  };
}

const xDesc = createParseImplDesc('VersionParseBenchmark');
const xDescNoAlloc = createParseImplDesc('VersionParseNoAllocBenchmark');

const xDescComparison = {
  title: 'Parse Implementation',
  prop: 'method',
  values: AllMethods.flatMap((v) => {
    return [
      {
        name: v.name,
        value: `VersionParseBenchmark.${v.value}`,
        method: v.value,
      },
      {
        name: `${v.name} NO ALLOC`,
        value: `VersionParseNoAllocBenchmark.${v.value}`,
        method: v.value,
      },
    ];
  }),
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: jdks,
};

const yDescLenth = {
  title: 'Input Length',
  prop: 'length',
  values: ValidInputs.map((v) => v.length),
};

const yDescOnly17 = Object.assign({}, yDesc, { values: ['openjdk-17'] });

const hAxisLength = {
  hAxis: {
    title: 'Input Length',
  },
};

const vAxisTime = {
  vAxis: {
    title: 'time, nanoseconds (lower is better)',
  },
};

const vAxisTimeLog = {
  vAxis: {
    logScale: true,
    ...vAxisTime.vAxis,
  },
};

const vAxisAllocRate = {
  vAxis: {
    title: 'Allocated Memory Per Call, bytes',
  },
};

function chartOptions(options: any) {
  return {
    ...options,
    legend: {
      textStyle: {
        fontSize: 12,
      },
    },
  };
}

const VersionParsingPerformanceImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [validInput, validInputSet] = useState(DefaultValidInput);
  const [invalidInput, invalidInputSet] = useState(DefaultInvalidInput);
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');
  const [comparisonMethods, comparisonMethodsSet] = useState<any>({});
  const [extractor, extractorSet] = useState({ func: null });

  const ChooseValidInput = (
    <Choose
      label="Valid Input Length:"
      items={ValidInputs.map((v) => ({ label: v.length.toString(), value: v, default: v === DefaultValidInput }))}
      onChange={(value: string) => validInputSet(value)}
    />
  );

  const ChooseJdk = (
    <Choose
      label="JDK:"
      items={getChooseItems(jdks, (_, index) => index === 0)}
      onChange={(value: JdkVersion) => jdkSet(value)}
    />
  );

  const ChooseComparison = (
    <Choose
      label="Methods:"
      items={AllMethods.map((v) => ({
        label: v.name,
        value: v.value,
        default: v.value === 'optimized1' || v.value === 'optimized6',
      }))}
      multiple
      onChange={(value: any) => comparisonMethodsSet(value)}
    />
  );

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/optimizing-performance-of-simple-version-parsing-in-scala">
          &laquo;Optimizing Performance of Simple Version Parsing in Scala&raquo;
        </Link>{' '}
        blog post.
      </p>

      <p>
        The performance tests are performed via <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6.
      </p>

      <h3>Performance Charts</h3>

      <div>
        <TimeUnits onChange={(func: any) => extractorSet({ func })} />

        <h4>Parsing Performance of valid input</h4>

        {ChooseValidInput}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => p.encoded === validInput}
          xDesc={xDesc}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisTime })}
        />

        <h4>Parsing Performance NO ALLOC of valid input</h4>

        {ChooseValidInput}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => p.encoded === validInput}
          xDesc={xDescNoAlloc}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisTime })}
        />

        <h4>Parsing Performance Comparison of valid input</h4>

        {ChooseJdk}
        {ChooseValidInput}
        {ChooseComparison}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => p.encoded === validInput && p.jdk === jdk}
          xDesc={{
            ...xDescComparison,
            values: xDescComparison.values.filter((v) => comparisonMethods[v.method] === true),
          }}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisTime })}
        />

        <h4>Parsing Performance of different valid inputs</h4>

        {ChooseJdk}
        <ChartAndTable
          chartType="LineChart"
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => p.jdk === jdk}
          xDesc={xDesc}
          yDesc={yDescLenth}
          options={chartOptions({ ...hAxisLength, ...vAxisTimeLog, focusTarget: 'category' })}
        />

        <h4>Parsing Performance of invalid input</h4>

        <Choose
          label="Invalid Input:"
          items={getChooseItems(InvalidInputs, (v) => v === DefaultInvalidInput)}
          onChange={(value: string) => invalidInputSet(value)}
        />

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor.func}
          filter={(p: any) => p.encoded === invalidInput}
          xDesc={xDesc}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisTime })}
        />
      </div>

      <h3>Memory Charts</h3>

      <div>
        <p>All charts below show normalized allocation rate -- how many bytes were allocated for a single call.</p>

        <h4>Alloc Rate of valid input</h4>

        {ChooseJdk}
        {ChooseValidInput}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractAllocRate}
          filter={(p: any) => p.encoded === validInput && p.jdk === jdk}
          xDesc={xDesc}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisAllocRate })}
        />

        <h4>Alloc Rate of valid input for NO ALLOC version</h4>

        {ChooseJdk}
        {ChooseValidInput}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractAllocRate}
          filter={(p: any) => p.encoded === validInput && p.jdk === jdk}
          xDesc={xDescNoAlloc}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisAllocRate })}
        />

        <h4>Alloc Rate Comparison of valid input</h4>

        {ChooseJdk}
        {ChooseValidInput}
        {ChooseComparison}
        <ChartAndTable
          dataTable={jmhList}
          extractor={extractAllocRate}
          filter={(p: any) => p.encoded === validInput && p.jdk === jdk}
          xDesc={{
            ...xDescComparison,
            values: xDescComparison.values.filter((v) => comparisonMethods[v.method] === true),
          }}
          yDesc={yDesc}
          options={chartOptions({ ...vAxisAllocRate })}
        />

        <h4>Alloc Rate of valid inputs</h4>

        {ChooseJdk}
        <ChartAndTable
          chartType="LineChart"
          dataTable={jmhList}
          extractor={extractAllocRate}
          filter={(p: any) => p.jdk === jdk}
          xDesc={xDesc}
          yDesc={yDescLenth}
          options={chartOptions({ ...vAxisAllocRate, ...hAxisLength, focusTarget: 'category' })}
        />
      </div>

      <p>
        Full JMH logs:
        <a href={filePath('jdk11.log.txt')}>openjdk-11</a>, <a href={filePath('jdk17.log.txt')}>openjdk-17</a>.
      </p>
    </div>
  );
};

function exportDimensions(benchmark: string, params: any) {
  //'com.komanov.ver.jmh.IsNumberBenchmark.isNumber'
  //'com.komanov.ver.jmh.VersionParseNoAllocBenchmark.optimized1'

  const lastDot = benchmark.lastIndexOf('.');
  const method = benchmark.substring(benchmark.lastIndexOf('.', lastDot - 1) + 1); // IsNumberBenchmark.isNumber

  return {
    method,
    length: ValidInputs.indexOf(params?.encoded) !== -1 ? params.encoded.length : -1,
    ...params,
  };
}

const filePath = (name: string) => `/data/charts/version-parsing/${name}`;

const fetchAndCombineResults = () => {
  return Promise.all([loadJson(filePath('jdk11.json')), loadJson(filePath('jdk17.json'))]).then((values: any[]) => {
    function setJdk(index: number, jdk: JdkVersion) {
      const list: JmhBenchmarkRun[] = values[index].data;
      list.forEach((v) => (v.params = { ...v.params, jdk }));
      return list;
    }

    return {
      data: [...setJdk(0, 'openjdk-11'), ...setJdk(1, 'openjdk-17')],
    };
  });
};

const VersionParsingPerformance = JmhChartPage(VersionParsingPerformanceImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Optimizing Performance of Simple Version Parsing in Scala (Charts)',
});

export default VersionParsingPerformance;
