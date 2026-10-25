'use strict';
// Pop Paws Panic v2 — (c) P-Prece Studio. Hero "Somjeed" is an original cat. All art & sound procedural.
const COLORS=[['#ff6b7a','#e0283f','#8a0f22'],['#6ec8ff','#1f8fe6','#0b4a8f'],['#8af07a','#2fbf3a','#11661c'],['#ffe66b','#f5b81c','#9a6400'],['#d39bff','#9b4ff0','#4e1590']];
const RAINBOW=-2,STAR=-1;
// colour -> action: 0 bomb/cut, 1 water, 2 wind, 3 key/light, 4 lift
const ACT={gate:'key',lava:'water',fire:'water',smoke:'wind',saw:'bomb',rocks:'bomb',lift:'up',ghost:'light',spider:'cut'};
const CACT=['bomb','water','wind','key','up'];
function actOf(o,c){return o.t==='boss'?CACT[c]:(ACT[o.t]||CACT[c]);}
function drawIcon(c,k,x,y,s,col){c.save();c.translate(x,y);c.scale(s/20,s/20);c.lineJoin=c.lineCap='round';c.strokeStyle='#2a1a10';c.lineWidth=2;
 if(k==='water'){c.fillStyle='#4fb4ff';c.beginPath();c.moveTo(0,-10);c.bezierCurveTo(8,0,8,9,0,9);c.bezierCurveTo(-8,9,-8,0,0,-10);c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(-2.5,2,2,0,7);c.fill();}
 else if(k==='key'||k==='light'){if(k==='key'){c.fillStyle='#ffd23a';c.beginPath();c.arc(-4,0,5.5,0,7);c.fill();c.stroke();c.fillRect(0,-1.8,10,3.6);c.strokeRect(0,-1.8,10,3.6);c.fillRect(6,1,2.5,4);c.fillStyle='#2a1a10';c.beginPath();c.arc(-4,0,2,0,7);c.fill();}
  else{c.fillStyle='#fff3a0';c.beginPath();c.arc(0,-2,7,0,7);c.fill();c.stroke();c.fillStyle='#888';c.fillRect(-3.5,5,7,4);c.strokeStyle='#ffd23a';for(let i=0;i<6;i++){const a=i*1.05;c.beginPath();c.moveTo(Math.cos(a)*9,Math.sin(a)*9-2);c.lineTo(Math.cos(a)*12,Math.sin(a)*12-2);c.stroke();}}}
 else if(k==='wind'){c.strokeStyle='#e9ffe0';c.lineWidth=3;c.beginPath();c.moveTo(-10,-5);c.lineTo(4,-5);c.arc(4,-8,3,1.57,-1.2,true);c.moveTo(-10,1);c.lineTo(7,1);c.arc(7,-2,3,1.57,-1.2,true);c.moveTo(-8,6);c.lineTo(2,6);c.stroke();c.strokeStyle='#2fbf3a';c.lineWidth=1.2;c.stroke();}
 else if(k==='bomb'){c.fillStyle='#333';c.beginPath();c.arc(-1,2,7.5,0,7);c.fill();c.stroke();c.strokeStyle='#a0522d';c.lineWidth=2;c.beginPath();c.moveTo(3,-4);c.quadraticCurveTo(6,-10,9,-8);c.stroke();c.fillStyle='#ffb020';c.beginPath();c.arc(9.5,-8.5,2.6,0,7);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(-4,-1,2,0,7);c.fill();}
 else if(k==='cut'){c.strokeStyle='#ddd';c.lineWidth=3;c.beginPath();c.moveTo(-8,-8);c.lineTo(6,6);c.moveTo(8,-8);c.lineTo(-6,6);c.stroke();c.fillStyle='#ff4d5e';c.lineWidth=2;c.strokeStyle='#2a1a10';[[-7,7],[7,7]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,3.5,0,7);c.fill();c.stroke();});}
 else if(k==='up'){c.fillStyle='#c48bff';c.beginPath();c.moveTo(0,-10);c.lineTo(9,0);c.lineTo(4,0);c.lineTo(4,9);c.lineTo(-4,9);c.lineTo(-4,0);c.lineTo(-9,0);c.closePath();c.fill();c.stroke();}
 c.restore();}
const cv=document.getElementById('c'),cx=cv.getContext('2d');
let W=360,H=640,DPR=1;
const BANNER=()=>(window.AndroidAds?56:0);
// ---------- Ads (safe stubs) ----------
const Ads={lastInter:0,minGap:90000,
 banner(show){try{window.AndroidAds&&(show?AndroidAds.showBanner&&AndroidAds.showBanner():AndroidAds.hideBanner&&AndroidAds.hideBanner());}catch(e){}},
 interstitial(){const n=Date.now();if(n-this.lastInter<this.minGap)return;this.lastInter=n;try{window.AndroidAds&&AndroidAds.showInterstitial&&AndroidAds.showInterstitial();}catch(e){}},
 rewarded(){return new Promise(res=>{if(!(window.AndroidAds&&AndroidAds.showRewarded)){setTimeout(()=>res(true),300);return;}
   window.onRewardedResult=ok=>{window.onRewardedResult=null;res(!!ok);};try{AndroidAds.showRewarded();}catch(e){res(false);}});}};
