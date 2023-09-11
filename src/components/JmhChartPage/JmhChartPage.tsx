import React from 'react';
import { ErrorMessage, Loader, Layout } from '..';
import { AjaxHelper, CancelablePromise, exportDataTable } from '../../util';
import { JmhDimensions } from '../../util/jmh';

interface JmhChartPageConfig {
  fetchFunc: () => Promise<any> | CancelablePromise;
  exportDimensionsFunc: (benchmark: string, params: any) => any;
  headerText?: string;
  loadingText?: string;
}

interface JmhChartPageState {
  jmhList: JmhDimensions[] | null;
  warning?: any | null;
}

export interface JmhChartComponentProps {
  jmhList: JmhDimensions[] | null;
  refetch: () => void;
}

export default function JmhChartPage(
  WrappedComponent:
    | React.Component<JmhChartComponentProps, any, any>
    | React.FunctionComponent<JmhChartComponentProps>,
  config: JmhChartPageConfig
) {
  if (!config.fetchFunc) {
    throw new Error('fetchFunc is not defined');
  }
  if (!config.exportDimensionsFunc) {
    throw new Error('exportDimensionsFunc is not defined');
  }

  return class extends React.Component<any, JmhChartPageState> {
    private ajaxHelper: AjaxHelper;

    constructor(props: any) {
      super(props);

      const ff = config.fetchFunc.bind(this);
      const ed = config.exportDimensionsFunc.bind(this);

      this.ajaxHelper = new AjaxHelper(
        this,
        ff,
        (response) => {
          this.setState({
            jmhList: exportDataTable(response.data, ed),
            warning: null,
          });
        },
        (reason) => {
          console.log(reason);
          this.setState({
            warning: reason,
          });
        }
      );

      this.state = {
        warning: null,
        jmhList: null,
      };
    }

    render() {
      const { headerText, loadingText } = config;
      const { warning, jmhList } = this.state;

      return (
        <Layout title={headerText}>
          {warning && (
            <ErrorMessage
              message="Failed to load chart data"
              error={[JSON.stringify(warning, null, 2)]}
            />
          )}
          {loadingText && (
            <Loader
              loading={this.ajaxHelper.isLoading()}
              content={loadingText}
            />
          )}
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
    };
  };
}
