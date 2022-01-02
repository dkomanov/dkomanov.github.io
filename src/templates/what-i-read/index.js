import {graphql, Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import {Layout, Markdown, Seo} from '../../components';
import '../../components/fragments';
import cover from './cover.jpg';
import './WhatIRead.css';

class MonthList extends React.Component {
  static propTypes = {
    months: PropTypes.shape({
      path: PropTypes.string.isRequired,
      yearMonth: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {months} = this.props;

    return (
      <ul className="what-i-read">
        {months.map(month => <li key={month.yearMonth}><Link to={month.path}>{month.yearMonth}</Link></li>)}
      </ul>
    );
  }
}


export default class WhatIReadPage extends React.Component {
  render() {
    const {data, pageContext: {months}} = this.props;
    const {markdownRemark: {html, fields: {month}}} = data;

    return (
      <Layout location={this.props.location} teaserUrl={cover}>
        <Seo title={`What I Read on ${month}`}/>
        <h1>What I Read on {month}</h1>
        <p>
          A log of what I've read/watched with short review.
        </p>
        <Markdown html={html}/>
        <MonthList months={months}/>
      </Layout>
    );
  }

  handleOnClick = (event, data) => {
    event.preventDefault();
    data.hide = !data.hide;
  };
}

export const pageQuery = graphql`
    query IReadQuery($id: String!) {
        markdownRemark(id: {eq: $id}) {
            html
            fields {
                yearMonth(formatString: "MMMM, YYYY")
            }
        }
    }
`;
