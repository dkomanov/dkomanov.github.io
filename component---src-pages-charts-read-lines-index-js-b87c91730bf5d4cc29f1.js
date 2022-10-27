"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[576],{7065:function(e,n,t){t.r(n);var r=t(1721),a=t(7294),l=t(9690),o=t(4271),i=[{date:"2017-12-17",comment:a.createElement("ul",null,a.createElement("li",null,"Initial version of benchmark."))}],s=i[0].date,c="ssd",u={title:"Method",prop:"method",values:[{name:"CPU only",value:"baseline"},{name:"Files.readAllLines",value:"filesReadLines"},{name:"Files.readAllBytes",value:"filesReadBytes"},{name:"Files.readAllBytes2",value:"filesReadBytes2"},{name:"BufferedReader inline",value:"forEachInline"},{name:"BufferedReader func",value:"forEachIndirect"},{name:"Files.lines",value:"forEachJava"}]},h={title:"CPU cycles",prop:"cpuTokens",values:[0,10,25,50,100,250,500,1e3].map((function(e){return e.toString(10)}))},m=function(e){function n(n){var t;return(t=e.call(this,n)||this).items=[1,10,100,1e3,1e4,1e5,1e6].map((function(e){return{label:e.toString(10),value:e,default:1e3===e}})),t}return(0,r.Z)(n,e),n.prototype.render=function(){var e=this.props.onChange;return a.createElement(l.V2,{label:"Line count: ",onChange:e,items:this.items})},n}(a.Component),p=function(e){function n(n){var t;return(t=e.call(this,n)||this).items=[{label:"SSD",value:"ssd",default:!0},{label:"HDD",value:"hdd"}],t}return(0,r.Z)(n,e),n.prototype.render=function(){var e=this.props.onChange;return a.createElement(l.V2,{label:"Hard Drive Type: ",onChange:e,items:this.items})},n}(a.Component),f=function(e){function n(n){var t;return(t=e.call(this,n)||this).items=h.values.map((function(e){return{label:e,value:e,default:parseInt(e,10)<=100}})),t}return(0,r.Z)(n,e),n.prototype.render=function(){var e=this.props.onChange;return a.createElement(l.V2,{multiple:!0,label:"CPU cycles: ",onChange:e,items:this.items})},n}(a.Component),d=function(e){function n(n){var t;return(t=e.call(this,n)||this).handleRunChange=function(e){s=e,t.props.refetch()},t.handleHardDriveTypeChange=function(e){c=e,t.props.refetch()},t.state={},t}return(0,r.Z)(n,e),n.prototype.render=function(){var e=this,n=this.state,t=n.lineCount,r=n.cpuTokensMap,o=this.props.jmhList;return a.createElement("div",{class:"markdown"},a.createElement("h3",null,"Introduction"),a.createElement("p",null,"The legend for tests. «Line count» is how many lines of different size are in a file,"," ","«CPU cycles» is how many abstract cycles spent for each line (modeling file processing)."),a.createElement("p",null,"Please notice, that unlike the article, here the performance tests are performed via ",a.createElement("a",{href:"http://openjdk.java.net/projects/code-tools/jmh/"},"JMH"),". The configuration of a hardware is Intel® Core™ i7–5600U CPU @ 2.60GHz × 4 (2 core + 2 HT) with 16 GB RAM."),a.createElement(l.Eg,{runs:i,onChange:this.handleRunChange}),a.createElement(p,{onChange:this.handleHardDriveTypeChange}),a.createElement(m,{onChange:function(n){return e.setState({lineCount:n})}}),a.createElement(f,{onChange:function(n){return e.setState({cpuTokensMap:n})}}),a.createElement("h3",null,"Chart"),a.createElement(l.We,{chartType:"Bar",dataTable:o,extractor:function(e){return Math.floor(e.score/1e3)},filter:function(e){return e.lineCount===t&&!0===r[e.cpuTokens]},title:"time, usec",xDesc:u,yDesc:h,options:{hAxis:{logScale:!1}}}),a.createElement("p",null,"Full JMH log is ",a.createElement("a",{href:"/data/charts/read-lines/jmh_"+s+".log.txt"},"here"),"."))},n}(a.Component);var v=(0,l.wZ)(d,{fetchFunc:function(){return(0,o._l)("/data/charts/read-lines/jmh_"+s+"_"+c+".json")},exportDimensionsFunc:function(e,n){var t=e.split("ReadLinesBenchmark."),r=t[1],a=t.slice(2);if(!r||a.length>0)throw new Error("Expected 2 parts in a benchmark: "+e);return{method:r,cpuTokens:n.cpuTokens,lineCount:parseInt(n.lineCount,10)}},headerText:"Exploring readLine Performance (Charts)"});n.default=v}}]);
//# sourceMappingURL=component---src-pages-charts-read-lines-index-js-b87c91730bf5d4cc29f1.js.map