import React from 'react';
import {AjaxHelper} from '../util';

/**
 * @param WrappedComponent Object extends React.Component
 * @param {function()} fetchFunc Function to fetch data. Should return Promise.
 * @returns Object extends React.Component
 */
export default function AjaxPage(WrappedComponent, fetchFunc) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.ajaxHelper = new AjaxHelper(
        this,
        fetchFunc.bind(this),
        response => {
          this.setState({
            data: response.data,
            error: null
          });
        },
        reason => {
          this.setState({
            data: null,
            error: [reason]
          });
        }
      );

      this.state = {
        error: null,
        data: null
      };
    }

    render() {
      return (
        <WrappedComponent
          data={this.state.data}
          error={this.state.error && this.state.error[0]}
          loading={this.ajaxHelper.isLoading()}
          refetch={this.fetchData}
          {...this.props}
        />
      );
    }

    componentDidMount() {
      this.fetchData();
    }

    componentWillUnmount() {
      this.ajaxHelper.cancel();
    }

    fetchData = () => {
      this.setState({
        error: null,
        data: null,
      });
      this.ajaxHelper.doAction();
    };
  };
}
