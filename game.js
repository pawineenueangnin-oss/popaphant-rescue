'use strict';
// Popaphant Rescue v1 — (c) P-Prece Studio. All art/sound procedural & original.
const COLORS=[['#ff6b7a','#e0283f','#8a0f22'],['#6ec8ff','#1f8fe6','#0b4a8f'],['#8af07a','#2fbf3a','#11661c'],['#ffe66b','#f5b81c','#9a6400'],['#d39bff','#9b4ff0','#4e1590']];
const cv=document.getElementById('c'),cx=cv.getContext('2d');
let W=360,H=640,DPR=1;
const BANNER=()=> (window.AndroidAds?56:0);
// ---------- Ads (safe stubs) ----------
const Ads={lastInter:0,minGap:90000,
 banner(show){try{window.AndroidAds&&(show?AndroidAds.showBanner&&AndroidAds.showBanner():AndroidAds.hideBanner&&AndroidAds.hideBanner());}catch(e){}},
 interstitial(){const n=Date.now();if(n-this.lastInter<this.minGap)return;this.lastInter=n;try{window.AndroidAds&&AndroidAds.showInterstitial&&AndroidAds.showInterstitial();}catch(e){}},
 rewarded(){return new Promise(res=>{if(!(window.AndroidAds&&AndroidAds.showRewarded)){setTimeout(()=>res(true),300);return;}
   window.onRewardedResult=ok=>{window.onRewardedResult=null;res(!!ok);};try{AndroidAds.showRewarded();}catch(e){res(false);}});}};