Ads.lastInter=Date.now();
// ---------- Sound (WebAudio synth) ----------
const SFX={ac:null,on:localStorage.getItem('pr_snd')!=='0',mNext:0,beat:0,
 init(){if(!this.ac){try{this.ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(this.ac&&this.ac.state==='suspended')this.ac.resume();},
 tone(f,d,type='sine',v=.2,slide=0,delay=0,f2){if(!this.on||!this.ac)return;const a=this.ac,t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(f2){o.frequency.linearRampToValueAtTime(f2,t+d*.4);o.frequency.linearRampToValueAtTime(f*slide,t+d);}else if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+d);let n=o;if(type==='sawtooth'){const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.value=1800;o.connect(fl);n=fl;}n.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.03);},
 noise(d,v=.15,hp=1000,delay=0){if(!this.on||!this.ac)return;const a=this.ac,t=a.currentTime+delay,b=a.createBuffer(1,a.sampleRate*d,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*(1-i/ch.length);
  const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=a.createGain();g.gain.value=v;s.connect(f).connect(g).connect(a.destination);s.start(t);},
 pop(n){const b=380+Math.min(n,12)*45;for(let i=0;i<Math.min(n,6);i++)this.tone(b*(1+i*.12),.12,'sine',.18,1.8,i*.035);},
 tick(){this.tone(900,.05,'triangle',.08,1.3);},
 bad(){this.tone(220,.15,'square',.05,.6);},
 crack(){this.noise(.08,.12,3000);},
 meow(p=1){this.tone(520*p,.45,'sawtooth',.12,.75,0,880*p);},
 sassyMeow(){this.tone(700,.25,'sawtooth',.1,.9,0,950);this.tone(500,.4,'sawtooth',.1,.6,.25,820);},
 hiss(){this.noise(.5,.18,2500);},
 yowl(){this.tone(900,.7,'sawtooth',.13,.5,0,1300);},
 purr(){for(let i=0;i<8;i++)this.tone(70,.09,'sawtooth',.08,1,i*.1);},
 slide(){this.tone(1200,.9,'sine',.15,.15);},
 boing(){this.tone(180,.35,'sine',.18,3);},
 clear(){[523,659,784,1046].forEach((f,i)=>this.tone(f,.25,'triangle',.15,1,i*.08));},
 win(){[523,659,784,659,784,1046].forEach((f,i)=>this.tone(f,.3,'triangle',.17,1,i*.12));this.purr();},
 lose(){[392,330,262].forEach((f,i)=>this.tone(f,.35,'sine',.16,.9,i*.18));this.slide();},
 boom(){this.tone(120,.5,'sawtooth',.14,.3);this.noise(.4,.2,200);},
 thunder(){this.noise(1.4,.22,60);this.tone(55,1.2,'sawtooth',.08,.6);},
 music(dt,tension,theme){if(!this.on||!this.ac)return;this.mNext-=dt;if(this.mNext>0)return;const iv=tension>1?.24:tension>0?.32:.42;this.mNext=iv;const b=this.beat++;
  const sc=theme==='day'?[262,330,392,330,294,349,392,349]:[220,262,196,233,220,262,247,208];const f=sc[b%8];
  this.tone(f/2,iv*.9,'triangle',theme==='day'?.05:.06);if(b%2===0)this.tone(f*(theme==='day'?2:1.5),iv*.5,'sine',.025);
  if(tension>1&&b%2===0){this.tone(60,.12,'sine',.18,.5);this.tone(55,.12,'sine',.14,.5,.14);}}};
// ---------- Save ----------
const SAVE=JSON.parse(localStorage.getItem('pp_save')||'{"stars":[]}');
function save(){localStorage.setItem('pp_save',JSON.stringify(SAVE));}
let G=null,ballSpr=[];
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';if(G)layout(G,true);}
function makeSprites(r){ballSpr=COLORS.map(c=>{const s=Math.ceil(r*2+4),o=document.createElement('canvas');o.width=o.height=s*DPR;const g=o.getContext('2d');g.scale(DPR,DPR);const m=s/2;
  const gr=g.createRadialGradient(m-r*.35,m-r*.4,r*.1,m,m,r);gr.addColorStop(0,c[0]);gr.addColorStop(.55,c[1]);gr.addColorStop(1,c[2]);
  g.fillStyle=gr;g.beginPath();g.arc(m,m,r,0,7);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(m-r*.35,m-r*.45,r*.32,r*.2,-.6,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.arc(m+r*.35,m+r*.4,r*.18,0,7);g.fill();return o;});}
// ---------- Level setup ----------
function startLevel(i){const L=LEVELS[i];
 G={li:i,L,moves:L.moves,movesUsed:0,balls:[],parts:[],flyers:[],texts:[],t:0,state:'play',shake:0,flash:0,nextBolt:3+Math.random()*4,
   obs:L.obs.map(o=>({...o,req:Object.entries(o.req).map(([c,n])=>({c:+c,need:n,left:n})),anim:0,dleft:o.danger||0,pulse:0})),
   cat:{x:0,y:0,bob:0,blink:0,nextBlink:2},quip:null,tutorial:i===0&&!SAVE.tutDone,tutStep:0,extraUsed:0,popsDone:0,tips:{},thr:0,thrMax:L.threat||L.moves,rt:L.rt||15,rtAcc:0,thrK:0,trail:[]};
 layout(G,false);fillBasin(G);for(let k=0;k<240;k++)physics(G,1/60);
 G.cat.x=G.startX;G.cat.y=G.yLow;showHUD();Ads.banner(true);
 setTimeout(()=>{if(G&&G.li===i&&i>0)tip('tipLink');},2600);
 setTimeout(()=>{if(G&&G.li===i){if(L.boss){say(T('qBoss'));SFX.yowl();}else{say(T('qStart'));SFX.sassyMeow();}}},400);}
function layout(g,keep){g.topH=Math.round(H*.45);const bt=g.topH+10,bb=H-BANNER()-10,bl=10,br=W-10;
 const ob=g.bas;g.bas={l:bl,r:br,t:bt,b:bb};g.R=(br-bl)/2;g.bcx=(bl+br)/2;g.bcy=bb-g.R*.62;
 g.rad=Math.max(11,Math.min(20,(br-bl)/19));makeSprites(g.rad);
 g.yLow=g.topH*.80;g.yHigh=g.topH*.52;g.startX=W*.09;g.exitX=W*.87;const n=g.obs.length;
 g.slot=(g.exitX-g.startX)/(n+1);g.sw=Math.min(78,g.slot*.78);
 g.obs.forEach((o,i)=>o.x=g.startX+g.slot*(i+1));g.lift=g.obs.find(o=>o.t==='lift');
 if(keep&&ob){const sx=(g.bas.r-g.bas.l)/(ob.r-ob.l),sy=(g.bas.b-g.bas.t)/(ob.b-ob.t);g.balls.forEach(b=>{b.x=g.bas.l+(b.x-ob.l)*sx;b.y=g.bas.t+(b.y-ob.t)*sy;b.px=b.x;b.py=b.y;});}
 if(g.cat)g.cat.x=Math.max(g.cat.x,g.startX);}
function basinCount(g){const w=g.bas.r-g.bas.l,h=g.bas.b-g.bas.t;const area=w*h-(1-Math.PI/4)*w*g.R*.62*0.5;return Math.floor(area*.80/(3.46*g.rad*g.rad));}
function rndColor(g){const cs=g.L.colors;if(Math.random()<.08){const need=[];g.obs.forEach(o=>o.req.forEach(r=>{if(r.left>0)need.push(r.c);}));if(need.length)return need[Math.random()*need.length|0];}return cs[Math.random()*cs.length|0];}
function newBall(g,x,y,c){return{x,y,px:x,py:y,c,sq:0,lock:0,bomb:0};}
function spawnBall(g,x,y,initial){const L=g.L,b=newBall(g,x,y,rndColor(g)),r=Math.random();
 if(L.rainbow&&r<L.rainbow)b.c=RAINBOW;else if(L.bomb&&!initial&&r<L.rainbow+L.bomb)b.bomb=5+(Math.random()*3|0);
 else if(L.lock&&Math.random()<(initial?L.lock:L.lock*.25))b.lock=Math.random()<.3?2:1;return b;}
function fillBasin(g){const N=basinCount(g),r=g.rad;let x=g.bas.l+r,y=g.bas.b-r;for(let i=0;i<N;i++){g.balls.push(spawnBall(g,x+(Math.random()-.5)*2,y,true));x+=r*2;if(x>g.bas.r-r){x=g.bas.l+r+(i%2?0:r);y-=r*1.75;}}}
function physics(g,dt){const B=g.balls,r=g.rad,gr=1500*dt*dt;
 for(const b of B){const vx=(b.x-b.px)*.985,vy=(b.y-b.py)*.985;b.px=b.x;b.py=b.y;b.x+=vx;b.y+=vy+gr;}
 for(let it=0;it<4;it++){
  for(let i=0;i<B.length;i++){const a=B[i];for(let j=i+1;j<B.length;j++){const b=B[j];const dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,m=2*r;if(d2<m*m&&d2>1e-6){const d=Math.sqrt(d2),p=(m-d)/d*.5;a.x-=dx*p;a.y-=dy*p;b.x+=dx*p;b.y+=dy*p;}}}
  for(const b of B){if(b.x<g.bas.l+r)b.x=g.bas.l+r;if(b.x>g.bas.r-r)b.x=g.bas.r-r;if(b.y>g.bas.b-r)b.y=g.bas.b-r;
   if(b.y>g.bcy){const dx=b.x-g.bcx,dy=(b.y-g.bcy)/0.62,d=Math.hypot(dx,dy),lim=g.R-r;if(d>lim){const k=lim/d;b.x=g.bcx+dx*k;b.y=g.bcy+dy*k*0.62;}}}}}
const LIM=g=>(2*g.rad*1.12)**2;
function near(g,a,b){const dx=b.x-a.x,dy=b.y-a.y;return dx*dx+dy*dy<LIM(g);}
function bfs(g,b0,c){const seen=new Set([b0]),q=[b0];while(q.length){const a=q.pop();for(const b of g.balls)if(!seen.has(b)&&!b.lock&&(b.c===c||b.c===RAINBOW)&&near(g,a,b)){seen.add(b);q.push(b);}}return[...seen];}
function groupOf(g,b0){if(b0.lock||b0.c===STAR)return{balls:[b0],c:b0.c};
 if(b0.c===RAINBOW){let best={balls:[b0],c:g.L.colors[0]};for(const c of g.L.colors){const gr=bfs(g,b0,c);if(gr.length>best.balls.length)best={balls:gr,c};}return best;}
 return{balls:bfs(g,b0,b0.c),c:b0.c};}
function allGroups(g){const seen=new Set(),out=[];for(const b of g.balls){if(seen.has(b)||b.lock||b.c===RAINBOW)continue;const gr=groupOf(g,b);gr.balls.forEach(x=>{if(x.c!==RAINBOW)seen.add(x);});out.push(gr);}
 for(const b of g.balls)if(b.c===STAR)out.push({balls:[b],c:STAR});return out;}
function ballAt(g,x,y){let best=null,bd=(g.rad*1.25)**2;for(const b of g.balls){const d=(b.x-x)**2+(b.y-y)**2;if(d<bd){bd=d;best=b;}}return best;}
function badgePos(g,o){const fy=floorY(g,o.x);return{x:o.x,y:Math.max(70,fy-g.topH*.42)};}
function floorY(g,x){return g.lift&&x>g.lift.x+g.sw*.5?g.yHigh:g.yLow;}
function say(s,dur=2.4){if(G)G.quip={s,t:0,d:dur};}
function tip(k){if(SAVE['tip_'+k]||(G&&G.state!=='play'))return;SAVE['tip_'+k]=1;save();toast(T(k));}
function feed(g,c,x,y){for(const o of g.obs){const r=o.req.find(q=>q.c===c&&q.left>0);if(r){r.left--;const bp=badgePos(g,o);const tp={x:o.x,y:floorY(g,o.x)-28};g.flyers.push({x,y,sx:x,sy:y,tx:tp.x,ty:tp.y,c,k:actOf(o,c),t:-Math.random()*.25,ob:o});if(o.req.every(q=>q.left<=0))o.done=true;return;}}}
function tap(x,y){const g=G;if(!g||g.state!=='play'||g.moves<=0)return;SFX.init();const b=ballAt(g,x,y);if(!b)return;
 if(b.lock){b.sq=1;SFX.crack();tip('tipLock');return;}
 let grp,col;if(b.c===STAR){const R2=(g.rad*5.2)**2;grp=g.balls.filter(o=>(o.x-b.x)**2+(o.y-b.y)**2<R2);SFX.boom();g.shake=10;col=STAR;}else{const r=groupOf(g,b);grp=r.balls;col=r.c;}
 if(grp.length<2){b.sq=1;SFX.bad();return;}
 g.moves--;g.movesUsed++;g.popsDone++;if(g.tutorial)g.tutStep=1;
 const set=new Set(grp);
 for(const o of grp){let c=o.c;if(c===RAINBOW)c=col;if(c===STAR)continue;if(c<0)c=g.L.colors[0];burst(g,o.x,o.y,COLORS[c][1],6);if(o.lock&&col===STAR){o.lock=0;}feed(g,c,o.x,o.y);}
 SFX.pop(grp.length);
 // crack neighbouring ice
 for(const o of g.balls)if(o.lock&&!set.has(o)&&grp.some(p=>near(g,o,p))){o.lock--;o.sq=1;burst(g,o.x,o.y,'#e8fbff',5);SFX.crack();}
 g.balls=g.balls.filter(o=>!set.has(o));
 if(grp.length>=7&&col!==STAR){g.balls.push(newBall(g,b.x,b.y,STAR));g.texts.push({s:T('big'),x,y:y-20,t:0});if(Math.random()<.6){say(T('qBig'),1.6);SFX.meow(1.2);}tip('star');}
 // bombs tick
 for(const o of [...g.balls])if(o.bomb){o.bomb--;if(o.bomb<=0)explode(g,o);}
 advThreat(g);
 for(const o of g.obs)if(o.danger&&!o.done&&o.dleft>0){o.dleft--;if(o.dleft===3){say(T('qScared'),2);SFX.hiss();}}
 refill(g);updHUD();
 if(g.balls.some(o=>o.bomb))tip('tipBomb');if(g.balls.some(o=>o.c===RAINBOW))tip('tipRainbow');if(g.balls.some(o=>o.lock))tip('tipLock');}
function advThreat(g){g.thr++;const left=g.thrMax-g.thr;if(left===4){say(T('qHurry'),2);SFX.hiss();}else if(left===2)SFX.yowl();g.shake=Math.max(g.shake,left<=3?5:2);}
function explode(g,o){const R2=(g.rad*2.4)**2;const hit=g.balls.filter(p=>(p.x-o.x)**2+(p.y-o.y)**2<R2);g.balls=g.balls.filter(p=>!hit.includes(p));
 burst(g,o.x,o.y,'#ffb020',30);burst(g,o.x,o.y,'#333',12);g.shake=16;g.flash=.5;SFX.boom();g.moves=Math.max(0,g.moves-2);g.texts.push({s:'-2',x:o.x,y:o.y,t:0});say(T('qBomb'),2);SFX.yowl();}
function refill(g){const N=basinCount(g);let k=0;while(g.balls.length<N){const nx=g.bas.l+g.rad+Math.random()*(g.bas.r-g.bas.l-2*g.rad);g.balls.push(spawnBall(g,nx,g.bas.t-g.rad*(1+2.1*(k++/6|0)),false));}}
function impact(g,f){const col=COLORS[f.c][0];if(f.k==='water'){for(let i=0;i<8;i++)g.parts.push({x:f.tx+(Math.random()-.5)*20,y:f.ty,vx:(Math.random()-.5)*120,vy:-120-Math.random()*120,l:.6,c:'#8fd3ff',r:3});g.parts.push({x:f.tx,y:f.ty-10,vx:0,vy:-30,l:.8,c:'rgba(230,230,230,.7)',r:9});}
 else if(f.k==='bomb'){burst(g,f.tx,f.ty,'#ffb020',10);g.shake=Math.max(g.shake,3);}else burst(g,f.tx,f.ty,col,8);
 g.rings=(g.rings||[]);g.rings.push({x:f.tx,y:f.ty,t:0,c:col});}
function burst(g,x,y,col,n){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*200;g.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,l:.6+Math.random()*.4,c:col,r:2+Math.random()*4});}}
function confetti(g){for(let i=0;i<90;i++){const c=COLORS[i%5][0];g.parts.push({x:W/2,y:g.topH*.5,vx:(Math.random()-.5)*600,vy:-200-Math.random()*400,l:1.5+Math.random(),c,r:3+Math.random()*4,sq:1});}}
function tension(g){let m=g.thrMax-g.thr;for(const o of g.obs)if(o.danger&&!o.done)m=Math.min(m,o.dleft);if(g.moves<=3)m=Math.min(m,g.moves);return m<=3?2:m<=6?1:0;}
// ---------- Update ----------
function update(dt){const g=G;if(!g)return;g.t+=dt;physics(g,dt);
 for(const b of g.balls)b.sq=Math.max(0,b.sq-dt*4);
 for(const p of g.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt;}g.parts=g.parts.filter(p=>p.l>0);
 for(const f of g.flyers){f.t+=dt*1.6;if(f.t>0){const k=Math.min(1,f.t),e=k*k*(3-2*k);f.x=f.sx+(f.tx-f.sx)*e;f.y=f.sy+(f.ty-f.sy)*e-Math.sin(k*3.14)*60;}if(f.t>=1&&!f.hit){f.hit=1;f.ob.pulse=1;SFX.tick();impact(g,f);}else if(f.t>0&&Math.random()<.5)g.parts.push({x:f.x,y:f.y,vx:0,vy:0,l:.35,c:COLORS[f.c][0],r:2.5});}
 g.flyers=g.flyers.filter(f=>f.t<1.05);
 for(const t of g.texts)t.t+=dt;g.texts=g.texts.filter(t=>t.t<1.2);
 if(g.quip){g.quip.t+=dt;if(g.quip.t>g.quip.d)g.quip=null;}
 g.shake=Math.max(0,g.shake-dt*30);g.flash=Math.max(0,g.flash-dt*2);
 if(g.L.theme==='storm'){g.nextBolt-=dt;if(g.nextBolt<=0){g.nextBolt=4+Math.random()*6;g.flash=1;g.shake=Math.max(g.shake,4);SFX.thunder();}}
 if(g.state==='play'&&(!g.tutorial||g.tutStep>0)&&!g.obs.every(o=>o.done)){g.rtAcc+=dt;if(g.rtAcc>=g.rt){g.rtAcc=0;advThreat(g);}}
 g.thrK+=(Math.min(1,g.thr/g.thrMax+g.rtAcc/g.rt/g.thrMax)-g.thrK)*Math.min(1,dt*3);
 if(g.rings){for(const r of g.rings)r.t+=dt*2;g.rings=g.rings.filter(r=>r.t<1);}
 const ten=tension(g);g.ten=ten;SFX.music(dt,ten,g.L.theme);
 const e=g.cat;e.nextBlink-=dt;if(e.nextBlink<0){e.blink=.15;e.nextBlink=2+Math.random()*3;}e.blink=Math.max(0,e.blink-dt);
 for(const o of g.obs){o.pulse=Math.max(0,o.pulse-dt*3);const flying=g.flyers.some(f=>f.ob===o);
  if(o.done&&!flying&&o.anim<1){if(o.t==='lift'&&Math.abs(e.x-o.x)>2)continue;if(o.anim===0){SFX.clear();burst(g,o.x,floorY(g,o.x)-30,'#fff6b0',24);if(o.t==='boss'){g.shake=12;SFX.boom();}}o.anim=Math.min(1,o.anim+dt*.9);}}
 let tx=g.exitX;for(const o of g.obs){if(o.anim<1){tx=o.t==='lift'?o.x:o.x-g.sw*.55-14;break;}}
 if(g.state==='lose')tx=e.x;tx=Math.max(tx,g.startX);const dx=tx-e.x;
 if(Math.abs(dx)>1&&g.state!=='win'){e.x+=Math.sign(dx)*Math.min(Math.abs(dx),75*dt);e.bob+=dt*12;e.walking=1;}else e.walking=0;
 if(g.state==='win'&&e.x<g.exitX){e.x=Math.min(g.exitX,e.x+75*dt);}
 if(g.lift&&Math.abs(e.x-g.lift.x)<g.sw*.5)e.y=g.yLow+(g.yHigh-g.yLow)*ease(g.lift.anim);else e.y=floorY(g,e.x);
 if(g.state==='lose'&&g.loseWhy==='threat'){e.y=floorY(g,e.x)-Math.min(30,(g.t-g.endT)*30)+Math.sin(g.t*4)*4;}
 if(g.state==='play'){
  if(e.x>=g.exitX-2&&g.obs.every(o=>o.anim>=1)){g.state='win';g.endT=g.t;SFX.win();confetti(g);say(T('qWin'),3);setTimeout(()=>{if(G===g)endPopup(true);},1900);}
  else if(g.thr>=g.thrMax){lose(g,'threat');}
  else if(g.obs.some(o=>o.danger&&!o.done&&o.dleft<=0)){lose(g,'danger');}
  else if(g.moves<=0&&!g.flyers.length&&!g.obs.every(o=>o.done)){lose(g,'moves');}}}
