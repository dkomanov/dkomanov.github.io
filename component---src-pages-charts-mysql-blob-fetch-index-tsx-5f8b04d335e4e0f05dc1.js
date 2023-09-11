"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[607,262,21],{3067:function(e,t,n){n.r(t),n.d(t,{AllCompressionRatios:function(){return r},CompressionRatioChooseComponent:function(){return c},DefaultCompressionRatio:function(){return o},comparisonValues:function(){return i},sideBySide:function(){return s}});var a=n(7294),l=n(9064),r=[{name:"low",value:"LOW_COMPRESSION_1_3"},{name:"medium",value:"MEDIUM_COMPRESSION_2_1"},{name:"high",value:"HIGH_COMPRESSION_3_4"},{name:"extra",value:"EXTRA_HIGH_COMPRESSION_6_2"}],o="MEDIUM_COMPRESSION_2_1",s=function(e){if(e.length<=0)throw new Error("empty array");if(e.find((function(t){return t.length!==e[0].length})))throw new Error("different lengths");for(var t=[],n=0;n<e[0].length;++n)for(var a=0;a<e.length;++a)t.push(e[a][n]);return t},i=function(e,t){return r.slice().reverse().map((function(n){return{name:e+" ["+n.name+"]",value:t+"-"+n.value}}))},c=function(e){var t=e.value,n=e.onChange;return a.createElement(l.NH,{label:"Compression Ratio:",value:t,items:r.map((function(e){return{label:e.name,value:e.value}})),onChange:n})};t.default=c},1590:function(e,t,n){n.r(t),n.d(t,{DatasetChooseComponent:function(){return u},DefaultRealDataset:function(){return o},RealLengthDesc:function(){return r},filterByDataset:function(){return i}});var a=n(7294),l=n(9064),r={title:"Real Input Size",prop:"length",values:["298","420","531","538","686","34011","42223","51771","62830","81207","94417","607930","751048","781196","866049","904172","1075724","1293080","1448911","1599048","4072805","4287156"]},o="607930-4287156",s=["all","34011-94417","607930-4287156"],i=function(e,t){return"all"===e||("34011-94417"===e?c(t.length,34011,94417):c(t.length,607930,4287156))};function c(e,t,n){var a=parseInt(e);return t<=a&&a<=n}var u=function(e){var t=e.dataset,n=e.datasetSet;return a.createElement(l.NH,{label:"Data set:",items:s.map((function(e){return{label:e,value:e}})),value:t,onChange:n})};t.default=u},8316:function(e,t,n){n.r(t);var a=n(2982),l=n(1597),r=n(7294),o=n(9064),s=n(8667),i=n(5e3),c=n(3067),u=n(1590);var m=function(){var e=[];function t(t){e.push({name:t+"KB",value:(1024*t).toString()})}function n(t,n){e.push({name:t+"."+n+"MB",value:(1024*t*1024+100*n*1024).toString(),default:5===t&&0===n})}t(1);for(var a=5;a<100;a+=5)t(a);for(var l=100;l<=900;l+=100)t(l);for(var r=1;r<=4;++r)for(var o=0;o<=9;++o)n(r,o);return n(5,0),e}(),f={title:"Fetch Kind",prop:"algorithm",values:[{name:"Uncompressed",value:"uncompressed"},{name:"Compressed table",value:"auto_mysql"},{name:"deflate",value:"deflate"},{name:"deflate+len MySQL",value:"explicit_mysql"},{name:"deflate+len Java",value:"deflateWithSize"}].concat((0,a.Z)(["gzip","snappy","zstd","brotli_0","brotli_6","brotli_11","lz4_fast","lz4_high9","lz4_high17"].map((function(e){return{name:e,value:e}}))))},p={title:"Fetch Kind",prop:"comparison",values:[{name:"Uncompressed",value:"uncompressed-LOW_COMPRESSION_1_3"},{name:"lz4 ~1",value:"lz4_high9-LOW_COMPRESSION_1_3"},{name:"lz4 ~1.5",value:"lz4_high9-MEDIUM_COMPRESSION_2_1"},{name:"lz4 ~2.5",value:"lz4_high9-HIGH_COMPRESSION_3_4"},{name:"lz4 ~3.9",value:"lz4_high9-EXTRA_HIGH_COMPRESSION_6_2"}]},h={title:"Compression Algorithm",prop:"comparison",values:[].concat((0,a.Z)((0,c.comparisonValues)("Compressed table","auto_mysql")),(0,a.Z)((0,c.comparisonValues)("deflate+len MySQL","explicit_mysql")))},d={title:"Compression Algorithm",prop:"comparison",values:[].concat((0,a.Z)((0,c.comparisonValues)("Java","deflateWithSize")),(0,a.Z)((0,c.comparisonValues)("MySQL","explicit_mysql")))},E={title:"Data length",prop:"length",values:m},v={title:"Data length, bytes"},g={title:"throughput, bytes per second"},S={title:"time, microseconds"},C=function(e){return"/data/charts/mysql-blob-fetch/"+e},_=(0,o.wZ)((function(e){var t,n=e.jmhList,a=(0,r.useState)(m.find((function(e){return e.default})).value),s=a[0],_=a[1],b=(0,r.useState)(c.DefaultCompressionRatio),y=b[0],L=b[1],M=(0,r.useState)("big"),R=M[0],D=M[1],O=(0,r.useState)(u.DefaultRealDataset),x=O[0],I=O[1],T=(0,r.useState)(i.mA),A=T[0],N=T[1],z=function(e){return"all"===R||("small"===R?parseInt(e.length)<=102400:parseInt(e.length)>=102400)},B=r.createElement(o.NH,{label:"Data set:",items:(t=["all","small","big"],t.map((function(e){return{label:e,value:e}}))),value:R,onChange:D}),P=r.createElement(u.DatasetChooseComponent,{dataset:x,datasetSet:I}),w=r.createElement(c.CompressionRatioChooseComponent,{value:y,onChange:L}),H=function(e){return e?r.createElement("div",null,P):r.createElement("div",null,w,B)},Q=function(e){return e?function(t){return t.realData===e&&(0,u.filterByDataset)(x,t)}:function(t){return t.realData===e&&function(e){return e.compressionRatio===y}(t)&&z(t)}},k=function(e){return r.createElement("div",null,r.createElement("h3",null,"Fetch BLOBs of different lengths"),H(e),r.createElement(o.We,{chartType:"LineChart",dataTable:n,extractor:A.func,filter:Q(e),xDesc:f,yDesc:e?u.RealLengthDesc:E,options:{hAxis:v,vAxis:S,legend:{textStyle:{fontSize:14}}}}))},U=function(e){return r.createElement("div",null,r.createElement("h3",null,"Effective throughput after decompression"),H(e),r.createElement(o.We,{chartType:"LineChart",dataTable:n,extractor:function(e){return e.totalBytesReturned},filter:Q(e),xDesc:f,yDesc:e?u.RealLengthDesc:E,options:{hAxis:v,vAxis:g,legend:{textStyle:{fontSize:14}}}}),r.createElement("h3",null,"MySQL data throughput over the wire"),H(e),r.createElement(o.We,{chartType:"LineChart",dataTable:n,extractor:function(e){return e.totalBytesFromMysql},filter:Q(e),xDesc:f,yDesc:e?u.RealLengthDesc:E,options:{hAxis:v,vAxis:g,legend:{textStyle:{fontSize:14}}}}))},W=function(e,t){return r.createElement("div",null,r.createElement("h3",null,e," with different compression ratios"),r.createElement("h4",null,"Performance"),B,r.createElement(o.We,{chartType:"LineChart",dataTable:n,extractor:A.func,filter:function(e){return z(e)},xDesc:t,yDesc:E,options:{hAxis:v,vAxis:S,legend:{textStyle:{fontSize:14}}}}),r.createElement("h4",null,"Throughput"),B,r.createElement(o.We,{chartType:"LineChart",dataTable:n,extractor:function(e){return e.totalBytesReturned},filter:function(e){return z(e)},xDesc:t,yDesc:E,options:{hAxis:v,vAxis:g,legend:{textStyle:{fontSize:14}}}}))};return r.createElement("div",{className:"markdown"},r.createElement("h2",null,"Introduction"),r.createElement("p",null,"Here are benchmarking results for"," ",r.createElement(l.Link,{to:"/p/mysql-blob-fetch-performance-in-java"},"«MySQL BLOB Fetch Performance In Java»")," ","blog post."),r.createElement("p",null,"The performance tests are performed via ",r.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6."),r.createElement("ul",null,r.createElement("li",null,r.createElement("a",{href:"#real-data"},"Charts for real data")),r.createElement("li",null,r.createElement("a",{href:"#stub-data"},"Charts for stub (random) data")),r.createElement("li",null,r.createElement("a",{href:"#comparisons"},"Comparisons for stub (random) data")),r.createElement("li",null,r.createElement("a",{href:"#legend"},"Legend"))),r.createElement(o.J6,{onChange:function(e){return N({func:e})}}),r.createElement("h2",null,"Charts for real data"),k(!0),U(!0),r.createElement("h2",null,"Charts for stub (random) data"),k(!1),U(!1),r.createElement("h3",null,"Fetch performance for different compression ratios"),r.createElement(o.qv,{label:"Data length:",items:m.map((function(e){return{label:e.name,value:e.value,default:!0===e.default}})),onChange:function(e){return _(e)}}),r.createElement(o.We,{dataTable:n,extractor:A.func,filter:function(e){return e.length===s},xDesc:f,yDesc:{title:"Compression Ratio",prop:"compressionRatio",values:c.AllCompressionRatios},options:{hAxis:{title:"Compression Ratio"},vAxis:S}}),r.createElement("h2",{id:"comparisons"},"Comparisons"),W("Uncompressed vs LZ4",p),W("Compressed Table vs DECOMPRESS",h),W("Java vs MySQL",d),r.createElement("h2",{id:"legend"},"Legend"),r.createElement("p",null,"SQL schema:"),r.createElement("pre",null,"-- data is not compressed","\n","CREATE TABLE uncompressed_blobs (","\n","  ","id INT NOT NULL PRIMARY KEY,","\n","  ","data MEDIUMBLOB NOT NULL","\n",") ENGINE=InnoDB ROW_FORMAT=DYNAMIC;","\n","\n","CREATE TABLE compressed_blobs (","\n","  ","id INT NOT NULL PRIMARY KEY,","\n","  ","data MEDIUMBLOB NOT NULL","\n",") ENGINE=InnoDB ROW_FORMAT=COMPRESSED;","\n","\n"),r.createElement("ul",null,r.createElement("li",null,r.createElement("strong",null,"Uncompressed"),": select data column from ",r.createElement("i",null,"uncompressed_blobs")," table: data is not compressed neither in MySQL nor on application level."),r.createElement("li",null,r.createElement("strong",null,"Compressed"),": select data column from ",r.createElement("i",null,"compressed_blobs")," table: data is compressed in MySQL, on select MySQL decompresses it and returns data uncompressed over the wire."),r.createElement("li",null,r.createElement("strong",null,"deflate"),": select data column from ",r.createElement("i",null,"uncompressed_blobs")," table: data is compressed on application level using"," ",r.createElement("a",{href:"https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_compress"},"MySQL's algorithm"),", on select MySQL returns compressed data over the wire (no decompress in MySQL); data is decompressed in application."),r.createElement("li",null,r.createElement("strong",null,"lz4"),": select data column from ",r.createElement("i",null,"lz4_compressed_blobs")," table: data is compressed on application level using ",r.createElement("a",{href:"https://github.com/lz4/lz4-java"},"LZ4 algorithm"),", on select MySQL returns compressed data over the wire (no decompress in MySQL); data is decompressed in application.")),r.createElement("p",null,"Full JMH logs: ",r.createElement("a",{href:C("jdk17.log.txt")},"openjdk-17")," (",r.createElement("a",{href:C("jdk17.json")},"json"),")."))}),{fetchFunc:function(){return(0,s._l)(C("jdk17.min.json"))},exportDimensionsFunc:function(e,t){return t},headerText:"MySQL BLOB Fetch Performance In Java (Charts)"});t.default=_}}]);
//# sourceMappingURL=component---src-pages-charts-mysql-blob-fetch-index-tsx-5f8b04d335e4e0f05dc1.js.map