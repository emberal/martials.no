import{b as h,i as n,c as l,L as c,t as r,r as p,F as $,a as _}from"./layout.bb853e75.js";const f=r(`<h3 class="text-center w-fit mx-auto before:content-['\u2197']"></h3>`),N=r('<div><div class="relative p-5"></div></div>'),g=({children:e,className:t,title:m,to:d,newTab:u=!1})=>(()=>{const o=N.cloneNode(!0),i=o.firstChild;return h(o,`relative bg-gradient-to-r from-cyan-600 to-cyan-500 h-32 w-72 rounded-2xl ${t}`),n(i,l(c,{className:"text-white",to:d,newTab:u,get children(){const s=f.cloneNode(!0);return n(s,m),s}}),null),n(i,e,null),o})(),v=r("<p>Sjekk ut mine API-er</p>"),k=r("<ul><li></li></ul>"),x=r("<p>Sjekk ut mine andre prosjekter</p>"),y=r("<p>Implementering av API</p>"),w=r('<div class="flex flex-wrap justify-center mt-10"></div>'),a="https://api.martials.no",b=[{title:"API-er",children:[v.cloneNode(!0),(()=>{const e=k.cloneNode(!0),t=e.firstChild;return n(t,l(c,{className:"text-white",to:`${a}/simplify-truths`,children:"Forenkle sannhetsverdier"})),e})()],to:a},{title:"Hjemmeside",children:x.cloneNode(!0),to:"https://h600878.github.io/"},{title:"Forenkle sannhetsverdier",children:y.cloneNode(!0),to:"/simplify-truths.html"}],j=()=>l(_,{title:"Velkommen!",get children(){const e=w.cloneNode(!0);return n(e,l($,{each:b,children:t=>l(g,{get title(){return t.title},className:"m-4",get to(){return t.to},get children(){return t.children}})})),e}});p(()=>l(j,{}),document.getElementById("root"));
