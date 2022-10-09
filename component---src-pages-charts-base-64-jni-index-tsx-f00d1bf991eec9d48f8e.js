"use strict";(self.webpackChunkkomanov_com=self.webpackChunkkomanov_com||[]).push([[180],{6082:function(e,n,a){a.r(n);var t=a(2982),r=a(1597),o=a(7294),c=a(5224),l=a(4271),d=["openjdk-17","openjdk-11","openjdk-8"],u=["1","10","50","100","500","1000","10000"],s="10000",i="fixed",m=["all","encode","decode"],f={title:"Library and Operation",prop:"method",values:[{name:"j.u.Base64 encode",value:"jdk_url_encode"},{name:"base64 encode",value:"jniBase64_url_encode"},{name:"base64 encode opt. 1",value:"jniBase64_url_encodeHacky1"},{name:"base64 encode opt. 2",value:"jniBase64_url_encodeHacky2"},{name:"base64 encode opt. 3",value:"jniBase64_url_encodeHacky3"},{name:"j.u.Base64 decode",value:"jdk_url_decode"},{name:"base64 decode",value:"jniBase64_url_decode"},{name:"base64 decode opt. 1",value:"jniBase64_url_decode1"},{name:"base64 decode opt. 2",value:"jniBase64_url_decode2"},{name:"base64 decode opt. 3",value:"jniBase64_url_decode3"},{name:"base64 decode opt. 4",value:"jniBase64_url_decode4"},{name:"base64 decode direct memory",value:"jniBase64_url_decodeHacky1"},{name:"base64 decode cached direct memory",value:"jniBase64_url_decodeHacky2"},{name:"crypto2 decode",value:"jniCrypto2_url_decode"}]},j={title:"JDK",prop:"jdk",values:d};var h=function(e){return"/data/charts/base64-jni/"+e},p=(0,c.wZ)((function(e){var n=e.jmhList,a=(0,o.useState)(m[0]),t=a[0],l=a[1],p=(0,o.useState)(s),k=p[0],v=p[1],_=(0,o.useState)(i),g=_[0],b=_[1],E=(0,o.useState)("openjdk-17"),x=E[0],B=E[1],D=(0,o.useState)({func:null}),y=D[0],C=D[1],J=function(e){return"all"===t||-1!==e.method.indexOf(t)},w=Object.assign({},f,{values:"all"===t?f.values:f.values.filter((function(e){return-1!==e.value.indexOf(t)}))});return o.createElement("div",{className:"markdown"},o.createElement("h3",null,"Introduction"),o.createElement("p",null,"Here are benchmarking results for"," ",o.createElement(r.Link,{to:"/p/base64-via-jni-encoding-performance"},"«Base64 via JNI Encoding Performance»")," ","blog post."),o.createElement("p",null,"The performance tests are performed via"," ",o.createElement("a",{href:"https://github.com/openjdk/jmh"},"JMH"),". The configuration of a hardware is Intel® Core™ i7-1165G7 @ 2.80GHz × 8 (4 core + 4 HT) with 16 GB RAM. Scala version: 2.13.6."),o.createElement("h3",null,"Charts"),o.createElement(c.V2,{label:"Data length:",items:(0,c.Jw)(u,(function(e){return e===s})),onChange:function(e){return v(e)}}),o.createElement(c.V2,{label:"Data set:",items:(0,c.Jw)(["fixed","random"],(function(e){return e===i})),onChange:function(e){return b(e)}}),o.createElement(c.V2,{label:"Method:",items:(0,c.Jw)(m,(function(e,n){return 0===n})),onChange:function(e){return l(e)}}),o.createElement(c.J6,{onChange:function(e){return C({func:e})}}),o.createElement("h4",null,"Encoding/Decoding Performance for various JDKs"),o.createElement(c.We,{dataTable:n,extractor:y.func,filter:function(e){return e.length===k&&e.dataset===g&&J(e)},title:"Encoding/Decoding, nanos",xDesc:w,yDesc:j}),o.createElement("h4",null,"Performance for different data sizes"),o.createElement(c.V2,{label:"JDK:",items:(0,c.Jw)(d,(function(e,n){return 0===n})),onChange:function(e){return B(e)}}),o.createElement(c.We,{chartType:"LineChart",dataTable:n,extractor:y.func,filter:function(e){return e.jdk===x&&e.dataset===g&&J(e)},xDesc:w,yDesc:{title:"Data length",prop:"length",values:u},options:{hAxis:{title:"Data length"},vAxis:{title:"time, nanoseconds",logScale:!0}}}),o.createElement("p",null,"Full JMH logs:",o.createElement("a",{href:h("jdk8.log.txt")},"openjdk-8"),","," ",o.createElement("a",{href:h("jdk11.log.txt")},"openjdk-11"),","," ",o.createElement("a",{href:h("jdk17.log.txt")},"openjdk-17"),"."))}),{fetchFunc:function(){return Promise.all([(0,l._l)(h("jdk8.json")),(0,l._l)(h("jdk11.json")),(0,l._l)(h("jdk17.json"))]).then((function(e){function n(n,a){var t=e[n].data;return t.forEach((function(e){return e.params=Object.assign({},e.params,{jdk:a})})),t}return{data:[].concat((0,t.Z)(n(0,"openjdk-8")),(0,t.Z)(n(1,"openjdk-11")),(0,t.Z)(n(2,"openjdk-17")))}}))},exportDimensionsFunc:function(e,n){var a=e.substring(e.lastIndexOf(".")+1);return Object.assign({method:a},n)},headerText:"Base64 via JNI Encoding Performance (Charts)"});n.default=p}}]);
//# sourceMappingURL=component---src-pages-charts-base-64-jni-index-tsx-f00d1bf991eec9d48f8e.js.map