import React, { useState } from 'react';
import { Link } from 'gatsby';
import { JmhBenchmarkRun } from '../../..';
import {
  ChartAndTable,
  Choose,
  getChooseItems,
  JmhChartComponentProps,
  JmhChartPage,
  TimeUnits,
  JdkVersion,
  Jdks,
} from '../../../components';
import { loadJson } from '../../../util';

const fastLibraries = [
  {
    name: 'Jackson (JSON)',
    value: 'JSON',
  },
  {
    name: 'Jackson (Cbor)',
    value: 'CBOR',
  },
  {
    name: 'Jackson (Smile)',
    value: 'SMILE',
  },
  {
    name: 'ScalaPb',
    value: 'SCALA_PB',
  },
  {
    name: 'JavaPb',
    value: 'JAVA_PB',
  },
  {
    name: 'JavaThrift',
    value: 'JAVA_THRIFT',
  },
  {
    name: 'BooPickle',
    value: 'BOOPICKLE',
  },
  {
    name: 'Chill',
    value: 'CHILL',
  },
  {
    name: 'Jsoniter',
    value: 'JSONITER',
  },
  {
    name: 'uPickle JSON',
    value: 'UPICKLE_JSON',
  },
  {
    name: 'uPickle MskPack',
    value: 'UPICKLE_MSGPACK',
  },
];
const slowLibraries = [
  {
    name: 'Circe',
    value: 'CIRCE',
  },
  {
    name: 'JavaSerialization',
    value: 'SERIALIZABLE',
  },
];

const xDesc = {
  title: 'Converter',
  prop: 'library',
  values: fastLibraries.concat(slowLibraries),
};

const xDescNoSlow = {
  title: 'Converter',
  prop: 'library',
  values: fastLibraries,
};

const yDesc = {
  title: 'JDK',
  prop: 'jdk',
  values: Jdks,
};

const DataSizes = [
  {
    name: '1K',
    value: 1000,
  },
  {
    name: '2K',
    value: 2000,
  },
  {
    name: '4K',
    value: 4000,
  },
  {
    name: '8K',
    value: 8000,
  },
  {
    name: '64K',
    value: 64000,
  },
];

type Action = 'both' | 'serialization' | 'deserialization';
const Actions = [
  {
    label: 'parse + serialize',
    value: 'both',
    default: true,
  },
  {
    label: 'serialize only',
    value: 'serialization',
  },
  {
    label: 'parse only',
    value: 'deserialization',
  },
];
function actionToLabel(action: Action) {
  return Actions.find((v) => v.value === action)?.label;
}