Ads.lastInter=Date.now();
// ---------- Sound (WebAudio synth) ----------
const SFX={ac:null,on:localStorage.getItem('pr_snd')!=='0',
 init(){if(!this.ac){try{this.ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(this.ac&&this.ac.state==='suspended')this.ac.resume();},
 tone(f,d,type='sine',v=.2,slide=0,delay=0){if(!this.on||!this.ac)return;const a=this.ac,t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.02);},
 pop(n){const b=380+Math.min(n,12)*45;for(let i=0;i<Math.min(n,6);i++)this.tone(b*(1+i*.12),.12,'sine',.18,1.8,i*.035);},
 tick(){this.tone(900,.05,'triangle',.08,1.3);},
 bad(){this.tone(220,.15,'square',.06,.6);},
 clear(){[523,659,784,1046].forEach((f,i)=>this.tone(f,.25,'triangle',.15,1,i*.08));},
 win(){[523,659,784,659,784,1046].forEach((f,i)=>this.tone(f,.3,'triangle',.17,1,i*.12));},
 lose(){[392,330,262].forEach((f,i)=>this.tone(f,.35,'sine',.16,.9,i*.18));},
 boom(){this.tone(120,.5,'sawtooth',.12,.3);this.tone(600,.3,'sine',.12,3);}};
// ---------- Save ----------
const SAVE=JSON.parse(localStorage.getItem('pr_save')||'{"stars":[]}');
function save(){localStorage.setItem('pr_save',JSON.stringify(SAVE));}
// ---------- State ----------
let G=null; // current level game
let ballSpr=[];
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';if(G)layout(G,true);}
function makeSprites(r){ballSpr=COLORS.map(c=>{const s=Math.ceil(r*2+4),o=document.createElement('canvas');o.width=o.height=s*DPR;const g=o.getContext('2d');g.scale(DPR,DPR);const m=s/2;
  const gr=g.createRadialGradient(m-r*.35,m-r*.4,r*.1,m,m,r);gr.addColorStop(0,c[0]);gr.addColorStop(.55,c[1]);gr.addColorStop(1,c[2]);
  g.fillStyle=gr;g.beginPath();g.arc(m,m,r,0,7);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(m-r*.35,m-r*.45,r*.32,r*.2,-.6,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.arc(m+r*.35,m+r*.4,r*.18,0,7);g.fill();return o;});}
// ---------- Level setup ----------
function startLevel(i){const L=LEVELS[i];
 G={li:i,L,moves:L.moves,movesUsed:0,balls:[],parts:[],flyers:[],texts:[],t:0,state:'play',shake:0,
   obs:L.obs.map(o=>({...o,left:o.need,anim:0,dleft:o.danger||0,pulse:0})),
   ele:{x:0,y:0,vx:0,bob:0,mood:0,face:1},tutorial:i===0&&!SAVE.tutDone,tutStep:0,extraUsed:0,popsDone:0,endT:0};
 layout(G,false);fillBasin(G);for(let k=0;k<240;k++)physics(G,1/60);
 G.ele.x=G.startX;G.ele.y=G.yLow;showHUD();Ads.banner(true);}
function layout(g,keep){g.topH=Math.round(H*.45);const bt=g.topH+10,bb=H-BANNER()-10,bl=10,br=W-10;
 const ob=g.bas;g.bas={l:bl,r:br,t:bt,b:bb};g.R=(br-bl)/2;g.bcx=(bl+br)/2;g.bcy=bb-g.R*.62;g.bR=g.R;
 g.rad=Math.max(11,Math.min(20,(br-bl)/19));makeSprites(g.rad);
 g.yLow=g.topH*.80;g.yHigh=g.topH*.50;g.startX=W*.1;g.exitX=W*.92;const n=g.obs.length;
 g.slot=(g.exitX-g.startX)/(n+1);g.sw=Math.min(78,g.slot*.78);
 g.obs.forEach((o,i)=>o.x=g.startX+g.slot*(i+1));g.lift=g.obs.find(o=>o.t==='lift');
 if(keep&&ob){const sx=(g.bas.r-g.bas.l)/(ob.r-ob.l),sy=(g.bas.b-g.bas.t)/(ob.b-ob.t);g.balls.forEach(b=>{b.x=g.bas.l+(b.x-ob.l)*sx;b.y=g.bas.t+(b.y-ob.t)*sy;b.px=b.x;b.py=b.y;});}
 if(G&&g.ele)g.ele.x=Math.max(g.ele.x,g.startX);}
function basinCount(g){const w=g.bas.r-g.bas.l,h=g.bas.b-g.bas.t;const area=w*h-(1-Math.PI/4)*w*g.R*.62*0.5;return Math.floor(area*.80/(3.46*g.rad*g.rad));}
function rndColor(g){const cs=g.L.colors;
 // gentle assist: bias towards colours still needed
 if(Math.random()<.25){const need=g.obs.filter(o=>o.left>0).map(o=>o.c);if(need.length)return need[Math.random()*need.length|0];}
 return cs[Math.random()*cs.length|0];}
function newBall(g,x,y,c){return{x,y,px:x,py:y,c,s:1,sq:0,id:Math.random()};}
function fillBasin(g){const N=basinCount(g),r=g.rad;let x=g.bas.l+r,y=g.bas.b-r;for(let i=0;i<N;i++){g.balls.push(newBall(g,x+(Math.random()-.5)*2,y,rndColor(g)));x+=r*2;if(x>g.bas.r-r){x=g.bas.l+r+(i%2?0:r);y-=r*1.75;}}}
function physics(g,dt){const B=g.balls,r=g.rad,gr=1500*dt*dt;
 for(const b of B){const vx=(b.x-b.px)*.985,vy=(b.y-b.py)*.985;b.px=b.x;b.py=b.y;b.x+=vx;b.y+=vy+gr;}
 for(let it=0;it<4;it++){
  for(let i=0;i<B.length;i++){const a=B[i];for(let j=i+1;j<B.length;j++){const b=B[j];const dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,m=2*r;if(d2<m*m&&d2>1e-6){const d=Math.sqrt(d2),p=(m-d)/d*.5;a.x-=dx*p;a.y-=dy*p;b.x+=dx*p;b.y+=dy*p;}}}
  for(const b of B){if(b.x<g.bas.l+r)b.x=g.bas.l+r;if(b.x>g.bas.r-r)b.x=g.bas.r-r;if(b.y>g.bas.b-r)b.y=g.bas.b-r;
   if(b.y>g.bcy){const dx=b.x-g.bcx,dy=(b.y-g.bcy)/0.62,d=Math.hypot(dx,dy),lim=g.R-r;if(d>lim){const k=lim/d;b.x=g.bcx+dx*k;b.y=g.bcy+dy*k*0.62;}}}}
}
function groupOf(g,b0){if(b0.c<0)return[b0];const B=g.balls,lim=(2*g.rad*1.12)**2,seen=new Set([b0]),q=[b0];
 while(q.length){const a=q.pop();for(const b of B)if(!seen.has(b)&&b.c===a.c){const dx=b.x-a.x,dy=b.y-a.y;if(dx*dx+dy*dy<lim){seen.add(b);q.push(b);}}}return[...seen];}
function allGroups(g){const seen=new Set(),out=[];for(const b of g.balls){if(seen.has(b))continue;const gr=groupOf(g,b);gr.forEach(x=>seen.add(x));out.push(gr);}return out;}
function ballAt(g,x,y){let best=null,bd=(g.rad*1.25)**2;for(const b of g.balls){const d=(b.x-x)**2+(b.y-y)**2;if(d<bd){bd=d;best=b;}}return best;}
function badgePos(g,o){const fy=floorY(g,o.x);return{x:o.x,y:Math.max(70,fy-g.topH*.42)};}
function floorY(g,x){return g.lift&&x>g.lift.x+g.sw*.5?g.yHigh:g.yLow;}
function tap(x,y){const g=G;if(!g||g.state!=='play')return;SFX.init();const b=ballAt(g,x,y);if(!b)return;
 let grp;if(b.c<0){const R2=(g.rad*5.2)**2;grp=g.balls.filter(o=>(o.x-b.x)**2+(o.y-b.y)**2<R2);SFX.boom();g.shake=10;}else grp=groupOf(g,b);
 if(grp.length<2){b.sq=1;SFX.bad();return;}
 g.moves--;g.movesUsed++;g.popsDone++;if(g.tutorial)g.tutStep=1;
 const counted={};for(const o of grp){if(o.c>=0)counted[o.c]=(counted[o.c]||0)+1;}
 // feed counters
 for(const o of grp){if(o.c<0)continue;const ob=g.obs.find(q=>q.c===o.c&&q.left>0);
  burst(g,o.x,o.y,COLORS[o.c][1],6);
  if(ob){ob.left--;const bp=badgePos(g,ob);g.flyers.push({x:o.x,y:o.y,sx:o.x,sy:o.y,tx:bp.x,ty:bp.y,c:o.c,t:-Math.random()*.15,ob});if(ob.left===0){ob.done=true;}}}
 SFX.pop(grp.length);
 g.balls=g.balls.filter(o=>!grp.includes(o));
 if(grp.length>=7&&b.c>=0){const s=newBall(g,b.x,b.y,-1);g.balls.push(s);g.texts.push({s:T('big'),x:x,y:y-20,t:0});if(!SAVE.starTip){SAVE.starTip=1;save();toast(T('star'));}}
 // hazards advance
 for(const o of g.obs)if(o.danger&&!o.done&&o.dleft>0)o.dleft--;
 // refill from top
 const N=basinCount(g);let k=0;while(g.balls.length<N){const nx=g.bas.l+g.rad+Math.random()*(g.bas.r-g.bas.l-2*g.rad);g.balls.push(newBall(g,nx,g.bas.t-g.rad*(1+2.1*(k++/6|0)),rndColor(g)));}
 updHUD();}
function burst(g,x,y,col,n){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*200;g.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,l:.6+Math.random()*.4,c:col,r:2+Math.random()*4});}}
function confetti(g){for(let i=0;i<90;i++){const c=COLORS[i%5][0];g.parts.push({x:W/2,y:g.topH*.5,vx:(Math.random()-.5)*600,vy:-200-Math.random()*400,l:1.5+Math.random(),c,r:3+Math.random()*4,sq:1});}}
// ---------- Update ----------
function update(dt){const g=G;if(!g)return;g.t+=dt;physics(g,dt);
 for(const b of g.balls){b.sq=Math.max(0,b.sq-dt*4);}
 for(const p of g.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt;}g.parts=g.parts.filter(p=>p.l>0);
 for(const f of g.flyers){f.t+=dt*1.6;if(f.t>0){const k=Math.min(1,f.t),e=k*k*(3-2*k);f.x=f.sx+(f.tx-f.sx)*e;f.y=f.sy+(f.ty-f.sy)*e-Math.sin(k*3.14)*60;}if(f.t>=1&&!f.hit){f.hit=1;f.ob.pulse=1;SFX.tick();}}
 g.flyers=g.flyers.filter(f=>f.t<1.05);
 for(const t of g.texts)t.t+=dt;g.texts=g.texts.filter(t=>t.t<1.2);
 g.shake=Math.max(0,g.shake-dt*30);
 const e=g.ele;
 for(const o of g.obs){o.pulse=Math.max(0,o.pulse-dt*3);
  const flying=g.flyers.some(f=>f.ob===o);
  if(o.done&&!flying&&o.anim<1){if(o.t==='lift'&&Math.abs(e.x-o.x)>2)continue;if(o.anim===0){SFX.clear();burst(g,o.x,floorY(g,o.x)-30,'#fff6b0',24);}o.anim=Math.min(1,o.anim+dt*.9);}}
 // elephant target
 let tx=g.exitX;for(const o of g.obs){if(o.anim<1){tx=o.t==='lift'?o.x:o.x-g.sw*.55-14;break;}if(o.t==='lift'&&o.anim<1)break;}
 tx=Math.max(tx,g.startX);const dx=tx-e.x;const sp=80;
 if(Math.abs(dx)>1){e.x+=Math.sign(dx)*Math.min(Math.abs(dx),sp*dt);e.bob+=dt*12;e.walking=1;}else e.walking=0;
 if(g.lift&&Math.abs(e.x-g.lift.x)<g.sw*.5)e.y=g.yLow+(g.yHigh-g.yLow)*ease(g.lift.anim);else e.y=floorY(g,e.x);
 // win / lose
 if(g.state==='play'){
  if(e.x>=g.exitX-2&&g.obs.every(o=>o.anim>=1)){g.state='win';g.endT=0;SFX.win();confetti(g);setTimeout(()=>{if(G===g)endPopup(true);},1300);}
  else if(g.obs.some(o=>o.danger&&!o.done&&o.dleft<=0)){g.state='lose';g.loseWhy='danger';g.shake=14;SFX.lose();setTimeout(()=>{if(G===g)endPopup(false);},1200);}
  else if(g.moves<=0&&!g.flyers.length&&!g.obs.every(o=>o.done)){g.state='lose';g.loseWhy='moves';SFX.lose();setTimeout(()=>{if(G===g)endPopup(false);},700);}
 }
}
const ease=k=>k*k*(3-2*k);
// ---------- Render ----------
function rr(x,y,w,h,r){cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h);}
function render(){cx.setTransform(DPR,0,0,DPR,0,0);const g=G;
 if(!g){drawBg(0);return;}
 cx.save();if(g.shake)cx.translate((Math.random()-.5)*g.shake,(Math.random()-.5)*g.shake);
 drawScene(g);drawBasin(g);
 for(const f of g.flyers){if(f.t<0)continue;const s=ballSpr[f.c],r=g.rad*.7;cx.drawImage(s,f.x-r,f.y-r,r*2,r*2);}
 for(const p of g.parts){cx.globalAlpha=Math.min(1,p.l*2);cx.fillStyle=p.c;if(p.sq)cx.fillRect(p.x,p.y,p.r,p.r*1.6);else{cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();}}cx.globalAlpha=1;
 for(const t of g.texts){cx.globalAlpha=1-t.t/1.2;txt(t.s,t.x,t.y-t.t*40,22,'#fff','#c2410c');}cx.globalAlpha=1;
 if(g.tutorial&&g.state==='play')drawTutorial(g);
 cx.restore();}
