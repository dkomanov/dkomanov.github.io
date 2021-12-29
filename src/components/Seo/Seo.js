import {graphql, StaticQuery} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';

class Seo extends React.Component {
  static propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    canonicalUrl: PropTypes.string,
    site: PropTypes.object.isRequired,
  };

  static defaultProps = {
    lang: `en`,
    meta: [],
    description: ``,
  };

  render() {
    const {description, lang, meta, title, canonicalUrl, site} = this.props;
    const metaDescription = description || site.siteMetadata.description;
    const links = [];
    if (canonicalUrl) {
      links.push({rel: 'canonical', href: canonicalUrl});
    }

    return (
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        link={links}
        meta={[
          {
            name: `description`,
            content: metaDescription,
          },
          {
            property: `og:title`,
            content: title,
          },
          {
            property: `og:description`,
            content: metaDescription,
          },
          {
            property: `og:type`,
            content: `website`,
          },
          {
            name: `twitter:card`,
            content: `summary`,
          },
          {
            name: `twitter:creator`,
            content: site.siteMetadata.author,
          },
          {
            name: `twitter:title`,
            content: title,
          },
          {
            name: `twitter:description`,
            content: metaDescription,
          },
        ].concat(meta)}
      />
    );
  }
}

const props = () => (
  <StaticQuery
    query={graphql`
query SeoQuery {
    site {
        siteMetadata {
            title
            description
            author
        }
    }
}
    `}
    render={({site}) => <Seo site={site} {...props} />}
  />
);

export default props;