import { graphql } from 'gatsby';

export const ListenedPoscastEpisodeFragment = graphql`
  fragment ListenedPoscastEpisodeFragment on MarkdownRemarkConnection {
    edges {
      node {
        frontmatter {
          date
          title
          podcastDate
          url
          teaser {
            childImageSharp {
              gatsbyImageData(layout: FIXED, width: 100)
            }
          }
          tags
          draft
        }
        fields {
          slug
        }
      }
    }
  }
`;
