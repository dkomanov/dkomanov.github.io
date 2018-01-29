import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {
  AjaxPage,
  Disqus,
  ErrorMessage,
  Loader,
  MainPage,
  Markdown,
  PageFooter,
  ShareButtons,
  SiteMenu
} from '../../components';
import Tags from '../../components/BlogPostList/Tags/Tags';
import {BlogPosts} from '../../content';
import {Config, loadMarkdown} from '../../util';
import {NotFound} from '../index';
import './BlogPost.css';

const parentProps = {
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.string,
  error: PropTypes.any,
};

class BlogPostMeta extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const {post} = this.props;

    return (
      <div className="blog-post-meta">
        <Tags tags={post.tags}/>
        <hr/>
        <ShareButtons post={post}/>
        <hr/>
        <Disqus post={post}/>
      </div>
    );
  }
}

class BlogPostWithoutCover extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    markdown: PropTypes.string,
    error: PropTypes.any,
  };

  render() {
    const {loading, post, markdown, error} = this.props;

    return (
      <div className="site-content no-cover">
        <div className="post-meta">
          <h1 className="post-title">{post.title}</h1>
          <div className="cf post-meta-text">
            <Link to="/">
              <span className="author-image" style={{backgroundImage: `url(${Config.logo})`}}>Blog Logo</span>
            </Link>
            <h4 className="author-name" itemProp="author" itemScope itemType="http://schema.org/Person">Dmitry Komanov</h4>
            {' on '}
            <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
            <br/>
            <br/>
          </div>
          <SiteMenu/>
        </div>
        <div>
          <div className="blog-post" itemScope itemType="http://schema.org/Article">
            <Loader loading={loading}/>
            <ErrorMessage message="Failed to load post" error={error}/>
            {markdown && <Markdown source={markdown}/>}
          </div>
          <BlogPostMeta post={post}/>
        </div>
        <PageFooter/>
      </div>
    )
  }
}

class BlogPostWithCover extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    markdown: PropTypes.string,
    error: PropTypes.any,
  };

  render() {
    const {baseUrl, loading, post, markdown, error} = this.props;

    return (
      <MainPage teaserUrl={`${baseUrl}/${post.cover}`}>
        <div className="blog-post" itemScope itemType="http://schema.org/Article">
          <h1>{post.title}</h1>

          <Loader loading={loading}/>
          <ErrorMessage message="Failed to load post" error={error}/>
          {markdown && <Markdown source={markdown}/>}
        </div>
        <BlogPostMeta post={post}/>
      </MainPage>
    );
  }
}

class BlogPostImpl extends React.Component {
  static propTypes = parentProps;

  render() {
    const {loading, data, error} = this.props;

    const post = getPost(this.props);
    if (!post || (error && error[0] === 'not found')) {
      return <NotFound {...this.props}/>
    }

    const baseUrl = `${Config.baseUrl}${post.source.substring(0, post.source.lastIndexOf('/'))}`;
    const markdown = data
      ? data.replace(/\(\.\//g, `(${baseUrl}/`).replace(/src="\.\//g, `src="${baseUrl}/`)
      : undefined;

    return post.cover
      ? <BlogPostWithCover post={post} baseUrl={baseUrl} loading={loading} error={error} markdown={markdown}/>
      : <BlogPostWithoutCover post={post} loading={loading} error={error} markdown={markdown}/>;
  }
}

function getPost(props) {
  const {match: {params: {url}}} = props;
  return BlogPosts.find(p => p.url === url);
}

function fetchPostMarkdown() {
  const post = getPost(this.props);
  return post
    ? loadMarkdown(`${Config.baseUrl}${post.source}`)
    : Promise.reject('not found');
}

export default AjaxPage(BlogPostImpl, fetchPostMarkdown);
