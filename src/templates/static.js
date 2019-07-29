import {graphql} from 'gatsby';
import React from 'react';
import {Layout, Markdown, Seo} from '../components';
import '../components/fragments';

export default class Static extends React.Component {
  render() {
    const {data: {markdownRemark: md}} = this.props;
    return (
      <Layout teaserUrl={md.frontmatter.cover}>
        <Seo title={md.frontmatter.title}/>
        <Markdown html={md.html}/>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
    query StaticBySlug($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                cover {
                    ...coverUrl
                }
            }
        }
    }
`;
