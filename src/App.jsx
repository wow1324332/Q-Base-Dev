import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATKKSrUm6NKATdZdJeDxhQ5Dj2Q32ujh0",
  authDomain: "q-base-dev.firebaseapp.com",
  projectId: "q-base-dev",
  storageBucket: "q-base-dev.firebasestorage.app",
  messagingSenderId: "756427289812",
  appId: "1:756427289812:web:217c6ebb1bfbd1d931f741"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

const ADMIN_ID = 'wow1324332';
const ADMIN_PW = 'djslzja1!';
const makeEmail = (id) => id + '@qbase.local';

const initialDevices = [
  {id:1,name:'Galaxy Z Fold7',type:'FOLD',status:'사용중',os:'A16/O8.0',serial:'R3CY70YS5MT',adid:'',user:'홍진의',maker:'Samsung',usim:''},
  {id:2,name:'Galaxy Z Fold4',type:'FOLD',status:'보관중',os:'A15/O7.0',serial:'R3CTB06WAGB',adid:'e0807df8-b3be-46d9-9d30-749a3f7b5c00',user:'',maker:'Samsung',usim:''},
  {id:3,name:'Galaxy Z Fold3',type:'FOLD',status:'보관중',os:'A14/O6.1',serial:'R3CR80CYWTV',adid:'',user:'',maker:'Samsung',usim:''},
  {id:4,name:'Galaxy Z Flip7',type:'FLIP',status:'사용중',os:'A16/O8.0',serial:'R3CY70MCMMB',adid:'',user:'김정근',maker:'Samsung',usim:''},
  {id:5,name:'Galaxy Z Flip6',type:'FLIP',status:'대여중',os:'A14/O6.1.1',serial:'R3CX608JDXH',adid:'',user:'손건희',maker:'Samsung',usim:''},
  {id:6,name:'Galaxy Z Flip5',type:'FLIP',status:'보관중',os:'A14/O6.1',serial:'R3CW901XR4A',adid:'',user:'',maker:'Samsung',usim:''},
  {id:7,name:'Galaxy S22 Ultra',type:'BAR',status:'대여중',os:'A14/O6.1',serial:'R3CT60FXMKM',adid:'8ddefb10-4a58-4397-b22c-d2ae342e2a68',user:'김효선',maker:'Samsung',usim:''},
  {id:8,name:'Galaxy S22',type:'BAR',status:'보관중',os:'A14/O6.0',serial:'R3CRC0ZH5YZ',adid:'',user:'',maker:'Samsung',usim:''},
  {id:9,name:'Galaxy S25 Ultra',type:'BAR',status:'사용중',os:'A15/O7.0',serial:'R3CY207FC9R',adid:'74a99bcd-5fa5-4e04-817a-68844c3cb649',user:'김정근',maker:'Samsung',usim:''},
  {id:10,name:'Galaxy S25',type:'BAR',status:'사용중',os:'A16/O8.0',serial:'R3CY205YAVV',adid:'',user:'김지연',maker:'Samsung',usim:''},
  {id:11,name:'Galaxy Note9',type:'BAR',status:'보관중',os:'A10/O2.5',serial:'R39K80D3GQ',adid:'',user:'김정근',maker:'Samsung',usim:''},
  {id:12,name:'Galaxy S7',type:'BAR',status:'보관중',os:'A8.0.0/S9.0',serial:'R39HB0BNVJ',adid:'',user:'',maker:'Samsung',usim:''},
  {id:13,name:'Galaxy A23',type:'BAR',status:'보관중',os:'A14/O6.1',serial:'R59W300942X',adid:'',user:'김정근',maker:'Samsung',usim:''},
  {id:14,name:'Galaxy S25+',type:'BAR',status:'사용중',os:'A16/O8.0',serial:'R3CY208XTTV',adid:'',user:'이다은',maker:'Samsung',usim:''},
];

const cssText = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Barlow+Condensed:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
:root{
  --bg:     #f5f5f3; --bg2:     #ffffff; --bg3:     #f0efed;
  --s0:     #ebebea; --s1:      #e2e2e0; --s2:      #d4d4d2;
  --b0:     rgba(0,0,0,0.07); --b1:     rgba(0,0,0,0.12); --b2:     rgba(0,0,0,0.22);
  --t0:     #111111; --t1:      #333333; --t2:      #6b6b6b; --t3:      #a0a0a0; --t4:      #d0d0d0;
  --c-stored:  #5a6472; --c-inuse:   #1a1a1a; --c-lent:    #7a6e68;
  --c-stored-bg:  rgba(90,100,114,0.07); --c-inuse-bg:   rgba(26,26,26,0.05); --c-lent-bg:    rgba(122,110,104,0.07);
  --c-stored-border: rgba(90,100,114,0.18); --c-inuse-border:  rgba(26,26,26,0.16); --c-lent-border:   rgba(122,110,104,0.18);
  --radius:   10px; --radius-lg:16px;
  --fA: 'Anton', sans-serif; --fB: 'Barlow', sans-serif; --fC: 'Barlow Condensed', sans-serif; --fM: 'JetBrains Mono', monospace;
  --max-w: 1440px; --pad: 48px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;background:var(--bg);color:var(--t1);font-family:var(--fB);}
