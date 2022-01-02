import React from 'react';
import Helmet from 'react-helmet';
import { useSiteMetadata } from '../../util/useSiteMetadata';

interface SeoPropTypes {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  lang: string;
}

export default ({ title, description, canonicalUrl, lang }: SeoPropTypes) => {
  const md = useSiteMetadata();
  const metaTitle = title || md.title;
  const metaDescription = description || md.description;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title ? `${title} | ` : ''}{md.title}</title>
      {
        canonicalUrl && <link rel="canonical" href={canonicalUrl} />
      }
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={metaTitle} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={md.author} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
    </Helmet>
  );
};
