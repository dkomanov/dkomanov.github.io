import {graphql, Link, useStaticQuery} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import {PageFooter, SiteMenu, TeaserImage} from '../';
import './Layout.css';

const Header = () => {
  const data = useStaticQuery(graphql`
      query LayoutQuery {
          site {
              siteMetadata {
                  title
                  description
              }
          }
      }
  `);

  const {site: {siteMetadata: {title, description}}} = data;

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        {title}
      </Link>
      <h1 className="site-title">{title}</h1>
      <div className="site-description">{description}</div>
      <SiteMenu/>
    </header>
  );
};

class TeaserfulLayout extends React.Component {
  static propTypes = {
    teaserUrl: PropTypes.any.isRequired,
  };

  render() {
    const {teaserUrl, children} = this.props;
    return (
      <div>
        <TeaserImage url={teaserUrl}/>
        <Header/>
        <div className="site-content">
          {children}
        </div>
        <PageFooter/>
      </div>
    );
  }
}

class TeaserlessLayout extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    rawDate: PropTypes.string,
    date: PropTypes.string,
  };

  render() {
    const {title, rawDate, date, children} = this.props;
    return (
      <div className="site-content no-cover">
        <div className="post-meta">
          <h1 className="post-title">{title}</h1>
          <div className="cf post-meta-text">
            <Link to="/">
              <span className="author-image">Blog Logo</span>
            </Link>
            <h4 className="author-name" itemProp="author" itemScope itemType="http://schema.org/Person">Dmitry Komanov</h4>
            {
              rawDate && date && <span>
                {' on '}
                <time dateTime={new Date(rawDate).toISOString()}>{date}</time>
                <br/>
                <br/>
              </span>
            }
          </div>
          <SiteMenu/>
        </div>
        {children}
        <PageFooter/>
      </div>
    );
  }
}

export default class Layout extends React.Component {
  static propTypes = {
    teaserUrl: PropTypes.any,
    title: PropTypes.string,
    rawDate: PropTypes.string,
    date: PropTypes.string,
  };

  render() {
    const {teaserUrl} = this.props;
    return teaserUrl ? <TeaserfulLayout {...this.props}/> : <TeaserlessLayout {...this.props}/>;
  }
}
