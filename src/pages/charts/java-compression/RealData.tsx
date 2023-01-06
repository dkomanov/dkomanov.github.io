import React from 'react';
import { StatelessChoose } from '../../../components';
import { JmhAxisDescriptor } from '../../../util/jmh';

export const yRealDesc: JmhAxisDescriptor = {
  title: 'Real Input Size',
  prop: 'length',
  values: [
    '298',
    '420',
    '531',
    '538',
    '686',
    '34011',
    '42223',
    '51771',
    '62830',
    '81207',
    '94417',
    '607930',
    '751048',
    '781196',
    '866049',
    '904172',
    '1075724',
    '1293080',
    '1448911',
    '1599048',
    '4072805',
    '4287156',
  ],
};

export type RealDataset = 'all' | '34011-94417' | '607930-4287156';
export const DefaultRealDataset: RealDataset = '607930-4287156';
const AllRealDatasets: RealDataset[] = ['all', '34011-94417', '607930-4287156'];

export const filterByDataset = (dataset: RealDataset, p: any) =>
  dataset === 'all' ||
  (dataset === '34011-94417' ? inBetween(p.length, 34011, 94417) : inBetween(p.length, 607930, 4287156));

function inBetween(v: any, from: number, to: number) {
  const num = parseInt(v);
  return from <= num && num <= to;
}

export const MakeDatasetChoose = (dataset: RealDataset, datasetSet: (v: any) => any) => (
  <StatelessChoose
    label="Data set:"
    items={AllRealDatasets.map((v) => ({ label: v, value: v }))}
    value={dataset}
    onChange={datasetSet}
  />
);