function lose(g,why){g.state='lose';g.loseWhy=why;g.endT=g.t;g.shake=why!=='moves'?16:6;if(why==='threat'){SFX.thunder();g.flash=.8;}SFX.lose();SFX.yowl();say(T('qLose'),3);setTimeout(()=>{if(G===g)endPopup(false);},1800);}
const ease=k=>k*k*(3-2*k);
// ---------- Render ----------
function rr(x,y,w,h,r){cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h);}
function render(){cx.setTransform(DPR,0,0,DPR,0,0);const g=G;if(!g){cx.fillStyle='#2b2140';cx.fillRect(0,0,W,H);return;}
 cx.save();if(g.shake)cx.translate((Math.random()-.5)*g.shake,(Math.random()-.5)*g.shake);
 // danger zoom on the scene
 cx.save();cx.beginPath();cx.rect(0,0,W,g.topH+2);cx.clip();const z=g.ten===2&&g.state==='play'?1.06:1;g.zoom=(g.zoom||1)+(z-(g.zoom||1))*.08;
 cx.translate(g.cat.x,g.cat.y);cx.scale(g.zoom,g.zoom);cx.translate(-g.cat.x,-g.cat.y);drawScene(g);cx.restore();
 drawSep(g);drawBasin(g);
 for(const f of g.flyers){if(f.t<0)continue;const r=g.rad*.8;cx.strokeStyle=COLORS[f.c][0];cx.globalAlpha=.55;cx.lineWidth=2;cx.setLineDash([4,5]);cx.beginPath();cx.moveTo(f.sx,f.sy);cx.quadraticCurveTo((f.sx+f.tx)/2,(f.sy+f.ty)/2-60,f.x,f.y);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1;
  cx.drawImage(ballSpr[f.c],f.x-r,f.y-r,r*2,r*2);drawIcon(cx,f.k,f.x,f.y,r*1.4);}
 if(g.rings)for(const r of g.rings){cx.globalAlpha=1-r.t;cx.strokeStyle=r.c;cx.lineWidth=3;cx.beginPath();cx.arc(r.x,r.y,10+r.t*30,0,7);cx.stroke();}cx.globalAlpha=1;
 for(const p of g.parts){cx.globalAlpha=Math.min(1,p.l*2);cx.fillStyle=p.c;if(p.sq)cx.fillRect(p.x,p.y,p.r,p.r*1.6);else{cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();}}cx.globalAlpha=1;
 for(const t of g.texts){cx.globalAlpha=1-t.t/1.2;txt(t.s,t.x,t.y-t.t*40,22,'#fff','#c2410c');}cx.globalAlpha=1;
 if(g.tutorial&&g.state==='play')drawTutorial(g);
 cx.restore();
 // vignette
 if(g.ten>0&&g.state==='play'){const p=g.ten===2?.45+.25*Math.sin(g.t*8):.25;const vg=cx.createRadialGradient(W/2,H*.4,Math.min(W,H)*.35,W/2,H*.4,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(120,0,20,0)');vg.addColorStop(1,`rgba(150,0,30,${p})`);cx.fillStyle=vg;cx.fillRect(0,0,W,H);}
 if(g.flash>0){cx.fillStyle=`rgba(230,240,255,${g.flash*.55})`;cx.fillRect(0,0,W,H);}}
function txt(s,x,y,sz,fill,stroke,align='center'){cx.font=`900 ${sz}px GameFont, system-ui, sans-serif`;cx.textAlign=align;cx.textBaseline='middle';cx.lineJoin='round';cx.lineWidth=sz*.22;cx.strokeStyle=stroke;cx.strokeText(s,x,y);cx.fillStyle=fill;cx.fillText(s,x,y);}
const THEMES={day:{sky:['#8be3ff','#d8f7e6'],rock:['#c98f5a','#a86c3c','#6e4224'],grass:'#7ccf5a',sil:'rgba(80,150,140,.25)'},
 cave:{sky:['#1d1433','#3c2a5c'],rock:['#6b5a7e','#4b3d5e','#2a2038'],grass:'#5ee0c8',sil:'rgba(140,110,200,.18)'},
 storm:{sky:['#0f1a2e','#2c3e5c'],rock:['#5a6372','#3e4654','#22272f'],grass:'#4f8f6a',sil:'rgba(120,140,170,.2)'}};
function drawScene(g){const th=g.topH,TH=THEMES[g.L.theme]||THEMES.day;
 let gr=cx.createLinearGradient(0,0,0,th);gr.addColorStop(0,TH.sky[0]);gr.addColorStop(1,TH.sky[1]);cx.fillStyle=gr;cx.fillRect(-20,-20,W+40,th+40);
 if(g.L.theme==='day'){cx.fillStyle=TH.sil;for(let i=0;i<4;i++){const x=W*(.12+i*.27),b=th*.75,h=th*(.28+.08*(i%2));cx.beginPath();cx.moveTo(x-h*.35,b);cx.quadraticCurveTo(x-h*.3,b-h*.5,x,b-h);cx.quadraticCurveTo(x+h*.3,b-h*.5,x+h*.35,b);cx.fill();}
  cx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<3;i++){const x=((g.t*8+i*160)%(W+120))-60,y=th*(.12+i*.07);cx.beginPath();cx.arc(x,y,14,0,7);cx.arc(x+16,y-6,18,0,7);cx.arc(x+34,y,13,0,7);cx.fill();}}
 else{// stalactites
  cx.fillStyle=TH.rock[2];cx.beginPath();cx.moveTo(-20,0);for(let x=-20;x<W+30;x+=26){const h=14+((x*7919)%23);cx.lineTo(x+8,h+Math.sin(x)*4);cx.lineTo(x+16,6);}cx.lineTo(W+30,0);cx.fill();
  if(g.L.theme==='storm'){cx.strokeStyle='rgba(170,200,255,.25)';cx.lineWidth=1;cx.beginPath();for(let i=0;i<40;i++){const x=(i*53+g.t*60)%W,y=(i*97+g.t*500)%th;cx.moveTo(x,y);cx.lineTo(x-3,y+10);}cx.stroke();
   if(g.flash>.6){cx.strokeStyle='#eaf2ff';cx.lineWidth=3;cx.beginPath();let lx=W*.6,ly=0;cx.moveTo(lx,ly);while(ly<th*.6){lx+=(Math.random()-.5)*30;ly+=18;cx.lineTo(lx,ly);}cx.stroke();}}
  // glowing mushrooms
  if(g.L.theme==='cave')for(let i=0;i<5;i++){const x=W*(.05+i*.22),y=g.yLow-2;cx.fillStyle='rgba(94,224,200,.25)';cx.beginPath();cx.arc(x,y-6,12,0,7);cx.fill();cx.fillStyle='#5ee0c8';cx.beginPath();cx.ellipse(x,y-7,6,4,0,3.14,0);cx.fill();}
  // spooky eyes
  for(let i=0;i<4;i++){const ex=W*(.15+i*.23),ey=th*(.18+((i*37)%3)*.08),op=Math.sin(g.t*.7+i*2);if(op>.2){const bl=Math.sin(g.t*3+i)>.95?.2:1;cx.fillStyle=i%2?'#ffe14d':'#ff5c5c';cx.globalAlpha=Math.min(1,(op-.2)*2);cx.beginPath();cx.ellipse(ex,ey,3,3*bl,0,0,7);cx.ellipse(ex+9,ey,3,3*bl,0,0,7);cx.fill();cx.globalAlpha=1;}}}
 const L=g.lift;drawRock(TH,-20,g.yLow,(L?L.x-g.sw*.5:W)+20,th-g.yLow+30);if(L)drawRock(TH,L.x+g.sw*.5,g.yHigh,W-L.x-g.sw*.5+20,th-g.yHigh+30);
 drawDoor(g.exitX+10,floorY(g,g.exitX));
 for(const o of g.obs)drawObs(g,o,false);
 drawCatInScene(g);
 for(const o of g.obs)drawObs(g,o,true);
 drawThreat(g);
 for(const o of g.obs)drawBadge(g,o);
 if(g.quip)drawQuip(g);}
function drawThreat(g){const th=g.topH,s=Math.min(1.15,th/250),kind=g.L.theme==='cave'?'slime':'flood';const top=g.cat.y-40*s,bot=th+4;
 const k=g.state==='lose'&&g.loseWhy==='threat'?1:g.thrK;const y=bot-(bot-top)*k;
 // the line the danger must not reach
 if(g.state==='play'){cx.strokeStyle='rgba(255,60,80,.8)';cx.lineWidth=2;cx.setLineDash([6,5]);cx.beginPath();cx.moveTo(0,top);cx.lineTo(W,top);cx.stroke();cx.setLineDash([]);}
 const c1=kind==='slime'?'rgba(120,220,70,.82)':'rgba(40,140,240,.78)',c2=kind==='slime'?'rgba(40,120,30,.92)':'rgba(10,50,140,.9)';
 const gr=cx.createLinearGradient(0,y,0,bot);gr.addColorStop(0,c1);gr.addColorStop(1,c2);cx.fillStyle=gr;cx.beginPath();cx.moveTo(-20,bot+30);
 for(let x=-20;x<=W+20;x+=10)cx.lineTo(x,y+Math.sin(x*.05+g.t*3)*4+Math.sin(x*.13-g.t*2)*2);cx.lineTo(W+20,bot+30);cx.closePath();cx.fill();
 cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=2;cx.beginPath();for(let x=-20;x<=W+20;x+=10){const yy=y+Math.sin(x*.05+g.t*3)*4+Math.sin(x*.13-g.t*2)*2;x<-10?cx.moveTo(x,yy):cx.lineTo(x,yy);}cx.stroke();
 for(let i=0;i<8;i++){const bx=(i*W/8+g.t*20*(i%2?1:-1)+W)%W,by=bot-((g.t*30+i*37)%Math.max(10,bot-y));cx.fillStyle='rgba(255,255,255,.35)';cx.beginPath();cx.arc(bx,by,2+(i%3),0,7);cx.fill();}
 if(g.state==='lose'&&g.loseWhy==='threat'){drawCatInScene(g);cx.fillStyle=c1;cx.globalAlpha=.6;cx.fillRect(0,g.cat.y-6,W,bot);cx.globalAlpha=1;}
 if(kind==='slime'&&bot-y>30)for(let i=0;i<3;i++){const ex=W*(.2+i*.3)+Math.sin(g.t+i)*10,ey=y+18;cx.fillStyle='#fff';cx.beginPath();cx.arc(ex,ey,4,0,7);cx.arc(ex+10,ey,4,0,7);cx.fill();cx.fillStyle='#1a3a10';cx.beginPath();cx.arc(ex+1,ey+1,2,0,7);cx.arc(ex+11,ey+1,2,0,7);cx.fill();}}
function drawSep(g){const th=g.topH;const gr=cx.createLinearGradient(0,th-6,0,th+12);gr.addColorStop(0,'#5a3a24');gr.addColorStop(1,'#2a1a10');cx.fillStyle=gr;cx.fillRect(0,th-2,W,12);}
function drawRock(TH,x,y,w,h){if(w<=0)return;let gr=cx.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,TH.rock[0]);gr.addColorStop(.2,TH.rock[1]);gr.addColorStop(1,TH.rock[2]);cx.fillStyle=gr;rr(x,y,w,h,8);cx.fill();
 cx.fillStyle=TH.grass;rr(x,y-4,w,9,5);cx.fill();cx.fillStyle='rgba(255,255,255,.25)';cx.fillRect(x+4,y-3,w-8,2);
 cx.fillStyle='rgba(0,0,0,.12)';for(let i=x+14;i<x+w-10;i+=34){cx.beginPath();cx.ellipse(i,y+h*.35,9,5,0,0,7);cx.fill();}}
