import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorMessage extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    error: PropTypes.array,
  };

  render() {
    const {error, message} = this.props;
    if (!error) {
      return null;
    }

    return (
      <pre>{message}:{'\n'}{error[0].toString()}</pre>
    );
  }
}
