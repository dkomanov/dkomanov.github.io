import React from 'react';
import {MainPage, Markdown} from '../../components';
import {AboutMarkdown} from '../../content';
import {Config} from '../../util';

export default class About extends React.Component {
  render() {
    return (
      <MainPage teaserUrl={`${Config.baseUrl}img/about-cover.jpg`}>
        <Markdown source={AboutMarkdown}/>
      </MainPage>
    );
  }
}
