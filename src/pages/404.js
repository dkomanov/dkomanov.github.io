import React from 'react';
import {Layout, Seo} from '../components';
import teaser from './404.jpg';

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout teaserUrl={teaser}>
        <Seo title="404: Not Found"/>
        <h1>404 Not Found</h1>
        <p>
          Page not found: {this.props.location.pathname}.
        </p>
      </Layout>
    );
  }
}
