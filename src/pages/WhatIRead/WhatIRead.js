import PropTypes from 'prop-types';
import React from 'react';
import {ErrorMessage, Loader, MainPage, Markdown} from '../../components';
import {WirMonths} from '../../content';
import {AjaxHelper, Config, loadMarkdown} from '../../util';
import {NotFound} from '../index';
import './WhatIRead.css';

class MonthRead extends React.Component {
  static propTypes = {
    month: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {loading, month, onClick} = this.props;

    return (
      <div>
        <h3>
          <a className={loading ? 'loading' : ''} onClick={event => onClick(event, month)}>{month.month}</a>
        </h3>

        <Loader loading={loading}/>
        <ErrorMessage message="Failed to load links" error={month.error}/>

        {
          month.data && month.hide === false &&
          <div className="markdown">
            <Markdown source={month.data}/>
          </div>
        }
      </div>
    );
  }
}

function getMonthFromMatchOrDefault(match) {
  const {params: {month = WirMonths[0]}} = match;
  return month;
}

export default class WhatIRead extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.ajaxHelper = new AjaxHelper(
      this,
      this.fetchCurrentMarkdown,
      null,
      null
    );

    this.currentMonth = getMonthFromMatchOrDefault(props.match);
    this.months = WirMonths.map(month => {
      return {
        month,
        data: null,
        error: null,
        hide: false,
      };
    });
  }

  render() {
    if (!this.currentMonth) {
      return <NotFound {...this.props}/>
    }

    const monthReads = this.months.map(monthEntry =>
      <MonthRead
        key={monthEntry.month}
        loading={this.ajaxHelper.isLoading() && this.currentMonth === monthEntry.month}
        month={monthEntry}
        onClick={this.handleOnClick}
      />
    );

    return (
      <MainPage teaserUrl={`${Config.baseUrl}img/what-i-read-cover.jpg`}>
        <div className="what-i-read">
          <h1>What I Read</h1>
          <p>
            A log of what I've read/watched with short review.
          </p>
          {monthReads}
        </div>
      </MainPage>
    );
  }

  componentDidMount() {
    this.ajaxHelper.doAction();
  }

  componentWillUnmount() {
    this.ajaxHelper.cancel();
  }

  fetchCurrentMarkdown = () => {
    const month = this.months.find(m => m.month === this.currentMonth);
    if (month) {
      return loadMarkdown(`${Config.baseUrl}data/what-i-read/${month.month}.md`)
        .then(r => {
          month.data = r.data;
          month.error = null;
          return r;
        })
        .catch(reason => {
          month.error = [reason];
          return reason;
        });
    } else {
      return Promise.reject('not found');
    }
  };

  handleOnClick = (event, month) => {
    event.preventDefault();

    if (month.data) {
      month.hide = !month.hide;
      this.forceUpdate();
    } else {
      this.currentMonth = month.month;
      this.ajaxHelper.doAction();
    }

    if (month.hide === false) {
      this.props.history.push(`/what-i-read/${month.month}`);
    }
  };
}
