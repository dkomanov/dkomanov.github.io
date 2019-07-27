import PropTypes from 'prop-types';
import React from 'react';
import {Button, Markdown} from '..';

export default class Changelog extends React.Component {
  static propTypes = {
    runs: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      comment: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    })).isRequired,
    onChange: PropTypes.func,
  };

  render() {
    const children = this.props.runs.map(({date, comment}) =>
      <div key={date}>
        <h4>
          <Button onClick={event => this.handleOnClick(event, date)}>{date}</Button>
        </h4>
        {typeof comment === 'string' ? <Markdown html={comment} tiny/> : comment}
        <hr/>
      </div>
    );
    return (
      <div>
        <h3>Changelog</h3>
        {children}
      </div>
    );
  }

  handleOnClick = (event, date) => {
    event.preventDefault();

    const {onChange} = this.props;
    if (onChange) {
      onChange(date);
    }
  };
}
