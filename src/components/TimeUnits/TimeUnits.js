import PropTypes from 'prop-types';
import React from 'react';
import {Choose} from '..';
import './TimeUnits.css';

const items = [
  {
    label: 'avg',
    value: 'avg',
    default: true,
  },
  {
    label: 'p0',
    value: '0.0',
  },
  {
    label: 'p50',
    value: '50.0',
  },
  {
    label: 'p95',
    value: '95.0',
  },
  {
    label: 'p99',
    value: '99.0',
  },
  {
    label: 'p100',
    value: '100.0',
  },
];

export default class TimeUnits extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  render() {
    return (
      <div className="time-units">
        <Choose label="Time Units: " onChange={this.handleOnClick} items={items}/>
        <p className="small">
          <small>
            avg - average, p0 - percentile 0 (min), p50 - percentile 50 (median), p95 - percentile 95, p99 - percentile 99, p100 - percentile 100 (max)
          </small>
        </p>
      </div>
    );
  }

  handleOnClick = value => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(
        value === 'avg'
          ? pm => pm.score
          : pm => pm.scorePercentiles[value]
      );
    }
  };
}
