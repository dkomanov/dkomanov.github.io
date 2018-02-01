import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {Config} from '../../util';
import {PageFooter, SiteMenu, TeaserImage} from '../index';
import './MainPage.css';

class Header extends React.Component {
  render() {
    return (
      <header className="site-header">
        <Link to="/" className="site-logo" style={{backgroundImage: `url('${Config.logo}')`}}>
          {Config.title}
        </Link>
        <h1 className="site-title">{Config.title}</h1>
        <div className="site-description">Severe Software Developer Blog</div>
        <SiteMenu/>
      </header>
    );
  }

  isActiveBlogItem = (match, location) => {
    return location.pathname === '/' || location.pathname.indexOf('/blog/list') === 0;
  };
}

export default class MainPage extends React.Component {
  static propTypes = {
    teaserUrl: PropTypes.string,
    fluid: PropTypes.bool,
  };

  static defaultProps = {
    fluid: false,
  };

  render() {
    const {teaserUrl = Config.coverImageUrl} = this.props;
    return (
      <div>
        <TeaserImage url={teaserUrl}/>
        <Header/>
        <div className="site-content">
          {this.props.children}
        </div>
        <PageFooter className="main-page-footer"/>
      </div>
    );
  }
}
