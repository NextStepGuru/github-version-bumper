parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"rP21":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.bumpVersion=void 0;const e=require("json-bumper"),r=async(r,s)=>await e(r,s);exports.bumpVersion=r;
},{}],"lyg8":[function(require,module,exports) {
module.exports={version:"1.0.7",testingen:"0.2.1"};
},{}],"QCba":[function(require,module,exports) {
"use strict";var e=require("actions-toolkit"),o=require("./helpers/bumper");const{version:s}=require("../version.json"),i=require("json-bumper");e.Toolkit.run(async e=>{const s=process.env.VERSION_FILE_NAME||"package.json",i=process.env.VERSION_ENTRY||"version",r=process.env.GITHUB_USER||"GitHub Version Bumper",n=process.env.GITHUB_EMAIL||"github-version-bumper@users.noreply.github.com",t=JSON.parse(e.getFile(s)).version;console.log(`Version ${t}`);try{var a;await e.runInWorkspace("git",["config","user.name",`"${r}"`]),await e.runInWorkspace("git",["config","user.email",`"${n}"`]);let t=!1;const l=null===(a=/refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF))||void 0===a?void 0:a[1];await e.runInWorkspace("git",["checkout",l]);const p=JSON.stringify(await e.runInWorkspace("git",["log","-1"])).toLowerCase()||"";if(console.log("lastcommitmessage",p),"master"===l)if(p.toLowerCase().includes("ci-ignore"))console.log("ci-ignore"),t=!0;else if(p.toLowerCase().includes("ci-version=")){const e=p.toLowerCase().split('ci-version=\\"')[1].split('\\"')[0];console.log("replace:",e),await(0,o.bumpVersion)(s,{replace:e,entry:i})}else if(p.toLowerCase().includes("ci-pre=")){console.log("pre");const e=p.toLowerCase().split('ci-pre=\\"')[1].split('\\"')[0];console.log("pre:",e),await(0,o.bumpVersion)(s,{pre:e,entry:i})}else p.toLowerCase().includes("ci-major")?(console.log("major"),await(0,o.bumpVersion)(s,{major:!0,entry:i})):p.toLowerCase().includes("ci-minor")?(console.log("minor"),await(0,o.bumpVersion)(s,{minor:!0,entry:i})):(console.log("patch"),await(0,o.bumpVersion)(s));else if("staging"===l||"qc"===l||"production"===l){console.log("current branch is:",l),console.log("entry:",i),console.log("filename demo-",s+"-rc");const e=await(0,o.bumpVersion)(s);if(e.original.includes("rc")){let i=e.original.split("-rc.")[1];i++;const r=e.original.slice(0,-1)+i;await(0,o.bumpVersion)(s,{replace:r})}else{const i=e.original,r="-rc.0",n=i.concat(r);await(0,o.bumpVersion)(s,{replace:n})}}if(!t){const o=JSON.parse(e.getFile(s)).version;console.log("-newVersion",o),await e.runInWorkspace("git",["commit","-a","-m",`ci: version bumped to v ${o}`]);const i=`https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;await e.runInWorkspace("git",["pull","--tags"]),await e.runInWorkspace("git",["tag",o]),await e.runInWorkspace("git",["push",i,"--follow-tags"]),await e.runInWorkspace("git",["push",i,"--tags"])}}catch(c){e.log.fatal(c),e.exit.failure("Failed to bump version")}e.exit.success("Version bumped!")});
},{"./helpers/bumper":"rP21","../version.json":"lyg8"}]},{},["QCba"], null)