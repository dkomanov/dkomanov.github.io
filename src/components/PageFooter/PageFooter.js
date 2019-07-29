import {graphql, Link, useStaticQuery} from 'gatsby';
import React from 'react';
import './PageFooter.css';

const PageFooter = props => {
  const data = useStaticQuery(graphql`
      query PageFooterQuery {
          site {
              siteMetadata {
                  author
                  email
              }
          }
      }
  `);

  const {site: {siteMetadata: {author, email}}} = data;

  return (
    <footer {...props}>
      All content &copy;{' '}
      <a href={`mailto:${email}`}>{author}</a>,{' '}
      <Link to="/powered">powered by...</Link>
    </footer>
  );
};

export default PageFooter;
