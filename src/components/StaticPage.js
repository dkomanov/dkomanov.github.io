import React from 'react';
import {MainPage, Markdown} from '.';
import {Config} from '../util';

export default function StaticPage(teaserUrl, markdown) {
  return class extends React.Component {
    render() {
      return (
        <MainPage teaserUrl={`${Config.baseUrl}${teaserUrl}`}>
          <Markdown source={markdown}/>
        </MainPage>
      );
    }
  }
}
