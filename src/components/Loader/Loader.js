import PropTypes from 'prop-types';
import React from 'react';

export default class Loader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    content: PropTypes.any,
  };

  static defaultProps = {
    content: 'Loading...',
  };

  render() {
    const {loading, content} = this.props;

    if (loading === true) {
      return typeof content === 'string'
        ? <p>{content}</p>
        : content;
    } else {
      return null;
    }
  }
}
