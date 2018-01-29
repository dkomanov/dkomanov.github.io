import PropTypes from 'prop-types';
import React from 'react';
import {MainPage} from '../../components';

export default class NotFound extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  render() {
    return (
      <MainPage teaserUrl="/img/not-found-cover.jpg">
        <h1>404 Not Found</h1>
        <p>
          Page not found: {this.props.location.pathname}.
        </p>
      </MainPage>
    );
  }
}
