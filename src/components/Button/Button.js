import PropTypes from 'prop-types';
import React from 'react';
import './Button.css';

export default class Button extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <button className="btn" {...this.props}/>
    );
  }
}