body::before{
  content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity:0.4;
}
.grid-bg{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(var(--b0) 1px,transparent 1px),linear-gradient(90deg,var(--b0) 1px,transparent 1px);
  background-size:60px 60px;
}
#login-screen{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:var(--bg);}
.login-wrap{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:0;}
.gear-scene{width:120px;height:80px;margin-bottom:-4px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;}
.gear-center-g{animation:gSpin 9s linear infinite;transform-origin:60px 60px;}
.gear-left-g {animation:gSpinR 6s linear infinite;transform-origin:18px 60px;}
.gear-right-g {animation:gSpin 6s linear infinite;transform-origin:102px 60px;}
@keyframes gSpin {from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes gSpinR{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
.gear-path{fill:none;stroke-linecap:round;}
.login-card{width:320px;background:var(--bg2);border:1px solid var(--b1);border-radius:20px;padding:32px 28px 24px;box-shadow:0 0 0 1px rgba(0,0,0,0.04),0 20px 60px rgba(0,0,0,0.12);animation:cardIn .65s cubic-bezier(.4,0,.2,1) both;}
@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.97);}to{opacity:1;transform:none;}}
.login-brand{text-align:center;margin-bottom:30px;}
.login-mark{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:transparent;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.login-title{font-family:var(--fA);font-size:36px;letter-spacing:3px;color:var(--t0);line-height:1;}
.login-sub{font-family:var(--fM);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-top:4px;}
.login-tabs{display:flex;background:var(--s0);border:1px solid var(--b0);border-radius:8px;padding:3px;margin-bottom:20px;gap:3px;}
.login-tab{flex:1;padding:8px;border-radius:6px;border:none;background:none;color:var(--t2);font-family:var(--fC);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
.login-tab.active{background:var(--s2);color:var(--t0);}
.lf-group{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}
.lf-label{font-family:var(--fC);font-size:10px;font-weight:600;color:var(--t3);letter-spacing:2px;text-transform:uppercase;}
.lf-input{padding:10px 14px;background:var(--s0);border:1px solid var(--b1);border-radius:8px;color:var(--t0);font-family:var(--fB);font-size:13px;font-weight:300;outline:none;transition:all .2s;}
.lf-input:focus{border-color:var(--b2);background:var(--s1);}
.lf-input::placeholder{color:var(--t3);}
.btn-login{width:100%;margin-top:4px;padding:12px;background:var(--t0);border:none;border-radius:8px;color:var(--bg);font-family:var(--fA);font-size:16px;letter-spacing:2px;cursor:pointer;transition:all .2s;}
.btn-login:hover{background:var(--t1);transform:translateY(-1px);}
.btn-login:active{transform:translateY(0);}
.login-divider{display:flex;align-items:center;gap:14px;margin:12px 0;font-family:var(--fM);font-size:9px;color:var(--t3);letter-spacing:1px;}
.login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:var(--b0);}
.btn-guest{width:100%;padding:10px;background:transparent;border:1px solid var(--b1);border-radius:8px;color:var(--t2);font-family:var(--fC);font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
.btn-guest:hover{background:var(--s0);color:var(--t1);border-color:var(--b2);}
.login-error{padding:11px 15px;border-radius:9px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--t1);font-family:var(--fM);font-size:11px;letter-spacing:.3px;display:none;margin-bottom:10px;}
.login-error.show{display:block;color:#e53e3e;}
.btn-install{position:fixed;top:24px;right:24px;z-index:1001;padding:8px 16px;background:var(--t0);color:var(--bg2);border-radius:8px;font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:1px;cursor:pointer;border:none;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.btn-install:hover{background:var(--t1);transform:translateY(-1px);}
.create-hint{font-family:var(--fM);font-size:10px;color:var(--t3);text-align:center;margin-top:10px;letter-spacing:.5px;}
.pending-section{margin-top:22px;}
.pending-label{font-family:var(--fC);font-size:11px;font-weight:600;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;}
.pending-item{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:10px;background:var(--s0);border:1px solid var(--b0);margin-bottom:6px;}
.pending-name{font-family:var(--fB);font-size:14px;font-weight:500;color:var(--t0);}
.pending-id{font-family:var(--fM);font-size:10px;color:var(--t3);margin-top:1px;}
.pending-acts{display:flex;gap:6px;}
.btn-approve{padding:5px 13px;border-radius:7px;border:1px solid var(--b1);background:transparent;color:var(--t1);font-family:var(--fC);font-size:11px;font-weight:600;letter-spacing:1px;cursor:pointer;transition:all .15s;}
.btn-approve:hover{background:var(--s1);color:var(--t0);}
.btn-reject{padding:5px 13px;border-radius:7px;border:1px solid var(--b0);background:transparent;color:var(--t3);font-family:var(--fC);font-size:11px;font-weight:600;letter-spacing:1px;cursor:pointer;transition:all .15s;}
.btn-reject:hover{color:var(--t2);}
#app{display:flex;min-height:100vh;flex-direction:column;}
.topbar{position:sticky;top:0;z-index:100;border-bottom:1px solid var(--b1);background:rgba(255,255,255,0.92);backdrop-filter:blur(28px);}
.topbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 var(--pad);height:66px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.logo{display:flex;align-items:center;gap:14px;}
.logo-mark{width:32px;height:32px;border-radius:8px;background:transparent;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.logo-wordmark{font-family:var(--fA);font-size:24px;letter-spacing:4px;color:var(--t0);line-height:1;}
.logo-sub{font-family:var(--fM);font-size:9px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-top:3px;}
.view-switcher{display:flex;gap:4px;background:var(--s0);border:1px solid var(--b0);border-radius:10px;padding:4px;}
.vsw{display:flex;align-items:center;gap:7px;padding:8px 18px;border-radius:7px;border:none;background:none;font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--t3);cursor:pointer;transition:all .2s;}
.vsw svg{opacity:.4;transition:opacity .2s;flex-shrink:0;}
.vsw:hover{color:var(--t1);}
.vsw.active{background:var(--s2);color:var(--t0);}
.vsw.active svg{opacity:1;}
.topbar-right{display:flex;align-items:center;gap:16px;}
.tb-stat{display:flex;align-items:center;gap:8px;padding:10px 18px;background:var(--s0);border:1px solid var(--b1);border-radius:9px;font-family:var(--fC);font-size:13px;font-weight:500;letter-spacing:1px;color:var(--t2);height:42px;}
.pulse-dot{width:7px;height:7px;border-radius:50%;background:var(--t2);animation:pd 2.4s ease-in-out infinite;}
@keyframes pd{0%,100%{opacity:1;}50%{opacity:.25;}}
.user-pill{display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;background:var(--s0);border:1px solid var(--b1);border-radius:40px;cursor:pointer;transition:all .2s;height:42px;}
.user-pill:hover{background:var(--s1);}
.user-av{width:30px;height:30px;border-radius:50%;background:var(--s2);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;font-family:var(--fC);font-size:12px;font-weight:700;color:var(--t0);}
.user-info-name{font-family:var(--fC);font-size:13px;font-weight:600;letter-spacing:.5px;color:var(--t1);}
.user-info-role{font-family:var(--fM);font-size:9px;color:var(--t3);letter-spacing:1px;text-transform:uppercase;}
.btn-add{display:flex;align-items:center;gap:8px;padding:0 26px;background:var(--t0);border:none;border-radius:9px;font-family:var(--fA);font-size:16px;letter-spacing:2px;color:var(--bg2);cursor:pointer;transition:all .2s;height:42px;white-space:nowrap;}
.btn-add:hover{opacity:.85;transform:translateY(-1px);}
.btn-add:active{transform:none;}
.btn-logout{padding:0 20px;background:var(--s0);border:1px solid var(--b1);border-radius:9px;font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--t2);cursor:pointer;transition:all .2s;height:42px;white-space:nowrap;}
.btn-logout:hover{color:var(--t0);border-color:var(--b2);background:var(--s1);}
.main{flex:1;}
.main-inner{max-width:var(--max-w);margin:0 auto;padding:40px var(--pad) 60px;display:flex;flex-direction:column;gap:32px;}
.guest-banner{display:flex;align-items:center;gap:10px;padding:13px 18px;border-radius:10px;background:rgba(0,0,0,0.03);border:1px solid var(--b1);font-family:var(--fM);font-size:11px;color:var(--t2);letter-spacing:.5px;}
.controls-row{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.search-box{display:flex;align-items:center;gap:10px;padding:11px 16px;background:var(--s0);border:1px solid var(--b1);border-radius:10px;transition:all .2s;width:260px;}
.search-box:focus-within{border-color:var(--b2);background:var(--s1);}
.search-box svg{color:var(--t3);flex-shrink:0;}
.search-box input{background:none;border:none;outline:none;font-family:var(--fB);font-size:14px;font-weight:300;color:var(--t0);width:100%;}
.search-box input::placeholder{color:var(--t3);}
.chips-group{display:flex;align-items:center;gap:6px;}
.chips-label{font-family:var(--fC);font-size:10px;font-weight:600;color:var(--t3);letter-spacing:2px;text-transform:uppercase;padding-right:2px;}
.chip{padding:7px 14px;border-radius:8px;border:1px solid var(--b0);background:var(--s0);font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--t3);cursor:pointer;transition:all .2s;}
.chip:hover{border-color:var(--b1);color:var(--t1);}
.chip.active{background:var(--s2);border-color:var(--b2);color:var(--t0);}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.stat-card{background:var(--bg2);border:1px solid var(--b0);border-radius:var(--radius-lg);padding:28px 24px 22px;cursor:pointer;transition:all .3s ease;position:relative;overflow:hidden;}
.stat-card:hover{border-color:var(--b1);transform:translateY(-2px);}
.stat-num{font-family:var(--fA);font-size:64px;line-height:1;letter-spacing:-1px;color:var(--t0);margin-bottom:8px;}
.stat-lbl{font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--t3);margin-bottom:18px;}
.stat-bar-t{height:1px;background:var(--b0);}
.stat-bar-f{height:100%;background:var(--t2);transition:width 1.1s cubic-bezier(.4,0,.2,1);}
.kanban-board{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start;}
.kanban-col{background:var(--bg2);border:1px solid var(--b0);border-radius:var(--radius-lg);overflow:hidden;}
.kanban-header{padding:20px 22px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--b0);}
.col-title-wrap{display:flex;align-items:center;gap:10px;}
.col-dot{width:7px;height:7px;border-radius:50%;}
.dot-stored{background:var(--c-stored);}
.dot-inuse{background:var(--c-inuse);animation:pd 2s ease-in-out infinite;}
.dot-lent{background:var(--c-lent);animation:pd 1.5s ease-in-out infinite;}
.col-title{font-family:var(--fA);font-size:22px;letter-spacing:2px;color:var(--t0);}
.col-cnt{font-family:var(--fA);font-size:20px;letter-spacing:1px;padding:4px 10px;border-radius:7px;background:var(--s0);color:var(--t2);}
.kanban-cards{padding:12px;display:flex;flex-direction:column;gap:8px;}
.device-card{background:var(--bg3);border:1px solid var(--b0);border-radius:var(--radius);padding:18px;cursor:pointer;transition:all .22s ease;animation:cardSlideIn .35s ease forwards;opacity:0;transform:translateY(8px);position:relative;}
@keyframes cardSlideIn{to{opacity:1;transform:none;}}
.kanban-cards .device-card:nth-child(1){animation-delay:.03s;}
.kanban-cards .device-card:nth-child(2){animation-delay:.07s;}
.kanban-cards .device-card:nth-child(3){animation-delay:.11s;}
.kanban-cards .device-card:nth-child(4){animation-delay:.15s;}
.kanban-cards .device-card:nth-child(5){animation-delay:.19s;}
.device-card:hover{border-color:var(--b1);background:var(--s0);transform:translateY(-2px);}
.device-card.selected{border-color:var(--b2);background:var(--s0);}
.device-card.selected::before{content:'';position:absolute;left:0;top:12%;bottom:12%;width:2px;background:var(--t1);border-radius:0 2px 2px 0;}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:14px;}
.card-name{font-family:var(--fB);font-size:15px;font-weight:600;color:var(--t0);line-height:1.3;}
.type-tag{padding:3px 9px;border-radius:5px;flex-shrink:0;font-family:var(--fC);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:var(--s2);border:1px solid var(--b1);color:var(--t2);}
.card-meta{display:flex;flex-direction:column;gap:5px;}
.meta-line{display:flex;align-items:center;gap:10px;}
.mk{font-family:var(--fM);font-size:9px;color:var(--t3);letter-spacing:.5px;text-transform:uppercase;min-width:22px;}
.mv{font-family:var(--fM);font-size:11px;color:var(--t2);}
.card-foot{margin-top:14px;padding-top:12px;border-top:1px solid var(--b0);display:flex;align-items:center;justify-content:space-between;}
.user-chip{display:flex;align-items:center;gap:6px;padding:4px 9px 4px 4px;border-radius:20px;background:var(--s1);border:1px solid var(--b0);}
.chip-av{width:18px;height:18px;border-radius:50%;background:var(--s2);display:flex;align-items:center;justify-content:center;font-family:var(--fC);font-size:9px;font-weight:700;color:var(--t1);}
.chip-name{font-family:var(--fB);font-size:12px;font-weight:500;color:var(--t1);}
.maker-tag{font-family:var(--fM);font-size:9px;color:var(--t3);}
.table-wrap{background:var(--bg2);border:1px solid var(--b0);border-radius:var(--radius-lg);overflow:hidden;}
.data-table{width:100%;border-collapse:collapse;}
.data-table thead tr{border-bottom:1px solid var(--b0);}
.data-table th{padding:15px 18px;text-align:left;font-family:var(--fC);font-size:10px;font-weight:600;color:var(--t3);letter-spacing:2px;text-transform:uppercase;}
.data-table td{padding:16px 18px;border-bottom:1px solid var(--b0);vertical-align:middle;}
.data-table tbody tr:last-child td{border-bottom:none;}
.data-table tbody tr{cursor:pointer;transition:background .12s;}
.data-table tbody tr:hover td{background:rgba(0,0,0,.025);}
.data-table tbody tr.selected td{background:rgba(0,0,0,.04);}
.td-name{font-family:var(--fB);font-size:15px;font-weight:600;color:var(--t0);}
.td-mono{font-family:var(--fM);font-size:11px;color:var(--t2);}
.td-dim{font-family:var(--fM);font-size:10px;color:var(--t3);}
.status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:20px;font-family:var(--fC);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.pill-stored{background:var(--c-stored-bg);border:1px solid var(--c-stored-border);color:var(--c-stored);}
.pill-inuse{background:var(--c-inuse-bg);border:1px solid var(--c-inuse-border);color:var(--c-inuse);}
.pill-lent{background:var(--c-lent-bg);border:1px solid var(--c-lent-border);color:var(--c-lent);}
.detail-panel{position:fixed;right:0;top:66px;bottom:0;width:380px;background:var(--bg2);border-left:1px solid var(--b1);transform:translateX(100%);transition:transform .33s cubic-bezier(.4,0,.2,1);z-index:50;display:flex;flex-direction:column;overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.08);}
.detail-panel.open{transform:translateX(0);}
.panel-hd{padding:28px 28px 22px;border-bottom:1px solid var(--b1);position:sticky;top:0;background:var(--bg2);z-index:1;}
.panel-close{position:absolute;right:22px;top:22px;width:30px;height:30px;border-radius:7px;background:var(--s0);border:1px solid var(--b0);color:var(--t2);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .15s;font-family:var(--fM);}
.panel-close:hover{background:var(--s1);color:var(--t0);}
.panel-icon{width:56px;height:56px;border-radius:14px;background:var(--s0);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px;}
.panel-dname{font-family:var(--fA);font-size:28px;letter-spacing:1px;color:var(--t0);margin-bottom:10px;line-height:1.1;}
.panel-tags{display:flex;gap:6px;flex-wrap:wrap;}
.panel-body{padding:22px 28px;flex:1;}
.psec{margin-bottom:26px;}
.psec-title{font-family:var(--fC);font-size:10px;font-weight:700;color:var(--t3);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:12px;}
.info-row{display:flex;align-items:center;padding:10px 12px;border-radius:8px;transition:background .12s;}
.info-row:hover{background:rgba(255,255,255,.02);}
.ik{font-family:var(--fM);font-size:10px;color:var(--t3);min-width:96px;flex-shrink:0;}
.iv{font-family:var(--fM);font-size:11px;color:var(--t1);}
.adid-box{font-family:var(--fM);font-size:10px;color:var(--t2);background:var(--s0);border:1px solid var(--b0);border-radius:9px;padding:12px 14px;word-break:break-all;line-height:1.8;}
.s-btns{display:flex;gap:7px;flex-wrap:wrap;}
.s-btn{padding:8px 15px;border-radius:8px;border:1px solid var(--b0);background:var(--s0);font-family:var(--fC);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--t2);cursor:pointer;transition:all .18s;}
.s-btn:hover{border-color:var(--b2);color:var(--t0);background:var(--s1);}
.panel-acts{padding:18px 28px 24px;border-top:1px solid var(--b0);display:flex;flex-direction:column;gap:8px;}
.act-btn{padding:12px 16px;border-radius:10px;border:1px solid var(--b1);cursor:pointer;font-family:var(--fA);font-size:17px;letter-spacing:2px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s;}
.act-btn.primary{background:var(--t0);color:var(--bg);border-color:transparent;}
.act-btn.primary:hover{background:var(--t1);transform:translateY(-1px);}
.act-btn.danger{background:transparent;color:var(--t2);border-color:var(--b0);}
.act-btn.danger:hover{color:var(--t0);border-color:var(--b1);}
.modal-overlay{display:flex;position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);z-index:150;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s;}
.modal-overlay.open{opacity:1;pointer-events:auto;}
.modal{background:var(--bg2);border:1px solid var(--b1);border-radius:20px;padding:36px;width:510px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.15);transform:translateY(20px);transition:transform .3s cubic-bezier(.4,0,.2,1);}
.modal-overlay.open .modal{transform:none;}
.modal-title{font-family:var(--fA);font-size:36px;letter-spacing:2px;color:var(--t0);margin-bottom:26px;}
.form-group{margin-bottom:16px;}
.form-label{font-family:var(--fC);font-size:10px;font-weight:700;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px;display:block;}
.form-input{width:100%;padding:12px 15px;background:var(--s0);border:1px solid var(--b1);border-radius:10px;color:var(--t0);font-family:var(--fB);font-size:14px;font-weight:300;outline:none;transition:all .2s;}
.form-input:focus{border-color:var(--b2);background:var(--s1);}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.modal-acts{display:flex;gap:10px;margin-top:26px;justify-content:flex-end;}
.btn-cancel{padding:11px 22px;background:var(--s0);border:1px solid var(--b1);border-radius:10px;color:var(--t2);font-family:var(--fC);font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .18s;}
.btn-cancel:hover{background:var(--s1);color:var(--t0);}
.btn-save{padding:11px 28px;background:var(--t0);border:none;border-radius:10px;color:var(--bg);font-family:var(--fA);font-size:18px;letter-spacing:2px;cursor:pointer;transition:all .18s;}
.btn-save:hover{background:var(--t1);transform:translateY(-1px);}
.toast-container{position:fixed;bottom:28px;right:28px;z-index:200;display:flex;flex-direction:column;gap:8px;}
.toast{padding:13px 20px;background:var(--s1);border:1px solid var(--b1);border-radius:11px;font-family:var(--fB);font-size:13px;font-weight:400;color:var(--t1);box-shadow:0 12px 40px rgba(0,0,0,.4);display:flex;align-items:center;gap:10px;animation:tIn .28s cubic-bezier(.4,0,.2,1) both;max-width:320px;}
@keyframes tIn{from{transform:translateY(16px) scale(.96);opacity:0;}to{transform:none;opacity:1;}}
.toast.removing{animation:tOut .25s cubic-bezier(.4,0,.2,1) both;}
@keyframes tOut{to{transform:translateY(10px) scale(.96);opacity:0;}}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px;gap:10px;text-align:center;}
.empty-icon{font-size:32px;opacity:.2;}
.empty-text{font-family:var(--fM);font-size:10px;color:var(--t3);letter-spacing:1.5px;text-transform:uppercase;}
.page-in{animation:pgIn .45s cubic-bezier(.4,0,.2,1) both;}
@keyframes pgIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--s2);border-radius:2px;}
.app-body{display:flex;flex:1;min-height:0;}
.sidebar{width:240px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--b1);display:flex;flex-direction:column;padding:24px 16px;gap:4px;position:sticky;top:66px;height:calc(100vh - 66px);overflow-y:auto;}
.sb-section-label{font-family:var(--fC);font-size:10px;font-weight:700;color:var(--t3);letter-spacing:2px;text-transform:uppercase;padding:0 12px;margin:16px 0 6px;}
.sb-section-label:first-child{margin-top:0;}
.sb-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;border:1px solid transparent;font-family:var(--fC);font-size:13px;font-weight:600;letter-spacing:.5px;color:var(--t2);cursor:pointer;transition:all .18s;position:relative;}
.sb-item:hover{background:var(--s0);color:var(--t0);}
.sb-item.active{background:var(--s0);border-color:var(--b1);color:var(--t0);}
.sb-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--t0);border-radius:0 2px 2px 0;}
.sb-icon{width:18px;height:18px;flex-shrink:0;opacity:.5;}
.sb-item.active .sb-icon,.sb-item:hover .sb-icon{opacity:1;}
.sb-divider{height:1px;background:var(--b0);margin:8px 0;}
.page-content{flex:1;overflow-y:auto;min-width:0;}
.dash-inner{max-width:var(--max-w);margin:0 auto;padding:48px var(--pad) 64px;display:flex;flex-direction:column;gap:36px;}
.dash-greeting{display:flex;flex-direction:column;gap:6px;}
.dash-greet-main{font-family:var(--fA);font-size:52px;letter-spacing:1px;line-height:1;color:var(--t0);}
.dash-greet-sub{font-family:var(--fM);font-size:11px;color:var(--t3);letter-spacing:1.5px;}
.dash-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.dash-card{background:var(--bg2);border:1px solid var(--b0);border-radius:var(--radius-lg);padding:32px 28px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;}
.dash-card:hover{border-color:var(--b2);transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08);}
.dash-card-icon{font-size:28px;margin-bottom:4px;}
.dash-card-title{font-family:var(--fA);font-size:26px;letter-spacing:1px;color:var(--t0);}
.dash-card-desc{font-family:var(--fB);font-size:13px;font-weight:300;color:var(--t2);line-height:1.6;}
.dash-card-arrow{position:absolute;right:24px;bottom:24px;font-family:var(--fC);font-size:18px;color:var(--t3);transition:all .18s;}
.dash-card:hover .dash-card-arrow{color:var(--t0);transform:translateX(4px);}
.dash-card-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;background:var(--s0);border:1px solid var(--b0);font-family:var(--fC);font-size:11px;font-weight:700;letter-spacing:1px;color:var(--t2);align-self:flex-start;margin-top:4px;}
`;

export default function App() {
  const [appState, setAppState] = useState('login'); // 'login' or 'app'
  const [loginTab, setLoginTab] = useState('login');
  
  // Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  
  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [createName, setCreateName] = useState('');
  const [createId, setCreateId] = useState('');
  const [createPw, setCreatePw] = useState('');
  const [createError, setCreateError] = useState('');

  // App data state
  const [devices, setDevices] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  
  // App view state
  const [activePage, setActivePage] = useState('dashboard');
  const [currentView, setCurrentView] = useState('kanban');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentTypeFilter, setCurrentTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalData, setModalData] = useState({
    name: '', type: 'BAR', status: '보관중', os: '', serial: '', user: '', maker: 'Samsung', usim: '', adid: ''
  });

  const [toasts, setToasts] = useState([]);
  const seedAttempted = useRef(false);

  useEffect(() => {
    const manifest = {
      name: "Q Base",
      short_name: "Q Base",
      start_url: ".",
      display: "standalone",
      background_color: "#f5f5f3",
      theme_color: "#111111",
      icons: [{
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23111111'/%3E%3Ctext x='50' y='65' font-size='50' fill='white' text-anchor='middle' font-family='sans-serif'%3EQ%3C/text%3E%3C/svg%3E",
        sizes: "192x192",
        type: "image/svg+xml"
      }]
    };
    const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestURL;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      URL.revokeObjectURL(manifestURL);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try { await signInWithCustomToken(auth, __initial_auth_token); } catch(e){}
      }
    };
    initAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'accounts', user.uid));
          if (docSnap.exists()) {
             const userData = docSnap.data();
             if (userData.approved) {
                 setCurrentUser({ ...userData, uid: user.uid });
                 setIsGuest(false);
                 setAppState('app');
                 setActivePage('dashboard');
             } else {
                 signOut(auth);
                 setLoginError('아직 관리자 승인 대기 중입니다.');
             }
          } else {
             const isSysAdmin = user.email === makeEmail(ADMIN_ID);
             setCurrentUser({ name: isSysAdmin ? '관리자' : (user.displayName || 'User'), role: isSysAdmin ? 'admin' : 'member', uid: user.uid, approved: true });
             setIsGuest(false);
             setAppState('app');
             setActivePage('dashboard');
          }
        } catch (e) { console.error(e); }
      } else {
        if (!isGuest) {
          setCurrentUser(null);
          setAppState('login');
        }
      }
    });
    return () => unsub();
  }, [isGuest]);

  useEffect(() => {
    if (!currentUser && !isGuest) return;

    const unsubDevices = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'devices'), (snapshot) => {
        const newDevs = [];
        snapshot.forEach(d => newDevs.push({ id: d.id, ...d.data() }));

        if (newDevs.length === 0 && currentUser?.role === 'admin' && !seedAttempted.current) {
            seedAttempted.current = true;
            initialDevices.forEach(d => {
                const dCopy = { ...d };
                delete dCopy.id;
                setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'devices', String(d.id)), dCopy)
                  .catch(e => console.error("Seed error:", e));
            });
        } else if (newDevs.length > 0) {
            setDevices(newDevs);
        }
    }, (err) => {
        console.error("DB Error", err);
        showToast("데이터베이스 연결 실패. 규칙을 확인하세요.");
    });

    let unsubPending = () => {};
    if (currentUser?.role === 'admin') {
        unsubPending = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'pendingAccounts'), (snapshot) => {
            const pending = [];
            snapshot.forEach(d => pending.push({ _docId: d.id, ...d.data() }));
            setPendingAccounts(pending);
        });
    }

    return () => { unsubDevices(); unsubPending(); };
  }, [currentUser, isGuest]);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, {id, msg, removing: false}]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? {...t, removing: true} : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 260);
    }, 2600);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      showToast("현재 브라우저 환경에서는 설치를 지원하지 않거나 이미 설치되어 있습니다.");
    }
  };

  const handleLogin = () => {
    setLoginError('');
    if (loginId === ADMIN_ID && loginPw === ADMIN_PW) {
       signInWithEmailAndPassword(auth, makeEmail(loginId), loginPw)
       .catch((err1) => {
           if(err1.code === 'auth/operation-not-allowed') {
               setCurrentUser({ id: loginId, name: '관리자', role: 'admin', uid: 'admin_bypass', approved: true });
               setIsGuest(false); setAppState('app'); setActivePage('dashboard');
               return;
           }
           createUserWithEmailAndPassword(auth, makeEmail(loginId), loginPw)
           .then((cred) => {
               return setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'accounts', cred.user.uid), {
                   id: loginId, name: '관리자', role: 'admin', approved: true
               });
           })
           .catch(e => { 
               if(e.code === 'auth/operation-not-allowed') {
                   setCurrentUser({ id: loginId, name: '관리자', role: 'admin', uid: 'admin_bypass', approved: true });
                   setIsGuest(false); setAppState('app'); setActivePage('dashboard');
               } else {
                   setLoginError('로그인 실패: ' + e.message); 
               }
           });
       });
       return;
    }

    signInWithEmailAndPassword(auth, makeEmail(loginId), loginPw)
    .catch(() => setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.'));
  };

  const handleGuestLogin = () => {
    setCurrentUser({name: 'GUEST', role: 'guest'});
    setIsGuest(true);
    setAppState('app');
    setActivePage('dashboard');
  };

  const handleCreateAccount = () => {
    setCreateError('');
    if(!createName || !createId || !createPw) {
      setCreateError('모든 항목을 입력해주세요.');
      return;
    }
    const docRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'pendingAccounts'));
    setDoc(docRef, { id: createId, pw: createPw, name: createName, role: 'member', approved: false })
    .then(() => {
        showToast(`"${createName}" 계정 등록 요청이 접수되었습니다.`);
        setCreateName(''); setCreateId(''); setCreatePw('');
        setLoginTab('login');
    })
    .catch(e => setCreateError('오류 발생: ' + e.message));
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setCurrentUser(null);
      setIsGuest(false);
      setIsDetailOpen(false);
      setSelectedId(null);
      setLoginId('');
      setLoginPw('');
      setAppState('login');
    });
  };

  const approveAccount = (acc) => {
    createUserWithEmailAndPassword(auth, makeEmail(acc.id), acc.pw)
    .then((cred) => {
        setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'accounts', cred.user.uid), {
            id: acc.id, name: acc.name, role: acc.role, approved: true
        });
        deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pendingAccounts', acc._docId));
        showToast(`"${acc.name}" 계정이 승인되었습니다.`);
    });
  };

  const rejectAccount = (acc) => {
    deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pendingAccounts', acc._docId));
    showToast(`"${acc.name}" 요청을 거절했습니다.`);
  };

  const openAddModal = () => {
    if (isGuest) { showToast('게스트는 추가할 수 없습니다.'); return; }
    setEditingId(null);
    setModalData({ name: '', type: 'BAR', status: '보관중', os: '', serial: '', user: '', maker: 'Samsung', usim: '', adid: '' });
    setIsModalOpen(true);
  };

  const editDevice = () => {
    if (!selectedId) return;
    const d = devices.find(x => x.id === selectedId);
    setEditingId(selectedId);
    setModalData({ ...d });
    setIsModalOpen(true);
  };

  const saveDevice = () => {
    if(!modalData.name.trim()){ showToast('시료 명을 입력하세요.'); return; }
    const payload = { ...modalData };
    if(!payload.maker) payload.maker = 'Samsung';

    if(editingId) {
        updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'devices', String(editingId)), payload)
        .then(() => showToast(`${payload.name} 수정 완료`))
        .catch(() => showToast('수정 권한 오류'));
    } else {
        const newRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'devices'));
        setDoc(newRef, payload)
        .then(() => showToast(`${payload.name} 등록 완료`))
        .catch(() => showToast('등록 권한 오류'));
    }
    setIsModalOpen(false);
  };

  const triggerDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const d = devices.find(x => x.id === selectedId);
    deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'devices', String(selectedId)))
    .then(() => {
        setIsDetailOpen(false);
        setSelectedId(null);
        showToast(`${d.name} 삭제 완료`);
        setIsDeleteModalOpen(false);
    });
  };

  const changeStatus = (newStatus) => {
    if(isGuest){ showToast('게스트는 수정할 수 없습니다.'); return; }
    if(!selectedId) return;
    updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'devices', String(selectedId)), { status: newStatus })
    .then(() => showToast(`상태 변경: ${newStatus}`));
  };

  const filteredDevices = devices.filter(d => {
    const sm = currentFilter === 'all' || d.status === currentFilter;
    const tm = currentTypeFilter === 'all' || d.type === currentTypeFilter;
    const qm = !searchQuery || d.name.toLowerCase().includes(searchQuery) || (d.serial && d.serial.toLowerCase().includes(searchQuery)) || (d.user && d.user.toLowerCase().includes(searchQuery));
    return sm && tm && qm;
  });

  const stats = {
    total: devices.length,
    inUse: devices.filter(d => d.status === '사용중').length,
    lent: devices.filter(d => d.status === '대여중').length,
    stored: devices.filter(d => d.status === '보관중').length,
  };

  const getBadge = (t) => <span className="type-tag">{t}</span>;
  const getStatus = (s) => {
    const c = s==='사용중'?'inuse':s==='대여중'?'lent':'stored';
    const dot = s==='사용중'?'dot-inuse':s==='대여중'?'dot-lent':'dot-stored';
    return <span className={`status-pill pill-${c}`}><span className={`col-dot ${dot}`} style={{width:'5px',height:'5px',flexShrink:0}}></span>{s}</span>;
  };
  const getUser = (d) => {
    if(!d.user) return <span className="maker-tag">—</span>;
    return <div className="user-chip"><div className="chip-av">{d.user.charAt(0)}</div><span className="chip-name">{d.user}</span></div>;
  };

  const selectedDeviceObj = devices.find(x => x.id === selectedId);

  if (appState === 'login') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: cssText }} />
        <div className="grid-bg"></div>
        <div id="login-screen">
          <button className="btn-install" onClick={handleInstallClick}>INSTALL APP</button>
          <div className="login-wrap">
            <div className="gear-scene">
              <svg width="120" height="80" viewBox="0 0 120 80" overflow="visible">
                <g className="gear-left-g" transform="translate(18,60)">
                  <circle r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5"/>
                  <circle r="4" fill="rgba(255,255,255,0.1)"/>
                  <g fill="rgba(255,255,255,0.1)" stroke="none">
                    <rect x="-3" y="-21" width="6" height="8" rx="2"/>
                    <rect x="-3" y="13" width="6" height="8" rx="2"/>
                    <rect x="13" y="-3" width="8" height="6" rx="2"/>
                    <rect x="-21" y="-3" width="8" height="6" rx="2"/>
                    <rect x="7" y="-19" width="6" height="8" rx="2" transform="rotate(45)"/>
                    <rect x="-13" y="-19" width="6" height="8" rx="2" transform="rotate(-45)"/>
                    <rect x="7" y="11" width="6" height="8" rx="2" transform="rotate(-45)"/>
                    <rect x="-13" y="11" width="6" height="8" rx="2" transform="rotate(45)"/>
                  </g>
                </g>
                <g className="gear-center-g" transform="translate(60,60)">
                  <circle r="22" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="7"/>
                  <circle r="7" fill="rgba(255,255,255,0.18)"/>
                  <g fill="rgba(255,255,255,0.18)">
                    <rect x="-4.5" y="-32" width="9" height="12" rx="2.5"/>
                    <rect x="-4.5" y="20" width="9" height="12" rx="2.5"/>
                    <rect x="20" y="-4.5" width="12" height="9" rx="2.5"/>
                    <rect x="-32" y="-4.5" width="12" height="9" rx="2.5"/>
                    <rect x="11" y="-29" width="9" height="12" rx="2.5" transform="rotate(45)"/>
                    <rect x="-20" y="-29" width="9" height="12" rx="2.5" transform="rotate(-45)"/>
                    <rect x="11" y="17" width="9" height="12" rx="2.5" transform="rotate(-45)"/>
                    <rect x="-20" y="17" width="9" height="12" rx="2.5" transform="rotate(45)"/>
                  </g>
                </g>
                <g className="gear-right-g" transform="translate(102,60)">
                  <circle r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5"/>
                  <circle r="4" fill="rgba(255,255,255,0.1)"/>
                  <g fill="rgba(255,255,255,0.1)">
                    <rect x="-3" y="-21" width="6" height="8" rx="2"/>
                    <rect x="-3" y="13" width="6" height="8" rx="2"/>
                    <rect x="13" y="-3" width="8" height="6" rx="2"/>
                    <rect x="-21" y="-3" width="8" height="6" rx="2"/>
                    <rect x="7" y="-19" width="6" height="8" rx="2" transform="rotate(45)"/>
                    <rect x="-13" y="-19" width="6" height="8" rx="2" transform="rotate(-45)"/>
                    <rect x="7" y="11" width="6" height="8" rx="2" transform="rotate(-45)"/>
                    <rect x="-13" y="11" width="6" height="8" rx="2" transform="rotate(45)"/>
                  </g>
                </g>
              </svg>
            </div>

            <div className="login-card">
              <div className="login-brand">
                <div style={{display:'flex',justifyContent:'center',marginBottom:'12px'}}>
                  <img className="login-mark" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23111111'/%3E%3Ctext x='50' y='65' font-size='50' fill='white' text-anchor='middle' font-family='sans-serif'%3EQ%3C/text%3E%3C/svg%3E" alt="Q Base Icon" />
                </div>
                <div className="login-title">Q BASE</div>
                <div className="login-sub">QA Management System</div>
              </div>

              <div className="login-tabs">
                <button className={`login-tab ${loginTab==='login'?'active':''}`} onClick={()=>setLoginTab('login')}>LOGIN</button>
                <button className={`login-tab ${loginTab==='create'?'active':''}`} onClick={()=>setLoginTab('create')}>CREATE</button>
              </div>

              {loginTab === 'login' && (
                <div>
                  <div className="lf-group">
                    <label className="lf-label">ID</label>
                    <input className="lf-input" type="text" placeholder="아이디" autoComplete="off" value={loginId} onChange={e=>setLoginId(e.target.value)} />
                  </div>
                  <div className="lf-group">
                    <label className="lf-label">Password</label>
                    <input className="lf-input" type="password" placeholder="비밀번호" value={loginPw} onChange={e=>setLoginPw(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')handleLogin()}}/>
                  </div>
                  <div className={`login-error ${loginError?'show':''}`}>{loginError}</div>
                  <button className="btn-login" onClick={handleLogin}>LOGIN</button>
                  <div className="login-divider">OR</div>
                  <button className="btn-guest" onClick={handleGuestLogin}>CONTINUE AS GUEST  ·  VIEW ONLY</button>

                  {pendingAccounts.length > 0 && (
                    <div className="pending-section show">
                      <div className="pending-label">// Pending Approvals</div>
                      <div>
                        {pendingAccounts.map(a => (
                          <div key={a._docId} className="pending-item">
                            <div><div className="pending-name">{a.name}</div><div className="pending-id">{a.id}</div></div>
                            <div className="pending-acts">
                              <button className="btn-approve" onClick={()=>approveAccount(a)}>APPROVE</button>
                              <button className="btn-reject" onClick={()=>rejectAccount(a)}>REJECT</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loginTab === 'create' && (
                <div>
                  <div className="lf-group">
                    <label className="lf-label">Name</label>
                    <input className="lf-input" type="text" placeholder="홍길동" value={createName} onChange={e=>setCreateName(e.target.value)}/>
                  </div>
                  <div className="lf-group">
                    <label className="lf-label">ID</label>
                    <input className="lf-input" type="text" placeholder="사용할 아이디" autoComplete="off" value={createId} onChange={e=>setCreateId(e.target.value)}/>
                  </div>
                  <div className="lf-group">
                    <label className="lf-label">Password</label>
                    <input className="lf-input" type="password" placeholder="비밀번호" value={createPw} onChange={e=>setCreatePw(e.target.value)}/>
                  </div>
                  <div className={`login-error ${createError?'show':''}`}>{createError}</div>
                  <button className="btn-login" onClick={handleCreateAccount}>REQUEST ACCOUNT</button>
                  <div className="create-hint">Requires admin approval before login</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast ${t.removing?'removing':''}`}><span style={{color:'var(--t2)',fontSize:'14px'}}>◆</span><span>{t.msg}</span></div>)}
        </div>
      </>
    );
  }

  const renderKanbanCol = (statusName, colId, dotClass) => {
    const items = filteredDevices.filter(d => d.status === statusName);
    return (
      <div className="kanban-col">
        <div className="kanban-header">
          <div className="col-title-wrap"><div className={`col-dot ${dotClass}`}></div><div className="col-title">{statusName}</div></div>
          <div className="col-cnt">{items.length}</div>
        </div>
        <div className="kanban-cards">
          {items.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">○</div><div className="empty-text">No Devices</div></div>
          ) : items.map(d => (
            <div key={d.id} className={`device-card ${selectedId===d.id?'selected':''}`} onClick={()=>{setSelectedId(d.id); setIsDetailOpen(true);}}>
              <div className="card-top"><div className="card-name">{d.name}</div>{getBadge(d.type)}</div>
              <div className="card-meta">
                <div className="meta-line"><span className="mk">OS</span><span className="mv">{d.os}</span></div>
                <div className="meta-line"><span className="mk">S/N</span><span className="mv">{d.serial}</span></div>
              </div>
              <div className="card-foot">{getUser(d)}<span className="maker-tag">{d.maker}</span></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <div className="grid-bg"></div>
      <div id="app" className="visible">
        
        <header className="topbar">
          <div className="topbar-inner">
            <div className="logo">
              <img className="logo-mark" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23111111'/%3E%3Ctext x='50' y='65' font-size='50' fill='white' text-anchor='middle' font-family='sans-serif'%3EQ%3C/text%3E%3C/svg%3E" alt="Q Base Icon" />
              <div>
                <div className="logo-wordmark">Q BASE</div>
                <div className="logo-sub">QA Management System</div>
              </div>
            </div>

            {activePage === 'devices' && (
              <div className="view-switcher">
                <button className={`vsw ${currentView==='kanban'?'active':''}`} onClick={()=>setCurrentView('kanban')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/><rect x="14" y="17" width="7" height="4" rx="1"/></svg>
                  KANBAN
                </button>
                <button className={`vsw ${currentView==='table'?'active':''}`} onClick={()=>setCurrentView('table')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  LIST
                </button>
              </div>
            )}

            <div className="topbar-right">
              <div className="tb-stat">
                <div className="pulse-dot"></div>
                <span>대여 중 {stats.lent}대</span>
              </div>
              <div className="user-pill" onClick={()=>currentUser?.role==='admin'&&pendingAccounts.length>0&&showToast(`대기 중인 계정 요청 ${pendingAccounts.length}건이 있습니다.`)}>
                <div className="user-av">{currentUser?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="user-info-name">{currentUser?.name}</div>
                  <div className="user-info-role">{isGuest ? 'GUEST' : currentUser?.role.toUpperCase()}</div>
                </div>
              </div>
              {!isGuest && activePage === 'devices' && (
                <button className="btn-add" onClick={openAddModal}>+ ADD</button>
              )}
              <button className="btn-logout" onClick={handleLogout}>LOGOUT</button>
            </div>
          </div>
        </header>

        <div className="app-body">
          <nav className="sidebar">
            <div className="sb-section-label">메뉴</div>
            <div className={`sb-item ${activePage==='dashboard'?'active':''}`} onClick={()=>setActivePage('dashboard')}>
              <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              대시보드
            </div>
            <div className={`sb-item ${activePage==='devices'?'active':''}`} onClick={()=>setActivePage('devices')}>
              <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Devices
            </div>
            <div className="sb-divider"></div>
            <div className="sb-section-label">시스템</div>
            <div className="sb-item" style={{cursor:'default',opacity:.5}}>
              <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              더 많은 메뉴 준비 중
            </div>
          </nav>

          <div className="page-content">
            {activePage === 'dashboard' && (
              <div className="dash-inner page-in">
                <div className="dash-greeting">
                  <div className="dash-greet-main">안녕하세요, {currentUser?.name}님</div>
                  <div className="dash-greet-sub">{`// ${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2,'0')}.${String(new Date().getDate()).padStart(2,'0')} · Q BASE`}</div>
                </div>

                <div className="dash-cards">
                  <div className="dash-card" onClick={()=>setActivePage('devices')}>
                    <div className="dash-card-icon">📱</div>
                    <div className="dash-card-title">Devices</div>
                    <div className="dash-card-desc">시료 현황을 확인하고 대여·사용·보관 상태를 관리합니다.</div>
                    <div className="dash-card-badge"><span className="pulse-dot" style={{width:'6px',height:'6px'}}></span><span>{stats.total}대 등록됨</span></div>
                    <div className="dash-card-arrow">→</div>
                  </div>
                  <div className="dash-card" style={{opacity:.45,cursor:'default'}}>
                    <div className="dash-card-icon">📋</div>
                    <div className="dash-card-title">테스트 케이스</div>
                    <div className="dash-card-desc">테스트 케이스와 실행 결과를 관리합니다.</div>
                    <div className="dash-card-badge">준비 중</div>
                  </div>
                  <div className="dash-card" style={{opacity:.45,cursor:'default'}}>
                    <div className="dash-card-icon">🐞</div>
                    <div className="dash-card-title">버그 트래커</div>
                    <div className="dash-card-desc">발견된 버그를 등록하고 이슈를 추적합니다.</div>
                    <div className="dash-card-badge">준비 중</div>
                  </div>
                </div>

                <div className="stat-row">
                  <div className="stat-card" onClick={()=>{setActivePage('devices');setCurrentFilter('all');}}>
                    <div className="stat-num">{stats.total}</div>
                    <div className="stat-lbl">전체 시료</div>
                    <div className="stat-bar-t"><div className="stat-bar-f" style={{width:'100%'}}></div></div>
                  </div>
                  <div className="stat-card" onClick={()=>{setActivePage('devices');setCurrentFilter('사용중');}}>
                    <div className="stat-num">{stats.inUse}</div>
                    <div className="stat-lbl">사용 중</div>
                    <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.inUse/stats.total*100)}%` : '0%'}}></div></div>
                  </div>
                  <div className="stat-card" onClick={()=>{setActivePage('devices');setCurrentFilter('대여중');}}>
                    <div className="stat-num">{stats.lent}</div>
                    <div className="stat-lbl">대여 중</div>
                    <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.lent/stats.total*100)}%` : '0%'}}></div></div>
                  </div>
                  <div className="stat-card" onClick={()=>{setActivePage('devices');setCurrentFilter('보관중');}}>
                    <div className="stat-num">{stats.stored}</div>
                    <div className="stat-lbl">보관 중</div>
                    <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.stored/stats.total*100)}%` : '0%'}}></div></div>
                  </div>
                </div>
              </div>
            )}

            {activePage === 'devices' && (
              <main className="main">
                <div className="main-inner page-in">
                  {isGuest && (
                    <div className="guest-banner">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      GUEST MODE — 조회 전용입니다. 데이터 수정·추가·삭제는 불가합니다.
                    </div>
                  )}

                  <div className="controls-row">
                    <div className="search-box">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      <input type="text" placeholder="이름 · 시리얼 · 사용자 검색" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
                    </div>
                    <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
                      <div className="chips-group">
                        <span className="chips-label">상태</span>
                        <div className={`chip ${currentFilter==='all'?'active':''}`} onClick={()=>setCurrentFilter('all')}>전체</div>
                        <div className={`chip ${currentFilter==='사용중'?'active':''}`} onClick={()=>setCurrentFilter('사용중')}>사용중</div>
                        <div className={`chip ${currentFilter==='대여중'?'active':''}`} onClick={()=>setCurrentFilter('대여중')}>대여중</div>
                        <div className={`chip ${currentFilter==='보관중'?'active':''}`} onClick={()=>setCurrentFilter('보관중')}>보관중</div>
                      </div>
                      <div className="chips-group">
                        <span className="chips-label">형태</span>
                        <div className={`chip ${currentTypeFilter==='all'?'active':''}`} onClick={()=>setCurrentTypeFilter('all')}>전체</div>
                        <div className={`chip ${currentTypeFilter==='FOLD'?'active':''}`} onClick={()=>setCurrentTypeFilter('FOLD')}>FOLD</div>
                        <div className={`chip ${currentTypeFilter==='FLIP'?'active':''}`} onClick={()=>setCurrentTypeFilter('FLIP')}>FLIP</div>
                        <div className={`chip ${currentTypeFilter==='BAR'?'active':''}`} onClick={()=>setCurrentTypeFilter('BAR')}>BAR</div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-row">
                    <div className="stat-card" onClick={()=>setCurrentFilter('all')}>
                      <div className="stat-num">{stats.total}</div>
                      <div className="stat-lbl">전체 시료</div>
                      <div className="stat-bar-t"><div className="stat-bar-f" style={{width:'100%'}}></div></div>
                    </div>
                    <div className="stat-card" onClick={()=>setCurrentFilter('사용중')}>
                      <div className="stat-num">{stats.inUse}</div>
                      <div className="stat-lbl">사용 중</div>
                      <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.inUse/stats.total*100)}%` : '0%'}}></div></div>
                    </div>
                    <div className="stat-card" onClick={()=>setCurrentFilter('대여중')}>
                      <div className="stat-num">{stats.lent}</div>
                      <div className="stat-lbl">대여 중</div>
                      <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.lent/stats.total*100)}%` : '0%'}}></div></div>
                    </div>
                    <div className="stat-card" onClick={()=>setCurrentFilter('보관중')}>
                      <div className="stat-num">{stats.stored}</div>
                      <div className="stat-lbl">보관 중</div>
                      <div className="stat-bar-t"><div className="stat-bar-f" style={{width: stats.total ? `${(stats.stored/stats.total*100)}%` : '0%'}}></div></div>
                    </div>
                  </div>

                  {currentView === 'kanban' && (
                    <div className="kanban-board">
                      {renderKanbanCol('보관중', 'stored', 'dot-stored')}
                      {renderKanbanCol('사용중', 'inuse', 'dot-inuse')}
                      {renderKanbanCol('대여중', 'lent', 'dot-lent')}
                    </div>
                  )}

                  {currentView === 'table' && (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr><th>시료 명</th><th>형태</th><th>상태</th><th>OS</th><th>시리얼 번호</th><th>대여/사용자</th><th>제조사</th></tr>
                        </thead>
                        <tbody>
                          {filteredDevices.map(d => (
                            <tr key={d.id} className={selectedId === d.id ? 'selected' : ''} onClick={()=>{setSelectedId(d.id); setIsDetailOpen(true);}}>
                              <td className="td-name">{d.name}</td>
                              <td>{getBadge(d.type)}</td>
                              <td>{getStatus(d.status)}</td>
                              <td className="td-mono">{d.os}</td>
                              <td className="td-dim">{d.serial}</td>
                              <td>{d.user ? getUser(d) : <span className="td-dim">—</span>}</td>
                              <td className="td-dim">{d.maker}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </main>
            )}
          </div>
        </div>
        
        <div className={`detail-panel ${isDetailOpen ? 'open' : ''}`}>
          {selectedDeviceObj && (
            <>
              <div className="panel-hd">
                <button className="panel-close" onClick={()=>setIsDetailOpen(false)}>✕</button>
                <div className="panel-icon">{selectedDeviceObj.type === 'FLIP' ? '📲' : '📱'}</div>
                <div className="panel-dname">{selectedDeviceObj.name}</div>
                <div className="panel-tags">{getBadge(selectedDeviceObj.type)} {getStatus(selectedDeviceObj.status)}</div>
              </div>
              <div className="panel-body">
                <div className="psec">
                  <div className="psec-title">기기 정보</div>
                  <div>
                    <div className="info-row"><span className="ik">시료 명</span><span className="iv">{selectedDeviceObj.name}</span></div>
                    <div className="info-row"><span className="ik">시료 형태</span><span className="iv">{selectedDeviceObj.type}</span></div>
                    <div className="info-row"><span className="ik">시료 상태</span><span className="iv">{selectedDeviceObj.status}</span></div>
                    <div className="info-row"><span className="ik">OS</span><span className="iv">{selectedDeviceObj.os}</span></div>
                    <div className="info-row"><span className="ik">시리얼 번호</span><span className="iv">{selectedDeviceObj.serial||'—'}</span></div>
                    <div className="info-row"><span className="ik">대여/사용자</span><span className="iv">{selectedDeviceObj.user||'—'}</span></div>
                    <div className="info-row"><span className="ik">제조사</span><span className="iv">{selectedDeviceObj.maker}</span></div>
                    <div className="info-row"><span className="ik">USIM</span><span className="iv">{selectedDeviceObj.usim||'—'}</span></div>
                  </div>
                </div>
                {selectedDeviceObj.adid && (
                  <div className="psec">
                    <div className="psec-title">ADID</div>
                    <div className="adid-box">{selectedDeviceObj.adid}</div>
                  </div>
                )}
                {!isGuest && (
                  <div className="psec">
                    <div className="psec-title">상태 변경</div>
                    <div className="s-btns">
                      <button className="s-btn" onClick={()=>changeStatus('보관중')}>보관중</button>
                      <button className="s-btn" onClick={()=>changeStatus('사용중')}>사용중</button>
                      <button className="s-btn" onClick={()=>changeStatus('대여중')}>대여중</button>
                    </div>
                  </div>
                )}
              </div>
              {!isGuest && (
                <div className="panel-acts">
                  <button className="act-btn primary" onClick={editDevice}>정보 수정</button>
                  <button className="act-btn danger" onClick={triggerDelete}>시료 삭제</button>
                </div>
              )}
            </>
          )}
        </div>

        <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={(e)=>{if(e.target===e.currentTarget) setIsModalOpen(false)}}>
          <div className="modal">
            <div className="modal-title">{editingId ? '시료 정보 수정' : '새 시료 등록'}</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">시료 명 *</label><input className="form-input" placeholder="Galaxy S25 Ultra" value={modalData.name} onChange={e=>setModalData({...modalData, name: e.target.value})}/></div>
              <div className="form-group"><label className="form-label">제조사</label><input className="form-input" value={modalData.maker} onChange={e=>setModalData({...modalData, maker: e.target.value})}/></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">시료 형태</label>
                <select className="form-input" value={modalData.type} onChange={e=>setModalData({...modalData, type: e.target.value})}>
                  <option value="BAR">BAR</option><option value="FOLD">FOLD</option><option value="FLIP">FLIP</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">시료 상태</label>
                <select className="form-input" value={modalData.status} onChange={e=>setModalData({...modalData, status: e.target.value})}>
                  <option value="보관중">보관중</option><option value="사용중">사용중</option><option value="대여중">대여중</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">OS</label><input className="form-input" placeholder="A16/O8.0" value={modalData.os} onChange={e=>setModalData({...modalData, os: e.target.value})}/></div>
              <div className="form-group"><label className="form-label">시리얼 번호</label><input className="form-input" placeholder="R3CY..." value={modalData.serial} onChange={e=>setModalData({...modalData, serial: e.target.value})}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">대여/사용자</label><input className="form-input" placeholder="홍길동" value={modalData.user} onChange={e=>setModalData({...modalData, user: e.target.value})}/></div>
              <div className="form-group"><label className="form-label">USIM</label><input className="form-input" value={modalData.usim} onChange={e=>setModalData({...modalData, usim: e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">ADID</label><input className="form-input" placeholder="e0807df8-b3be-46d9-..." value={modalData.adid} onChange={e=>setModalData({...modalData, adid: e.target.value})}/></div>
            <div className="modal-acts">
              <button className="btn-cancel" onClick={()=>setIsModalOpen(false)}>취소</button>
              <button className="btn-save" onClick={saveDevice}>저장</button>
            </div>
          </div>
        </div>

        <div className={`modal-overlay ${isDeleteModalOpen ? 'open' : ''}`} style={{zIndex:9999}} onClick={(e)=>{if(e.target===e.currentTarget) setIsDeleteModalOpen(false)}}>
          <div className="modal" style={{width:'400px', padding:'28px'}}>
             <div className="modal-title" style={{fontSize:'24px', marginBottom:'16px'}}>삭제 확인</div>
             <div style={{fontFamily:'var(--fB)', fontSize:'14px', color:'var(--t1)', marginBottom:'24px'}}>
                "{selectedDeviceObj?.name}" 시료를 정말 삭제하시겠습니까?<br/><span style={{color:'var(--t3)',fontSize:'12px'}}>이 작업은 되돌릴 수 없습니다.</span>
             </div>
             <div className="modal-acts" style={{marginTop:0}}>
                 <button className="btn-cancel" onClick={()=>setIsDeleteModalOpen(false)}>취소</button>
                 <button className="btn-save" style={{background:'#e53e3e'}} onClick={confirmDelete}>삭제</button>
             </div>
          </div>
        </div>
      </div>
      
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast ${t.removing?'removing':''}`}><span style={{color:'var(--t2)',fontSize:'14px'}}>◆</span><span>{t.msg}</span></div>)}
      </div>
    </>
  );
}
