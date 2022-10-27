"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[711],{1894:function(e,t,n){n.r(t);var a=n(1721),l=n(7294),r=n(5855),o=n(8e3),c=[{date:"2017-12-25",comment:l.createElement("ul",null,l.createElement("li",null,"Initial version of benchmark."))}],i=c[0].date,s={title:"Method",prop:"method",values:[{name:"Charset.decode",value:"charset"},{name:"localMethods",value:"localMethodsScala"},{name:"localMethodsIndices",value:"localMethodsIndices"},{name:"sequentialLoop (Scala)",value:"sequentialLoopScala"},{name:"sequentialLoop (Java)",value:"sequentialLoopJava"},{name:"changeIndexInsideLoop (Scala)",value:"changeIndexInsideLoopScala"},{name:"changeIndexInsideLoop (Java)",value:"changeIndexInsideLoopJava"},{name:"changeIndexInsideLoopByteMagic (Scala)",value:"changeIndexInsideLoopByteMagicScala"},{name:"changeIndexInsideLoopByteMagic (Java)",value:"changeIndexInsideLoopByteMagicJava"}]},h={title:"Line Length",prop:"lineLength",values:[0,1,2,5,10,100,1e4].map((function(e){return e.toString(10)}))},u=function(e){function t(t){var n;return(n=e.call(this,t)||this).items=[{label:"ASCII only",value:"ASCII"},{label:"Single char only",value:"SINGLE_CHAR_ONLY"},{label:"All chars",value:"MIXED",default:!0}],n}return(0,a.Z)(t,e),t.prototype.render=function(){var e=this.props.onChange;return l.createElement(r.V2,{label:"Characters: ",onChange:e,items:this.items})},t}(l.Component),p=function(e){function t(t){var n;return(n=e.call(this,t)||this).handleRunChange=function(e){i=e,n.props.refetch()},n.state={},n}return(0,a.Z)(t,e),t.prototype.render=function(){var e=this,t=this.state,n=t.extractor,a=t.inputType,o=t.show10k,p=this.props.jmhList;return l.createElement("div",{class:"markdown"},l.createElement("h3",null,"Introduction"),l.createElement("p",null,"The legend for tests. «Line Length» is amount of Unicode-symbols (do not confuse with char),"," ","«Characters» is typo of characters in string: ASCII (single byte for UTF-8), single chars only"," ","(all symbols represented as a single char) and all chars."),l.createElement("p",null,"Please notice, that unlike the article, here the performance tests are performed via ",l.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH"),". The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),l.createElement(r.Eg,{runs:c,onChange:this.handleRunChange}),l.createElement(r.J6,{onChange:function(t){return e.setState({extractor:t})}}),l.createElement(u,{onChange:function(t){return e.setState({inputType:t})}}),l.createElement(r.V2,{label:"Show 10k",items:[{label:"Yes",value:!0},{label:"No",value:!1,default:!0}],onChange:function(t){return e.setState({show10k:t})}}),l.createElement("h3",null,"Chart"),l.createElement(r.We,{chartType:"Bar",dataTable:p,extractor:n,filter:function(e){return e.inputType===a&&("10000"!==e.lineLength||o)},title:"time, nanos",xDesc:s,yDesc:h}),l.createElement("p",null,"Full JMH log is ",l.createElement("a",{href:"/data/charts/read-utf8/jmh_"+i+".log.txt"},"here"),"."))},t}(l.Component);var d=(0,r.wZ)(p,{fetchFunc:function(){return(0,o._l)("/data/charts/read-utf8/jmh_"+i+".json")},exportDimensionsFunc:function(e,t){var n=e.split("ReadUtf8Benchmark."),a=n[1],l=n.slice(2);if(!a||l.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);return{method:a,inputType:t.inputType,lineLength:t.lineLength}},headerText:"Exploring UTF-8 Decoding Performance (Charts)"});t.default=d}}]);
//# sourceMappingURL=component---src-pages-charts-read-utf-8-index-js-27ccdae8dc5388b9b5d0.js.map