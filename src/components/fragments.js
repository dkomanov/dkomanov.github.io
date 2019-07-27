import {graphql} from 'gatsby';

export const query = graphql`
    fragment BlogPostList on MarkdownRemarkConnection {
        edges {
            node {
                excerpt
                fields {
                    slug
                }
                frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    title
                    description
                }
            }
        }
    }

    fragment coverUrl on File {
        publicURL
    }
`;