function drawDoor(x,fy){const w=30,h=48;let gr=cx.createLinearGradient(x-w/2,0,x+w/2,0);gr.addColorStop(0,'#ffe27a');gr.addColorStop(.5,'#ffc531');gr.addColorStop(1,'#c98a0b');
 cx.fillStyle='rgba(255,220,120,.25)';cx.beginPath();cx.arc(x,fy-h*.5,h*.8,0,7);cx.fill();cx.fillStyle=gr;
 cx.beginPath();cx.moveTo(x-w/2,fy);cx.lineTo(x-w/2,fy-h*.6);cx.quadraticCurveTo(x,fy-h*1.25,x+w/2,fy-h*.6);cx.lineTo(x+w/2,fy);cx.fill();
 cx.fillStyle='#5b3a1a';cx.beginPath();cx.moveTo(x-w*.3,fy);cx.lineTo(x-w*.3,fy-h*.55);cx.quadraticCurveTo(x,fy-h*.95,x+w*.3,fy-h*.55);cx.lineTo(x+w*.3,fy);cx.fill();
 // fish-pie treat waiting inside
 cx.fillStyle='#ffd27a';cx.beginPath();cx.ellipse(x,fy-6,9,5,0,0,7);cx.fill();cx.fillStyle='#e86a2c';cx.fillRect(x-7,fy-9,14,3);}
