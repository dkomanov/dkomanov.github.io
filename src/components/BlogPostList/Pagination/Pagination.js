import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import './Pagination.css';

export default class Pagination extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    urlFunc: PropTypes.func.isRequired,
  };

  render() {
    const {page, pageSize, totalCount, urlFunc} = this.props;

    const pageCount = Math.ceil(totalCount / pageSize);

    if (pageCount <= 1) {
      return null;
    }

    const pageNumbers = [...Array(pageCount).keys()].map(i => {
      const pageNumber = i + 1;
      return pageNumber === page
        ? <li key={i} className="active">{pageNumber}</li>
        : <li key={i} itemProp="url"><Link to={urlFunc(pageNumber)} itemProp="name">{pageNumber}</Link></li>;
    });

    return (
      <ul className="pagination" itemScope role="navigation" itemType="http://schema.org/pagination">
        {pageNumbers}
      </ul>
    );
  }
}