const ScalaSerialization2022Impl = ({ jmhList }: JmhChartComponentProps) => {
  const [excludeSlow, excludeSlowSet] = useState(false);
  const [dataSize, dataSizeSet] = useState(4000);
  const [action, actionSet] = useState<Action>('both');
  const [extractor, extractorSet] = useState({ func: null });
  const [jdk, jdkSet] = useState<JdkVersion>('openjdk-17');

  const microExtractor = (pm: any) => {
    return extractor.func(pm) / 1000;
  };

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/scala-serialization-2022">
          &laquo;Scala Serialization 2022&raquo;
        </Link>{' '}
        blog post. Graphs from the previous runs (2016-2018) are{' '}
        <Link to="/charts/scala-serialization">here</Link>.
      </p>

      <p>
        The performance tests are performed via{' '}
        <a href="https://github.com/openjdk/jmh">JMH</a>. The configuration of a
        hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16
        GB RAM. Scala version: 2.13.6.
      </p>

      <h3>Misc</h3>

      <ul>
        <li>Latest version of jsoniter doesn't work on openjdk-8.</li>
        <li>
          Java Serialization, circe and chill are by far the slowest. You may
          turn it off on charts to make it more readable.
        </li>
      </ul>

      <h3>Charts</h3>

      <Choose
        label="Data Size:"
        items={DataSizes.map(({ name, value }) => ({
          label: name,
          value,
          default: value === 4000,
        }))}
        onChange={(value: number) => dataSizeSet(value)}
      />
      <Choose
        label="Action:"
        items={Actions}
        onChange={(value: Action) => actionSet(value)}
      />
      <Choose
        label="Exclude slowest:"
        items={[
          {
            label: 'No',
            value: false,
            default: true,
          },
          {
            label: 'Yes, please',
            value: true,
          },
        ]}
        onChange={(value: boolean) => excludeSlowSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h3 id="site">Site DTO</h3>

      <ChartAndTable
        dataTable={jmhList}
        extractor={microExtractor}
        filter={(d: any) =>
          d.dataType === 'Site' &&
          d.action === action &&
          d.dataSize === dataSize
        }
        title={`Times of ${actionToLabel(
          action
        )} for Site class (DTO), microseconds`}
        xDesc={excludeSlow ? xDescNoSlow : xDesc}
        yDesc={yDesc}
        options={{}}
      />

      <h3 id="events">Events</h3>

      <ChartAndTable
        dataTable={jmhList}
        extractor={microExtractor}
        filter={(d: any) =>
          d.dataType === 'Event' &&
          d.action === action &&
          d.dataSize === dataSize
        }
        title={`Times of ${actionToLabel(
          action
        )} for list of Events, microseconds`}
        xDesc={excludeSlow ? xDescNoSlow : xDesc}
        yDesc={yDesc}
      />

      <h3 id="progression">Progression depending on data size</h3>

      <p>It doesn't show anything unusual, which is a good sign.</p>

      <Choose
        label="JDK:"
        items={getChooseItems(Jdks, (_, index) => index === 0)}
        onChange={(value: JdkVersion) => jdkSet(value)}
      />

      <h4>Site DTO</h4>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={microExtractor}
        filter={(d: any) =>
          d.dataType === 'Site' && d.action === action && d.jdk === jdk
        }
        title={`Times of ${actionToLabel(
          action
        )} for Site class (DTO), microseconds`}
        xDesc={excludeSlow ? xDescNoSlow : xDesc}
        yDesc={{
          title: 'Data Size',
          prop: 'dataSize',
          values: [1000, 2000, 4000, 8000, 64000],
        }}
        options={{
          hAxis: {
            title: 'Data Size, bytes',
          },
          vAxis: {
            title: 'time, microseconds',
          },
        }}
      />

      <h4>Events</h4>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={microExtractor}
        filter={(d: any) =>
          d.dataType === 'Event' && d.action === action && d.jdk === jdk
        }
        title={`Times of ${actionToLabel(
          action
        )} for list of Events, microseconds`}
        xDesc={excludeSlow ? xDescNoSlow : xDesc}
        yDesc={{
          title: 'Data Size',
          prop: 'dataSize',
          values: [1000, 2000, 4000, 8000, 64000],
          minValue: 10,
        }}
        options={{
          hAxis: {
            title: 'Data Size, bytes',
          },
          vAxis: {
            title: 'time, microseconds',
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
  //'com.komanov.serialization.jmh.EventBenchmark.both'

  const [dataTypePart, action, ...otherBenchmark] =
    benchmark.split('Benchmark.');
  if (!action || otherBenchmark.length > 0) {
    throw new Error('Expected 2 parts in a benchmark: ' + benchmark);
  }

  const dataType = dataTypePart.substring(dataTypePart.lastIndexOf('.') + 1);
  const dataSize =
    parseInt((/_(\d+)_K/.exec(params.inputType) || [])[1], 10) * 1000;

  return {
    library: params.converterType,
    action,
    dataType,
    dataSize,
    jdk: params.jdk,
  };
}

const filePath = (name: string) =>
  `/data/charts/scala-serialization-2022/${name}`;

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

const ScalaSerialization2022 = JmhChartPage(ScalaSerialization2022Impl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Scala Serialization 2022 (Charts)',
});

export default ScalaSerialization2022;
