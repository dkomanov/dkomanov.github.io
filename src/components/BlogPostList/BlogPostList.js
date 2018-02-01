import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import './BlogPostList.css';
import Pagination from './Pagination/Pagination';
import Tags from './Tags/Tags';

class BlogPostPreview extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const {post} = this.props;

    return (
      <article className="post" itemScope itemType="http://schema.org/BlogPosting">
        <div className="article-item">
          <header className="post-header">
            <h2 className="post-title" itemProp="name">
              <Link to={`/p/${post.url}`} itemProp="url">{post.title}</Link>
            </h2>
          </header>
          <section className="post-description" itemProp="description">
            <p>{post.description}</p>
          </section>
          <div className="post-meta">
            <time dateTime={post.date}>{post.date}</time>
            <Tags tags={post.tags}/>
          </div>
        </div>
      </article>
    );
  }
}

export default class BlogPostList extends React.Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    urlFunc: PropTypes.func.isRequired,
  };

  render() {
    const sortedPosts = this.props.posts
      .sort((a, b) => b.date.localeCompare(a.date));
    const {page, pageSize, urlFunc} = this.props;
    const first = (page - 1) * pageSize;

    if (first < 0 || first >= sortedPosts.length) {
      return <p>Nothing found.</p>;
    }

    return (
      <div>
        {
          sortedPosts
            .slice(first, first + pageSize)
            .map(post => <BlogPostPreview key={post.url} post={post}/>)
        }
        <Pagination pageSize={pageSize} totalCount={sortedPosts.length} page={page} urlFunc={urlFunc}/>
      </div>
    );
  }
}
