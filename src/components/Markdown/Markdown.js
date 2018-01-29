import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
import React from 'react';
import {default as MarkdownComponent} from 'react-remarkable';
import './Markdown.css';

function highlight(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (err) {
      console.error(err);
    }
  }

  try {
    return hljs.highlightAuto(str).value;
  } catch (err) {
    console.error(err);
  }

  return '';
}

export default class Markdown extends React.Component {
  render() {
    const options = {
      html: true,
      typography: true,
      highlight,
    };

    return (
      <div className="markdown" role="main">
        <MarkdownComponent options={options} {...this.props}/>
      </div>
    );
  }
}