function dangerK(o){return o.danger?1-o.dleft/o.danger:0;}
function drawObs(g,o,front){const fy=floorY(g,o.x),w=g.sw,a=ease(o.anim),t=g.t,cat=g.cat;
 if(front){// hazards that move toward the cat render in front
  if(o.t==='ghost'&&a<1){const k=dangerK(o),gx=o.x-k*(o.x-cat.x-18),gy=fy-38+Math.sin(t*3)*6-a*60;cx.globalAlpha=(1-a)*.92;
   cx.fillStyle='#f4f1ff';cx.beginPath();cx.arc(gx,gy,18,3.14,0);for(let i=0;i<=4;i++){cx.lineTo(gx+18-i*9,gy+18+(i%2?-5:3)+Math.sin(t*6+i)*2);}cx.fill();
   cx.fillStyle='#2a1d45';cx.beginPath();cx.ellipse(gx-6,gy-2,3.5,5,0,0,7);cx.ellipse(gx+6,gy-2,3.5,5,0,0,7);cx.fill();cx.beginPath();cx.ellipse(gx,gy+8,4,3+Math.sin(t*4),0,0,7);cx.fill();cx.globalAlpha=1;
   if(a>0){cx.fillStyle=`rgba(255,240,150,${(1-a)*.6})`;cx.beginPath();cx.arc(o.x,fy-40,60*a,0,7);cx.fill();}}
  if(o.t==='spider'&&a<1){const k=dangerK(o),sx=o.x-k*(o.x-cat.x-6),top=8,sy=top+(1-a)*(14+k*(fy-60-top))-a*20;cx.strokeStyle='rgba(230,230,240,.7)';cx.lineWidth=1;cx.beginPath();cx.moveTo(sx,0);cx.lineTo(sx,sy);cx.stroke();
   cx.strokeStyle='#1c1426';cx.lineWidth=2.5;for(let i=0;i<4;i++){const l=Math.sin(t*8+i)*2;cx.beginPath();cx.moveTo(sx,sy);cx.quadraticCurveTo(sx-14,sy-8+i*5,sx-18,sy+4+i*4+l);cx.moveTo(sx,sy);cx.quadraticCurveTo(sx+14,sy-8+i*5,sx+18,sy+4+i*4-l);cx.stroke();}
   const sg=cx.createRadialGradient(sx-3,sy-3,1,sx,sy,11);sg.addColorStop(0,'#5b4a78');sg.addColorStop(1,'#1c1426');cx.fillStyle=sg;cx.beginPath();cx.arc(sx,sy,10,0,7);cx.fill();
   cx.fillStyle='#ff4d6d';for(const ex of[-4,4]){cx.beginPath();cx.arc(sx+ex,sy+1,2.4,0,7);cx.fill();}}
  if(o.t==='rocks'){const k=dangerK(o),rx=Math.min(o.x,cat.x+(o.x-cat.x)*.4+30);if(a<1){cx.save();cx.translate(rx+Math.sin(t*30)*k*2,18);cx.fillStyle='#6b6f7b';for(let i=0;i<5;i++){cx.beginPath();cx.arc(-24+i*12,6+(i%2)*6,9,0,7);cx.fill();}cx.restore();
    for(let i=0;i<Math.floor(k*6);i++){const py=(t*200+i*57)%(fy-20);cx.fillStyle='#8a8f99';cx.beginPath();cx.arc(rx-20+((i*37)%40),20+py,2.5,0,7);cx.fill();}}
   cx.globalAlpha=a;cx.fillStyle='#8b5a2b';cx.fillRect(rx-26,12,6,fy-12);cx.fillRect(rx+20,12,6,fy-12);cx.fillRect(rx-30,10,60,8);cx.globalAlpha=1;}
  if(o.t==='boss'&&a<1){const k=dangerK(o),bx=o.x-k*(o.x-cat.x-46),s=(1+k*.35)*(1-a)+.001,by=fy;cx.save();cx.translate(bx,by);cx.scale(s,s);
   const bg=cx.createRadialGradient(-10,-50,5,0,-35,48);bg.addColorStop(0,'#b77cff');bg.addColorStop(1,'#3d1670');cx.fillStyle=bg;cx.beginPath();cx.moveTo(-40,0);cx.quadraticCurveTo(-48,-70+Math.sin(t*3)*4,0,-74);cx.quadraticCurveTo(48,-70,40,0);cx.closePath();cx.fill();
   cx.fillStyle='#fff';cx.beginPath();cx.arc(0,-46,14,0,7);cx.fill();const px=Math.max(-6,Math.min(6,(cat.x-bx)/10));cx.fillStyle='#e0283f';cx.beginPath();cx.arc(px,-45,6,0,7);cx.fill();cx.fillStyle='#000';cx.beginPath();cx.arc(px,-45,3,0,7);cx.fill();
   cx.fillStyle='#1a0a2e';cx.beginPath();cx.ellipse(0,-18,20,8+Math.sin(t*5)*3,0,0,7);cx.fill();cx.fillStyle='#fff';for(let i=-2;i<=2;i++){cx.beginPath();cx.moveTo(i*7-3,-25);cx.lineTo(i*7,-17);cx.lineTo(i*7+3,-25);cx.fill();}
   cx.fillStyle='#5a2a99';cx.beginPath();cx.moveTo(-20,-70);cx.lineTo(-26,-90);cx.lineTo(-10,-73);cx.moveTo(20,-70);cx.lineTo(26,-90);cx.lineTo(10,-73);cx.fill();cx.restore();}
  return;}
 if(o.t==='gate'){const h=g.topH*.36;cx.save();cx.beginPath();cx.rect(o.x-w*.4,fy-h-4,w*.8,h+4);cx.clip();
   for(let i=0;i<4;i++){const bx=o.x-w*.3+i*w*.2;let gr=cx.createLinearGradient(bx-4,0,bx+4,0);gr.addColorStop(0,'#c7cfe0');gr.addColorStop(.5,'#ffffff');gr.addColorStop(1,'#6f7a94');cx.fillStyle=gr;rr(bx-4,fy-h-a*h,8,h,4);cx.fill();}
   cx.restore();cx.fillStyle='#8b5a2b';rr(o.x-w*.45,fy-h-10,w*.9,10,4);cx.fill();
   if(a<1){const ly=fy-h*.5+a*30;cx.globalAlpha=1-a;cx.strokeStyle='#e8b60e';cx.lineWidth=5;cx.beginPath();cx.arc(o.x,ly-10,9,3.14,0);cx.stroke();
    let gr=cx.createLinearGradient(0,ly-6,0,ly+14);gr.addColorStop(0,'#ffe066');gr.addColorStop(1,'#d18a00');cx.fillStyle=gr;rr(o.x-13,ly-8,26,22,6);cx.fill();cx.fillStyle='#6b4500';cx.beginPath();cx.arc(o.x,ly+2,3.5,0,7);cx.fill();cx.globalAlpha=1;}}
 if(o.t==='lava'){const pw=w*1.05,ph=g.topH-fy+10;cx.fillStyle='#2a1508';cx.fillRect(o.x-pw/2,fy-2,pw,ph);const hot=1-a;
   if(hot>0){let gr=cx.createLinearGradient(0,fy,0,fy+ph);gr.addColorStop(0,'#ffc23c');gr.addColorStop(1,'#d9480f');cx.globalAlpha=hot;cx.fillStyle=gr;cx.fillRect(o.x-pw/2,fy+2,pw,ph-4);for(let i=0;i<3;i++){const bx=o.x-pw/3+i*pw/3,by=fy+8+Math.sin(t*3+i)*3;cx.fillStyle='#ffe08a';cx.beginPath();cx.arc(bx,by,3+Math.sin(t*5+i)*1.5,0,7);cx.fill();}
     const k=dangerK(o);for(let i=0;i<3+k*6;i++){const ph2=(t*1.3+i*.37)%1,sx=o.x+(i%2?-1:1)*(ph2*(30+k*(o.x-cat.x)*.8));cx.fillStyle='rgba(255,140,30,.85)';cx.beginPath();cx.arc(sx,fy-Math.sin(ph2*3.14)*(20+k*40),3+k*2,0,7);cx.fill();}cx.globalAlpha=1;}
   if(a>0){cx.globalAlpha=a;let g2=cx.createLinearGradient(0,fy,0,fy+ph);g2.addColorStop(0,'#9fb7c4');g2.addColorStop(1,'#56707f');cx.fillStyle=g2;rr(o.x-pw/2,fy-4,pw,ph+4,6);cx.fill();cx.globalAlpha=1;}
   if(a>=1)return;const tx=o.x,ty=Math.max(64,fy-g.topH*.42)+26,tw=w*.8,tht=24;cx.fillStyle='rgba(255,255,255,.55)';rr(tx-tw/2,ty,tw,tht,7);cx.fill();
   const r0=o.req[0],fill=o.done?1-a:1-r0.left/r0.need;cx.fillStyle='#3fa9f5';rr(tx-tw/2+2,ty+tht-2-(tht-4)*fill,tw-4,(tht-4)*fill,5);cx.fill();cx.strokeStyle='#2b6c9e';cx.lineWidth=2;rr(tx-tw/2,ty,tw,tht,7);cx.stroke();
   if(o.done&&a<1){cx.fillStyle='rgba(80,180,255,.85)';cx.fillRect(tx-5,ty+tht,10,fy-ty-tht);}}
 if(o.t==='smoke'){const k=dangerK(o);const sx=o.x-k*(o.x-cat.x-20);cx.globalAlpha=1-a;
   for(let i=0;i<7;i++){const ang=i*.9+t*.6,rx=sx+Math.cos(ang)*w*.25+(a*60),ry=fy-30-i*7+Math.sin(ang*1.3)*6-a*40;const r=16+(i%3)*5;const gr=cx.createRadialGradient(rx-4,ry-4,2,rx,ry,r);gr.addColorStop(0,'#e6c6ff');gr.addColorStop(1,'rgba(110,40,170,.8)');cx.fillStyle=gr;cx.beginPath();cx.arc(rx,ry,r,0,7);cx.fill();}
   cx.fillStyle='#ffe14d';cx.beginPath();cx.arc(sx-6,fy-44,2.5,0,7);cx.arc(sx+6,fy-44,2.5,0,7);cx.fill();cx.globalAlpha=1;
   const fx=o.x,fyy=Math.max(64,fy-g.topH*.42)+34;cx.save();cx.translate(fx,fyy);cx.rotate(o.done?t*20:t*.5);cx.fillStyle='#5fd0c4';for(let i=0;i<3;i++){cx.rotate(2.09);cx.beginPath();cx.ellipse(0,-9,5,9,0,0,7);cx.fill();}cx.restore();}
 if(o.t==='fire'){const nz=Math.max(64,fy-g.topH*.42)+30;cx.fillStyle='#555e70';rr(o.x-10,nz-10,20,16,4);cx.fill();
   const len=(fy-nz)*(1-a);if(len>2){for(let i=0;i<10;i++){const yy=nz+6+(i/10)*len,r=(6+i*1.3)*(1-a*.5)+Math.sin(t*20+i)*2.5;const gr=cx.createRadialGradient(o.x,yy,1,o.x,yy,r);gr.addColorStop(0,'#fff6b0');gr.addColorStop(.5,'#ffb020');gr.addColorStop(1,'rgba(255,60,0,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(o.x+Math.sin(t*15+i)*2,yy,r,0,7);cx.fill();}}}
 if(o.t==='saw'){const top=Math.max(64,fy-g.topH*.42)+20;cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(o.x-2,top,4,fy-top);
   const sy=a>0?fy-18+a*a*80:top+12+(Math.sin(t*2.2)*.5+.5)*(fy-top-30);cx.save();cx.translate(o.x,sy);cx.rotate(a>0?0:t*12);cx.globalAlpha=1-a;
   cx.fillStyle='#c9d1de';cx.beginPath();for(let i=0;i<16;i++){const an=i/16*6.283,rr2=i%2?13:17;cx.lineTo(Math.cos(an)*rr2,Math.sin(an)*rr2);}cx.fill();cx.fillStyle='#7b8698';cx.beginPath();cx.arc(0,0,5,0,7);cx.fill();cx.restore();cx.globalAlpha=1;}
 if(o.t==='lift'){const py=g.yLow+(g.yHigh-g.yLow)*a;cx.fillStyle='rgba(60,40,20,.35)';cx.fillRect(o.x-3,g.yHigh-30,6,g.yLow-g.yHigh+30);
   cx.strokeStyle='#8a8f99';cx.lineWidth=2;cx.beginPath();cx.moveTo(o.x-w*.35,py);cx.lineTo(o.x,g.yHigh-30);cx.lineTo(o.x+w*.35,py);cx.stroke();
   let gr=cx.createLinearGradient(0,py,0,py+12);gr.addColorStop(0,'#ffd36b');gr.addColorStop(1,'#c27c0e');cx.fillStyle=gr;rr(o.x-w*.5,py,w,12,5);cx.fill();}}
function drawBadge(g,o){if(o.anim>=1)return;const p=badgePos(g,o),n=o.req.length,bw=n>1?42:50,tot=bw*n;
 cx.save();cx.translate(p.x,p.y);const s=1+o.pulse*.25;cx.scale(s,s);
 o.req.forEach((r,i)=>{const x0=-tot/2+i*bw;let gr=cx.createLinearGradient(0,-14,0,14);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#d9e3f0');cx.fillStyle=gr;rr(x0+1,-14,bw-2,28,14);cx.fill();cx.strokeStyle=COLORS[r.c][1];cx.lineWidth=3;cx.stroke();
  cx.drawImage(ballSpr[r.c],x0+1,-10,20,20);drawIcon(cx,actOf(o,r.c),x0+11,0,13);if(r.left<=0)txt('✔',x0+bw*.62,1,15,'#2fbf3a','#fff');else txt(String(r.left),x0+bw*.62,1,n>1?14:17,'#3b2a1a','#fff');});
 if(o.t==='boss'){txt(T('boss'),0,-24,14,'#ffe14d','#5a1a99');}
 cx.restore();
 if(o.danger&&!o.done){const blink=o.dleft<=3?(Math.sin(g.t*12)>0):true;if(blink){const yy=o.t==='boss'?p.y+20:p.y-34;cx.fillStyle='#e0283f';rr(p.x-20,yy,40,18,9);cx.fill();txt('⚠'+o.dleft,p.x,yy+9,12,'#fff','#e0283f');}}}
function drawQuip(g){const q=g.quip,c=g.cat;const a=Math.min(1,q.t*6,(q.d-q.t)*4);cx.globalAlpha=Math.max(0,a);cx.font='800 13px GameFont, system-ui, sans-serif';
 const lines=wrap(q.s,Math.min(190,W*.5));const w=Math.max(...lines.map(l=>cx.measureText(l).width))+18,h=lines.length*17+10;let x=Math.min(Math.max(c.x-10,6),W-w-6),y=Math.max(4,c.y-62-h);
 cx.fillStyle='#fff';rr(x,y,w,h,10);cx.fill();cx.beginPath();cx.moveTo(c.x+4,y+h);cx.lineTo(c.x+12,y+h+8);cx.lineTo(c.x+16,y+h);cx.fill();cx.fillStyle='#3b2a1a';cx.textAlign='left';cx.textBaseline='middle';lines.forEach((l,i)=>cx.fillText(l,x+9,y+13+i*17));cx.globalAlpha=1;}
function catMood(g){if(g.state==='win')return'win';if(g.state==='lose')return'fail';if(g.ten===2)return'panic';if(g.ten===1)return'scared';return g.cat.walking?'walk':'idle';}
function drawCatInScene(g){const e=g.cat,s=Math.min(1.15,g.topH/250);const mood=catMood(g);const bob=e.walking?Math.abs(Math.sin(e.bob))*3:0;
 drawCat(cx,e.x,e.y-bob,s,{mood,t:g.t,walk:e.walking?e.bob:0,blink:e.blink>0,et:g.t-(g.endT||0)});}
// ---------- The hero: Somjeed, an original cheeky orange tabby ----------
function drawCat(c,x,y,s,o){const t=o.t,m=o.mood;c.save();c.translate(x,y);
 let sx=s,sy=s,rot=0,jy=0;
 if(m==='idle'){sy*=1+Math.sin(t*2)*.02;}
 if(m==='panic'){c.translate(Math.sin(t*45)*1.8,0);}
 if(m==='win'){jy=-Math.abs(Math.sin(t*7))*12;rot=Math.sin(t*7)*.18;}
 if(m==='fail'){const k=Math.min(1,o.et*3);sy*=1-.45*k;sx*=1+.25*k;}
 c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(0,0,22*s,4*s,0,0,7);c.fill();
 c.translate(0,jy);c.rotate(rot);c.scale(sx,sy);
 const fur=(x0,y0,r)=>{const g=c.createRadialGradient(x0-r*.35,y0-r*.45,r*.1,x0,y0,r);g.addColorStop(0,'#ffc56b');g.addColorStop(.55,'#ff9a2e');g.addColorStop(1,'#c4610f');return g;};
 const puff=m==='scared'||m==='panic'?1.12:1;
 // tail (S curve, swishing; puffed when scared)
 const sw=m==='idle'?Math.sin(t*2.2)*.5:m==='walk'?Math.sin(t*6)*.3:m==='win'?Math.sin(t*10)*.6:m==='fail'?-.8:Math.sin(t*20)*.15;
 c.save();c.translate(-16,-14);c.rotate(-.4+sw);c.strokeStyle='#e57d1c';c.lineCap='round';c.lineWidth=(m==='scared'||m==='panic')?10:7;
 c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-14,-4,-6,-22,-16,-30);c.stroke();c.strokeStyle='#8a3d06';c.lineWidth=2.5;for(let i=0;i<3;i++){const p=.3+i*.25;c.beginPath();c.arc(-10*p-3,-24*p,3,0,3);c.stroke();}c.restore();
 // legs
 const lw=o.walk?Math.sin(o.walk)*3:0;c.fillStyle='#f08a24';
 if(m==='fail'){c.fillStyle='#f08a24';[-12,-4,8,15].forEach(lx=>{c.beginPath();c.ellipse(lx,-3,6,3,0,0,7);c.fill();});}
 else [[-11,lw],[-3,-lw],[8,lw],[15,-lw]].forEach(([lx,d])=>{c.beginPath();c.ellipse(lx+d*.4,-5,4.5,6.5,0,0,7);c.fill();c.fillStyle='#fff1dc';c.beginPath();c.ellipse(lx+d*.4+1,-1,4,2.3,0,0,7);c.fill();c.fillStyle='#f08a24';});
 // chubby body
 c.save();c.scale(puff,puff);c.fillStyle=fur(2,-18,21);c.beginPath();c.ellipse(2,-17,20,14,0,0,7);c.fill();
 c.fillStyle='#fff1dc';c.beginPath();c.ellipse(8,-11,11,7,0,0,7);c.fill();
 c.strokeStyle='#a9500a';c.lineWidth=2.6;c.lineCap='round';for(let i=0;i<3;i++){c.beginPath();c.moveTo(-10+i*8,-30);c.quadraticCurveTo(-8+i*8,-24,-12+i*8,-20);c.stroke();}
 if(m==='scared'||m==='panic'){c.strokeStyle='#e57d1c';c.lineWidth=2;for(let i=0;i<6;i++){const ax=-14+i*6;c.beginPath();c.moveTo(ax,-30);c.lineTo(ax+2,-35);c.stroke();}}
 c.restore();
 // head
 const hx=16,hy=-36+(m==='idle'?Math.sin(t*2)*.6:0);c.save();c.translate(hx,hy);if(m==='win')c.rotate(-rot*1.5);
 // ears
 const ef=m==='scared'||m==='panic'?.5:m==='fail'?.7:Math.sin(t*1.3)>.97?.25:0;
 for(const sgn of[-1,1]){c.save();c.translate(sgn*8,-9);c.rotate(sgn*(.25+ef));c.fillStyle='#f08a24';c.beginPath();c.moveTo(-6,2);c.lineTo(0,-11);c.lineTo(6,2);c.fill();c.fillStyle='#ffb3c1';c.beginPath();c.moveTo(-3,1);c.lineTo(0,-6);c.lineTo(3,1);c.fill();c.restore();}
 c.fillStyle=fur(0,0,16);c.beginPath();c.ellipse(0,0,16,14,0,0,7);c.fill();
 c.strokeStyle='#a9500a';c.lineWidth=2.2;[-5,0,5].forEach(dx=>{c.beginPath();c.moveTo(dx,-13);c.lineTo(dx*.8,-8);c.stroke();});
 // cheeks/muzzle
 c.fillStyle='#fff1dc';c.beginPath();c.ellipse(-4,6,6,4.5,0,0,7);c.ellipse(5,6,6,4.5,0,0,7);c.fill();
 c.fillStyle='rgba(255,110,140,.45)';c.beginPath();c.ellipse(-10,4,3,2,0,0,7);c.ellipse(11,4,3,2,0,0,7);c.fill();
 // eyes
 const eyeY=-2;
 for(const ex of[-6,6]){
  if(m==='fail'){c.strokeStyle='#2a1a0a';c.lineWidth=2;c.beginPath();c.moveTo(ex-3,eyeY-3);c.lineTo(ex+3,eyeY+3);c.moveTo(ex+3,eyeY-3);c.lineTo(ex-3,eyeY+3);c.stroke();continue;}
  if(m==='win'){c.strokeStyle='#2a1a0a';c.lineWidth=2.2;c.beginPath();c.arc(ex,eyeY+1,3.5,3.4,6.0);c.stroke();continue;}
  const big=m==='scared'||m==='panic';const rx=big?5.2:4.6,ry=big?6:5;
  c.fillStyle='#fff';c.beginPath();c.ellipse(ex,eyeY,rx,ry,0,0,7);c.fill();
  c.fillStyle='#5fbf3a';c.beginPath();c.arc(ex+(big?0:1),eyeY+(big?0:1),big?3.4:3.2,0,7);c.fill();
  c.fillStyle='#1b1b1b';c.beginPath();c.ellipse(ex+(big?0:1),eyeY+(big?0:1),big?1.2:1,big?1.3:2.4,0,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex+2,eyeY-1.5,1,0,7);c.fill();
  // heavy lazy eyelids (sassy) unless scared; blink closes fully
  if(!big){const lid=o.blink?1:(m==='idle'?.48:.35);c.fillStyle='#f39030';c.beginPath();c.ellipse(ex,eyeY,rx+.6,ry+.6,0,3.14,3.14+3.14);c.rect(ex-rx-.6,eyeY-ry-.6,(rx+.6)*2,(ry+.6)*2*lid);c.fill();
   c.save();c.beginPath();c.rect(ex-rx-1,eyeY-ry-1,(rx+1)*2,(ry+1)*2*lid);c.clip();c.fillStyle='#f39030';c.beginPath();c.ellipse(ex,eyeY,rx+.6,ry+.6,0,0,7);c.fill();c.restore();
   c.strokeStyle='#7a3a06';c.lineWidth=1.4;c.beginPath();c.moveTo(ex-rx,eyeY-ry+(ry*2)*lid);c.lineTo(ex+rx,eyeY-ry+(ry*2)*lid);c.stroke();}}
 if(m==='panic'){c.fillStyle='#7fd3ff';c.beginPath();c.ellipse(-14,-6+((t*30)%8),2,3,0,0,7);c.fill();}
 // nose & mouth
 c.fillStyle='#ff6f91';c.beginPath();c.moveTo(-2,3);c.lineTo(2,3);c.lineTo(0,5.5);c.fill();
 c.strokeStyle='#5a2a06';c.lineWidth=1.3;c.beginPath();
 if(m==='panic'||m==='scared'){c.fillStyle='#5a1a1a';c.ellipse(0,10,3,m==='panic'?4+Math.sin(t*20):2.5,0,0,7);c.fill();}
 else if(m==='fail'){c.moveTo(-4,10);c.quadraticCurveTo(0,7,4,10);c.stroke();c.fillStyle='#ff8fa8';c.beginPath();c.ellipse(1,11.5,2,2.5,0,0,7);c.fill();}
 else if(m==='win'){c.fillStyle='#5a1a1a';c.arc(0,8,4,0,3.14);c.fill();}
 else{c.moveTo(0,5.5);c.lineTo(0,7);c.quadraticCurveTo(-3,9,-5,7.5);c.moveTo(0,7);c.quadraticCurveTo(4,9.5,7,5.5);c.stroke();}// smirk (one side up)
 c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=.9;for(const sg of[-1,1])for(let i=0;i<2;i++){c.beginPath();c.moveTo(sg*7,6+i*2);c.lineTo(sg*17,4+i*4);c.stroke();}
 c.restore();
 // collar with fish tag
 c.fillStyle='#2c7be5';c.beginPath();c.ellipse(13,-25,9,3,.3,0,7);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.ellipse(15,-21,4,2.2,0,0,7);c.moveTo(18,-21);c.lineTo(21,-23);c.lineTo(21,-19);c.fill();
 // win: raised paw; fail: dizzy stars
 if(m==='win'){c.fillStyle='#f08a24';c.beginPath();c.ellipse(26,-32+Math.sin(t*14)*3,4,6,-.6,0,7);c.fill();}
 c.restore();
 if(m==='fail'){for(let i=0;i<3;i++){const a=t*5+i*2.1;txt('★',x+16*s+Math.cos(a)*14,y-46*s+Math.sin(a)*4,11,'#ffe14d','#a06a00');}}}
// ---------- Basin ----------
function drawBasin(g){const B=g.bas;let gr=cx.createLinearGradient(0,g.topH,0,H);gr.addColorStop(0,'#3d2a3a');gr.addColorStop(1,'#1f1420');cx.fillStyle=gr;cx.fillRect(0,g.topH+8,W,H-g.topH);
 cx.save();cx.beginPath();cx.moveTo(B.l-4,B.t-6);cx.lineTo(B.l-4,g.bcy);cx.ellipse(g.bcx,g.bcy,g.R+4,(g.R+4)*.62,0,3.14,0,true);cx.lineTo(B.r+4,B.t-6);cx.closePath();
 gr=cx.createRadialGradient(g.bcx,g.bcy-40,20,g.bcx,g.bcy,g.R*1.4);gr.addColorStop(0,'#2e5d7a');gr.addColorStop(1,'#16314a');cx.fillStyle=gr;cx.fill();cx.strokeStyle='#e9b45a';cx.lineWidth=4;cx.stroke();cx.clip();
 const r=g.rad;for(const b of g.balls){const sq=b.sq?1+Math.sin(b.sq*20)*.12*b.sq:1;
  if(b.c===STAR){drawStarBall(b.x,b.y,r,g.t);continue;}
  if(b.c===RAINBOW){drawRainbow(b.x,b.y,r,g.t);continue;}
  cx.drawImage(ballSpr[b.c],b.x-r*sq-2,b.y-r/sq-2,(r*2+4)*sq,(r*2+4)/sq);
  if(b.lock){cx.fillStyle='rgba(220,245,255,.55)';rr(b.x-r,b.y-r,r*2,r*2,5);cx.fill();cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.stroke();if(b.lock>1){cx.beginPath();cx.moveTo(b.x-r*.6,b.y-r*.2);cx.lineTo(b.x,b.y+r*.2);cx.lineTo(b.x+r*.5,b.y-r*.4);cx.stroke();}}
  if(b.bomb){const hot=b.bomb<=2;cx.fillStyle=hot&&Math.sin(g.t*14)>0?'#e0283f':'#222';cx.beginPath();cx.arc(b.x,b.y,r*.62,0,7);cx.fill();txt(String(b.bomb),b.x,b.y+1,r*.85,'#fff','#000');
   cx.fillStyle='#ffb020';cx.beginPath();cx.arc(b.x+r*.5,b.y-r*.75,2+Math.random()*2,0,7);cx.fill();}}
 cx.restore();}
function drawStarBall(x,y,r,t){const gr=cx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);gr.addColorStop(0,'#fff');gr.addColorStop(.5,'#ffe14d');gr.addColorStop(1,'#e08a00');cx.fillStyle=gr;cx.beginPath();cx.arc(x,y,r*1.05,0,7);cx.fill();txt('★',x,y+1,r*1.3,'#fff','rgba(0,0,0,.25)');}
function drawRainbow(x,y,r,t){const cols=['#ff6b7a','#ffe66b','#8af07a','#6ec8ff','#d39bff'];for(let i=0;i<5;i++){cx.fillStyle=cols[i];cx.beginPath();cx.moveTo(x,y);cx.arc(x,y,r,t+i*1.256,t+(i+1)*1.256);cx.fill();}cx.fillStyle='rgba(255,255,255,.7)';cx.beginPath();cx.arc(x-r*.3,y-r*.35,r*.3,0,7);cx.fill();}
function drawTutorial(g){if(g.tutStep===0){const gs=allGroups(g).filter(x=>x.balls.length>=2&&x.c===0).sort((a,b)=>b.balls.length-a.balls.length);if(!gs.length)return;const target=gs[0].balls[0];
   const k=(Math.sin(g.t*5)+1)/2;drawHand(target.x+6,target.y+8+k*10);bubbleText(T('tut1'),W/2,g.bas.t+28);}
 else if(g.tutStep===1&&g.popsDone<3){const p=badgePos(g,g.obs[0]);bubbleText(T('tut2'),W/2,p.y+48);}}
function bubbleText(s,x,y){cx.font='800 15px GameFont, system-ui, sans-serif';const lines=wrap(s,W-60);const h=lines.length*20+14;cx.fillStyle='rgba(255,255,255,.95)';rr(20,y-h/2,W-40,h,14);cx.fill();lines.forEach((l,i)=>{cx.fillStyle='#3b2a1a';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(l,x,y-h/2+17+i*20);});}
function wrap(s,mw){const sp=s.includes(' ');const words=sp?s.split(' '):[...s];const sep=sp?' ':'';const out=[];let cur='';for(const w of words){const t=cur?cur+sep+w:w;if(cx.measureText(t).width>mw&&cur){out.push(cur);cur=w;}else cur=t;}if(cur)out.push(cur);return out;}
function drawHand(x,y){cx.save();cx.translate(x,y);cx.rotate(-.35);cx.fillStyle='#fff';cx.strokeStyle='#3b2a1a';cx.lineWidth=2.5;rr(-6,-2,12,26,6);cx.fill();cx.stroke();rr(-14,16,30,26,10);cx.fill();cx.stroke();cx.restore();}
// ---------- DOM UI ----------
const $=id=>document.getElementById(id);
function showHUD(){$('hud').style.display='flex';$('map').style.display='none';$('pop').style.display='none';updHUD();}
function updHUD(){if(!G)return;$('lvl').textContent=T('level')+' '+(G.li+1)+(G.L.boss?' 👹':'');$('mv').textContent=G.moves;$('mvl').textContent=T('moves');$('mvbox').classList.toggle('low',G.moves<=3);}
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,2600);}
function stars(g){const f=g.moves/g.L.moves;return g.extraUsed?1:f>=.2?3:f>=.08?2:1;}
function endPopup(win){const g=G;{const t=$('toast');clearTimeout(t._h);t.style.opacity=0;}const p=$('pop');p.style.display='flex';let h;
 if(win){const st=stars(g);SAVE.stars[g.li]=Math.max(SAVE.stars[g.li]||0,st);if(g.li===0)SAVE.tutDone=1;save();
  h=`<div class="card"><h2>${T('win')}</h2><div class="stars">${[1,2,3].map(i=>`<span class="${i<=st?'on':''}" style="animation-delay:${i*.2}s">★</span>`).join('')}</div><canvas id="ecv" width="400" height="240"></canvas><div class="quip">“${T('qWin')}”</div>
  ${g.li+1<LEVELS.length?`<button class="btn green" id="bNext">${T('next')}</button><button class="btn small" id="bMap">${T('map')}</button>`:`<button class="btn green" id="bMap">${T('map')}</button>`}</div>`;}
 else h=`<div class="card"><h2 class="go">${T('gameOver')}</h2><div class="why">${g.loseWhy==='moves'?T('outMoves'):g.loseWhy==='threat'?T('tooLate'):T('danger')}</div><canvas id="ecv" width="400" height="240"></canvas><div class="quip">“${T('qLose')}”</div>
  ${g.extraUsed<2?`<button class="btn gold" id="bAd">${g.loseWhy==='moves'?T('extra'):T('cont')}</button>`:''}<button class="btn green" id="bRetry">${T('retry')}</button><button class="btn small" id="bMap">${T('map')}</button></div>`;
 p.innerHTML=h;const ecv=$('ecv'),ec=ecv.getContext('2d');let t0=performance.now();
 (function anim(){if(!document.body.contains(ecv))return;const t=(performance.now()-t0)/1000;ec.setTransform(2,0,0,2,0,0);ec.clearRect(0,0,200,120);const lw=!win&&g.loseWhy==='threat';if(!win&&g.loseWhy==='threat'){}drawCat(ec,88,104+(win?0:Math.sin(t*2)*3),1.7,{mood:win?'win':(t<1.2?'panic':'scared'),t,blink:Math.sin(t*2)>.97,et:t});if(lw){const sl=g.L.theme==='cave';ec.fillStyle=sl?'rgba(120,220,70,.8)':'rgba(40,140,240,.75)';ec.beginPath();ec.moveTo(0,120);for(let x=0;x<=200;x+=8)ec.lineTo(x,88+Math.sin(x*.08+t*3)*4);ec.lineTo(200,120);ec.fill();}requestAnimationFrame(anim);})();
 if(win&&g.li+1>=LEVELS.length)toast(T('allDone'));
 const on=(id,f)=>{const b=$(id);if(b)b.onclick=()=>{SFX.init();SFX.tick();f();};};
 on('bNext',()=>{maybeInter();startLevel(g.li+1);});
 on('bMap',()=>{maybeInter();openMap();});on('bRetry',()=>{maybeInter();startLevel(g.li);});
 on('bAd',async()=>{const ok=await Ads.rewarded();if(ok){g.moves+=5;g.extraUsed++;g.thr=Math.max(0,g.thr-6);g.rt*=1.5;g.rtAcc=0;g.obs.forEach(o=>{if(o.danger&&!o.done)o.dleft+=4;});g.state='play';$('pop').style.display='none';SFX.sassyMeow();updHUD();}});}
