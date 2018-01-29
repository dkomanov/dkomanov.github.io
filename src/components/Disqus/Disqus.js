import PropTypes from 'prop-types';
import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import {Config} from '../../util';

export default class Disqus extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    if (!Config.disqus) {
      return null;
    }

    const {post} = this.props;
    return (
      <ReactDisqusComments
        shortname={Config.disqus}
        identifier={post.url}
        title={post.title}
      />
    );
  }
}
