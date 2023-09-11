"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[792],{3396:function(e,t,a){a.r(t);var n=a(2982),l=a(7294),r=a(1597),i=a(5224),o=a(4271),c=[{name:"Jackson (JSON)",value:"JSON"},{name:"Jackson (Cbor)",value:"CBOR"},{name:"Jackson (Smile)",value:"SMILE"},{name:"ScalaPb",value:"SCALA_PB"},{name:"ScalaPb (direct)",value:"SCALA_PB_DIRECT"},{name:"JavaPb",value:"JAVA_PB"},{name:"JavaThrift",value:"JAVA_THRIFT"},{name:"BooPickle",value:"BOOPICKLE"},{name:"Chill",value:"CHILL"},{name:"Jsoniter",value:"JSONITER"},{name:"uPickle JSON",value:"UPICKLE_JSON"},{name:"uPickle JSON pooled",value:"UPICKLE_POOLED_JSON"},{name:"uPickle MskPack",value:"UPICKLE_MSGPACK"},{name:"CapNProto",value:"CAP_N_PROTO"},{name:"CapNProto pooled",value:"CAP_N_PROTO_POOLED"}],s={title:"Converter",prop:"library",values:c.concat([{name:"Circe",value:"CIRCE"},{name:"JavaSerialization",value:"SERIALIZABLE"}])},u={title:"Converter",prop:"library",values:c},m={title:"JDK",prop:"jdk",values:i.Sy},d=[{name:"1K",value:1e3},{name:"2K",value:2e3},{name:"4K",value:4e3},{name:"8K",value:8e3},{name:"64K",value:64e3}],v=[{label:"parse + serialize",value:"both",default:!0},{label:"serialize only",value:"serialization"},{label:"parse only",value:"deserialization"}];function f(e){var t;return null===(t=v.find((function(t){return t.value===e})))||void 0===t?void 0:t.label}var p=function(e){return"/data/charts/scala-serialization-2022/"+e},h=(0,i.wZ)((function(e){var t=e.jmhList,a=(0,l.useState)(!1),n=a[0],o=a[1],c=(0,l.useState)(4e3),h=c[0],E=c[1],S=(0,l.useState)("both"),k=S[0],b=S[1],C=(0,l.useState)({func:null}),T=C[0],j=C[1],P=(0,l.useState)("openjdk-17"),y=P[0],O=P[1],z=function(e){return T.func(e)/1e3};return l.createElement("div",{className:"markdown"},l.createElement("h3",null,"Introduction"),l.createElement("p",null,"Here are benchmarking results for"," ",l.createElement(r.Link,{to:"/p/scala-serialization-2022"},"«Scala Serialization 2022»")," ","blog post. Graphs from the previous runs (2016-2018) are"," ",l.createElement(r.Link,{to:"/charts/scala-serialization"},"here"),"."),l.createElement("p",null,"The performance tests are performed via"," ",l.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6."),l.createElement("h3",null,"Misc"),l.createElement("ul",null,l.createElement("li",null,"Latest version of jsoniter doesn't work on openjdk-8."),l.createElement("li",null,"Java Serialization, circe and chill are by far the slowest. You may turn it off on charts to make it more readable.")),l.createElement("h3",null,"Charts"),l.createElement(i.V2,{label:"Data Size:",items:d.map((function(e){var t=e.name,a=e.value;return{label:t,value:a,default:4e3===a}})),onChange:function(e){return E(e)}}),l.createElement(i.V2,{label:"Action:",items:v,onChange:function(e){return b(e)}}),l.createElement(i.V2,{label:"Exclude slowest:",items:[{label:"No",value:!1,default:!0},{label:"Yes, please",value:!0}],onChange:function(e){return o(e)}}),l.createElement(i.J6,{onChange:function(e){return j({func:e})}}),l.createElement("h3",{id:"site"},"Site DTO"),l.createElement(i.We,{dataTable:t,extractor:z,filter:function(e){return"Site"===e.dataType&&e.action===k&&e.dataSize===h},title:"Times of "+f(k)+" for Site class (DTO), microseconds",xDesc:n?u:s,yDesc:m,options:{}}),l.createElement("h3",{id:"events"},"Events"),l.createElement(i.We,{dataTable:t,extractor:z,filter:function(e){return"Event"===e.dataType&&e.action===k&&e.dataSize===h},title:"Times of "+f(k)+" for list of Events, microseconds",xDesc:n?u:s,yDesc:m}),l.createElement("h3",{id:"progression"},"Progression depending on data size"),l.createElement("p",null,"It doesn't show anything unusual, which is a good sign."),l.createElement(i.V2,{label:"JDK:",items:(0,i.Jw)(i.Sy,(function(e,t){return 0===t})),onChange:function(e){return O(e)}}),l.createElement("h4",null,"Site DTO"),l.createElement(i.We,{chartType:"LineChart",dataTable:t,extractor:z,filter:function(e){return"Site"===e.dataType&&e.action===k&&e.jdk===y},title:"Times of "+f(k)+" for Site class (DTO), microseconds",xDesc:n?u:s,yDesc:{title:"Data Size",prop:"dataSize",values:[1e3,2e3,4e3,8e3,64e3]},options:{hAxis:{title:"Data Size, bytes"},vAxis:{title:"time, microseconds"}}}),l.createElement("h4",null,"Events"),l.createElement(i.We,{chartType:"LineChart",dataTable:t,extractor:z,filter:function(e){return"Event"===e.dataType&&e.action===k&&e.jdk===y},title:"Times of "+f(k)+" for list of Events, microseconds",xDesc:n?u:s,yDesc:{title:"Data Size",prop:"dataSize",values:[1e3,2e3,4e3,8e3,64e3],minValue:10},options:{hAxis:{title:"Data Size, bytes"},vAxis:{title:"time, microseconds"}}}),l.createElement("p",null,"Full JMH logs:",l.createElement("a",{href:p("jdk8.log.txt")},"openjdk-8"),","," ",l.createElement("a",{href:p("jdk11.log.txt")},"openjdk-11"),","," ",l.createElement("a",{href:p("jdk17.log.txt")},"openjdk-17"),"."))}),{fetchFunc:function(){return Promise.all([(0,o._l)(p("jdk8.json")),(0,o._l)(p("jdk11.json")),(0,o._l)(p("jdk17.json"))]).then((function(e){function t(t,a){var n=e[t].data;return n.forEach((function(e){return e.params=Object.assign({},e.params,{jdk:a})})),n}return{data:[].concat((0,n.Z)(t(0,"openjdk-8")),(0,n.Z)(t(1,"openjdk-11")),(0,n.Z)(t(2,"openjdk-17")))}}))},exportDimensionsFunc:function(e,t){var a=e.split("Benchmark."),n=a[0],l=a[1],r=a.slice(2);if(!l||r.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);var i=n.substring(n.lastIndexOf(".")+1).startsWith("Site")?"Site":"Event",o=1e3*parseInt((/_(\d+)_K/.exec(t.inputType)||[])[1],10);return{library:t.converterType,action:l,dataType:i,dataSize:o,jdk:t.jdk}},headerText:"Scala Serialization 2022 (Charts)"});t.default=h}}]);
//# sourceMappingURL=component---src-pages-charts-scala-serialization-2022-index-tsx-496226ee0120cedcdfa3.js.map