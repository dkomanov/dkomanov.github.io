import PropTypes from 'prop-types';
import React from 'react';
import './Markdown.css';

export default class Markdown extends React.Component {
  static propTypes = {
    tiny: PropTypes.bool,
    html: PropTypes.string.isRequired
  };

  static defaultProps = {
    tiny: false
  };

  render() {
    const {html, tiny} = this.props;

    return (
      <div className={`markdown ${tiny ? 'tiny' : ''}`} role="main" dangerouslySetInnerHTML={{__html: html}}/>
    );
  }
}
