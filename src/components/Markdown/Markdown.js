import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
import PropTypes from 'prop-types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Link} from 'react-router-dom';
import './Markdown.css';

class MarkdownLink extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.any,
  };

  render() {
    const {href, children} = this.props;
    return href.match(/^(https?:)?\/\//)
      ? <a href={href}>{children}</a>
      : <Link to={href}>{children}</Link>;
  }
}

class HighlightJs extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  };

  static defaultProps = {
    language: '',
  };

  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  setRef(el) {
    this.codeEl = el;
  }

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl);
  }

  render() {
    return (
      <pre>
        <code ref={this.setRef} className={this.props.language}>
          {this.props.value}
        </code>
      </pre>
    );
  }
}

class ImageLoader extends  React.Component {
  static propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    alt: PropTypes.string,
  };

  render() {
    const {src, alt: altText, title} = this.props;
    const [alt, className = ''] = (altText || '').split('|');

    if (className === 'wide') {
      return (
        <span className="wide-image">
          <img src={src} alt={alt} title={title}/>
        </span>
      );
    } else {
      return <img src={src} alt={alt} title={title}/>;
    }
  }
}

export default class Markdown extends React.Component {
  render() {
    const {source} = this.props;
    return (
      <div className="markdown" role="main">
        <ReactMarkdown
          source={source}
          renderers={{
            code: HighlightJs,
            link: MarkdownLink,
            image: ImageLoader,
          }}
        />
      </div>
    );
  }
}
