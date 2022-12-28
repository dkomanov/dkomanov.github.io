import { Link } from 'gatsby';
import React, { useState } from 'react';
import { ChartAndTable, Choose, getChooseItems, JmhChartComponentProps, JmhChartPage, TimeUnits } from '../../../components';
import { loadJson } from '../../../util';

type Action = 'encode' | 'decode';
const actions: Action[] = ['encode', 'decode'];
type Dataset = '298-665' | '34011-94417' | '607930-4287156';
const allDatasets: Dataset[] = ['298-665', '34011-94417', '607930-4287156'];
const DefaultDataset: Dataset = '607930-4287156';

const xDesc = {
  title: 'Compression Method',
  prop: 'algorithm',
  values: [
    'gzip',
    'deflate',
    'deflatePlusSize',
    'zstd',
    'brotli',
    'snappy',
    'lz4_Fast',
    'lz4_High9',
    'lz4_High17',
  ],
};

const yDesc = {
  title: 'Input Size',
  prop: 'input',
  values: [
    '298',
    '319',
    '320',
    '326',
    '335',
    '366',
    '372',
    '648',
    '420',
    '459',
    '531',
    '686',
    '562',
    '479',
    '538',
    '665',
    '34011',
    '35578',
    '51771',
    '52928',
    '59448',
    '59617',
    '68118',
    '67071',
    '42223',
    '62830',
    '67872',
    '79107',
    '68230',
    '81207',
    '88114',
    '94417',
    '607930',
    '773419',
    '989390',
    '781196',
    '668462',
    '751048',
    '1075724',
    '791173',
    '1293080',
    '904172',
    '1356567',
    '1599048',
    '866049',
    '1448911',
    '4072805',
    '4287156',
  ],
};

function inBetween(v: any, from: number, to: number) {
  const num = parseInt(v);
  return from <= num && num <= to;
}

const JavaCompressionPerformanceImpl = ({ jmhList }: JmhChartComponentProps) => {
  const [action, actionSet] = useState(actions[0]);
  const [dataset, datasetSet] = useState<Dataset>(DefaultDataset);
  const [extractor, extractorSet] = useState({ func: null });

  console.log(jmhList);

  const filterByAction = (p: any) =>
    action === 'all' || p.method === action;

  const filterByDataset = (p: any) =>
    dataset === '298-665' ? inBetween(p.input, 298, 665) : (dataset === '34011-94417' ? inBetween(p.input, 34011, 94417) : inBetween(p.input, 607930, 4287156));

  return (
    <div className="markdown">
      <h3>Introduction</h3>

      <p>
        Here are benchmarking results for{' '}
        <Link to="/p/java-compression">
          &laquo;Performance of Compression in Java&raquo;
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
        label="Data set:"
        items={getChooseItems(allDatasets, (v) => v === DefaultDataset)}
        onChange={(value: Dataset) => datasetSet(value)}
      />
      <Choose
        label="Method:"
        items={getChooseItems(actions, (_, index) => index === 0)}
        onChange={(value: Action) => actionSet(value)}
      />
      <TimeUnits onChange={(func: any) => extractorSet({ func })} />

      <h4>Performance</h4>

      <ChartAndTable
        chartType="LineChart"
        dataTable={jmhList}
        extractor={extractor.func}
        filter={(p: any) => filterByAction(p) && filterByDataset(p)}
        title="Encoding/Decoding, nanos"
        xDesc={xDesc}
        yDesc={yDesc}
        options={{
          legend: {
            textStyle: {
              fontSize: 12,
            },
          },
        }}
      />
    </div>
  );
};

function exportDimensions(benchmark: string, params: any) {
  //'com.wixpress.routes.trie.impl.jmh.CompressMysqlBenchmark.decode'

  let method = benchmark.substring(benchmark.lastIndexOf('.') + 1); // decode
  const matched = /total_([0-9]+)_with_.*/.exec(params.input);

  return {
    ...params,
    method,
    input: matched ? matched[1] : '0',
  };
}

const filePath = (name: string) => `/data/charts/java-compression/${name}`;

const fetchAndCombineResults = () => {
  return loadJson(filePath('compress.json')).then((data: any) => ({ data: data.data }));
};

const JavaCompressionPerformance = JmhChartPage(JavaCompressionPerformanceImpl, {
  fetchFunc: fetchAndCombineResults,
  exportDimensionsFunc: exportDimensions,
  headerText: 'Performance of Compression in Java (Charts)',
});

export default JavaCompressionPerformance;
