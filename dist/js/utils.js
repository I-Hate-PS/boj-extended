"use strict";const Utils={requestAjax:function(a,b){const c=new XMLHttpRequest;return c?void(c.onreadystatechange=function(){if(4==c.readyState)if(200==c.status)try{b(c.responseText,null)}catch(a){console.error(a.message+" in "+c.responseText),b(null,a.message)}else b(null,c.status)},c.open("GET",a),c.send()):(console.error("Can not create XMLHTTP instance."),!1)},loadCSS:function(a){const b=chrome.extension.getURL(a),c=document.createElement("link");c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",b),document.getElementsByTagName("head")[0].appendChild(c)},loadScript:function(a){const b=chrome.extension.getURL(a),c=document.createElement("script");c.setAttribute("type","text/javascript"),c.setAttribute("src",b),document.getElementsByTagName("body")[0].appendChild(c)},createElement:function(a,b){const c=Object.keys(b),d=document.createElement(a||"div");for(let e=0;e<c.length;++e)d.setAttribute(c[e],b[[c[e]]]);return d}};function progressTimer(){function a(a){let b="";return a=parseInt(a/1e3),0<a%60&&(b=a%60+"\uCD08 "+b),a=parseInt(a/60),0<a%60&&(b=a%60+"\uBD84 "+b),a=parseInt(a/60),0<a%24&&(b=a%24+"\uC2DC\uAC04 "+b),a=parseInt(a/24),0<a&&(b=a+"\uC77C "),b?b:"1\uCD08 \uBBF8\uB9CC"}function b(e,f,g){const h=f-new Date().getTime()+1,i=100*h/(f-e);if(0>h)d.setAttribute("style","float:left; transition-duration: .2s; width: 100%; background-color:#dc3545;"),d.innerText=a(-h)+" \uC9C0\uB0A8";else{let b="";50>=i?b="background-color:#ffc107;":10>=i&&(b="background-color:#dc3545;"),d.setAttribute("style","float:right; transition-duration: .2s; width:"+i+"%;"+b),d.innerText=a(h)+" \uB0A8\uC74C"}"running"===c.getAttribute("state")?window.requestAnimationFrame(b.bind(null,e,f,g)):g()}const c=document.createElement("div");c.setAttribute("class","progress");const d=document.createElement("div");return d.setAttribute("class","progress-bar"),d.innerText="Loading...",c.appendChild(d),{element:function(){return c},start:function(a,d,e){return"running"===c.getAttribute("state")?void console.error("already started"):void(c.setAttribute("state","running"),b(a,d,e))},stop:function(){c.setAttribute("state","stop")},text:function(a){return a&&(d.innerText=a),a},show:function(){c.style.display="block"},hide:function(){c.style.display="none"}}}function createVsForm(a,b){const c=Utils.createElement("div",{class:"vs",style:"margin-bottom: 10px"}),d=Utils.createElement("div",{class:"row"}),e=Utils.createElement("div",{class:"col col-sr-only col-md-1"}),f=Utils.createElement("div",{class:"col col-md-2"}),g=Utils.createElement("div",{class:"col col-md-4"}),h=g.cloneNode();d.appendChild(e.cloneNode()),d.appendChild(g),d.appendChild(f),d.appendChild(h),d.appendChild(e.cloneNode()),c.appendChild(d);const i=Utils.createElement("input",{type:"text",class:"form-control",value:a||"",placeholder:"Username"}),j=Utils.createElement("input",{type:"text",class:"form-control",value:b||"",placeholder:"Username"});g.appendChild(i),h.appendChild(j);const k=Utils.createElement("button",{type:"button",class:"btn btn-primary btn-block"});return k.innerText="VS",k.addEventListener("click",a=>{a.preventDefault();const b=i.value,c=j.value;i.setAttribute("class","form-control"+(b?"":" text-border-red bg-color-red")),j.setAttribute("class","form-control"+(c?"":" text-border-red bg-color-red")),b&&c&&(window.location=`https://www.acmicpc.net/vs/${b}/${c}`)}),f.appendChild(k),c}