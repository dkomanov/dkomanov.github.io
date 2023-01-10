import React from 'react';
import { StatelessChoose } from '../../../components';

export const AllCompressionRatios = [
  {
    name: 'low',
    value: 'LOW_COMPRESSION_1_3',
  },
  {
    name: 'medium',
    value: 'MEDIUM_COMPRESSION_2_1',
  },
  {
    name: 'high',
    value: 'HIGH_COMPRESSION_3_4',
  },
  {
    name: 'extra',
    value: 'EXTRA_HIGH_COMPRESSION_6_2',
  },
];

export const DefaultCompressionRatio = 'MEDIUM_COMPRESSION_2_1';

export const sideBySide = (lists: any[][]): any[] => {
  if (lists.length <= 0) {
    throw new Error('empty array');
  }
  if (lists.find((v) => v.length !== lists[0].length)) {
    throw new Error('different lengths');
  }

  const r = [];
  for (let i = 0; i < lists[0].length; ++i) {
    for (let j = 0; j < lists.length; ++j) {
      r.push(lists[j][i]);
    }
  }
  return r;
};

export const comparisonValues = (name: string, value: string) => {
  return AllCompressionRatios.slice()
    .reverse()
    .map((r) => ({ name: `${name} [${r.name}]`, value: `${value}-${r.value}` }));
};

export const CompressionRatioChooseComponent = ({ value, onChange }: { value: string; onChange: (value: string) => any }) => {
  return (
    <StatelessChoose
      label="Compression Ratio:"
      value={value}
      items={AllCompressionRatios.map((i) => ({
        label: i.name,
        value: i.value,
      }))}
      onChange={onChange}
    />
  );
};

export default CompressionRatioChooseComponent;
