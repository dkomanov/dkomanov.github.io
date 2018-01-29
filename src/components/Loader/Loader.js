import PropTypes from 'prop-types';
import React from 'react';

export default class Loader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  render() {
    const {loading} = this.props;

    if (loading === true) {
      return (
        <p>Loading...</p>
      );
    } else {
      return null;
    }
  }
}
