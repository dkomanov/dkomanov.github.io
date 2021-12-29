import {graphql, Link, StaticQuery} from 'gatsby';
import React from 'react';
import {Changelog, ChartAndTable, JmhChartPage, TimeUnits} from '../../../components';
import {loadJson} from '../../../util';

const xDesc = {
  title: 'Converter',
  prop: 'library',
  values: [
    {
      name: 'Json',
      value: 'JSON',
    },
    {
      name: 'Cbor',
      value: 'CBOR',
    },
    {
      name: 'ScalaPb',
      value: 'SCALA_PB',
    },
    {
      name: 'JavaPb',
      value: 'JAVA_PB',
    },
    {
      name: 'JavaThrift',
      value: 'JAVA_THRIFT',
    },
    {
      name: 'Scrooge',
      value: 'SCROOGE',
    },
    {
      name: 'BooPickle',
      value: 'BOOPICKLE',
    },
    {
      name: 'Chill',
      value: 'CHILL',
    },
    {
      name: 'Scrooge',
      value: 'SCROOGE',
    },
    {
      name: 'Circe',
      value: 'CIRCE',
    },
    {
      name: 'Pickling',
      value: 'PICKLING',
    },
    {
      name: 'JavaSerialization',
      value: 'SERIALIZABLE',
    },
  ],
  valuesForMax: ['SCALA_PB', 'JAVA_PB', 'JAVA_THRIFT', 'SCROOGE', 'BOOPICKLE'],
};

const yDesc = {
  title: 'data size',
  prop: 'dataSize',
  values: [
    {
      name: '1k',
      value: '_1_K',
    },
    {
      name: '2k',
      value: '_2_K',
    },
    {
      name: '4k',
      value: '_4_K',
    },
    {
      name: '8k',
      value: '_8_K',
    },
  ],
};

function yDescContainValue(v) {
  return !!yDesc.values.find(({value}) => value === v);
}

function findMax(data) {
  let max = 0;

  data.forEach(v => {
    if (xDesc.valuesForMax.indexOf(v[xDesc.prop]) !== -1 && yDescContainValue(v[yDesc.prop])) {
      const value = v.pm.scorePercentiles['100.0'];
      max = Math.max(value, max);
    }
  });
  const onePercentOfMax = max / 100;
  return max + onePercentOfMax;
}

class ScalaSerializationImpl extends React.Component {
  render() {
    const {extractor} = this.state || {};
    const {jmhList, shared} = this.props;

    return (
      <div className="markdown">
        <h3>Introduction</h3>

        <p>
          Here are present actual charts for performance comparison of serialization libraries for Scala for the corresponding
          article <Link to="/p/scala-serialization">&laquo;Scala Serialization&raquo;</Link>.
        </p>

        <p>
          The legend for tests. &laquo;Site&raquo; is a data transfer object (DTO) with different types of data
          (lists, enums, regular fields). &laquo;Events&raquo; are the primitive representation of this DTO for
          Event Sourcing (many small objects). Data sizes (1k, 2k etc.) are the corresponding size of the DTO in JSON format.
        </p>

        <p>
          Please notice, that unlike the article, here the performance tests are performed
          via <a href="http://openjdk.java.net/projects/code-tools/jmh/">JMH</a> and using 2 threads.
          The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM.
        </p>

        <Changelog runs={shared.runs} onChange={this.handleRunChange}/>

        <h3>Charts</h3>

        <ul>
          <li><a href="#site-both">Site Two-Way</a></li>
          <li><a href="#events-both">Events Two-Way</a></li>
          <li><a href="#site-serialization">Site Serialization</a></li>
          <li><a href="#site-deserialization">Site Deserialization</a></li>
          <li><a href="#events-serialization">Events Serialization</a></li>
          <li><a href="#events-deserialization">Events Deserialization</a></li>
        </ul>

        <TimeUnits onChange={extractor => this.setState({extractor})}/>

        <h3 id="site-both">Site Two-Way</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Site' && d.action === 'both'}
          title="Two-way times for Site (DTO), nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <h3 id="events-both">Events Two-Way</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Event' && d.action === 'both'}
          title="Two-way times for Events, nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <h3 id="site-serialization">Site Serialization</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Site' && d.action === 'serialization'}
          title="Serialization times for Site (DTO), nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <h3 id="site-deserialization">Site Deserialization</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Site' && d.action === 'deserialization'}
          title="Deserialization times for Site (DTO), nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <h3 id="events-serialization">Events Serialization</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Event' && d.action === 'serialization'}
          title="Serialization times for Events, nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <h3 id="events-deserialization">Events Deserialization</h3>

        <ChartAndTable
          dataTable={jmhList}
          extractor={extractor}
          filter={d => d.dataType === 'Event' && d.action === 'deserialization'}
          title="Deserialization times for Events, nanos"
          xDesc={xDesc}
          yDesc={yDesc}
          findMaxFunc={findMax}
        />

        <p>
          Full JMH log is <a href={`/data/charts/scala-serialization/jmh_${shared.currentRunDate}.log.txt`}>here</a>.
        </p>

      </div>
    );
  }

  handleRunChange = date => {
    this.props.shared.currentRunDate = date;
    this.props.refetch();
  };
}

function exportDimensions(benchmark, params) {
  //'com.komanov.serialization.jmh.EventBenchmark.both'

  const [dataTypePart, action, ...otherBenchmark] = benchmark.split('Benchmark.');
  if (!action || otherBenchmark.length > 0) {
    throw new Error('Expected 2 parts in a benchmark: ' + benchmark);
  }

  const dataType = dataTypePart.substring(dataTypePart.lastIndexOf('.') + 1);

  return {
    library: params.converterType,
    action,
    dataType,
    dataSize: params.inputType,
  };
}

const ScalaSerialization = JmhChartPage(
  ScalaSerializationImpl,
  {
    // function is important, by some reason () => {} doesn't work - can't bind this :(
    fetchFunc: function () {
      return loadJson(`/data/charts/scala-serialization/jmh_${this.props.shared.currentRunDate}.json`);
    },
    exportDimensionsFunc: exportDimensions,
    headerText: 'Scala Serialization (Charts)',
  },
);

//export default ScalaSerialization;

const props = () => (
  <StaticQuery
    query={graphql`
query ScalaSerializationQuery {
  allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/charts/scala-serialization/"}},
    sort: { fields: frontmatter___date, order: DESC }
  ) {
    edges {
      node {
        frontmatter {
          date
        }
        html
      }
    }
  }
}
    `}
    render={(data) => {
      const runs = data.allMarkdownRemark.edges.map(({node}) => {
        return {
          date: node.frontmatter.date.substring(0, 10),
          comment: node.html,
        };
      });

      const shared = {
        runs,
        currentRunDate: runs[0].date,
      };

      return (
        <ScalaSerialization shared={shared} {...props}/>
      );
    }}
  />
);

export default props;