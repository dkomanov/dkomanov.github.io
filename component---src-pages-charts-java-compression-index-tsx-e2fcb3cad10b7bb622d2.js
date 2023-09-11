"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[763,262,21],{3067:function(e,t,n){n.r(t),n.d(t,{AllCompressionRatios:function(){return l},CompressionRatioChooseComponent:function(){return u},DefaultCompressionRatio:function(){return o},comparisonValues:function(){return s},sideBySide:function(){return i}});var a=n(7294),r=n(9064),l=[{name:"low",value:"LOW_COMPRESSION_1_3"},{name:"medium",value:"MEDIUM_COMPRESSION_2_1"},{name:"high",value:"HIGH_COMPRESSION_3_4"},{name:"extra",value:"EXTRA_HIGH_COMPRESSION_6_2"}],o="MEDIUM_COMPRESSION_2_1",i=function(e){if(e.length<=0)throw new Error("empty array");if(e.find((function(t){return t.length!==e[0].length})))throw new Error("different lengths");for(var t=[],n=0;n<e[0].length;++n)for(var a=0;a<e.length;++a)t.push(e[a][n]);return t},s=function(e,t){return l.slice().reverse().map((function(n){return{name:e+" ["+n.name+"]",value:t+"-"+n.value}}))},u=function(e){var t=e.value,n=e.onChange;return a.createElement(r.NH,{label:"Compression Ratio:",value:t,items:l.map((function(e){return{label:e.name,value:e.value}})),onChange:n})};t.default=u},1590:function(e,t,n){n.r(t),n.d(t,{DatasetChooseComponent:function(){return c},DefaultRealDataset:function(){return o},RealLengthDesc:function(){return l},filterByDataset:function(){return s}});var a=n(7294),r=n(9064),l={title:"Real Input Size",prop:"length",values:["298","420","531","538","686","34011","42223","51771","62830","81207","94417","607930","751048","781196","866049","904172","1075724","1293080","1448911","1599048","4072805","4287156"]},o="607930-4287156",i=["all","34011-94417","607930-4287156"],s=function(e,t){return"all"===e||("34011-94417"===e?u(t.length,34011,94417):u(t.length,607930,4287156))};function u(e,t,n){var a=parseInt(e);return t<=a&&a<=n}var c=function(e){var t=e.dataset,n=e.datasetSet;return a.createElement(r.NH,{label:"Data set:",items:i.map((function(e){return{label:e,value:e}})),value:t,onChange:n})};t.default=c},2942:function(e,t,n){n.r(t);var a=n(1597),r=n(7294),l=n(9064),o=n(8667),i=n(5e3),s=n(3067),u=n(1590),c=[{label:"decode",value:"decode"},{label:"encode",value:"encode"},{label:"encode + brotli_11",value:"encode-all"}],m={title:"Compression Algorithm",prop:"algorithm",values:["gzip","deflate","deflateWithSize","snappy","zstd","brotli_0","brotli_6","brotli_11","lz4_fast","lz4_high9","lz4_high17"]},p=function(e,t){return e.values.map((function(e){return{label:e,value:e,default:e===t}}))},h={title:"Stub Input Size",prop:"length",values:["1024","2048","3072","4096","5120","6144","7168","8192","9216","10240","20480","30720","40960","51200","61440","71680","81920","92160","102400"]};var f=function(){for(var e=[],t=1;t<=9;++t)e.push({label:t+"00 MB/s",value:(100*t*1024*1024).toString()});for(var n=1;n<5;++n)e.push({label:n+" GB/s",value:(1024*n*1024*1024).toString()});return e.push({label:"no limit",value:1099511627776..toString()}),e}(),d={title:"JDK",prop:"jdk",values:l.Sy},v={textStyle:{fontSize:12}},g={title:"Data length, bytes"},E={title:"throughput, bytes per second"},C={title:"time, microseconds"},b=function(e){return"/data/charts/java-compression/"+e},_=(0,l.wZ)((function(e){var t,n=e.jmhList,o=(0,r.useState)("openjdk-17"),_=o[0],D=o[1],S=(0,r.useState)(c[0].value),y=S[0],x=S[1],z=(0,r.useState)(parseInt(f[4].value)),j=z[0],A=z[1],R="decode"!==y,k=(0,r.useState)(i.mA),I=k[0],T=k[1],V=(0,r.useState)("4287156"),B=V[0],O=V[1],w=(0,r.useState)(u.DefaultRealDataset),H=w[0],M=w[1],L=(0,r.useState)("102400"),N=L[0],P=L[1],J=(0,r.useState)(s.DefaultCompressionRatio),G=J[0],F=J[1],q="encode"===y?Object.assign({},m,{values:m.values.filter((function(e){return"brotli_11"!==e}))}):m,K=function(e){return e.jdk===_},W=function(e){return e.action===(R?"encode":"decode")},U=function(e){return e.compressionRatio===G},Q=function(e){var t=function(t){return t?e.totalInputBytes:e.totalOutputBytes},n=t(R),a=n/t(!R),r=j;return n>r?Math.min(n,r*a):n},X=R?"Encoding":"Decoding",Y=r.createElement(l.NH,{label:"JDK:",items:(t=l.Sy,t.map((function(e){return{label:e,value:e}}))),value:_,onChange:D}),Z=r.createElement(l.NH,{label:"Action:",items:c,value:y,onChange:x}),$=r.createElement(u.DatasetChooseComponent,{dataset:H,datasetSet:M}),ee=r.createElement(l.qv,{label:"IO limit:",items:f.map((function(e){return Object.assign({},e,{default:e.value===j.toString()})})),onChange:function(e){return A(parseInt(e))}}),te=r.createElement(l.qv,{label:"Data length:",items:p(u.RealLengthDesc,B),onChange:O}),ne=r.createElement(l.qv,{label:"Data length:",items:p(h,N),onChange:P}),ae=r.createElement(s.CompressionRatioChooseComponent,{value:G,onChange:F}),re=function(e){return r.createElement("div",null,r.createElement("h3",null,X," Performance (time, microseconds)"),e?r.createElement("div",null," ",Y,Z,$):r.createElement("div",null,Y,Z,ae),r.createElement(l.ow,{chartType:"Line",dataTable:n,extractor:I.func,filter:function(t){return t.realData==e&&K(t)&&W(t)&&(e?(0,u.filterByDataset)(H,t):U(t))},xDesc:e?u.RealLengthDesc:h,yDesc:q,options:{legend:v,hAxis:g,vAxis:C}}))},le=function(e){return r.createElement("div",null,r.createElement("h3",null,X," Throughput (",R?"input":"output"," bytes)"),e?r.createElement("div",null," ",Y,Z,$):r.createElement("div",null,Y,Z,ae),ee,r.createElement(l.ow,{chartType:"Line",dataTable:n,extractor:Q,filter:function(t){return t.realData===e&&K(t)&&W(t)&&(e?(0,u.filterByDataset)(H,t):U(t))},xDesc:e?u.RealLengthDesc:h,yDesc:q,options:{legend:v,hAxis:g,vAxis:E}}))},oe=function(e,t){return r.createElement("div",null,r.createElement("h3",null,X," Performance By JDK"),Z,e?te:r.createElement("div",null,ae,ne),r.createElement(l.ow,{chartType:"Bar",dataTable:n,extractor:I.func,filter:function(n){return n.realData==e&&n.length===t&&W(n)&&(e||U(n))},xDesc:d,yDesc:q,options:{legend:v,vAxis:C}}))},ie=function(e,t,a){var o=function(e){return!e.realData&&K(e)&&W(e)};return r.createElement("div",null,r.createElement("h3",null,X," Comparison: ",e),r.createElement("h4",null,"Performance Comparison: ",e),Y,Z,r.createElement(l.ow,{chartType:"Line",dataTable:n,extractor:I.func,filter:o,xDesc:h,yDesc:t,alternateColors:a||2,options:{legend:v,hAxis:g,vAxis:C}}),r.createElement("h4",null,"Throughput Comparison: ",e),Y,Z,r.createElement(l.ow,{chartType:"Line",dataTable:n,filter:o,extractor:Q,xDesc:h,yDesc:t,alternateColors:a||2,options:{legend:v,hAxis:g,vAxis:E}}),r.createElement("h4",null,"Compression Ratios: ",e),r.createElement(l.ow,{chartType:"Line",dataTable:n,filter:o,extractor:function(e){return e.ratio},xDesc:h,yDesc:t,doNotFloorValues:!0,alternateColors:a||2,options:{legend:v,hAxis:g,vAxis:{title:"compression ratio",format:"decimal"}}}))};return r.createElement("div",{className:"markdown"},r.createElement("h2",null,"Introduction"),r.createElement("p",null,"Here are benchmarking results for"," ",r.createElement(a.Link,{to:"/p/java-compression"},"«Java Compression Performance»")," blog post."),r.createElement("p",null,"The performance tests are performed via ",r.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6."),r.createElement("ul",null,r.createElement("li",null,r.createElement("a",{href:"#real-data"},"Charts for real data")),r.createElement("li",null,r.createElement("a",{href:"#stub-data"},"Charts for stub (random) data"))),r.createElement(l.J6,{onChange:function(e){return T({func:e})}}),r.createElement("h2",null,"Charts for real data"),re(!0),le(!0),oe(!0,B),r.createElement("h2",null,"Charts for stub (random) data"),re(!1),le(!1),oe(!1,N),r.createElement("h2",null,"Comparisons"),ie("gzip vs deflate",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("gzip","gzip"),(0,s.comparisonValues)("deflate","deflate")])}),ie("deflate vs deflate+size",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("deflate","deflate"),(0,s.comparisonValues)("mysql","deflateWithSize")])}),ie("lz4 levels",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("lz4_fast","lz4_fast"),(0,s.comparisonValues)("lz4_high9","lz4_high9"),(0,s.comparisonValues)("lz4_high17","lz4_high17")])},3),ie("brotli levels",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("brotli_0","brotli_0"),(0,s.comparisonValues)("brotli_6","brotli_6"),(0,s.comparisonValues)("brotli_11","brotli_11")])},3),ie("lz4 vs brotli",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("lz4_high9","lz4_high9"),(0,s.comparisonValues)("brotli_6","brotli_6")])}),ie("lz4_fast vs snappy",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("lz4_fast","lz4_fast"),(0,s.comparisonValues)("snappy","snappy")])}),ie("brotli_6 vs gzip",{title:"Compression Algorithm",prop:"comparison",values:(0,s.sideBySide)([(0,s.comparisonValues)("brotli_6","brotli_6"),(0,s.comparisonValues)("gzip","gzip")])}),r.createElement("p",null,"Full JMH logs:",r.createElement("a",{href:b("jdk8.log.txt")},"openjdk-8")," (",r.createElement("a",{href:b("jdk8.json")},"json"),"),"," ",r.createElement("a",{href:b("jdk11.log.txt")},"openjdk-11")," (",r.createElement("a",{href:b("jdk11.json")},"json"),"),"," ",r.createElement("a",{href:b("jdk17.log.txt")},"openjdk-17")," (",r.createElement("a",{href:b("jdk17.json")},"json"),"). Compression ratios and data lengths in a"," ",r.createElement("a",{href:"https://docs.google.com/spreadsheets/d/1pFOAgxVYsos38oraeva1_RHC9P4J3oN2Oj2fQ65L8OI"},"speadsheet"),"."))}),{fetchFunc:function(){return(0,o._l)(b("jmh.min.json"))},exportDimensionsFunc:function(e,t){return t},headerText:"Java Compression Performance (Charts)"});t.default=_}}]);
//# sourceMappingURL=component---src-pages-charts-java-compression-index-tsx-e2fcb3cad10b7bb622d2.js.map