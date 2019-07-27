import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import {Layout, Markdown, Seo, ShareButtons, Tags} from '../components';
import '../components/fragments';
import './BlogPost.css';

class BlogPostMeta extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const {post} = this.props;

    return (
      <div className="blog-post-meta">
        <Tags tags={post.frontmatter.tags}/>
        <hr/>
        <ShareButtons post={post}/>
      </div>
    );
  }
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    //const {previous, next} = this.props.pageContext;

    return (
      <Layout
        teaserUrl={post.frontmatter.cover} title={post.frontmatter.title}
        rawDate={post.frontmatter.rawDate} date={post.frontmatter.date}
      >
        <Seo
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          canonicalUrl={post.frontmatter.canonicalUrl}
        />
        <div className="blog-post" itemScope itemType="http://schema.org/Article">
          {
            post.frontmatter.cover &&
            <h1>{post.title}</h1>
          }
          <Markdown html={post.html}/>
        </div>
        <BlogPostMeta post={post}/>
      </Layout>
    );
  }
}

/*
<ul>
  <li>
    {previous && (
      <Link to={previous.fields.slug} rel="prev">
        ← {previous.frontmatter.title}
      </Link>
    )}
  </li>
  <li>
    {next && (
      <Link to={next.fields.slug} rel="next">
        {next.frontmatter.title} →
      </Link>
    )}
  </li>
</ul>
*/


export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            html
            fields {
                slug
            }
            frontmatter {
                rawDate: date
                date(formatString: "MMMM DD, YYYY")
                title
                description
                tags
                canonicalUrl
                cover {
                    ...coverUrl
                }
            }
        }
    }
`;
