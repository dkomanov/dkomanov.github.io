"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[698],{4764:function(e,t,a){a.r(t);var n=a(4578),r=a(1597),i=a(7294),l=a(5224),o=a(4271),s={title:"Converter",prop:"library",values:[{name:"Json",value:"JSON"},{name:"Cbor",value:"CBOR"},{name:"ScalaPb",value:"SCALA_PB"},{name:"JavaPb",value:"JAVA_PB"},{name:"JavaThrift",value:"JAVA_THRIFT"},{name:"Scrooge",value:"SCROOGE"},{name:"BooPickle",value:"BOOPICKLE"},{name:"Chill",value:"CHILL"},{name:"Scrooge",value:"SCROOGE"},{name:"Circe",value:"CIRCE"},{name:"Pickling",value:"PICKLING"},{name:"JavaSerialization",value:"SERIALIZABLE"}],valuesForMax:["SCALA_PB","JAVA_PB","JAVA_THRIFT","SCROOGE","BOOPICKLE"]},c={title:"data size",prop:"dataSize",values:[{name:"1k",value:"_1_K"},{name:"2k",value:"_2_K"},{name:"4k",value:"_4_K"},{name:"8k",value:"_8_K"}]};function u(e){var t=0;return e.forEach((function(e){if(-1!==s.valuesForMax.indexOf(e[s.prop])&&function(e){return!!c.values.find((function(t){return t.value===e}))}(e[c.prop])){var a=e.pm.scorePercentiles["100.0"];t=Math.max(a,t)}})),t+t/100}var m=function(e){function t(){for(var t,a=arguments.length,n=new Array(a),r=0;r<a;r++)n[r]=arguments[r];return(t=e.call.apply(e,[this].concat(n))||this).handleRunChange=function(e){t.props.shared.currentRunDate=e,t.props.refetch()},t}return(0,n.Z)(t,e),t.prototype.render=function(){var e=this,t=(this.state||{}).extractor,a=this.props,n=a.jmhList,o=a.shared;return i.createElement("div",{className:"markdown"},i.createElement("h3",null,"Introduction"),i.createElement("p",null,"Here are present actual charts for performance comparison of serialization libraries for Scala for the corresponding article ",i.createElement(r.Link,{to:"/p/scala-serialization"},"«Scala Serialization»"),"."),i.createElement("p",null,"The legend for tests. «Site» is a data transfer object (DTO) with different types of data (lists, enums, regular fields). «Events» are the primitive representation of this DTO for Event Sourcing (many small objects). Data sizes (1k, 2k etc.) are the corresponding size of the DTO in JSON format."),i.createElement("p",null,"Please notice, that unlike the article, here the performance tests are performed via ",i.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH")," and using 2 threads. The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),i.createElement(l.Eg,{runs:o.runs,onChange:this.handleRunChange}),i.createElement("h3",null,"Charts"),i.createElement("ul",null,i.createElement("li",null,i.createElement("a",{href:"#site-both"},"Site Two-Way")),i.createElement("li",null,i.createElement("a",{href:"#events-both"},"Events Two-Way")),i.createElement("li",null,i.createElement("a",{href:"#site-serialization"},"Site Serialization")),i.createElement("li",null,i.createElement("a",{href:"#site-deserialization"},"Site Deserialization")),i.createElement("li",null,i.createElement("a",{href:"#events-serialization"},"Events Serialization")),i.createElement("li",null,i.createElement("a",{href:"#events-deserialization"},"Events Deserialization"))),i.createElement(l.J6,{onChange:function(t){return e.setState({extractor:t})}}),i.createElement("h3",{id:"site-both"},"Site Two-Way"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Site"===e.dataType&&"both"===e.action},title:"Two-way times for Site (DTO), nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("h3",{id:"events-both"},"Events Two-Way"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Event"===e.dataType&&"both"===e.action},title:"Two-way times for Events, nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("h3",{id:"site-serialization"},"Site Serialization"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Site"===e.dataType&&"serialization"===e.action},title:"Serialization times for Site (DTO), nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("h3",{id:"site-deserialization"},"Site Deserialization"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Site"===e.dataType&&"deserialization"===e.action},title:"Deserialization times for Site (DTO), nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("h3",{id:"events-serialization"},"Events Serialization"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Event"===e.dataType&&"serialization"===e.action},title:"Serialization times for Events, nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("h3",{id:"events-deserialization"},"Events Deserialization"),i.createElement(l.We,{dataTable:n,extractor:t,filter:function(e){return"Event"===e.dataType&&"deserialization"===e.action},title:"Deserialization times for Events, nanos",xDesc:s,yDesc:c,findMaxFunc:u}),i.createElement("p",null,"Full JMH log is ",i.createElement("a",{href:"/data/charts/scala-serialization/jmh_"+o.currentRunDate+".log.txt"},"here"),"."))},t}(i.Component);var h=(0,l.wZ)(m,{fetchFunc:function(){return(0,o._l)("/data/charts/scala-serialization/jmh_"+this.props.shared.currentRunDate+".json")},exportDimensionsFunc:function(e,t){var a=e.split("Benchmark."),n=a[0],r=a[1],i=a.slice(2);if(!r||i.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);var l=n.substring(n.lastIndexOf(".")+1);return{library:t.converterType,action:r,dataType:l,dataSize:t.inputType}},headerText:"Scala Serialization (Charts)"});t.default=function e(){return i.createElement(r.StaticQuery,{query:"308373640",render:function(t){var a=t.allMarkdownRemark.edges.map((function(e){var t=e.node;return{date:t.frontmatter.date.substring(0,10),comment:t.html}})),n={runs:a,currentRunDate:a[0].date};return i.createElement(h,Object.assign({shared:n},e))}})}}}]);
//# sourceMappingURL=component---src-pages-charts-scala-serialization-index-js-f9cbac41632bd6c2eb6e.js.map