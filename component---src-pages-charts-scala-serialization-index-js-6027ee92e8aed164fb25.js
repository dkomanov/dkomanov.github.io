(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{389:function(e,a,t){"use strict";t.r(a);t(12),t(35),t(3),t(117);var n=t(396),i=t(14),r=t(0),l=t.n(r),o=t(377),s=t(80);var c={title:"Converter",prop:"library",values:[{name:"Json",value:"JSON"},{name:"Cbor",value:"CBOR"},{name:"ScalaPb",value:"SCALA_PB"},{name:"JavaPb",value:"JAVA_PB"},{name:"JavaThrift",value:"JAVA_THRIFT"},{name:"Scrooge",value:"SCROOGE"},{name:"BooPickle",value:"BOOPICKLE"},{name:"Chill",value:"CHILL"},{name:"Scrooge",value:"SCROOGE"},{name:"Circe",value:"CIRCE"},{name:"Pickling",value:"PICKLING"},{name:"JavaSerialization",value:"SERIALIZABLE"}],valuesForMax:["SCALA_PB","JAVA_PB","JAVA_THRIFT","SCROOGE","BOOPICKLE"]},u={title:"data size",prop:"dataSize",values:[{name:"1k",value:"_1_K"},{name:"2k",value:"_2_K"},{name:"4k",value:"_4_K"},{name:"8k",value:"_8_K"}]};function h(e){var a=0;return e.forEach((function(e){if(-1!==c.valuesForMax.indexOf(e[c.prop])&&function(e){return!!u.values.find((function(a){return a.value===e}))}(e[u.prop])){var t=e.pm.scorePercentiles["100.0"];a=Math.max(t,a)}})),a+a/100}var d=function(e){var a,t;function n(){for(var a,t=arguments.length,n=new Array(t),i=0;i<t;i++)n[i]=arguments[i];return(a=e.call.apply(e,[this].concat(n))||this).handleRunChange=function(e){a.props.shared.currentRunDate=e,a.props.refetch()},a}return t=e,(a=n).prototype=Object.create(t.prototype),a.prototype.constructor=a,a.__proto__=t,n.prototype.render=function(){var e=this,a=(this.state||{}).extractor,t=this.props,n=t.jmhList,r=t.shared;return l.a.createElement("div",null,l.a.createElement("h3",null,"Introduction"),l.a.createElement("p",null,"Here are present actual charts for performance comparison of serialization libraries for Scala for the corresponding article ",l.a.createElement(i.Link,{to:"/p/scala-serialization"},"«Scala Serialization»"),"."),l.a.createElement("p",null,"The legend for tests. «Site» is a data transfer object (DTO) with different types of data (lists, enums, regular fields). «Events» are the primitive representation of this DTO for Event Sourcing (many small objects). Data sizes (1k, 2k etc.) are the corresponding size of the DTO in JSON format."),l.a.createElement("p",null,"Please notice, that unlike the article, here the performance tests are performed via ",l.a.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH")," and using 2 threads. The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),l.a.createElement(o.c,{runs:r.runs,onChange:this.handleRunChange}),l.a.createElement("h3",null,"Charts"),l.a.createElement("ul",null,l.a.createElement("li",null,l.a.createElement("a",{href:"#site-both"},"Site Two-Way")),l.a.createElement("li",null,l.a.createElement("a",{href:"#events-both"},"Events Two-Way")),l.a.createElement("li",null,l.a.createElement("a",{href:"#site-serialization"},"Site Serialization")),l.a.createElement("li",null,l.a.createElement("a",{href:"#site-deserialization"},"Site Deserialization")),l.a.createElement("li",null,l.a.createElement("a",{href:"#events-serialization"},"Events Serialization")),l.a.createElement("li",null,l.a.createElement("a",{href:"#events-deserialization"},"Events Deserialization"))),l.a.createElement(o.r,{onChange:function(a){return e.setState({extractor:a})}}),l.a.createElement("h3",{id:"site-both"},"Site Two-Way"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Site"===e.dataType&&"both"===e.action},title:"Two-way times for Site (DTO), nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("h3",{id:"events-both"},"Events Two-Way"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Event"===e.dataType&&"both"===e.action},title:"Two-way times for Events, nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("h3",{id:"site-serialization"},"Site Serialization"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Site"===e.dataType&&"serialization"===e.action},title:"Serialization times for Site (DTO), nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("h3",{id:"site-deserialization"},"Site Deserialization"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Site"===e.dataType&&"deserialization"===e.action},title:"Deserialization times for Site (DTO), nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("h3",{id:"events-serialization"},"Events Serialization"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Event"===e.dataType&&"serialization"===e.action},title:"Serialization times for Events, nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("h3",{id:"events-deserialization"},"Events Deserialization"),l.a.createElement(o.d,{dataTable:n,extractor:a,filter:function(e){return"Event"===e.dataType&&"deserialization"===e.action},title:"Deserialization times for Events, nanos",xDesc:c,yDesc:u,findMaxFunc:h}),l.a.createElement("p",null,"Full JMH log is ",l.a.createElement("a",{href:"/data/charts/scala-serialization/jmh_"+r.currentRunDate+".log.txt"},"here"),"."))},n}(l.a.Component);var m=Object(o.h)(d,{fetchFunc:function(){return Object(s.e)("/data/charts/scala-serialization/jmh_"+this.props.shared.currentRunDate+".json")},exportDimensionsFunc:function(e,a){var t=e.split("Benchmark."),n=t[0],i=t[1],r=t.slice(2);if(!i||r.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);var l=n.substring(n.lastIndexOf(".")+1);return{library:a.converterType,action:i,dataType:l,dataSize:a.inputType}},headerText:"Scala Serialization (Charts)"});a.default=function(e){return l.a.createElement(i.StaticQuery,{query:"3669402259",render:function(a){var t=a.allMarkdownRemark.edges.map((function(e){var a=e.node;return{date:a.fileAbsolutePath.substr(a.fileAbsolutePath.lastIndexOf("/")+1,10),comment:a.html}})),n={runs:t,currentRunDate:t[0].date};return l.a.createElement(m,Object.assign({shared:n},e))},data:n})}},396:function(e){e.exports=JSON.parse('{"data":{"allMarkdownRemark":{"edges":[{"node":{"fileAbsolutePath":"/home/travis/build/dkomanov/dkomanov.github.io/src/pages/charts/scala-serialization/2018-04-08.md","html":"<ul>\\n<li>Major upgrade to scala 2.12.4.</li>\\n<li>Add <a href=\\"https://github.com/FasterXML/jackson-dataformats-binary/tree/master/cbor\\">CBOR</a> data format (via Jackson)</li>\\n<li>Upgrade versions of libraries: jackson (2.9.5), protobuf (3.4.0), boopickle (1.3.0), chill (0.9.2).</li>\\n<li>Downgrade: protobuf (3.1.0).</li>\\n<li>Fixed Chill threading via state per thread (no penalty for clone for it).</li>\\n<li>Remove circe (failed to compile).</li>\\n</ul>"}},{"node":{"fileAbsolutePath":"/home/travis/build/dkomanov/dkomanov.github.io/src/pages/charts/scala-serialization/2017-12-01.md","html":"<ul>\\n<li>Introduced benchmark for <a href=\\"https://github.com/circe/circe\\">Circe</a> library.</li>\\n<li>Downgrade versions (because using bazel rules): scrooge (4.6.0).</li>\\n<li>Upgrade versions of libraries: scala-library (2.11.8), jackson (2.9.1), protobuf (3.4.0),\\nscalapb (0.6.5), boopickle (1.2.5), chill (0.9.2).</li>\\n<li>Fixed issue with Chill by cloning input array (therefore it’s time of Chill + array clone).</li>\\n</ul>"}},{"node":{"fileAbsolutePath":"/home/travis/build/dkomanov/dkomanov.github.io/src/pages/charts/scala-serialization/2016-06-26.md","html":"<ul>\\n<li>Initial version of benchmark.</li>\\n<li>Libraries: scala-library (2.11.7), jackson (2.7.3), protobuf (3.0.0-beta-2), scalapb (0.5.31),\\nscala-pickling (0.11.0-M2), boopickle (1.2.4), chill (0.8.0), libthrift (0.9.1), scrooge (4.7.0).</li>\\n<li>Chill failed with ”Buffer underflow” exception on only-deserialization benchmarks,\\nbecause of <a href=\\"https://github.com/twitter/chill/issues/181\\">bug</a>.</li>\\n</ul>"}}]}}}')}}]);
//# sourceMappingURL=component---src-pages-charts-scala-serialization-index-js-6027ee92e8aed164fb25.js.map