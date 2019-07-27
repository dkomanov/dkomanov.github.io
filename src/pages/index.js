import {graphql} from 'gatsby';
import React from 'react';
import {BlogPostList, Layout, Seo} from '../components';
import '../components/fragments';

// TODO: https://www.gatsbyjs.org/docs/adding-pagination/

class BlogIndex extends React.Component {
  render() {
    const {data} = this.props;
    const posts = data.allMarkdownRemark.edges.map(({node}) => node);

    return (
      <Layout location={this.props.location} teaserUrl="img/cover.jpg">
        <Seo title="All posts"/>
        <BlogPostList posts={posts} pageSize={100} page={1} urlFunc={() => null}/>
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(
            filter: {
                frontmatter: {
                    type: {eq: "blog"}
                    draft: {ne: true}
                }
            },
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            ...BlogPostList
        }
    }
`;
