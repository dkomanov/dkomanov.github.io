"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[180],{6082:function(e,n,t){t.r(n);var a=t(2982),c=t(1597),o=t(7294),r=t(5224),i=t(4271),l=["openjdk-17","openjdk-11","openjdk-8"],u=["1","10","50","100","500","1000","10000"],d="10000",s="fixed",f=["all","encode","decode"],m={title:"Library and Operation",prop:"method",values:[{name:"j.u.Base64 encode",value:"jdk_url_encode"},{name:"base64 encode",value:"jni_url_encodeConfig"},{name:"encode_config_slice (no cache)",value:"jni_url_encodeConfigSlice1NoCache"},{name:"encode_config_slice (cache output)",value:"jni_url_encodeConfigSlice1Cache"},{name:"encode_config_slice (cache input/output)",value:"jni_url_encodeConfigSlice2CacheInputOutput"},{name:"j.u.Base64 decode",value:"jdk_url_decode"},{name:"decode_config #1",value:"jni_url_decodeConfig1"},{name:"decode_config #2 (get_byte_array_elements)",value:"jni_url_decodeConfig2"},{name:"decode_config #3 (explicit size)",value:"jni_url_decodeConfig3"},{name:"decode_config #4 (get_primitive_array_critical)",value:"jni_url_decodeConfig4"},{name:"decode_config_slice JNI",value:"jni_url_decodeConfigSlice1"},{name:"decode_config_slice (no cache)",value:"jni_url_decodeConfigSlice1NoCache"},{name:"decode_config_slice (cache output)",value:"jni_url_decodeConfigSlice2Cache"},{name:"decode_config_slice (cache input/output)",value:"jni_url_decodeConfigSlice3CacheInputOutput"}]},_={title:"JDK",prop:"jdk",values:l};var h=function(e){return"/data/charts/base64-jni/"+e},g=(0,r.wZ)((function(e){var n=e.jmhList,t=(0,o.useState)(f[0]),a=t[0],i=t[1],g=(0,o.useState)(d),p=g[0],j=g[1],v=(0,o.useState)(s),k=v[0],C=v[1],E=(0,o.useState)("openjdk-17"),b=E[0],x=E[1],D=(0,o.useState)({func:null}),S=D[0],J=D[1],w=function(e){return"all"===a||-1!==e.method.indexOf(a)},O=Object.assign({},m,{values:"all"===a?m.values:m.values.filter((function(e){return-1!==e.name.indexOf(a)}))});return o.createElement("div",{className:"markdown"},o.createElement("h3",null,"Introduction"),o.createElement("p",null,"Here are benchmarking results for"," ",o.createElement(c.Link,{to:"/p/base64-encoding-via-jni-performance"},"«Base64 Encoding via JNI Performance»")," ","blog post."),o.createElement("p",null,"The performance tests are performed via"," ",o.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6."),o.createElement("h3",null,"Charts"),o.createElement(r.V2,{label:"Data length:",items:(0,r.Jw)(u,(function(e){return e===d})),onChange:function(e){return j(e)}}),o.createElement(r.V2,{label:"Data set:",items:(0,r.Jw)(["fixed","random"],(function(e){return e===s})),onChange:function(e){return C(e)}}),o.createElement(r.V2,{label:"Method:",items:(0,r.Jw)(f,(function(e,n){return 0===n})),onChange:function(e){return i(e)}}),o.createElement(r.J6,{onChange:function(e){return J({func:e})}}),o.createElement("h4",null,"Encoding/Decoding Performance for various JDKs"),o.createElement(r.We,{dataTable:n,extractor:S.func,filter:function(e){return e.length===p&&e.dataset===k&&w(e)},title:"Encoding/Decoding, nanos",xDesc:O,yDesc:_}),o.createElement("h4",null,"Performance for different data sizes"),o.createElement(r.V2,{label:"JDK:",items:(0,r.Jw)(l,(function(e,n){return 0===n})),onChange:function(e){return x(e)}}),o.createElement(r.We,{chartType:"LineChart",dataTable:n,extractor:S.func,filter:function(e){return e.jdk===b&&e.dataset===k&&w(e)},xDesc:O,yDesc:{title:"Data length",prop:"length",values:u},options:{hAxis:{title:"Data length"},vAxis:{title:"time, nanoseconds",logScale:!0}}}),o.createElement("p",null,"Full JMH logs:",o.createElement("a",{href:h("jdk8.log.txt")},"openjdk-8"),","," ",o.createElement("a",{href:h("jdk11.log.txt")},"openjdk-11"),","," ",o.createElement("a",{href:h("jdk17.log.txt")},"openjdk-17"),"."))}),{fetchFunc:function(){return Promise.all([(0,i._l)(h("jdk8.json")),(0,i._l)(h("jdk11.json")),(0,i._l)(h("jdk17.json"))]).then((function(e){function n(n,t){var a=e[n].data;return a.forEach((function(e){return e.params=Object.assign({},e.params,{jdk:t})})),a}return{data:[].concat((0,a.Z)(n(0,"openjdk-8")),(0,a.Z)(n(1,"openjdk-11")),(0,a.Z)(n(2,"openjdk-17")))}}))},exportDimensionsFunc:function(e,n){var t=e.substring(e.lastIndexOf(".")+1);return Object.assign({method:t},n)},headerText:"Base64 Encoding via JNI Performance (Charts)"});n.default=g}}]);
//# sourceMappingURL=component---src-pages-charts-base-64-jni-index-tsx-caf79d8da1b65d9a8840.js.map