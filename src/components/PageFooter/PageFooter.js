import {Link} from 'gatsby';
import React from 'react';
import './PageFooter.css';

class PageFooter extends React.Component {
  render() {
    return (
      <footer {...this.props}>
        All content &copy; <a href="mailto:dkomanov@gmail.com">Dmitry Komanov</a>, <Link to="/powered">powered by...</Link>
      </footer>
    );
  }
}

export default PageFooter;
