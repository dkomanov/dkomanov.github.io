"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[842],{214:function(e,t,a){a.r(t);var r=a(1721),n=a(5444),o=a(7294),i=a(8807),l=a(8e3),s={title:"Method",prop:"name",values:["javaConcat","stringFormat","messageFormat","scalaConcat","concatOptimized1","concatOptimized2","concatOptimizedMacros","slf4j","sInterpolator","fInterpolator","rawInterpolator","sfiInterpolator"]},c={title:"string length",prop:"dataSize",values:[{name:"tiny (7)",value:"Tiny"},{name:"very short (17)",value:"VeryShort"},{name:"short (29)",value:"Short"},{name:"medium (75)",value:"Medium"},{name:"long (212)",value:"Long"},{name:"very long (1004)",value:"VeryLong"},{name:"very long size miss (1006)",value:"VeryLongSizeMiss"}]},m=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){var e=this,t=(this.state||{}).extractor,a=this.props.jmhList;return o.createElement("div",{className:"markdown"},o.createElement("h3",null,"Introduction"),o.createElement("p",null,"Here are present actual charts for performance comparison of string formatting in Java/Scala for the corresponding"," ","post ",o.createElement(n.Link,{to:"/p/scala-string-interpolation-performance"},"«Scala: String Interpolation Performance»"),"."),o.createElement("p",null,"The legend for tests. «String length» is a length of a result string (after formatting)."),o.createElement("p",null,"Tests performed via ",o.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH"),", 2 forks, 3 warmup runs and 7 iteration (3 seconds each). Ubuntu 16.04, linux-kernel 4.4.0-51-generic, JDK 1.8.0_91, scala library 2.12. The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),o.createElement("h3",null,"Chart"),o.createElement(i.J6,{onChange:function(t){return e.setState({extractor:t})}}),o.createElement(i.We,{dataTable:a,extractor:t,filter:function(e){return!!e.dataSize},title:"String formatting times, nanos",xDesc:s,yDesc:c}),o.createElement("p",null,"Full JMH log is ",o.createElement("a",{href:"/data/charts/scala-string-format/jmh.log"},"here"),"."))},t}(o.Component);var u=(0,i.wZ)(m,{fetchFunc:function(){return(0,l._l)("/data/charts/scala-string-format/jmh-result.json")},exportDimensionsFunc:function(e,t){var a=e.lastIndexOf(".");if(-1===a)throw new Error("Expected a dot in a benchmark: "+e);return{name:e.substring(a+1),dataSize:t&&t.arg}},headerText:"Scala: String Interpolation Performance (Charts)"});t.default=u}}]);
//# sourceMappingURL=component---src-pages-charts-scala-string-format-index-js-5198b9a41b4bfd420952.js.map