function maybeInter(){if(G&&G.li>=2)Ads.interstitial();}
function openMap(){G=null;$('hud').style.display='none';$('pop').style.display='none';const m=$('map');m.style.display='flex';
 const unlocked=Math.min(LEVELS.length-1,SAVE.stars.filter(Boolean).length);
 let h=`<div class="title"><canvas id="mcat" width="240" height="150"></canvas><div class="logo">Pop Paws<br><small>Panic!</small></div><div class="tag">${T('tag')}</div></div><div class="path">`;
 for(let i=0;i<LEVELS.length;i++){const st=SAVE.stars[i]||0,lock=i>unlocked,boss=LEVELS[i].boss;h+=`<button class="node ${lock?'lock':''} ${i===unlocked?'cur':''} ${boss?'boss':''}" data-i="${i}" style="margin-left:${(36+28*Math.sin(i*1.1))|0}%">${lock?'🔒':boss?'👹':i+1}<span class="ns">${[1,2,3].map(k=>k<=st?'★':'☆').join('')}</span></button>`;}
 h+=`</div><div class="foot">P-Prece Studio · <button id="snd" class="snd">${SFX.on?'🔊':'🔇'}</button></div>`;m.innerHTML=h;
 m.querySelectorAll('.node').forEach(b=>b.onclick=()=>{if(b.classList.contains('lock'))return;SFX.init();SFX.meow();startLevel(+b.dataset.i);});
 $('snd').onclick=()=>{SFX.on=!SFX.on;localStorage.setItem('pr_snd',SFX.on?'1':'0');$('snd').textContent=SFX.on?'🔊':'🔇';};
 const mc=$('mcat'),mx=mc.getContext('2d'),t0=performance.now();(function anim(){if(!document.body.contains(mc))return;const t=(performance.now()-t0)/1000;mx.setTransform(2,0,0,2,0,0);mx.clearRect(0,0,120,75);drawCat(mx,52,70,1.15,{mood:'idle',t,blink:(t%3.2)<.15});requestAnimationFrame(anim);})();
 const cur=m.querySelector('.cur');if(cur)cur.scrollIntoView({block:'center'});Ads.banner(true);}
