(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{CIIA:function(e,t,a){"use strict";a.r(t);var r=a("Wbzz"),n=a("q1tI"),o=a.n(n),i=a("Kvkj"),l=a("QmAe");var s={title:"Method",prop:"name",values:["javaConcat","stringFormat","messageFormat","scalaConcat","concatOptimized1","concatOptimized2","concatOptimizedMacros","slf4j","sInterpolator","fInterpolator","rawInterpolator","sfiInterpolator"]},c={title:"string length",prop:"dataSize",values:[{name:"tiny (7)",value:"Tiny"},{name:"very short (17)",value:"VeryShort"},{name:"short (29)",value:"Short"},{name:"medium (75)",value:"Medium"},{name:"long (212)",value:"Long"},{name:"very long (1004)",value:"VeryLong"},{name:"very long size miss (1006)",value:"VeryLongSizeMiss"}]},m=function(e){var t,a;function n(){return e.apply(this,arguments)||this}return a=e,(t=n).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a,n.prototype.render=function(){var e=this,t=(this.state||{}).extractor,a=this.props.jmhList;return o.a.createElement("div",null,o.a.createElement("h3",null,"Introduction"),o.a.createElement("p",null,"Here are present actual charts for performance comparison of string formatting in Java/Scala for the corresponding"," ","post ",o.a.createElement(r.Link,{to:"/p/scala-string-interpolation-performance"},"«Scala: String Interpolation Performance»"),"."),o.a.createElement("p",null,"The legend for tests. «String length» is a length of a result string (after formatting)."),o.a.createElement("p",null,"Tests performed via ",o.a.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH"),", 2 forks, 3 warmup runs and 7 iteration (3 seconds each). Ubuntu 16.04, linux-kernel 4.4.0-51-generic, JDK 1.8.0_91, scala library 2.12. The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),o.a.createElement("h3",null,"Chart"),o.a.createElement(i.r,{onChange:function(t){return e.setState({extractor:t})}}),o.a.createElement(i.d,{dataTable:a,extractor:t,filter:function(e){return!!e.dataSize},title:"String formatting times, nanos",xDesc:s,yDesc:c}),o.a.createElement("p",null,"Full JMH log is ",o.a.createElement("a",{href:"/data/charts/scala-string-format/jmh.log"},"here"),"."))},n}(o.a.Component);var p=Object(i.h)(m,{fetchFunc:function(){return Object(l.e)("/data/charts/scala-string-format/jmh-result.json")},exportDimensionsFunc:function(e,t){var a=e.lastIndexOf(".");if(-1===a)throw new Error("Expected a dot in a benchmark: "+e);return{name:e.substring(a+1),dataSize:t&&t.arg}},headerText:"Scala: String Interpolation Performance (Charts)"});t.default=p}}]);
//# sourceMappingURL=component---src-pages-charts-scala-string-format-index-js-2bafefd684a52b7da642.js.map