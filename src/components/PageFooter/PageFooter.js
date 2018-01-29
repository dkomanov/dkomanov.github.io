import React from 'react';
import {Link} from 'react-router-dom';
import './PageFooter.css';

class PageFooter extends React.Component {
  render() {
    return (
      <footer {...this.props}>
        <Link to="/powered">Powered by...</Link><br/>
        All content &copy; <a href="mailto:dkomanov@gmail.com">Dmitry Komanov</a>
      </footer>
    );
  }
}

export default PageFooter;
