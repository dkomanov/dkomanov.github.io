import PropTypes from 'prop-types';
import React from 'react';
import {BlogPostList, MainPage} from '../../components';
import {getAllBlogPosts} from '../../util';

export default class BlogByTag extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    pageSize: PropTypes.number,
  };

  static defaultProps = {
    pageSize: 5,
  };

  render() {
    const {match: {params: {tag, page: pageParam = '1'}}, pageSize} = this.props;
    const page = parseInt(pageParam, 10);

    const posts = getAllBlogPosts().filter(p => (p.tags || []).indexOf(tag) >= 0);

    return (
      <MainPage>
        <BlogPostList posts={posts} page={page} pageSize={pageSize} urlFunc={p => `/posts/${tag}/${p}`}/>
      </MainPage>
    );
  }
}
