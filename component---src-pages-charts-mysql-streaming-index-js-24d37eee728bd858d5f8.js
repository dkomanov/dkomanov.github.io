"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[632],{5030:function(e,t,n){n.r(t);var r=n(1721),i=n(7294),a=n(5855),o=n(8e3),s={title:"Method",prop:"method",values:["ConnectorJ.atOnce","ConnectorJ.stream","MariaDb.atOnce","MariaDb.stream"]},l={title:"limit",prop:"limit",values:[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900,1e3]},c=function(e){function t(t){var n;return(n=e.call(this,t)||this).items=[{label:"local",value:"local"},{label:"bad network (Wi-Fi)",value:"wifi"},{label:"good network (Wire)",value:"wire",default:!0},{label:"strange",value:"strange"}],n}return(0,r.Z)(t,e),t.prototype.render=function(){var e=this.props.onChange;return i.createElement(a.V2,{label:"Environment: ",onChange:e,items:this.items})},t}(i.Component);function m(e,t){for(var n=[],r=0;r<=t;r+=e)n.push(r);return n}var u=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={extractor:null,environment:"wire"},n.limitsBelow100Options={legend:{position:"bottom"},focusTarget:"category",hAxis:{title:"row count",ticks:m(10,100)},vAxis:{title:"time, microseconds",format:"short",viewWindow:{min:0}}},n.limitsBelow1kOptions=JSON.parse(JSON.stringify(n.limitsBelow100Options)),n.limitsBelow1kOptions.hAxis.ticks=m(100,1e3),n}return(0,r.Z)(t,e),t.prototype.render=function(){var e=this,t=this.state,n=t.extractor,r=t.environment,o=this.props.jmhList;return i.createElement("div",{class:"markdown"},i.createElement("h3",null,"Introduction"),i.createElement("p",null,"The performance tests are performed via ",i.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH"),". The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),i.createElement("h3",null,"Charts"),i.createElement(c,{onChange:function(t){return e.setState({environment:t})}}),i.createElement(a.J6,{onChange:function(t){return e.setState({extractor:t})}}),i.createElement("h3",{id:"below-100"},"LIMIT below 100"),i.createElement(a.We,{chartType:"LineChart",dataTable:o,extractor:n,filter:function(e){return e.environment===r&&e.limit<=100},title:"LIMIT below 100, microseconds",xDesc:s,yDesc:l,options:this.limitsBelow100Options}),i.createElement("h3",{id:"all-drivers"},"All LIMITs"),i.createElement(a.We,{chartType:"LineChart",dataTable:o,extractor:n,filter:function(e){return e.environment===r&&e.limit<=1e3},title:"All LIMITs, microseconds",xDesc:s,yDesc:l,options:this.limitsBelow1kOptions}))},t}(i.Component);function h(e){var t=[];return e.forEach((function(e){return e.forEach((function(e){return t.push(e)}))})),t}var f=(0,a.wZ)(u,{fetchFunc:function(){return Promise.all([(0,o._l)("/data/charts/mysql-streaming/jmh-results-local.json"),(0,o._l)("/data/charts/mysql-streaming/jmh-results-wifi.json"),(0,o._l)("/data/charts/mysql-streaming/jmh-results-wire.json"),(0,o._l)("/data/charts/mysql-streaming/jmh-results-strange.json")]).then((function(e){function t(t,n){var r=h(e[t].data);return r.forEach((function(e){return e.params.environment=n})),r}return{data:h([t(0,"local"),t(1,"wifi"),t(2,"wire"),t(3,"strange")])}}))},exportDimensionsFunc:function(e,t){var n=e.split("Benchmark."),r=n[0],i=n[1],a=n.slice(2);if(!r||!i||a.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);var o=t.limit,s=t.environment;return{method:r.substring(r.lastIndexOf(".")+1)+"."+i,limit:parseInt(o,10),environment:s}},headerText:"The Cost of a Streaming Data from MySQL (Charts)"});t.default=f}}]);
//# sourceMappingURL=component---src-pages-charts-mysql-streaming-index-js-24d37eee728bd858d5f8.js.map