function txt(s,x,y,sz,fill,stroke,align='center'){cx.font=`900 ${sz}px GameFont, system-ui, sans-serif`;cx.textAlign=align;cx.textBaseline='middle';cx.lineJoin='round';cx.lineWidth=sz*.22;cx.strokeStyle=stroke;cx.strokeText(s,x,y);cx.fillStyle=fill;cx.fillText(s,x,y);}
function drawBg(top){const gr=cx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#7fd3ff');gr.addColorStop(.45,'#bff0e0');gr.addColorStop(1,'#f9d9a8');cx.fillStyle=gr;cx.fillRect(0,0,W,H);}
function drawScene(g){const th=g.topH;
 let gr=cx.createLinearGradient(0,0,0,th);gr.addColorStop(0,'#8be3ff');gr.addColorStop(1,'#d8f7e6');cx.fillStyle=gr;cx.fillRect(0,0,W,th);
 // distant temple silhouettes (original simple stupa shapes)
 cx.fillStyle='rgba(80,150,140,.25)';for(let i=0;i<4;i++){const x=W*(.12+i*.27),b=th*.75,h=th*(.28+.08*(i%2));cx.beginPath();cx.moveTo(x-h*.35,b);cx.quadraticCurveTo(x-h*.3,b-h*.5,x,b-h);cx.quadraticCurveTo(x+h*.3,b-h*.5,x+h*.35,b);cx.fill();}
 // clouds
 cx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<3;i++){const x=((g.t*8+i*160)%(W+120))-60,y=th*(.12+i*.07);cx.beginPath();cx.arc(x,y,14,0,7);cx.arc(x+16,y-6,18,0,7);cx.arc(x+34,y,13,0,7);cx.fill();}
 // floors
 const L=g.lift;drawRock(0,g.yLow,L?L.x-g.sw*.5:W,th-g.yLow+4);
 if(L){drawRock(L.x+g.sw*.5,g.yHigh,W-L.x-g.sw*.5,th-g.yHigh+4);}
 // exit door
 drawDoor(g.exitX+8,floorY(g,g.exitX));
 for(const o of g.obs)drawObs(g,o);
 drawEle(g);
 for(const o of g.obs)drawBadge(g,o);
 // separator
 gr=cx.createLinearGradient(0,th-6,0,th+12);gr.addColorStop(0,'#7a4b2a');gr.addColorStop(1,'#3d2414');cx.fillStyle=gr;cx.fillRect(0,th-2,W,12);}
