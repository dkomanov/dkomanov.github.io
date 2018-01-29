import PropTypes from 'prop-types';
import React from 'react';
import {BlogPostList, MainPage} from '../../components';
import {getAllBlogPosts} from '../../util';

export default class Blog extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    pageSize: PropTypes.number,
  };

  static defaultProps = {
    pageSize: 5,
  };

  render() {
    const {match: {params: {page: pageParam = '1'}}, pageSize} = this.props;
    const page = parseInt(pageParam, 10);

    return (
      <MainPage>
        <BlogPostList posts={getAllBlogPosts()} page={page} pageSize={pageSize} urlFunc={p => p === 1 ? '/' : `/posts/${p}`}/>
      </MainPage>
    );
  }
}
