import React from 'react';
import {Link} from 'gatsby';
import './SiteMenu.css';

class MaybeActiveLink extends React.Component {
  render() {
    return <Link activeClassName="active" {...this.props}/>;
  }
}

export default class SiteMenu extends React.Component {
  render() {
    return (
      <div className="site-menu">
        <MaybeActiveLink to="/">Blog</MaybeActiveLink>
        <MaybeActiveLink to="/what-i-read">What I Read</MaybeActiveLink>
        <MaybeActiveLink to="/about">About</MaybeActiveLink>
      </div>
    );
  }

  // TODO It's not necessary, probably: https://www.gatsbyjs.org/docs/gatsby-link/
  isActiveBlogItem = (match, location) => {
    return location.pathname === '/' || location.pathname.indexOf('/blog/list') === 0;
  };
}
