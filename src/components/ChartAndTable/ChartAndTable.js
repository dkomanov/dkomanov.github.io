import PropTypes from 'prop-types';
import React from 'react';
import {GoogleChart, Button} from '..';
import {buildData} from '../../util';
import './ChartAndTable.css';

class RawDataTable extends React.Component {
  render() {
    const {data: rawData} = this.props;
    const data = rawData.length < rawData[0].length * 2
      ? rawData[0].map((col, i) => rawData.map(row => row[i]))
      : rawData;
    const [headerRow, ...dataRows] = data;

    const headers = headerRow.map((name, index) =>
      <th key={index} className="right">{name}</th>);
    const lines = dataRows.map((line, lineIndex) => {
      const cells = line.map((value, index) =>
        <td key={index} className="right">{Number.isNaN(value) ? '' : value}</td>);
      return <tr key={lineIndex}>{cells}</tr>
    });

    return (
      <div className="raw-data-table">
        <table>
          <thead>
          <tr>
            {headers}
          </tr>
          </thead>
          <tbody>
          {lines}
          </tbody>
        </table>
      </div>
    )
  }
}

export default class ChartAndTable extends React.Component {
  static propTypes = {
    chartType: PropTypes.string,
    dataTable: PropTypes.array,
    filter: PropTypes.func,
    extractor: PropTypes.func,
    title: PropTypes.string,
    xDesc: PropTypes.shape({
      title: PropTypes.string.isRequired,
      prop: PropTypes.string.isRequired,
      values: PropTypes.array.isRequired
    }).isRequired,
    yDesc: PropTypes.shape({
      title: PropTypes.string.isRequired,
      prop: PropTypes.string.isRequired,
      values: PropTypes.array.isRequired
    }).isRequired,
    findMaxFunc: PropTypes.func,
    options: PropTypes.object,
  };

  static defaultProps = {
    chartType: 'Bar',
  };

  constructor(props) {
    super(props);

    this.state = {
      hideTable: true
    };
  }

  render() {
    const {dataTable, filter, extractor, title, xDesc, yDesc, findMaxFunc, chartType} = this.props;
    const options = this.props.options || {};

    if (!dataTable || !extractor) {
      return null;
    }

    const filteredData = filter ? dataTable.filter(filter) : dataTable;

    const data = buildData(filteredData, extractor, xDesc, yDesc);

    function setDefault(path, value) {
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

    return (
      <div className="wide-content">
        <GoogleChart
          chartType={chartType}
          data={data}
          width="100%"
          height="600px"
          options={options}
          loader="Rendering chart..."
        />
        <div className="table-toggler">
          <Button onClick={this.handleOnClick}>Toggle Raw Data</Button>
        </div>
        {this.state.hideTable || <RawDataTable data={data}/>}
      </div>
    )
  }

  handleOnClick = event => {
    event.preventDefault();
    this.setState({
      hideTable: !this.state.hideTable
    });
  };
}
