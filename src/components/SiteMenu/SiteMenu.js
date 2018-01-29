import React from 'react';
import {NavLink} from 'react-router-dom';
import './SiteMenu.css';

class MaybeActiveLink extends React.Component {
  render() {
    return <NavLink activeClassName="active" {...this.props}/>;
  }
}

export default class SiteMenu extends React.Component {
  render() {
    return (
      <div className="site-menu">
        <MaybeActiveLink to="/" isActive={this.isActiveBlogItem}>Blog</MaybeActiveLink>
        <MaybeActiveLink to="/what-i-read">What I Read</MaybeActiveLink>
        <MaybeActiveLink to="/about">About</MaybeActiveLink>
      </div>
    );
  }

  isActiveBlogItem = (match, location) => {
    return location.pathname === '/' || location.pathname.indexOf('/blog/list') === 0;
  };
}
