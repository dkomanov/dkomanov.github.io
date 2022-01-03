import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { Article } from '..';
import Pagination from './Pagination/Pagination';
import Tags from './Tags/Tags';

class BlogPostPreview extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
  };

  render() {
    const { node } = this.props;

    const slug = node.fields.slug;
    const title = node.frontmatter.title || slug;
    const date = node.frontmatter.date;

    return (
      <Article
        header={
          <Link to={slug} itemProp="url">
            {title}
          </Link>
        }
        content={
          <p
            dangerouslySetInnerHTML={{
              __html: node.frontmatter.description || node.excerpt,
            }}
          />
        }
        date={date}
        meta={<Tags tags={node.frontmatter.tags} />}
      />
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
    const { page, pageSize, urlFunc, posts } = this.props;
    const first = (page - 1) * pageSize;

    if (first < 0 || first >= posts.length) {
      return <p>Nothing found.</p>;
    }

    return (
      <div>
        {posts.slice(first, first + pageSize).map((post) => (
          <BlogPostPreview key={post.fields.slug} node={post} />
        ))}
        <Pagination
          pageSize={pageSize}
          totalCount={posts.length}
          page={page}
          urlFunc={urlFunc}
        />
      </div>
    );
  }
}