function drawRock(x,y,w,h){if(w<=0)return;let gr=cx.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#c98f5a');gr.addColorStop(.2,'#a86c3c');gr.addColorStop(1,'#6e4224');cx.fillStyle=gr;rr(x,y,w,h,8);cx.fill();
 cx.fillStyle='#7ccf5a';rr(x,y-4,w,9,5);cx.fill();cx.fillStyle='rgba(255,255,255,.3)';cx.fillRect(x+4,y-3,w-8,2);
 cx.fillStyle='rgba(0,0,0,.08)';for(let i=x+14;i<x+w-10;i+=34){cx.beginPath();cx.ellipse(i,y+h*.55,9,5,0,0,7);cx.fill();}}
function drawDoor(x,fy){const w=30,h=48;let gr=cx.createLinearGradient(x-w/2,0,x+w/2,0);gr.addColorStop(0,'#ffe27a');gr.addColorStop(.5,'#ffc531');gr.addColorStop(1,'#c98a0b');cx.fillStyle=gr;
 cx.beginPath();cx.moveTo(x-w/2,fy);cx.lineTo(x-w/2,fy-h*.6);cx.quadraticCurveTo(x,fy-h*1.25,x+w/2,fy-h*.6);cx.lineTo(x+w/2,fy);cx.fill();
 cx.fillStyle='#5b3a1a';cx.beginPath();cx.moveTo(x-w*.3,fy);cx.lineTo(x-w*.3,fy-h*.55);cx.quadraticCurveTo(x,fy-h*.95,x+w*.3,fy-h*.55);cx.lineTo(x+w*.3,fy);cx.fill();
 cx.fillStyle='#fff3b0';cx.beginPath();cx.arc(x,fy-h*1.05,4,0,7);cx.fill();}
