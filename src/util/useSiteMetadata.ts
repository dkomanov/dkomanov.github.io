import { graphql, useStaticQuery } from 'gatsby';

interface SiteMetadata {
    siteUrl: string;
    title: string;
    description: string;
    author: string;
    email: string;
    social: {
        twitter?: string;
        facebook?: string;
    };
}

export const useSiteMetadata = () => {
    const data = useStaticQuery(graphql`
        query SiteMetadataQuery {
            site {
                siteMetadata {
                    siteUrl
                    title
                    description
                    author
                    email
                    social {
                        twitter
                        facebook
                    }
                }
            }
        }
    `);

    const md: SiteMetadata = data.site.siteMetadata;
    return md;
};
