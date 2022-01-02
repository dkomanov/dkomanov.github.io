import { Link } from 'gatsby';
import React from 'react';
import { useSiteMetadata } from '../../util/useSiteMetadata';
import './PageFooter.css';

const PageFooter = (props) => {
  const md = useSiteMetadata();

  return (
    <footer {...props}>
      All content &copy;{' '}
      <a href={`mailto:${md.email}`}>{md.author}</a>,{' '}
      <Link to="/powered">powered by...</Link>
    </footer>
  );
};

export default PageFooter;
