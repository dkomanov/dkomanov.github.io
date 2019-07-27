import {graphql} from 'gatsby';
import React from 'react';
import {Layout, Markdown} from '../components';
import '../components/fragments';

export default class Static extends React.Component {
  render() {
    const {data: {markdownRemark: md}} = this.props;
    return (
      <Layout teaserUrl={md.frontmatter.cover}>
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
                cover {
                    ...coverUrl
                }
            }
        }
    }
`;
