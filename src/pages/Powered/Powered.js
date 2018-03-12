import React from 'react';
import {MainPage, Markdown} from '../../components';
import {PoweredMarkdown} from '../../content';
import {Config} from '../../util';

export default class Powered extends React.Component {
  render() {
    return (
      <MainPage teaserUrl={`${Config.baseUrl}img/powered-cover.jpg`}>
        <Markdown source={PoweredMarkdown}/>
      </MainPage>
    );
  }
}
