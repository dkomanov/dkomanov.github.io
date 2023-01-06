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

export const ChooseCompressionRatio = (value: string, onChange: (value: string) => any) => {
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

export const DefaultCompressionRatio = 'MEDIUM_COMPRESSION_2_1';

export const comparisonValues = (name: string, value: string) => {
  return [
    {
      name: `${name} [low]`,
      value: `${value}-LOW_COMPRESSION_1_3`,
    },
    {
      name: `${name} [med]`,
      value: `${value}-MEDIUM_COMPRESSION_2_1`,
    },
    {
      name: `${name} [high]`,
      value: `${value}-HIGH_COMPRESSION_3_4`,
    },
    {
      name: `${name} [extra]`,
      value: `${value}-EXTRA_HIGH_COMPRESSION_6_2`,
    },
  ];
};
