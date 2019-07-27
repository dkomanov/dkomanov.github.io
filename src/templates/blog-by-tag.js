import {graphql} from 'gatsby';
import React from 'react';
import {BlogPostList, Layout, Seo} from '../components';
import '../components/fragments';

export default class BlogPostListByTagTemplate extends React.Component {
  render() {
    const {data, pageContext: {tag}} = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges.map(({node}) => node);

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Seo title={`Blog posts by tag: ${tag}`}/>
        <h1>by tag: {tag} ({posts.length})</h1>
        <BlogPostList posts={posts} pageSize={100} page={1} urlFunc={() => null}/>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
    query BlogPostByTag($tag: String!) {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(
            filter: {
                frontmatter: {
                    type: { eq: "blog"}
                    draft: {ne: true}
                    tags: { in: [$tag] }
                }
            }
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            ...BlogPostList
        }
    }
`;
