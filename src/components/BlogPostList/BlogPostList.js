import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import './BlogPostList.css';
import Pagination from './Pagination/Pagination';
import Tags from './Tags/Tags';

class BlogPostPreview extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired
  };

  render() {
    const {node} = this.props;

    const slug = node.fields.slug;
    const title = node.frontmatter.title || slug;
    const date = node.frontmatter.date;

    return (
      <article className="post" itemScope itemType="http://schema.org/BlogPosting">
        <div className="article-item">
          <header className="post-header">
            <h2 className="post-title" itemProp="name">
              <Link to={slug} itemProp="url">{title}</Link>
            </h2>
          </header>
          <section className="post-description" itemProp="description">
            <p dangerouslySetInnerHTML={{__html: node.frontmatter.description || node.excerpt}}/>
          </section>
          <div className="post-meta">
            <time dateTime={date}>{date}</time>
            <Tags tags={node.frontmatter.tags}/>
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
    urlFunc: PropTypes.func.isRequired
  };

  render() {
    const {page, pageSize, urlFunc, posts} = this.props;
    const first = (page - 1) * pageSize;

    if (first < 0 || first >= posts.length) {
      return <p>Nothing found.</p>;
    }

    return (
      <div>
        {
          posts
            .slice(first, first + pageSize)
            .map(post => <BlogPostPreview key={post.fields.slug} node={post}/>)
        }
        <Pagination pageSize={pageSize} totalCount={posts.length} page={page} urlFunc={urlFunc}/>
      </div>
    );
  }
}
