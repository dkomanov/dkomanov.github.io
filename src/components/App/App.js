import PropTypes from 'prop-types';
import React from 'react';
import {Route, Switch, withRouter} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import * as page from './../../pages';
import './App.css';

// https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md
class ScrollToTopImpl extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

const ScrollToTop = withRouter(ScrollToTopImpl);

export default class App extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string
  };

  static defaultProps = {
    baseUrl: '/'
  };

  render() {
    const {baseUrl} = this.props;
    return (
      <BrowserRouter basename={baseUrl}>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={page.Blog}/>
            <Route exact path="/p/:url" component={page.BlogPost}/>
            <Route exact path="/posts/:page(\d+)" component={page.Blog}/>
            <Route exact path="/posts/:tag([a-z0-9 -]+)/:page(\d+)?" component={page.BlogByTag}/>
            <Route exact path="/what-i-read/:month?" component={page.WhatIRead}/>
            <Route exact path="/about" component={page.About}/>
            <Route exact path="/powered" component={page.Powered}/>
            <Route path="*" component={page.NotFound}/>
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}
