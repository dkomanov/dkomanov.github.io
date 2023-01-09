import React, { useState } from 'react';
import { Button, GoogleChart } from '..';
import { buildData2, JmhAxisDescriptor, JmhExtractorFunc, transpose } from '../../util/jmh';
import './ChartAndTable.css';

// https://htmlcolorcodes.com/color-names/
const AlternateColors = [
  ['DarkRed', 'Red', 'Crimson', 'DarkSalmon', 'IndianRed'],
  ['MediumBlue', 'DodgerBlue', 'SkyBlue', 'SteelBlue', 'Turquoise'],
  ['Teal', 'Green', 'SpringGreen', 'LimeGreen', 'Chartreuse'],
  ['PaleVioletRed', 'MediumVioletRed', 'DeepPink', 'HotPink', 'Pink'],
  ['Orange', 'DarkOrange', 'OrangeRed', 'Tomato', 'Coral'],
  ['Purple', 'BlueViolet', 'Magenta', 'Plum', 'Lavender'],
  ['Yellow', 'Gold', 'Khaki', 'Moccasin', 'LemonChiffon'],
];

const RawDataTable = ({ data: rawData }: { data: any[][] }) => {
  const data = rawData.length < rawData[0].length * 1.5 ? transpose(rawData) : rawData;
  const [headerRow, ...dataRows] = data;

  const headers = headerRow.map((name, index) => (
    <th key={index} className="right">
      {name}
    </th>
  ));
  const lines = dataRows.map((line, lineIndex) => {
    const cells = line.map((value, index) => (
      <td key={index} className="right">
        {Number.isNaN(value) ? '' : value}
      </td>
    ));
    return <tr key={lineIndex}>{cells}</tr>;
  });

  return (
    <div className="raw-data-table">
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{lines}</tbody>
      </table>
    </div>
  );
};

export interface ChartAndTable2Props {
  chartType?: 'LineChart' | 'Bar' | 'Line';
  dataTable: any[] | null;
  filter?: (p: any) => boolean;
  extractor?: JmhExtractorFunc;
  title?: string;
  xDesc: JmhAxisDescriptor;
  yDesc: JmhAxisDescriptor;
  alternateColors?: number;
  doNotFloorValues?: boolean;
  findMaxFunc?: (pm: any) => any;
  options?: any;
}

export const ChartAndTable2 = (props: ChartAndTable2Props) => {
  const [hideTable, hideTableSet] = useState(true);
  const { dataTable, filter, extractor, title, xDesc, yDesc, findMaxFunc, chartType } = props;
  const options = props.options || {};

  if (!dataTable || !extractor) {
    return null;
  }

  const filteredData = filter ? dataTable.filter(filter) : dataTable;

  const data = buildData2(filteredData, extractor, xDesc, yDesc, props.doNotFloorValues !== true);

  function setDefault(path: string, value: any) {
    if (!value) {
      return;
    }

    let current = options;
    const pathParts = path.split('.');
    pathParts.forEach((name, index) => {
      if (index === pathParts.length - 1) {
        if (current[name] === undefined) {
          current[name] = typeof value === 'function' ? value() : value;
        }
      } else {
        if (current[name] === undefined) {
          current[name] = {};
        }
        current = current[name];
      }
    });
  }

  setDefault('chart.title', title);
  setDefault('vAxis.format', 'short');
  if (findMaxFunc) {
    setDefault('vAxis.viewWindow.max', () => findMaxFunc(filteredData));
  }

  // multiple selections
  setDefault('selectionMode', 'multiple');
  setDefault('tooltip.trigger', 'selection');
  setDefault('aggregationTarget', 'category');

  const { alternateColors } = props;
  if (
    alternateColors &&
    alternateColors > 0 &&
    alternateColors <= AlternateColors[0].length &&
    yDesc.values.length <= AlternateColors.length * AlternateColors[0].length
  ) {
    const colors = yDesc.values.map(
      (_, index) => AlternateColors[Math.floor(index / alternateColors)][index % alternateColors]
    );
    setDefault('colors', colors);
  }

  return (
    <div className="wide-content">
      <GoogleChart
        chartType={chartType || 'Bar'}
        data={data}
        width="100%"
        height="600px"
        options={options}
        loader="Rendering chart..."
      />
      <div className="table-toggler">
        <Button
          onClick={(event) => {
            event.preventDefault();
            hideTableSet(!hideTable);
          }}
        >
          Toggle Raw Data
        </Button>
      </div>
      {hideTable || <RawDataTable data={data} />}
    </div>
  );
};

export default ChartAndTable2;
