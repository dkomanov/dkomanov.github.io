import React from 'react';
import {ErrorMessage, Loader, Layout} from '..';
import {AjaxHelper, exportDataTable} from '../../util';

/**
 * @param WrappedComponent Object extends React.Component
 * @param config {{fetchFunc: function(), exportDimensionsFunc: function(benchmark: string, params: Object), [headerText]: string, [loadingText]: string}}
 * @returns Object extends React.Component
 */
export default function JmhChartPage(WrappedComponent, config) {
  if (!config.fetchFunc) {
    throw new Error('fetchFunc is not defined');
  }
  if (!config.exportDimensionsFunc) {
    throw new Error('exportDimensionsFunc is not defined');
  }

  return class extends React.Component {
    constructor(props) {
      super(props);

      const self = this;

      const ff = config.fetchFunc.bind(self);
      const ed = config.exportDimensionsFunc.bind(self);

      self.ajaxHelper = new AjaxHelper(
        this,
        ff,
        response => {
          this.setState({
            jmhList: exportDataTable(response.data, ed),
            warning: null
          });
        },
        reason => {
          console.log(reason);
          this.setState({
            warning: reason
          });
        }
      );

      this.state = {
        warning: null,
        jmhList: null
      };
    }

    render() {
      const {headerText, loadingText} = config;
      const {warning, jmhList} = this.state;

      return (
        <Layout title={headerText}>
          {warning && <ErrorMessage message="Failed to load chart data" error={[JSON.stringify(warning, null, 2)]}/>}
          {loadingText &&
          <Loader loading={this.ajaxHelper.isLoading()} content={loadingText}/>}
          <WrappedComponent
            jmhList={jmhList}
            refetch={this.fetchData}
            {...this.props}
          />
        </Layout>
      );
    }

    componentDidMount() {
      this.fetchData();
    }

    componentWillUnmount() {
      this.ajaxHelper.cancel();
    }

    fetchData = () => {
      this.ajaxHelper.doAction();
    }
  };
}
