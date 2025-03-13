import{X as R,j as t,O as F,r as j,M as P,B as m,l as I}from"./index-DmrI1hgF.js";import{u as M,M as O,a as S,b as k,c as v,d as A,e as E}from"./index.esm-BcoL7PDw.js";const N=R(t.jsx("path",{d:"M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"}),"ArrowBackIosNewOutlined");var h={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(n){(function(){var o={}.hasOwnProperty;function s(){for(var e="",r=0;r<arguments.length;r++){var i=arguments[r];i&&(e=l(e,a(i)))}return e}function a(e){if(typeof e=="string"||typeof e=="number")return e;if(typeof e!="object")return"";if(Array.isArray(e))return s.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var r="";for(var i in e)o.call(e,i)&&e[i]&&(r=l(r,i));return r}function l(e,r){return r?e?e+" "+r:e+r:e}n.exports?(s.default=s,n.exports=s):window.classNames=s})()})(h);var _=h.exports;const $=F(_),D=["xxl","xl","lg","md","sm","xs"],L="xs",y=j.createContext({prefixes:{},breakpoints:D,minBreakpoint:L}),{Consumer:z,Provider:Y}=y;function H(n,o){const{prefixes:s}=j.useContext(y);return n||s[o]||o}const K=["as","disabled"];function W(n,o){if(n==null)return{};var s={};for(var a in n)if({}.hasOwnProperty.call(n,a)){if(o.indexOf(a)>=0)continue;s[a]=n[a]}return s}function X(n){return!n||n.trim()==="#"}function T({tagName:n,disabled:o,href:s,target:a,rel:l,role:e,onClick:r,tabIndex:i=0,type:b}){n||(s!=null||a!=null||l!=null?n="a":n="button");const u={tagName:n};if(n==="button")return[{type:b||"button",disabled:o},u];const x=c=>{if((o||n==="a"&&X(s))&&c.preventDefault(),o){c.stopPropagation();return}r==null||r(c)},f=c=>{c.key===" "&&(c.preventDefault(),x(c))};return n==="a"&&(s||(s="#"),o&&(s=void 0)),[{role:e??"button",disabled:void 0,tabIndex:o?void 0:i,href:s,target:n==="a"?a:void 0,"aria-disabled":o||void 0,rel:n==="a"?l:void 0,onClick:x,onKeyDown:f},u]}const V=j.forwardRef((n,o)=>{let{as:s,disabled:a}=n,l=W(n,K);const[e,{tagName:r}]=T(Object.assign({tagName:s,disabled:a},l));return t.jsx(r,Object.assign({},l,e,{ref:o}))});V.displayName="Button";const w=j.forwardRef(({as:n,bsPrefix:o,variant:s="primary",size:a,active:l=!1,disabled:e=!1,className:r,...i},b)=>{const u=H(o,"btn"),[x,{tagName:f}]=T({tagName:n,disabled:e,...i}),c=f;return t.jsx(c,{...x,...i,ref:b,disabled:e,className:$(r,u,l&&"active",s&&`${u}-${s}`,a&&`${u}-${a}`,i.href&&e&&"disabled")})});w.displayName="Button";const q=({columns:n=[],data:o=[],customRightButtonIcon:s,customRightButtonStyles:a,customRightButtonText:l,customRightButtonCallBackFunction:e,customRightButton:r=!1,showBackButton:i=!1,backButtonCallBackFunction:b=()=>{},tableHeader:u="Enter Table Header",extraComponents:x=t.jsx(t.Fragment,{}),actionMenuItems:f=[],headerStyles:c={},buttonStyles:B={}})=>{const C=M({columns:n,data:o,initialState:{showColumnFilters:!1,showGlobalFilter:!0},muiTableHeadRowProps:{sx:{fontWeight:"bold",fontSize:"14px",bgcolor:"#F3F8F7",boxShadow:0,borderRadius:"none",...c}},muiTableHeadCellProps:{sx:{...c}},muiTableProps:{sx:{paddingX:"20px",boxShadow:0,borderRadius:"none"}},renderTopToolbar:({table:p})=>t.jsxs(m,{children:[t.jsx(m,{sx:{marginX:"20px",marginY:"10px"},className:"header-title",children:t.jsx("h3",{className:"card-title",children:u})}),x,t.jsxs(m,{sx:{display:"flex",justifyContent:"space-between",padding:"10px",flexWrap:"wrap",alignItems:"flex-start"},children:[i?t.jsxs(m,{onClick:b,sx:{display:"flex",justifyContent:"flex-start",marginX:"10px",cursor:"pointer"},children:[t.jsx(N,{}),t.jsx(I,{fontWeight:600,children:"Back"})]}):t.jsx(t.Fragment,{}),t.jsxs(m,{sx:{display:"flex",gap:"0.1rem",alignItems:"center",paddingLeft:"10px",paddingBottom:"5px"},children:[t.jsx(S,{table:p}),t.jsx(k,{table:p}),t.jsx(v,{table:p}),t.jsx(A,{table:p}),t.jsx(E,{table:p})]}),r&&t.jsx(m,{sx:{display:"flex",justifyContent:"flex-start",alignItems:"center"},children:t.jsxs(w,{onClick:e,style:{border:"none",backgroundColor:"#0B795F",color:"#fff",display:"flex",alignItems:"center",marginLeft:"10px",marginRight:"10px",cursor:"pointer",...B,...a},children:[s," ",l]})})]})]}),enableRowActions:f.length>0,positionActionsColumn:"last",renderRowActionMenuItems:({row:p})=>f.map((d,g)=>t.jsxs(P,{disabled:d.disabled||!1,sx:{display:"flex",alignItems:"center"},id:`${d.display}:${g}`,onClick:()=>d.handleClick?d.handleClick(p.original):void 0,children:[d.icon&&t.jsx("span",{style:{marginRight:"10px",color:"#0B795F"},children:d.icon}),t.jsx("span",{children:d.display})]},`${d.display}:${g}`))});return t.jsx(O,{table:C})};export{q as V};
