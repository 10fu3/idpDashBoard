(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{349:function(t,e,n){var content=n(350);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(13).default)("7132a15d",content,!0,{sourceMap:!1})},350:function(t,e,n){(e=n(12)(!1)).push([t.i,".theme--light.v-divider{border-color:rgba(0,0,0,.12)}.theme--dark.v-divider{border-color:hsla(0,0%,100%,.12)}.v-divider{display:block;flex:1 1 0px;max-width:100%;height:0;max-height:0;border:solid;border-width:thin 0 0;transition:inherit}.v-divider--inset:not(.v-divider--vertical){max-width:calc(100% - 72px)}.v-application--is-ltr .v-divider--inset:not(.v-divider--vertical){margin-left:72px}.v-application--is-rtl .v-divider--inset:not(.v-divider--vertical){margin-right:72px}.v-divider--vertical{align-self:stretch;border:solid;border-width:0 thin 0 0;display:inline-flex;height:inherit;min-height:100%;max-height:100%;max-width:0;width:0;vertical-align:text-bottom}.v-divider--vertical.v-divider--inset{margin-top:8px;min-height:0;max-height:calc(100% - 16px)}",""]),t.exports=e},355:function(t,e,n){"use strict";var r=n(2),o=(n(349),n(26));function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function c(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=o.a.extend({name:"v-divider",props:{inset:Boolean,vertical:Boolean},render:function(t){var e;return this.$attrs.role&&"separator"!==this.$attrs.role||(e=this.vertical?"vertical":"horizontal"),t("hr",{class:c({"v-divider":!0,"v-divider--inset":this.inset,"v-divider--vertical":this.vertical},this.themeClasses),attrs:c({role:"separator","aria-orientation":e},this.$attrs),on:this.$listeners})}})},402:function(t,e,n){"use strict";n.r(e);n(36),n(17),n(22),n(42);var r={computed:{},props:{noValidation:{type:Boolean,default:!1}},methods:{drop:function(t){var e=t.target.files||t.dataTransfer.files;this.setIcon(e[0])},setIcon:function(t){var e=null!=t?t:this.lists[0].file,n=this.validate("icon",e);n.length>0?alert(n):(this.lists[0].file=e,this.lists[0].fileName=e.name)},validate:function(t,e){var n="";switch(t){case"icon":if(null==e||null==e)n="画像がアップロードされていません";else{var r=e.name.split(".");switch(r[r.length-1]){case"png":case"jpg":case"jpeg":case"bmp":break;default:n=".png .jpg .jpeg .bmpの拡張子のファイルに対応しています"}}break;case"mail":this.reg.test(e)||(n="有効なメールアドレスを入力してください");break;case"pass":e.length<8&&(n="パスワードは8文字以上にしてください");break;case"nick":e.length<1&&(n="1文字以上入力してください`")}return n},removeFile:function(){this.lists[0].fileName="",this.lists[0].file=null},change_request:function(t,e,n){var r=this;this.lists[n].input="";var o=null,l="";if("icon"===t?(o=null!=e?e:this.lists[0].file,l=this.validate(t,o)):l=this.validate(t,e),l.length>0)alert(l);else{var c=function(t){fetch("http://localhost/api/v1/account/",{method:"get",headers:new Headers({Authorization:localStorage.getItem("authorization")})}).then((function(t){return t.json()})).then((function(a){for(var i=0;i<t.length;i++)switch(t[i].id){case"icon":t[i].value=a.icon;break;case"mail":t[i].value=a.mail;break;case"nick":t[i].value=a.nick;break;case"newpass":t[i].input=""}}))},v=function(t,e,n,r,o){var l={};l[t]=e,fetch("http://localhost/api/v1/account/",{method:"put",mode:"cors",headers:new Headers({Authorization:localStorage.getItem("authorization")}),body:JSON.stringify(l)}).then((function(t){return t.ok?(n(r),{}):t.json()})).then((function(t){t.error&&alert(t.error)})).catch((function(t){alert("エラーが発生しました")}))};if("icon"===t){var h=new FormData;h.append("file",this.lists[0].file),fetch("http://localhost/api/v1/img",{method:"POST",body:h}).then((function(t){return t.json()})).then((function(e){v(t,e.url,c,r.lists)}))}else v(t,e,c,this.lists)}},reload:function(){var t=this;fetch("http://localhost/api/v1/account/",{method:"get",headers:new Headers({Authorization:localStorage.getItem("authorization")})}).then((function(t){return t.json()})).then((function(a){for(var i=0;i<t.lists.length;i++)switch(t.lists[i].id){case"icon":t.lists[i].value=a.icon;break;case"mail":t.lists[i].value=a.mail;break;case"nick":t.lists[i].value=a.nick;break;case"newpass":t.lists[i].input=""}}))}},created:function(){var t=this;fetch("http://localhost/api/v1/account/",{method:"get",headers:new Headers({Authorization:localStorage.getItem("authorization")})}).then((function(t){return t.json()})).then((function(a){for(var i=0;i<t.lists.length;i++)switch(t.lists[i].id){case"icon":t.lists[i].value=a.icon;break;case"mail":t.lists[i].value=a.mail;break;case"nick":t.lists[i].value=a.nick;break;case"newpass":t.lists[i].input=""}}))},data:function(){var t=this;return{reg:/^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,lists:[{rule:function(t){},fileName:"",input:null,id:"icon",category:"アイコン",value:""},{rule:function(e){return t.reg.test(e)||"無効なメールアドレスです"},input:"",id:"mail",category:"メールアドレス",value:"",type:"text"},{rule:function(t){return t&&t.length>=8||"8文字以上のパスワードを設定してください"},input:"",id:"newpass",category:"パスワード",value:"",type:"password"},{rule:function(t){return t&&t.length>=1||"1文字は設定してください"},input:"",id:"nick",category:"ニックネーム",value:"",type:"text"}]}}},o=n(74),l=n(108),c=n.n(l),v=n(168),h=n(231),d=n(345),f=n(344),m=n(396),_=n(339),x=n(355),w=n(397),y=n(398),k=n(399),j=n(400),O=n(395),V=n(139),C=n(166),P=n(100),z=n(401),F=n(391),I=n(353),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-row",[n("v-col",[n("v-row",[n("v-col",[n("v-card",{staticClass:"mx-auto mt-5",attrs:{width:"500px",elevation:"9"}},[n("v-card-title",{staticClass:"justify-center"},[n("v-container",[n("h2",{staticClass:"font-weight-light",attrs:{align:"center"}},[t._v("\n                      アカウント情報\n                    ")])])],1),t._v(" "),n("v-card-text",[n("v-container",[n("v-card",[n("v-card-text",[n("v-list",[t._l(t.lists,(function(e,r){return[n("v-list-item",{key:e.id},[n("v-col",{staticClass:"text-left mb-5"},[n("p",[t._v(t._s(e.category))])]),t._v(" "),n("v-col",{staticClass:"text-right"},["icon"===e.id?n("div",[n("v-avatar",{staticClass:"ma-5"},[n("v-img",{attrs:{src:e.value}})],1)],1):n("div",[n("p",{staticClass:"mb-5"},[t._v(t._s(e.value))])])])],1),t._v(" "),n("v-expansion-panels",{key:e.id+"-panel"},[n("v-expansion-panel",[n("v-expansion-panel-header",[t._v("変更")]),t._v(" "),n("v-expansion-panel-content",["icon"!==e.id?n("div",[n("v-container",[n("p",[t._v("新しい"+t._s(e.category)+"を設定")]),t._v(" "),n("v-text-field",{attrs:{type:e.type,rules:[e.rule]},model:{value:e.input,callback:function(n){t.$set(e,"input",n)},expression:"list.input"}}),t._v(" "),n("v-spacer"),t._v(" "),n("v-btn",{attrs:{color:"primary",outlined:""},on:{click:function(n){return n.stopPropagation(),t.change_request(e.id,e.input,r)}}},[t._v("変更")])],1)],1):n("div",{on:{dragover:function(t){t.preventDefault()},drop:function(e){return e.preventDefault(),t.drop(e)}}},[n("v-container",[n("p",[t._v("新しい"+t._s(e.category)+"を設定")]),t._v(" "),n("p",[t._v("imgurというアップローダーに画像がアップロードされます")]),t._v(" "),n("br"),t._v(" "),n("v-file-input",{attrs:{accept:"image/png, image/jpeg, image/bmp",placeholder:"png jpeg bmp","prepend-icon":"mdi-camera"},on:{change:t.setIcon}}),t._v(" "),n("p",[t._v(t._s(t.lists[0].fileName))]),t._v(" "),n("v-spacer"),t._v(" "),n("v-btn",{attrs:{color:"error",outlined:""},on:{click:function(e){return e.stopPropagation(),t.removeFile(e)}}},[t._v("削除")]),t._v(" "),n("v-btn",{attrs:{color:"primary",outlined:""},on:{click:function(n){return n.stopPropagation(),t.change_request(e.id,e.input,r)}}},[t._v("変更")])],1)],1)])],1)],1),t._v(" "),0==r||r+1<t.lists.length?n("v-divider",{staticClass:"mt-3 mb-3",staticStyle:{"border-color":"#FFFFFF"}}):t._e()]}))],2)],1)],1)],1)],1),t._v(" "),n("v-card-actions",[n("v-btn",{attrs:{color:"error",block:""}},[t._v("\n                      アカウントを削除\n                    ")])],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VAvatar:v.a,VBtn:h.a,VCard:d.a,VCardActions:f.a,VCardText:f.b,VCardTitle:f.c,VCol:m.a,VContainer:_.a,VDivider:x.a,VExpansionPanel:w.a,VExpansionPanelContent:y.a,VExpansionPanelHeader:k.a,VExpansionPanels:j.a,VFileInput:O.a,VImg:V.a,VList:C.a,VListItem:P.a,VRow:z.a,VSpacer:F.a,VTextField:I.a})}}]);