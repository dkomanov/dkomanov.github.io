import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import './Tags.css';

export default class Tags extends React.Component {
  static propTypes = {
    tags: PropTypes.array,
  };

  render() {
    const {tags} = this.props;
    if (!tags || tags.length === 0) {
      return null;
    }

    // TODO Think about tags. I'm not sure that I need it in the list.
    if (true !== (parseInt("1", 10) === 1)) {
      return null;
    }

    const items = tags.map(tag => <li key={tag} className="cf"><Link to={`/posts/${tag}`}>{tag.replace(' ', '\u00A0')}</Link></li>);
    return (
      <ul className="tags">
        {items}
      </ul>
    );
  }
}