cv.addEventListener('pointerdown',e=>tap(e.clientX,e.clientY));
$('home').onclick=()=>{SFX.init();openMap();};
addEventListener('resize',resize);
let last=performance.now();function loop(n){const dt=Math.min(.033,(n-last)/1000);last=n;if(G)update(dt);render();requestAnimationFrame(loop);}
resize();document.documentElement.lang=LANG;if(LANG==='ar')document.documentElement.dir='rtl';
openMap();requestAnimationFrame(loop);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
// ---------- test hooks ----------
window.__pr={get g(){return G;},startLevel,tap,update,allGroups,
 best(){const g=G;const gs=allGroups(g).filter(x=>x.balls.length>=2||x.c===STAR);if(!gs.length)return null;let bs=-1,bg=null;const first=g.obs.find(o=>!o.done);
  for(const gr of gs){const n=gr.balls.length;let sc=n*.1;if(gr.c===STAR)sc=40;else for(const o of g.obs){const r=o.req.find(q=>q.c===gr.c&&q.left>0);if(r){sc+=Math.min(n,r.left)*(o.danger?3:1)*(o===first?2:1);break;}}
   if(n>=7)sc+=8;if(gr.balls.some(b=>b.bomb&&b.bomb<=2))sc+=12;
   if(sc>bs){bs=sc;bg=gr;}}const b=bg.balls.find(x=>x.c!==RAINBOW)||bg.balls[0];return{x:b.x,y:b.y};},
 worst(){const g=G;const gs=allGroups(g).filter(x=>x.balls.length>=2&&x.c>=0&&!g.obs.some(o=>o.req.some(r=>r.c===x.c&&r.left>0)));if(!gs.length)return null;const b=gs[0].balls[0];return{x:b.x,y:b.y};},
 sim(sec){for(let i=0;i<sec*60;i++)update(1/60);}};