function drawObs(g,o){const fy=floorY(g,o.x),w=g.sw,a=ease(o.anim),t=g.t;
 if(o.t==='gate'){const h=g.topH*.36;cx.save();cx.beginPath();cx.rect(o.x-w*.4,fy-h-4,w*.8,h+4);cx.clip();
   for(let i=0;i<4;i++){const bx=o.x-w*.3+i*w*.2;let gr=cx.createLinearGradient(bx-4,0,bx+4,0);gr.addColorStop(0,'#c7cfe0');gr.addColorStop(.5,'#ffffff');gr.addColorStop(1,'#6f7a94');cx.fillStyle=gr;rr(bx-4,fy-h-a*h,8,h,4);cx.fill();}
   cx.restore();cx.fillStyle='#8b5a2b';rr(o.x-w*.45,fy-h-10,w*.9,10,4);cx.fill();
   if(a<1){const ly=fy-h*.5+a*30;cx.globalAlpha=1-a;cx.strokeStyle='#e8b60e';cx.lineWidth=5;cx.beginPath();cx.arc(o.x,ly-10,9,3.14,0);cx.stroke();
    let gr=cx.createLinearGradient(0,ly-6,0,ly+14);gr.addColorStop(0,'#ffe066');gr.addColorStop(1,'#d18a00');cx.fillStyle=gr;rr(o.x-13,ly-8,26,22,6);cx.fill();cx.fillStyle='#6b4500';cx.beginPath();cx.arc(o.x,ly+2,3.5,0,7);cx.fill();cx.globalAlpha=1;}}
 if(o.t==='lava'){const pw=w*1.05,ph=g.topH-fy-6;cx.fillStyle='#2a1508';cx.fillRect(o.x-pw/2,fy-2,pw,ph);
   const hot=1-a;let gr=cx.createLinearGradient(0,fy,0,fy+ph);gr.addColorStop(0,`rgba(255,${200-hot*60|0},60,1)`);gr.addColorStop(1,'#d9480f');
   if(hot>0){cx.globalAlpha=hot;cx.fillStyle=gr;cx.fillRect(o.x-pw/2,fy+2,pw,ph-4);for(let i=0;i<3;i++){const bx=o.x-pw/3+i*pw/3,by=fy+8+Math.sin(t*3+i)*3;cx.fillStyle='#ffe08a';cx.beginPath();cx.arc(bx,by,3+Math.sin(t*5+i)*1.5,0,7);cx.fill();}
     if(o.danger){const k=1-o.dleft/o.danger;cx.fillStyle='rgba(255,120,30,.5)';for(let i=0;i<4;i++){const sx=o.x-pw/2-k*40-i*8;cx.beginPath();cx.arc(sx,fy-6-Math.abs(Math.sin(t*4+i))*k*30,3+k*3,0,7);cx.fill();}}cx.globalAlpha=1;}
   if(a>0){cx.globalAlpha=a;let g2=cx.createLinearGradient(0,fy,0,fy+ph);g2.addColorStop(0,'#9fb7c4');g2.addColorStop(1,'#56707f');cx.fillStyle=g2;rr(o.x-pw/2,fy-4,pw,ph+4,6);cx.fill();cx.globalAlpha=1;}
   // water tank
   const tx=o.x,ty=Math.max(64,fy-g.topH*.42)+26,tw=w*.8,tht=26;cx.fillStyle='rgba(255,255,255,.55)';rr(tx-tw/2,ty,tw,tht,7);cx.fill();
   const fill=o.done?1-a:1-o.left/o.need;cx.fillStyle='#3fa9f5';rr(tx-tw/2+2,ty+tht-2-(tht-4)*fill,tw-4,(tht-4)*fill,5);cx.fill();cx.strokeStyle='#2b6c9e';cx.lineWidth=2;rr(tx-tw/2,ty,tw,tht,7);cx.stroke();
   if(o.done&&a<1){cx.fillStyle='rgba(80,180,255,.85)';cx.fillRect(tx-5,ty+tht,10,fy-ty-tht);for(let i=0;i<4;i++){cx.beginPath();cx.arc(tx+(Math.random()-.5)*pw,fy+Math.random()*6,3,0,7);cx.fillStyle='#dff3ff';cx.fill();}}}
 if(o.t==='smoke'){const k=o.danger?1-o.dleft/o.danger:0;const sx=o.x-k*(o.x-g.ele.x-20);cx.globalAlpha=1-a;
   for(let i=0;i<7;i++){const ang=i*.9+t*.6,rx=sx+Math.cos(ang)*w*.25+(a*60),ry=fy-30-i*7+Math.sin(ang*1.3)*6-a*40;const r=16+(i%3)*5;const gr=cx.createRadialGradient(rx-4,ry-4,2,rx,ry,r);gr.addColorStop(0,'#e6c6ff');gr.addColorStop(1,'rgba(130,60,190,.75)');cx.fillStyle=gr;cx.beginPath();cx.arc(rx,ry,r,0,7);cx.fill();}
   cx.globalAlpha=1;// fan
   const fx=o.x,fyy=Math.max(64,fy-g.topH*.42)+34;cx.save();cx.translate(fx,fyy);cx.rotate(o.done?t*20:t*.5);cx.fillStyle='#5fd0c4';for(let i=0;i<3;i++){cx.rotate(2.09);cx.beginPath();cx.ellipse(0,-9,5,9,0,0,7);cx.fill();}cx.restore();cx.fillStyle='#245';cx.beginPath();cx.arc(fx,fyy,4,0,7);cx.fill();}
 if(o.t==='fire'){const nz=Math.max(64,fy-g.topH*.42)+30;cx.fillStyle='#555e70';rr(o.x-10,nz-10,20,16,4);cx.fill();
   const len=(fy-nz)*(1-a);if(len>2){for(let i=0;i<10;i++){const yy=nz+6+(i/10)*len,r=(6+i*1.2)*(1-a*.5)+Math.sin(t*20+i)*2;const gr=cx.createRadialGradient(o.x,yy,1,o.x,yy,r);gr.addColorStop(0,'#fff6b0');gr.addColorStop(.5,'#ffb020');gr.addColorStop(1,'rgba(255,60,0,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(o.x+Math.sin(t*15+i)*2,yy,r,0,7);cx.fill();}}}
 if(o.t==='lift'){const py=g.yLow+(g.yHigh-g.yLow)*a;cx.fillStyle='rgba(60,40,20,.35)';cx.fillRect(o.x-3,g.yHigh-30,6,g.yLow-g.yHigh+30);
   cx.strokeStyle='#8a8f99';cx.lineWidth=2;cx.beginPath();cx.moveTo(o.x-w*.35,py);cx.lineTo(o.x,g.yHigh-30);cx.lineTo(o.x+w*.35,py);cx.stroke();
   let gr=cx.createLinearGradient(0,py,0,py+12);gr.addColorStop(0,'#ffd36b');gr.addColorStop(1,'#c27c0e');cx.fillStyle=gr;rr(o.x-w*.5,py,w,12,5);cx.fill();}}
function drawBadge(g,o){if(o.anim>=1)return;const p=badgePos(g,o),s=1+o.pulse*.25;cx.save();cx.translate(p.x,p.y);cx.scale(s,s);
 let gr=cx.createLinearGradient(0,-16,0,16);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#d9e3f0');cx.fillStyle=gr;rr(-25,-14,50,28,14);cx.fill();cx.strokeStyle=COLORS[o.c][1];cx.lineWidth=3;cx.stroke();
 const r=10;cx.drawImage(ballSpr[o.c],-23,-9,18,18);
 if(o.done){txt('✔',8,1,18,'#2fbf3a','#fff');}else txt(String(o.left),8,1,17,'#3b2a1a','#fff');
 cx.restore();
 if(o.danger&&!o.done){const blink=o.dleft<=3?(Math.sin(g.t*12)>0):true;if(blink){cx.fillStyle='#e0283f';rr(p.x-20,p.y-35,40,18,9);cx.fill();txt('⚠'+o.dleft,p.x,p.y-26,12,'#fff','#e0283f');}}}
function drawEle(g){const e=g.ele,s=Math.min(1.15,g.topH/250)*1.0,bob=e.walking?Math.abs(Math.sin(e.bob))*3:Math.sin(g.t*2)*1;
 let scared=g.obs.some(o=>o.danger&&!o.done&&o.dleft<=3)||g.state==='lose';const happy=g.state==='win';
 const x=e.x+(scared?Math.sin(g.t*40):0),y=e.y-(happy?Math.abs(Math.sin(g.t*8))*14:0);
 drawElephant(cx,x,y-bob,s,{scared,happy,walk:e.walking?e.bob:0,t:g.t});}
function drawElephant(c,x,y,s,o){c.save();c.translate(x,y);c.scale(s,s);
 // shadow
 c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,0,22,4,0,0,7);c.fill();
 const sk=(x0,y0,r)=>{const g=c.createRadialGradient(x0-r*.35,y0-r*.4,r*.1,x0,y0,r);g.addColorStop(0,'#d8e4f2');g.addColorStop(.6,'#9fb2cc');g.addColorStop(1,'#6a7f9e');return g;};
 const lw=o.walk?Math.sin(o.walk)*3:0;
 // legs
 c.fillStyle='#8496b4';[[-11,lw],[-3,-lw],[7,lw],[14,-lw]].forEach(([lx,d])=>{c.beginPath();c.ellipse(lx+d*.3,-5,5,7,0,0,7);c.fill();});
 // body
 c.fillStyle=sk(0,-20,20);c.beginPath();c.ellipse(2,-18,19,15,0,0,7);c.fill();
 // saddle cloth (Thai-style pattern)
 c.fillStyle='#e0283f';c.beginPath();c.ellipse(4,-25,12,8,0,3.3,6.1);c.lineTo(15,-18);c.lineTo(-7,-18);c.fill();c.fillStyle='#ffc531';for(let i=-4;i<14;i+=5){c.beginPath();c.moveTo(i,-18);c.lineTo(i+2.5,-14);c.lineTo(i+5,-18);c.fill();}
 // tail
 c.strokeStyle='#7d8fae';c.lineWidth=2;c.beginPath();c.moveTo(-17,-20);c.quadraticCurveTo(-23,-16+Math.sin(o.t*5)*2,-21,-11);c.stroke();
 // head
 const hx=16,hy=-34;
 c.fillStyle=sk(hx+8,hy-2,8);c.beginPath();c.ellipse(hx-4,hy+2,10,13,-.2,0,7);c.fill();// ear back
 c.fillStyle=sk(hx,hy,15);c.beginPath();c.arc(hx,hy,14,0,7);c.fill();
 // ear front
 const ef=Math.sin(o.t*3)*.08;c.save();c.translate(hx-6,hy+1);c.rotate(-.2+ef);c.fillStyle=sk(0,0,11);c.beginPath();c.ellipse(0,0,9,12,0,0,7);c.fill();c.fillStyle='#f6b3c4';c.beginPath();c.ellipse(1,0,5.5,8,0,0,7);c.fill();c.restore();
 // trunk
 c.strokeStyle='#97aac6';c.lineCap='round';c.lineWidth=7;c.beginPath();c.moveTo(hx+11,hy+4);const up=o.happy?-1:o.scared?.4:-.3;c.quadraticCurveTo(hx+22,hy+10,hx+24,hy+2+up*12);c.stroke();
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(hx+12,hy+2);c.quadraticCurveTo(hx+21,hy+7,hx+22,hy+up*12);c.stroke();
 // eye
 c.fillStyle='#1d2238';c.beginPath();c.ellipse(hx+5,hy-3,3,o.scared?4.5:3.8,0,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(hx+6,hy-4.5,1.3,0,7);c.fill();
 c.fillStyle='rgba(255,120,150,.55)';c.beginPath();c.ellipse(hx+5,hy+5,3.5,2,0,0,7);c.fill();
 // mouth
 c.strokeStyle='#4a3040';c.lineWidth=1.3;c.beginPath();if(o.scared)c.arc(hx+9,hy+9,2,3.4,6);else c.arc(hx+8,hy+6,2.5,.2,2.4);c.stroke();
 // little jasmine flower on head
 c.fillStyle='#fff';for(let i=0;i<5;i++){c.beginPath();c.arc(hx-3+Math.cos(i*1.26)*3,hy-13+Math.sin(i*1.26)*3,2.2,0,7);c.fill();}c.fillStyle='#ffc531';c.beginPath();c.arc(hx-3,hy-13,1.6,0,7);c.fill();
 c.restore();}
function drawBasin(g){const B=g.bas;let gr=cx.createLinearGradient(0,g.topH,0,H);gr.addColorStop(0,'#5b3a24');gr.addColorStop(1,'#3a2416');cx.fillStyle=gr;cx.fillRect(0,g.topH+8,W,H-g.topH);
 // bowl
 cx.save();cx.beginPath();cx.moveTo(B.l-4,B.t-6);cx.lineTo(B.l-4,g.bcy);cx.ellipse(g.bcx,g.bcy,g.R+4,(g.R+4)*.62,0,3.14,0,true);cx.lineTo(B.r+4,B.t-6);cx.closePath();
 gr=cx.createRadialGradient(g.bcx,g.bcy-40,20,g.bcx,g.bcy,g.R*1.4);gr.addColorStop(0,'#2e5d7a');gr.addColorStop(1,'#16314a');cx.fillStyle=gr;cx.fill();cx.strokeStyle='#e9b45a';cx.lineWidth=4;cx.stroke();cx.clip();
 const r=g.rad;for(const b of g.balls){const sq=b.sq?1+Math.sin(b.sq*20)*.12*b.sq:1;
   if(b.c<0){drawStarBall(b.x,b.y,r,g.t);continue;}cx.drawImage(ballSpr[b.c],b.x-r*sq-2,b.y-r/sq-2,(r*2+4)*sq,(r*2+4)/sq);}
 cx.restore();
 // HUD moves pill in basin top-left drawn by DOM
}
function drawStarBall(x,y,r,t){const gr=cx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);gr.addColorStop(0,'#fff');gr.addColorStop(.5,`hsl(${t*200%360},90%,65%)`);gr.addColorStop(1,`hsl(${(t*200+120)%360},80%,45%)`);cx.fillStyle=gr;cx.beginPath();cx.arc(x,y,r*1.05,0,7);cx.fill();txt('★',x,y+1,r*1.3,'#fff','rgba(0,0,0,.25)');}
function drawTutorial(g){let target;if(g.tutStep===0){const gs=allGroups(g).filter(x=>x.length>=2&&x[0].c===0).sort((a,b)=>b.length-a.length);if(!gs.length)return;target=gs[0][0];g.tutTarget=target;
   const k=(Math.sin(g.t*5)+1)/2;drawHand(target.x+6,target.y+8+k*10);bubbleText(T('tut1'),W/2,g.bas.t+28);}
 else if(g.tutStep===1&&g.popsDone<3){const o=g.obs[0];const p=badgePos(g,o);bubbleText(T('tut2'),W/2,p.y+48);}}
function bubbleText(s,x,y){cx.font='800 15px GameFont, system-ui, sans-serif';const lines=wrap(s,W-60);const h=lines.length*20+14;cx.fillStyle='rgba(255,255,255,.95)';rr(20,y-h/2,W-40,h,14);cx.fill();lines.forEach((l,i)=>{cx.fillStyle='#3b2a1a';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(l,x,y-h/2+17+i*20);});}
function wrap(s,mw){const words=s.includes(' ')?s.split(' '):[...s];const sep=s.includes(' ')?' ':'';const out=[];let cur='';for(const w of words){const t=cur?cur+sep+w:w;if(cx.measureText(t).width>mw&&cur){out.push(cur);cur=w;}else cur=t;}if(cur)out.push(cur);return out;}
function drawHand(x,y){cx.save();cx.translate(x,y);cx.rotate(-.35);cx.fillStyle='#fff';cx.strokeStyle='#3b2a1a';cx.lineWidth=2.5;
 rr(-6,-2,12,26,6);cx.fill();cx.stroke();rr(-14,16,30,26,10);cx.fill();cx.stroke();cx.restore();}
// ---------- DOM UI ----------
const $=id=>document.getElementById(id);
function showHUD(){$('hud').style.display='flex';$('map').style.display='none';$('pop').style.display='none';updHUD();}
function updHUD(){if(!G)return;$('lvl').textContent=T('level')+' '+(G.li+1);$('mv').textContent=G.moves;$('mvl').textContent=T('moves');}
function toast(s){const t=$('toast');t.textContent=s;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,2600);}
function stars(g){const f=g.moves/g.L.moves;return g.extraUsed?1:f>=.3?3:f>=.12?2:1;}
function endPopup(win){const g=G;const p=$('pop');p.style.display='flex';let h='';
 if(win){const st=stars(g);SAVE.stars[g.li]=Math.max(SAVE.stars[g.li]||0,st);if(g.li===0){SAVE.tutDone=1;}save();
  h=`<div class="card"><h2>${T('win')}</h2><div class="stars">${[1,2,3].map(i=>`<span class="${i<=st?'on':''}" style="animation-delay:${i*.2}s">★</span>`).join('')}</div><canvas id="ecv" width="400" height="240"></canvas>
  ${g.li+1<LEVELS.length?`<button class="btn green" id="bNext">${T('next')}</button><button class="btn small" id="bMap">${T('map')}</button>`:`<button class="btn green" id="bMap">${T('map')}</button>`}</div>`;}
 else{h=`<div class="card"><h2>${g.loseWhy==='moves'?T('outMoves'):T('danger')}</h2><canvas id="ecv" width="400" height="240"></canvas>
  ${g.loseWhy==='moves'&&g.extraUsed<2?`<button class="btn gold" id="bAd">${T('extra')}</button>`:''}<button class="btn green" id="bRetry">${T('retry')}</button><button class="btn small" id="bMap">${T('map')}</button></div>`;}
 p.innerHTML=h;const ec=$('ecv').getContext('2d');ec.scale(2,2);drawElephant(ec,82,108,1.6,{happy:win,scared:!win,t:0});
 if(win&&g.li+1>=LEVELS.length)toast(T('allDone'));
 const on=(id,f)=>{const b=$(id);if(b)b.onclick=()=>{SFX.init();SFX.tick();f();};};
 on('bNext',()=>{if(g.li+1<LEVELS.length){maybeInter();startLevel(g.li+1);}else openMap();});
 on('bMap',()=>{maybeInter();openMap();});on('bRetry',()=>{maybeInter();startLevel(g.li);});
 on('bAd',async()=>{const ok=await Ads.rewarded();if(ok){g.moves+=5;g.extraUsed++;g.state='play';$('pop').style.display='none';updHUD();}});}
function maybeInter(){if(G&&G.li>=2)Ads.interstitial();}
function openMap(){G=null;$('hud').style.display='none';$('pop').style.display='none';const m=$('map');m.style.display='flex';
 const unlocked=Math.min(LEVELS.length-1,SAVE.stars.filter(Boolean).length);
 let h=`<div class="title"><div class="logo">Popaphant<br><small>Rescue</small></div><div class="tag">${T('tag')}</div></div><div class="path">`;
 for(let i=0;i<LEVELS.length;i++){const st=SAVE.stars[i]||0,lock=i>unlocked;h+=`<button class="node ${lock?'lock':''} ${i===unlocked?'cur':''}" data-i="${i}" style="margin-left:${(36+28*Math.sin(i*1.1))|0}%">${lock?'🔒':i+1}<span class="ns">${[1,2,3].map(k=>k<=st?'★':'☆').join('')}</span></button>`;}
 h+=`</div><div class="foot">P-Prece Studio · <button id="snd" class="snd">${SFX.on?'🔊':'🔇'}</button></div>`;m.innerHTML=h;
 m.querySelectorAll('.node').forEach(b=>b.onclick=()=>{if(b.classList.contains('lock'))return;SFX.init();SFX.tick();startLevel(+b.dataset.i);});
 $('snd').onclick=()=>{SFX.on=!SFX.on;localStorage.setItem('pr_snd',SFX.on?'1':'0');$('snd').textContent=SFX.on?'🔊':'🔇';};
 const cur=m.querySelector('.cur');if(cur)cur.scrollIntoView({block:'center'});Ads.banner(true);}
// ---------- Input & loop ----------
cv.addEventListener('pointerdown',e=>{tap(e.clientX,e.clientY);});
$('home').onclick=()=>{SFX.init();openMap();};
addEventListener('resize',resize);
let last=performance.now();function loop(n){const dt=Math.min(.033,(n-last)/1000);last=n;if(G){update(dt);}render();requestAnimationFrame(loop);}
resize();document.documentElement.lang=LANG;if(LANG==='ar')document.documentElement.dir='rtl';
openMap();requestAnimationFrame(loop);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
// ---------- test hooks (harmless) ----------
window.__pr={get g(){return G;},startLevel,tap,update,allGroups,
 best(){const g=G;const gs=allGroups(g).filter(x=>x.length>=2||x[0].c<0);if(!gs.length)return null;let bs=-1,bg=null;
  for(const gr of gs){let sc=gr.length*.1;const c=gr[0].c;if(c<0)sc=50;else{for(const o of g.obs)if(o.c===c&&o.left>0){sc+=Math.min(gr.length,o.left)*(o.danger?3:1)*(g.obs.indexOf(o)===g.obs.findIndex(q=>q.left>0)?2:1);}}if(gr.length>=7)sc+=8;if(sc>bs){bs=sc;bg=gr;}}
  const b=bg[0];return{x:b.x,y:b.y};},
 sim(sec){for(let i=0;i<sec*60;i++)update(1/60);}};
