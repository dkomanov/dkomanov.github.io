"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[815],{2695:function(e,a,t){t.r(a);var n=t(5785),l=t(7294),r=t(1597),o=t(9690),s=t(4271),c=["2.12","2.13"],u=function(e){return{title:"Collection",prop:"method",values:[{name:"java.util.Hash"+e,value:"java"+e},{name:"WrappedHash"+e,value:"javaWrapped"+e},{name:"immutable."+e,value:"scala"+e},{name:"mutable."+e,value:"scalaMutable"+e}]}},i={title:"JDK",prop:"jdk",values:["openjdk-17","openjdk-11","openjdk-8"]},p={title:"scala version",prop:"scala",values:c};var m=function(e,a){return"/data/charts/set-map-java-vs-scala-"+e+"/"+a},f=(0,o.wZ)((function(e){var a=e.jmhList,t=(0,l.useState)("2.13"),n=t[0],s=t[1],f=(0,l.useState)("1000000"),d=f[0],h=f[1],k=(0,l.useState)({func:null}),j=k[0],v=k[1];return l.createElement("div",{className:"markdown"},l.createElement("h3",null,"Introduction"),l.createElement("p",null,"Here are benchmarking results for"," ",l.createElement(r.Link,{to:"/p/map-performance-java-vs-scala"},"«Map Performance: Java vs Scala»")," ","blog post."),l.createElement("p",null,"The performance tests are performed via"," ",l.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM."),l.createElement("h3",null,"Charts"),l.createElement(o.V2,{label:"Collection size:",items:[{label:"1000",value:"1000"},{label:"10000",value:"10000"},{label:"100000",value:"100000"},{label:"1000000",value:"1000000",default:!0}],onChange:function(e){return h(e)}}),l.createElement(o.V2,{label:"Scala version:",items:c.map((function(e){return{label:e,value:e,default:"2.13"===e}})),onChange:function(e){return s(e)}}),l.createElement(o.J6,{onChange:function(e){return v({func:e})}}),l.createElement("h4",null,"Map Lookup Performance"),l.createElement("p",null,"Benchmarks for java.util.HashMap vs Map.asJava vs immutable.Map vs mutable.Map."),l.createElement("h5",null,"openjdk-17: 2.12 vs 2.13"),l.createElement("p",null,"Comparing performance of Map between scala 2.12 and 2.13, using openjdk-17."),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return"hit"===e.what&&e.size===d},title:"Map successful lookup (hit) -- openjdk-17, nanos",xDesc:u("Map"),yDesc:p}),l.createElement("h5",null,"All JDKs"),l.createElement("p",null,"Comparing performance of Map for different versions of JDK: openjdk-8 vs openjdk-11 vs openjdk-17. Use switcher above to change scala version."),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return e.scala===n&&"hit"===e.what&&e.size===d},title:"Map successful lookup (hit), nanos",xDesc:u("Map"),yDesc:i}),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return e.scala===n&&"miss"===e.what&&e.size===d},title:"Map failed lookup (miss), nanos",xDesc:u("Map"),yDesc:i}),l.createElement("h4",null,"Set Lookup Performance"),l.createElement("p",null,"Same benchmark but for Set. Notice that HashSet internally uses HashMap, so the performance, supposedly, should be the same."),l.createElement("h5",null,"openjdk-17: 2.12 vs 2.13"),l.createElement("p",null,"Comparing performance of Set between scala 2.12 and 2.13, using openjdk-17."),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return"hit"===e.what&&e.size===d},title:"Set successful lookup (hit) -- openjdk-17, nanos",xDesc:u("Set"),yDesc:p}),l.createElement("h5",null,"All JDKs"),l.createElement("p",null,"Comparing performance of Set for different versions of JDK: openjdk-8 vs openjdk-11 vs openjdk-17. Use switcher above to change scala version."),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return e.scala===n&&"hit"===e.what&&e.size===d},title:"Set successful lookup (hit), nanos",xDesc:u("Set"),yDesc:i}),l.createElement(o.We,{dataTable:a,extractor:j.func,filter:function(e){return e.scala===n&&"miss"===e.what&&e.size===d},title:"Set failed lookup (miss), nanos",xDesc:u("Set"),yDesc:i}),l.createElement("p",null,"Full JMH logs:",l.createElement("a",{href:m("2-12","jdk8.log.txt")},"openjdk-8 (scala 2.12)"),","," ",l.createElement("a",{href:m("2-12","jdk11.log.txt")},"openjdk-11 (scala 2.12)"),","," ",l.createElement("a",{href:m("2-12","jdk17.log.txt")},"openjdk-17 (scala 2.12)"),","," ",l.createElement("a",{href:m("2-13","jdk8.log.txt")},"openjdk-8 (scala 2.13)"),","," ",l.createElement("a",{href:m("2-13","jdk11.log.txt")},"openjdk-11 (scala 2.13)"),","," ",l.createElement("a",{href:m("2-13","jdk17.log.txt")},"openjdk-17 (scala 2.13)"),"."))}),{fetchFunc:function(){return Promise.all([(0,s._l)(m("2-12","jdk8.json")),(0,s._l)(m("2-12","jdk11.json")),(0,s._l)(m("2-12","jdk17.json")),(0,s._l)(m("2-13","jdk8.json")),(0,s._l)(m("2-13","jdk11.json")),(0,s._l)(m("2-13","jdk17.json"))]).then((function(e){function a(a,t,n){var l=e[a].data;return l.forEach((function(e){return e.params=Object.assign({jdk:t,scala:n},e.params)})),l}return{data:[].concat((0,n.Z)(a(0,"openjdk-8","2.12")),(0,n.Z)(a(1,"openjdk-11","2.12")),(0,n.Z)(a(2,"openjdk-17","2.12")),(0,n.Z)(a(3,"openjdk-8","2.13")),(0,n.Z)(a(4,"openjdk-11","2.13")),(0,n.Z)(a(5,"openjdk-17","2.13")))}}))},exportDimensionsFunc:function(e,a){var t=e.substring(e.lastIndexOf(".")+1),n=t.endsWith("Hit"),l=t.substring(0,t.length-(n?3:4));return Object.assign({method:l,what:n?"hit":"miss"},a)},headerText:"Set/Map lookup performance: Java vs Scala (Charts)"});a.default=f}}]);
//# sourceMappingURL=component---src-pages-charts-set-map-java-vs-scala-index-tsx-fc2e745efd99a802fb62.js.map