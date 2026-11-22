var REAL_SRC="assets/img/tutorial-sat.jpg";

(function(){
"use strict";
/* ================= helpers ================= */
var $=function(id){return document.getElementById(id)};
var cl=function(x,a,b){return x<a?a:x>b?b:x}, lerp=function(a,b,k){return a+(b-a)*k};
function sm(a,b,x){x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)}
function io(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function win(lt,a,b,f){f=f||.3;return sm(a,a+f,lt)*(1-sm(b-f,b,lt))}
function rng(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
var TAU=Math.PI*2;

/* ================= world ================= */
// world units = procedural texture pixels. 1 killa = 198 ft × 220 ft (1 acre). 3.3 ft per unit.
var KW=60, KH=200/3, FT=3.3, GX=120, GY=120, PW=1440, PH=1574, SCX=210, SCY=454;
function kCorner(mc,mr,kc,kr){return {x:GX+(mc*5+kc)*KW, y:GY+(mr*5+kr)*KH}}
var K12=kCorner(1,1,1,2), F12=12/FT;
var P=[{x:K12.x,y:K12.y},{x:K12.x+KW,y:K12.y},{x:K12.x+KW,y:K12.y+KH-F12},{x:K12.x+KW-F12,y:K12.y+KH},{x:K12.x,y:K12.y+KH}];
var PC={x:K12.x+KW/2,y:K12.y+KH/2};
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function areaFt(pts){var s=0;for(var i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];s+=a.x*b.y-b.x*a.y}return Math.abs(s)/2*FT*FT}
function perimFt(pts,closed){var s=0;for(var i=0;i<pts.length-(closed?0:1);i++)s+=dist(pts[i],pts[(i+1)%pts.length])*FT;return s}
function km(sqft){var m=sqft/272, k=Math.floor(m/20); return {k:k,m:m-k*20}}
function fmtArea(sqft){var a=km(sqft);return a.k+' Kanal '+a.m.toFixed(1)+' Marla'}
function n0(x){return Math.round(x).toLocaleString('en-US')}
var LAT0=30.9693, LON0=70.9428;
function ll(p){return {la:LAT0-(p.y-PC.y)*FT/364000, lo:LON0+(p.x-PC.x)*FT/312100}}

/* ================= imagery ================= */
var real=new Image(); real.src=REAL_SRC; $('bgimg').style.backgroundImage='url('+REAL_SRC+')';
var proc=document.createElement('canvas'); proc.width=PW; proc.height=PH;
var procMap=document.createElement('canvas'); procMap.width=PW; procMap.height=PH;
var realMap=document.createElement('canvas'); realMap.width=1024; realMap.height=1024;
(function genProc(){
  var g=proc.getContext('2d'), R=rng(42);
  g.fillStyle='#55693a'; g.fillRect(0,0,PW,PH);
  var crops=[['#5f8f37',.9],['#4d7a2c',1],['#6fa046',.7],['#3e6326',.5],['#9aa83f',.35],['#8c7656',.45],['#7a6247',.35],['#567f33',.8]];
  function pick(){var t=0,i;for(i=0;i<crops.length;i++)t+=crops[i][1];var r=R()*t;for(i=0;i<crops.length;i++){r-=crops[i][1];if(r<=0)return crops[i][0]}return crops[0][0]}
  function shade(hex,d){var n=parseInt(hex.slice(1),16),r=(n>>16)+d,gg=(n>>8&255)+d,b=(n&255)+d;return 'rgb('+cl(r,0,255)+','+cl(gg,0,255)+','+cl(b,0,255)+')'}
  function plot(x,y,w,h){var c=pick();g.fillStyle=shade(c,(R()*16-8)|0);g.fillRect(x,y,w,h);
    var vert=R()<.5;g.strokeStyle=R()<.5?'rgba(0,0,0,.13)':'rgba(255,255,230,.09)';g.lineWidth=1;g.beginPath();
    if(vert)for(var i=x+2;i<x+w;i+=2.6){g.moveTo(i,y);g.lineTo(i,y+h)}else for(i=y+2;i<y+h;i+=2.6){g.moveTo(x,i);g.lineTo(x+w,i)}g.stroke();
    for(i=0;i<40;i++){g.fillStyle=R()<.5?'rgba(0,0,0,.12)':'rgba(255,255,220,.08)';g.fillRect(x+R()*w,y+R()*h,1+R()*3,1+R()*3)}}
  for(var kr=-2;kr<22;kr++)for(var kc=-2;kc<22;kc++){var x=GX+kc*KW,y=GY+kr*KH,r=R();
    if(r<.22)plot(x,y,KW/2,KH),plot(x+KW/2,y,KW/2,KH);else if(r<.36)plot(x,y,KW,KH/2),plot(x,y+KH/2,KW,KH/2);else plot(x,y,KW,KH)}
  g.strokeStyle='rgba(196,182,140,.75)';g.lineWidth=1.6;g.beginPath();
  for(kc=-2;kc<=22;kc++){g.moveTo(GX+kc*KW,0);g.lineTo(GX+kc*KW,PH)}for(kr=-2;kr<=22;kr++){g.moveTo(0,GY+kr*KH);g.lineTo(PW,GY+kr*KH)}g.stroke();
  // murabba paths + tree lines
  g.strokeStyle='#c8b58c';g.lineWidth=4.5;g.beginPath();for(var m=0;m<=4;m++){g.moveTo(GX+m*300,0);g.lineTo(GX+m*300,PH);g.moveTo(0,GY+m*1000/3);g.lineTo(PW,GY+m*1000/3)}g.stroke();
  for(m=0;m<=4;m++)for(var t=0;t<PH;t+=9+R()*14){if(R()<.55){g.fillStyle='rgba(38,64,30,'+(.6+R()*.35)+')';g.beginPath();g.arc(GX+m*300+(R()<.5?-5:5),t,2.5+R()*4,0,TAU);g.fill()}}
  // canal (khal)
  var cy=GY+2*1000/3;g.strokeStyle='#b9ab84';g.lineWidth=12;g.beginPath();g.moveTo(0,cy);g.lineTo(PW,cy);g.stroke();g.strokeStyle='#557c84';g.lineWidth=6;g.stroke();
  // dera / farmhouse cluster + tubewell
  for(var i=0;i<26;i++){var hx=GX+930+R()*90,hy=GY+1110+R()*90;g.fillStyle=['#b9ad98','#a89d8c','#c9c1b2','#8f857a'][i%4];g.fillRect(hx,hy,8+R()*12,7+R()*10)}
  for(i=0;i<30;i++){g.fillStyle='rgba(34,58,27,.85)';g.beginPath();g.arc(GX+910+R()*140,GY+1090+R()*140,3+R()*5,0,TAU);g.fill()}
  g.fillStyle='#6d8a93';g.fillRect(GX+455,GY+300,9,9);
  // fine noise
  var id=g.getImageData(0,0,PW,PH),d=id.data;for(i=0;i<d.length;i+=4){var n=(R()-.5)*14;d[i]+=n;d[i+1]+=n;d[i+2]+=n}g.putImageData(id,0,0);
  // feather edges so it blends into the real Sentinel-2 imagery underneath
  g.globalCompositeOperation='destination-in';var f=150,gr=g.createLinearGradient(0,0,PW,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(f/PW,'#000');gr.addColorStop(1-f/PW,'#000');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,PW,PH);
  gr=g.createLinearGradient(0,0,0,PH);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(f/PH,'#000');gr.addColorStop(1-f/PH,'#000');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,PW,PH);g.globalCompositeOperation='source-over';
  var mg=procMap.getContext('2d');mg.filter='grayscale(1) brightness(1.75) contrast(.45) sepia(.25)';mg.drawImage(proc,0,0);mg.filter='none';
})();
function buildRealMap(){var g=realMap.getContext('2d');g.filter='grayscale(1) brightness(1.75) contrast(.45) sepia(.25)';g.drawImage(real,0,0);g.filter='none'}
if(real.complete)buildRealMap();else real.onload=buildRealMap;
var RS=5, RX=GX+600-512*RS, RY=GY+2000/3-512*RS;

/* ================= map renderer ================= */
var mc=$('map'), mx=mc.getContext('2d');
function w2s(v,p){var dx=(p.x-v.cx)*v.z,dy=(p.y-v.cy)*v.z,c=Math.cos(v.rot||0),s=Math.sin(v.rot||0);return {x:SCX+dx*c-dy*s,y:SCY+dx*s+dy*c}}
function drawMap(g,Wd,Ht,S,scale,cxo,cyo){
  var v=S.view; cxo=cxo||SCX; cyo=cyo||SCY;
  g.setTransform(scale,0,0,scale,0,0); g.fillStyle='#2a3424'; g.fillRect(0,0,Wd,Ht);
  if(S.mapA<=0) return;
  g.save(); g.globalAlpha=S.mapA;
  g.translate(cxo,cyo); g.rotate(v.rot||0); g.scale(v.z,v.z); g.translate(-v.cx,-v.cy);
  var mm=S.layer==='map';
  g.imageSmoothingQuality='high';
  if(real.complete&&real.naturalWidth) g.drawImage(mm?realMap:real,RX,RY,1024*RS,1024*RS);
  g.drawImage(mm?procMap:proc,0,0);
  // masaavi / KML grid
  var ga=Math.max(S.grid,S.kml);
  if(ga>0){ var lw=1/v.z;
    g.globalAlpha=S.mapA*ga;
    var x0=GX-2*300,x1=GX+9*300,y0=GY-2*1000/3,y1=GY+9*1000/3;
    if(v.z>.55){ g.strokeStyle=S.kml>0?'rgba(0,229,255,.55)':'rgba(255,255,255,.42)'; g.lineWidth=lw*1.1; g.beginPath();
      for(var x=x0;x<=x1+.1;x+=KW){g.moveTo(x,y0);g.lineTo(x,y1)} for(var y=y0;y<=y1+.1;y+=KH){g.moveTo(x0,y);g.lineTo(x1,y)} g.stroke() }
    g.strokeStyle=S.kml>0?'rgba(0,229,255,.95)':(mm?'rgba(30,60,45,.8)':'rgba(255,255,255,.85)'); g.lineWidth=lw*(S.kml>0?2:1.8); g.beginPath();
    for(x=x0;x<=x1+.1;x+=300){g.moveTo(x,y0);g.lineTo(x,y1)} for(y=y0;y<=y1+.1;y+=1000/3){g.moveTo(x0,y);g.lineTo(x1,y)} g.stroke();
    g.globalAlpha=S.mapA;
  }
  if(S.hiK){ var h=S.hiK; g.fillStyle='rgba(0,229,255,'+(.28*h.a)+')'; g.fillRect(h.x,h.y,KW,KH); g.strokeStyle='rgba(0,229,255,'+h.a+')'; g.lineWidth=3/v.z; g.strokeRect(h.x,h.y,KW,KH) }
  // polygons
  S.polys.forEach(function(pl){ if(pl.hide) return; var pts=pl.pts; if(pts.length<2&&!pl.closed) return;
    g.beginPath(); g.moveTo(pts[0].x,pts[0].y); for(var i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y);
    if(pl.closed){ g.closePath(); g.fillStyle=pl.fill; g.globalAlpha=S.mapA*pl.fa; g.fill(); g.globalAlpha=S.mapA }
    if(pl.sel){ g.strokeStyle='rgba(255,255,255,.95)'; g.lineWidth=7/v.z; g.stroke() }
    g.strokeStyle=pl.line; g.lineWidth=3/v.z; g.lineJoin='round'; g.stroke();
    if(pl.preview){ g.setLineDash([7/v.z,6/v.z]); g.beginPath(); g.moveTo(pts[pts.length-1].x,pts[pts.length-1].y); g.lineTo(pl.preview.x,pl.preview.y); g.strokeStyle=pl.line; g.lineWidth=2/v.z; g.stroke(); g.setLineDash([]) }
  });
  g.restore();
  g.setTransform(scale,0,0,scale,0,0);
  function W2S(p){var dx=(p.x-v.cx)*v.z,dy=(p.y-v.cy)*v.z,c=Math.cos(v.rot||0),s=Math.sin(v.rot||0);return {x:cxo+dx*c-dy*s,y:cyo+dx*s+dy*c}}
  // labels (screen space, upright, no clutter)
  var ga2=Math.max(S.grid,S.kml)*S.mapA;
  if(ga2>0){ g.textAlign='center'; g.textBaseline='middle';
    var kA=sm(1.05,1.45,v.z)*ga2, mA=(1-sm(.9,1.3,v.z))*ga2;
    for(var mr=-2;mr<9;mr++)for(var mcx=-2;mcx<9;mcx++){ var num=47+(mr-1)*11+(mcx-1);
      if(mA>0){ var c=W2S({x:GX+mcx*300+150,y:GY+mr*1000/3+500/3}); if(c.x>-40&&c.x<Wd+40&&c.y>-40&&c.y<Ht+40){ g.globalAlpha=mA; g.font='800 '+(v.z>.5?15:11)+'px Manrope,Arial'; g.lineWidth=3.5; g.strokeStyle='rgba(0,0,0,.65)'; g.strokeText(num,c.x,c.y); g.fillStyle='#fff'; g.fillText(num,c.x,c.y) } }
      if(kA>0) for(var k=0;k<25;k++){ var kc=k%5,kr=(k/5)|0, q=W2S({x:GX+(mcx*5+kc)*KW+KW/2,y:GY+(mr*5+kr)*KH+KH/2}); if(q.x<-30||q.x>Wd+30||q.y<-30||q.y>Ht+30) continue;
        g.globalAlpha=kA; g.font='800 12.5px "JetBrains Mono",monospace'; var t=num+'/'+(k+1); g.lineWidth=3.5; g.strokeStyle='rgba(0,0,0,.7)'; g.strokeText(t,q.x,q.y); g.fillStyle=S.kml>0?'#BFFBFF':'#fff'; g.fillText(t,q.x,q.y) } }
    g.globalAlpha=1 }
  // segment length labels
  S.polys.forEach(function(pl){ if(pl.hide||!pl.labels) return; var pts=pl.pts, n=pl.closed?pts.length:pts.length-1;
    for(var i=0;i<n;i++){ var a=W2S(pts[i]),b=W2S(pts[(i+1)%pts.length]), L=dist(pts[i],pts[(i+1)%pts.length])*FT, mxp=(a.x+b.x)/2, myp=(a.y+b.y)/2;
      var nx=-(b.y-a.y), ny=b.x-a.x, nl=Math.hypot(nx,ny)||1, off=L<40?18:0; mxp+=nx/nl*off; myp+=ny/nl*off;
      var t=L.toFixed(1)+' ft'; g.font='800 12px Manrope,Arial'; var w=g.measureText(t).width+14;
      g.globalAlpha=pl.la==null?1:pl.la; g.fillStyle='rgba(14,20,16,.86)'; rr(g,mxp-w/2,myp-10,w,20,10); g.fill(); g.fillStyle='#fff'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,mxp,myp+.5); g.globalAlpha=1 } });
  // selection handles
  S.polys.forEach(function(pl){ if(!pl.sel) return; pl.pts.forEach(function(p){ var s=W2S(p); g.fillStyle='#fff'; g.strokeStyle='#122019'; g.lineWidth=2; g.fillRect(s.x-6,s.y-6,12,12); g.strokeRect(s.x-6,s.y-6,12,12) }) });
  // snap ring
  if(S.snap){ var s=W2S(S.snap.p), pr=1+.15*Math.sin(S.snap.t*10); g.globalAlpha=S.snap.a; g.strokeStyle='#3BFF9E'; g.lineWidth=2.5; g.setLineDash([5,4]); g.beginPath(); g.arc(s.x,s.y,22*pr,0,TAU); g.stroke(); g.setLineDash([]);
    g.fillStyle='rgba(59,255,158,.18)'; g.beginPath(); g.arc(s.x,s.y,22*pr,0,TAU); g.fill(); g.font='800 11px Manrope,Arial'; g.fillStyle='#04140C'; var tw=48; g.fillStyle='#3BFF9E'; rr(g,s.x-tw/2,s.y-48,tw,18,9); g.fill(); g.fillStyle='#04140C'; g.textAlign='center'; g.fillText('SNAP',s.x,s.y-38.5); g.globalAlpha=1 }
  // stakeout guide
  if(S.stake){ var a=W2S(S.stake.from), b=W2S(S.stake.to); g.strokeStyle='#3BFF9E'; g.lineWidth=3; g.setLineDash([9,7]); g.lineDashOffset=-S.stake.t*40; g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke(); g.setLineDash([]);
    var rz=Math.max(.5/FT*v.z,7); g.strokeStyle=S.stake.ok?'#3BFF9E':'rgba(255,255,255,.9)'; g.lineWidth=2; g.beginPath(); g.arc(b.x,b.y,rz,0,TAU); g.stroke();
    if(S.stake.ok){ for(var q=0;q<3;q++){ var ph=((S.stake.t*1.2+q/3)%1); g.globalAlpha=1-ph; g.beginPath(); g.arc(b.x,b.y,rz+ph*60,0,TAU); g.stroke() } g.globalAlpha=1 } }
  // pins: thin white stem + solid round head (one marker per coordinate)
  S.pins.forEach(function(pn){ var s=W2S(pn), dy=pn.dy||0; g.globalAlpha=pn.a==null?1:pn.a;
    g.strokeStyle='rgba(0,0,0,.45)'; g.lineWidth=4; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x,s.y-24+dy); g.stroke();
    g.strokeStyle='#fff'; g.lineWidth=2; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x,s.y-24+dy); g.stroke();
    g.fillStyle='rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(s.x,s.y+1,4,1.8,0,0,TAU); g.fill();
    g.fillStyle=pn.c; g.strokeStyle='#fff'; g.lineWidth=2.2; g.beginPath(); g.arc(s.x,s.y-30+dy,7.5,0,TAU); g.fill(); g.stroke(); g.globalAlpha=1 });
  // blue dot + heading beam
  if(S.dot){ var d=S.dot, s=W2S(d), ar=d.acc/FT*v.z;
    g.fillStyle='rgba(66,133,244,.16)'; g.strokeStyle='rgba(66,133,244,.55)'; g.lineWidth=1.5; g.beginPath(); g.arc(s.x,s.y,Math.max(ar,10),0,TAU); g.fill(); g.stroke();
    g.save(); g.translate(s.x,s.y); g.rotate((v.rot||0)+d.hd*Math.PI/180);
    var bg=g.createRadialGradient(0,0,4,0,0,78); bg.addColorStop(0,'rgba(66,133,244,.55)'); bg.addColorStop(1,'rgba(66,133,244,0)');
    g.fillStyle=bg; g.beginPath(); g.moveTo(0,0); g.arc(0,0,78,-Math.PI/2-.42,-Math.PI/2+.42); g.closePath(); g.fill(); g.restore();
    g.fillStyle='#fff'; g.beginPath(); g.arc(s.x,s.y,11,0,TAU); g.fill(); g.fillStyle='#4285F4'; g.beginPath(); g.arc(s.x,s.y,8,0,TAU); g.fill() }
  // crosshair (precision: thin lines, red centre)
  if(S.cross>0){ g.globalAlpha=S.cross; g.strokeStyle='rgba(0,0,0,.5)'; g.lineWidth=3; xh(g,cxo,cyo); g.strokeStyle='#fff'; g.lineWidth=1.3; xh(g,cxo,cyo); g.fillStyle='#E53935'; g.beginPath(); g.arc(cxo,cyo,2.6,0,TAU); g.fill(); g.globalAlpha=1 }
}
function xh(g,x,y){g.beginPath();g.moveTo(x-30,y);g.lineTo(x-7,y);g.moveTo(x+7,y);g.lineTo(x+30,y);g.moveTo(x,y-30);g.lineTo(x,y-7);g.moveTo(x,y+7);g.lineTo(x,y+30);g.stroke()}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}

/* ================= UI chrome ================= */
var IC={menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',layers:'<path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/>',poly:'<path d="M12 3l8 6-3 10H7L4 9z"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.5M8.2 13.2l7.6 4.5"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6M9 13l3 3 3-3"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0"/>'};
function ic(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[n]+'</svg>'}
document.querySelector('.tbar').innerHTML=['menu','search','layers','poly','share','gear'].map(ic).join('');
document.querySelector('.bbar').innerHTML=['eye','list','folder','undo','redo','lock'].map(ic).join('');
var BX=function(i){return 14+392/6*(i+.5)}; // toolbar / bottom-bar icon centres
var SW=['#E53935','#FB8C00','#00E5FF','#3BFF9E','#FFD54F','#7C4DFF','#FFFFFF','#111111'];
$('sw').innerHTML=SW.map(function(c){return '<i style="background:'+c+'"></i>'}).join('');
var swEls=$('sw').children, SWX=function(i){return 10+18+9+i*47+19}; // swatch centre x in screen
$('wave').innerHTML=new Array(26).join('<i></i>'); var waveEls=$('wave').children;
var lo=document.querySelectorAll('.lopt i');
lo[0].style.backgroundImage='url('+REAL_SRC+')'; lo[1].style.background='linear-gradient(135deg,#efe9dc,#d9d2c1)'; lo[2].style.backgroundImage='url('+REAL_SRC+')';
var OV=[].slice.call(document.querySelectorAll('#ui .ov'));
var txtCache={};
function txt(id,v){if(txtCache[id]!==v){txtCache[id]=v;$(id).textContent=v}}
function html(id,v){if(txtCache[id]!==v){txtCache[id]=v;$(id).innerHTML=v}}
function cls(el,c,on){if(el.classList.contains(c)!==!!on)el.classList.toggle(c,!!on)}

/* ================= chapters ================= */
function V(view){return {cx:view[0],cy:view[1],z:view[2],rot:view[3]||0}}
function keys(lt,K){ if(lt<=K[0][0]) return V(K[0][1]); for(var i=0;i<K.length-1;i++){ if(lt<=K[i+1][0]){ var k=io((lt-K[i][0])/(K[i+1][0]-K[i][0])), a=K[i][1], b=K[i+1][1];
  return {cx:lerp(a[0],b[0],k),cy:lerp(a[1],b[1],k),z:Math.exp(lerp(Math.log(a[2]),Math.log(b[2]),k)),rot:lerp(a[3]||0,b[3]||0,k)} } } return V(K[K.length-1][1]) }
function kv(lt,K){ if(lt<=K[0][0]) return K[0][1]; for(var i=0;i<K.length-1;i++){ if(lt<=K[i+1][0]){ var k=io((lt-K[i][0])/(K[i+1][0]-K[i][0])); return [lerp(K[i][1][0],K[i+1][1][0],k),lerp(K[i][1][1],K[i+1][1][1],k)] } } return K[K.length-1][1] }
function C(el){ if(typeof el==='string') el=$(el); var x=0,y=0,e=el; while(e&&e.id!=='screen'){ x+=e.offsetLeft; y+=e.offsetTop; e=e.offsetParent } return {x:x+el.offsetWidth/2,y:y+el.offsetHeight/2} }
function sfx(S,lt,t0,kind,en,ur){ if(lt>=t0&&lt<t0+.3) S.sfx.push({k:kind+t0.toFixed(2),kind:kind,en:en,ur:ur}) }
function tapE(S,lt,t0,el,kind){ if(lt>t0-.45&&lt<t0+.7){ var c=C(el); S.taps.push({x:c.x,y:c.y,age:lt-t0}) } sfx(S,lt,t0,kind||'tap') }
function tap(S,lt,t0,x,y,kind){ if(lt>t0-.45&&lt<t0+.7) S.taps.push({x:x,y:y,age:lt-t0}); sfx(S,lt,t0,kind||'tap') }
function co(S,lt,a,b,x,y,en,ur){ var al=win(lt,a,b,.35); if(al>0) S.cos.push({x:x,y:y,en:en,ur:ur,a:al}) }
function pinsUpTo(lt,times,n){ var out=[]; for(var i=0;i<n;i++){ if(lt<times[i]) break; var age=lt-times[i], dy=-(1-sm(0,.28,age))*34+Math.sin(cl(age/.4,0,1)*Math.PI)*3*(age>.28?1:0); out.push(i) } return out }
function pinC(i,n,closed){ return i===0?'#16A34A':(i===n-1&&!closed?'#8B5CF6':'#F59E0B') }
var RED='#E53935', CY='#00E5FF', YEL='#FFD54F';
function finalPoly(o){ return {pts:P,closed:true,line:o&&o.line||CY,fill:o&&o.fill||YEL,fa:o&&o.fa!=null?o.fa:.45,labels:o&&o.labels!=null?o.labels:true} }
function finalPins(S){ for(var i=0;i<5;i++) S.pins.push({x:P[i].x,y:P[i].y,c:i===0?'#16A34A':'#F59E0B'}) }

var CH=[
{t:'Intro & 0.0° True North Map Lock',ur:'تعارف اور 0.0° ٹرو نارتھ لاک',d:13,steps:[
 [0,'Open Land Survo — the map opens straight onto your area.','لینڈ سروو کھولیں — نقشہ سیدھا آپ کے علاقے پر کھلتا ہے۔'],
 [2.2,'The map is locked to 0.0° True North, exactly like the record.','نقشہ 0.0° ٹرو نارتھ پر لاک ہے، بالکل ریکارڈ کی طرح۔'],
 [4.5,'Rotate freely with two fingers — the compass shows the angle.','دو انگلیوں سے نقشہ گھمائیں، کمپاس زاویہ دکھاتا ہے۔'],
 [6.6,'Tap the compass to snap back to True North instantly.','کمپاس دبائیں، نقشہ فوراً ٹرو نارتھ پر واپس۔'],
 [7.9,'Switch Satellite, Map or Hybrid in one tap.','ایک ٹیپ میں سیٹلائٹ، میپ یا ہائبرڈ۔'],
 [10.5,'Pan and zoom smoothly over Masaavi killa plots.','مساوی کے کلّوں پر آسانی سے زوم اور حرکت۔']],
 fn:function(lt,S){
  sfx(S,lt,.25,'chime'); sfx(S,lt,8.15,'sheet');
  S.V.splash=1-sm(2.0,2.6,lt); S.mapA=sm(1.8,2.5,lt); S.V.chrome=sm(2.2,2.8,lt); S.cross=sm(2.6,3.2,lt);
  var rot=lt<4.6?0:lt<6.4?io((lt-4.6)/1.8)*.44:lt<6.85?.44:lt<7.6?.44*(1-io((lt-6.85)/.75)):0;
  var v=keys(lt,[[2.0,[720,787,.1]],[4.4,[560,640,.95]],[10.6,[560,640,.95]],[12.9,[K12.x+40,K12.y+40,2.1]]]); v.rot=rot; S.view=v;
  if(lt>4.5&&lt<6.5){ var a=rot+(-.6), r=95, k=sm(4.5,4.8,lt)*(1-sm(6.2,6.5,lt)); S.fingers=[{x:SCX+Math.cos(a)*r,y:SCY+Math.sin(a)*r,a:k},{x:SCX-Math.cos(a)*r,y:SCY-Math.sin(a)*r,a:k}] }
  S.V.cbtn=rot>.003?1:sm(7.6,7.3,lt)*0; tap(S,lt,6.85,378,380);
  tap(S,lt,8.0,BX(2),69); S.V.tray=win(lt,8.15,10.5,.3); tapE(S,lt,8.9,'lo1'); tapE(S,lt,9.75,'lo0');
  S.layer=(lt>8.95&&lt<9.8)?'map':'sat'; S.traySel=lt>8.95&&lt<9.8?1:0;
  S.grid=sm(10.6,11.4,lt)*.85;
  co(S,lt,2.7,4.5,347,124,'Locked to 0.0° True North','0.0° ٹرو نارتھ پر لاک');
  co(S,lt,5.0,6.5,347,124,'Compass shows rotation','کمپاس گھماؤ دکھاتا ہے');
  co(S,lt,11.3,12.95,SCX,SCY,'Masaavi killa grid','مساوی کلّہ گرڈ');
 }},
{t:'High-Accuracy Blue Dot & Heading Beam',ur:'درست نیلا نقطہ اور سمت کی بیم',d:10,steps:[
 [0,'Fused GPS (GNSS + IMU) locks your real position.','فیوزڈ جی پی ایس آپ کی اصل پوزیشن لاک کرتا ہے۔'],
 [1.5,'Tap BOOST — readings are averaged and drift is filtered.','بوسٹ دبائیں، ڈرفٹ فلٹر ہو جاتا ہے۔'],
 [3.4,'The blue dot settles right on the field corner.','نیلا نقطہ کھیت کے کونے پر ٹھہر جاتا ہے۔'],
 [5.6,'The heading beam turns with your phone — you always know your direction.','ہیڈنگ بیم فون کے ساتھ گھومتی ہے۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.grid=.5; S.cross=.0;
  S.view=keys(lt,[[0,[P[0].x+10,P[0].y+16,2.4]],[5,[P[0].x+4,P[0].y+8,3.2]],[10,[P[0].x+4,P[0].y+8,3.4]]]);
  var k=sm(.3,4.8,lt), j=(1-k);
  var ox=lerp(26,0,k)+j*6*Math.sin(lt*7.3), oy=lerp(-18,0,k)+j*6*Math.cos(lt*5.1);
  var hd=lt<5?22:22+70*Math.sin((lt-5)*1.15);
  S.dot={x:P[0].x+ox/FT,y:P[0].y+oy/FT,acc:lerp(39.4,5.9,k),hd:hd};
  tap(S,lt,1.5,347,181); sfx(S,lt,4.8,'ok');
  S.T.gpsA='±'+(S.dot.acc*.3048).toFixed(1)+' m'; S.T.gpsS=lt>1.5?'BOOST · FUSED':'GNSS';
  S.mag=win(lt,3.5,5.3)?{p:S.dot,a:win(lt,3.5,5.3),z:2.6,y:620}:null;
  co(S,lt,1.7,3.4,347,181,'BOOST: drift filtered','بوسٹ: ڈرفٹ ختم');
  var ds=w2s(S.view,S.dot); co(S,lt,5.8,9.8,ds.x,ds.y-40,'Heading beam = phone direction','بیم = فون کی سمت');
 }},
{t:'Pins, Snap-to-Point & Raqba',ur:'پن، اسنیپ اور رقبہ',d:18,steps:[
 [0,'Centre the crosshair on a corner and tap + to drop a pin.','کراس ہیئر کونے پر رکھیں، + دبا کر پن لگائیں۔'],
 [2.8,'Every side shows its length the moment it is drawn.','ہر سائیڈ کی لمبائی فوراً نظر آتی ہے۔'],
 [5.8,'Short sides — even a few feet — always get a clear label.','چھوٹی سائیڈ بھی واضح لیبل کے ساتھ۔'],
 [8.3,'Turn on Snap to Point to join an existing corner exactly.','اسنیپ ٹو پوائنٹ آن کریں، پرانے کونے سے بالکل جوڑیں۔'],
 [10.6,'Snap closes on the first pin — one clean pin, no duplicates.','اسنیپ پہلے پن پر بند — کوئی ڈبل پن نہیں۔'],
 [11.4,'Raqba appears instantly: Kanal, Marla, Acres and Sq ft.','رقبہ فوراً: کنال، مرلہ، ایکڑ اور مربع فٹ۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.grid=.35; S.cross=1-sm(11,11.6,lt);
  var T=[1.0,2.8,4.6,6.1,7.8], z=3;
  var off={x:P[0].x+2.3,y:P[0].y+1.9};
  S.view=keys(lt,[[1.2,[P[0].x,P[0].y,z]],[2.6,[P[1].x,P[1].y,z]],[4.4,[P[2].x,P[2].y,z]],[5.9,[P[3].x,P[3].y,z]],[7.6,[P[4].x,P[4].y,z]],[8.6,[P[4].x,P[4].y,z]],[10.2,[off.x,off.y,z]],[10.7,[P[0].x,P[0].y,z]],[12.4,[PC.x,PC.y,2.15]]]);
  T.forEach(function(t){tap(S,lt,t,360,770,'pin')}); tap(S,lt,10.6,360,770,'snap'); sfx(S,lt,10.8,'chime'); tap(S,lt,8.3,378,440);
  var n=0; for(var i=0;i<5;i++) if(lt>=T[i]) n=i+1;
  var closed=lt>=10.6, pts=P.slice(0,n);
  if(n>=1){ var pl={pts:pts,closed:closed,line:RED,fill:RED,fa:.18*sm(10.6,11.1,lt),labels:true};
    if(!closed&&n>=1&&lt>T[0]) pl.preview={x:S.view.cx,y:S.view.cy}; S.polys.push(pl) }
  for(i=0;i<n;i++){ var age=lt-T[i]; S.pins.push({x:P[i].x,y:P[i].y,c:i===0?'#16A34A':(i===n-1&&!closed?'#8B5CF6':'#F59E0B'),dy:-(1-sm(0,.28,age))*34}) }
  S.snapOn=lt>=8.3; S.V.toast=win(lt,8.4,9.8); S.T.toast='Snap to Point · ON';
  if(lt>9.3&&lt<11) S.snap={p:P[0],a:win(lt,9.3,11,.25),t:lt};
  S.V.area=sm(.9,1.3,lt);
  if(!closed){ S.T.aL='Drawing · '+Math.max(0,n-1)+' sides'; S.T.aM=n>1?perimFt(pts,false).toFixed(1)+' ft':'Tap + to add'; S.T.aS='Perimeter (open)' }
  else { var A=areaFt(P); S.T.aL='Raqba · closed'; S.T.aM=fmtArea(A); S.T.aS=(A/43560).toFixed(3)+' Acre · '+n0(A)+' sq ft' }
  S.mag=win(lt,6.2,7.7)?{p:{x:(P[2].x+P[3].x)/2,y:(P[2].y+P[3].y)/2},a:win(lt,6.2,7.7),z:2.4,y:640}:(win(lt,11,13)?{p:P[0],a:win(lt,11,13),z:2.2,y:520}:null);
  co(S,lt,11.4,17.6,16,136,'Raqba: Kanal · Marla · Acre · Sq ft','رقبہ: کنال، مرلہ، ایکڑ');
  co(S,lt,13.6,17.6,SCX,SCY-120,'One pin per corner — no duplicates','ہر کونے پر ایک ہی پن');
 }},
{t:'One-Tap Selection & Instant Colours',ur:'ایک ٹیپ انتخاب اور فوری رنگ',d:10,steps:[
 [0,'Tap any polygon — its edge or inside — to select it.','کسی بھی پولیگن کو ایک ٹیپ سے منتخب کریں۔'],
 [1.3,'The colour bar opens instantly — no menus to dig through.','رنگوں کی بار فوراً کھل جاتی ہے۔'],
 [2.6,'Pick a line colour…','لائن کا رنگ چنیں…'],
 [4.2,'…then a fill colour and its transparency.','…پھر فل کا رنگ اور شفافیت۔'],
 [8.2,'Done — colours stay saved with the polygon.','ہو گیا — رنگ پولیگن کے ساتھ محفوظ۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.grid=.3; S.V.area=1;
  S.view=keys(lt,[[0,[PC.x,PC.y,2.15]],[1.2,[PC.x,PC.y+12,2.5]],[10,[PC.x,PC.y+14,2.6]]]);
  var ps=w2s(S.view,PC); tap(S,lt,1.0,ps.x+10,ps.y-10);
  var sel=lt>1.0&&lt<8.3; S.V.pal=win(lt,1.25,8.45,.3);
  tapE(S,lt,2.7,swEls[2]); tapE(S,lt,4.2,'tbF'); tapE(S,lt,5.0,swEls[4]); tapE(S,lt,8.2,'pdone','ok'); sfx(S,lt,1.25,'sheet');
  var lineC=lt<2.75?RED:CY, fillC=lt<5.05?RED:YEL, fa=lt<5.05?.18:lerp(.2,.45,sm(6.2,7.4,lt));
  S.polys.push({pts:P,closed:true,line:lineC,fill:fillC,fa:fa,labels:true,sel:sel}); finalPins(S);
  S.palTab=lt<4.2?0:1; S.palSw=lt<4.2?(lt<2.75?0:2):(lt<5.05?0:4); S.opac=lt<5.05?.18:lerp(.2,.45,sm(6.2,7.4,lt));
  if(lt>6.0&&lt<7.6){ var tc=C('trk'), tw=$('trk').offsetWidth; S.fingers=[{x:tc.x-tw/2+tw*S.opac/.6,y:tc.y,a:win(lt,6.0,7.6,.2)}] }
  S.T.aL='Polygon 1 · '+(sel?'selected':'saved'); var A=areaFt(P); S.T.aM=fmtArea(A); S.T.aS=(A/43560).toFixed(3)+' Acre · '+n0(A)+' sq ft';
  co(S,lt,1.4,2.6,SCX,700,'1-tap colour bar','ایک ٹیپ رنگ بار');
 }},
{t:'Import KML / KMZ / .MMP & Layers',ur:'کے ایم ایل امپورٹ اور لیئرز',d:13,steps:[
 [0,'Import KML, KMZ or .MMP files straight from your phone.','KML، KMZ یا MMP فائل سیدھی فون سے امپورٹ کریں۔'],
 [2.4,'A whole mouza — 3,025 killas — opens in under a second.','پورا موضع — 3,025 کلّے — ایک سیکنڈ میں۔'],
 [4.2,'Crisp vector lines; no label clutter when zoomed out.','صاف ویکٹر لائنیں، زوم آؤٹ پر کوئی ہجوم نہیں۔'],
 [6.3,'Zoom in and clean killa numbers appear: 47/1, 47/2…','زوم کریں، کلّہ نمبر صاف: 47/1، 47/2…'],
 [8.5,'Tap any killa to see its boundary and area.','کسی کلّے کو ٹیپ کریں، حد اور رقبہ دیکھیں۔'],
 [11,'Show, hide or reorder layers in one place.','لیئرز ایک جگہ سے دکھائیں یا چھپائیں۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.kml=sm(3.95,4.4,lt); S.grid=lt<4?.3:0;
  var k13=kCorner(1,1,2,2);
  S.view=keys(lt,[[0,[PC.x,PC.y,2.6]],[2.4,[PC.x,PC.y,2.6]],[4.3,[700,760,.3]],[5.2,[650,700,.36]],[7.8,[k13.x+KW/2-8,k13.y+KH/2+30,1.75]],[13,[k13.x+KW/2-8,k13.y+KH/2+30,1.8]]]);
  var hideMine=lt>12&&lt<12.6;
  S.polys.push(Object.assign(finalPoly({labels:lt<4.2}),{hide:hideMine})); if(!hideMine&&lt<4.2) finalPins(S);
  sfx(S,lt,.95,'sheet'); sfx(S,lt,3.9,'ok'); sfx(S,lt,8.7,'sheet'); sfx(S,lt,11.1,'sheet');
  tap(S,lt,.8,BX(2),860); S.V.imp=win(lt,.95,4.05,.3); tapE(S,lt,2.4,'fr0');
  S.impSel=lt>2.4; S.impP=sm(2.6,3.9,lt); S.T.impSt=lt<2.6?'Ready':lt<3.9?'Reading geometry… rendering vector layer':'✓ 3,025 polygons in 0.4 s';
  var ks=w2s(S.view,{x:k13.x+KW/2,y:k13.y+KH/2}); tap(S,lt,8.5,ks.x,ks.y);
  if(lt>8.5) S.hiK={x:k13.x,y:k13.y,a:sm(8.5,8.8,lt)};
  S.V.info=win(lt,8.7,10.9,.3);
  tap(S,lt,10.95,BX(1),860); S.V.lay=win(lt,11.1,13.2,.3); tapE(S,lt,12.0,'tgS'); S.tgOff=hideMine;
  co(S,lt,4.4,6.2,SCX,SCY,'3,025 killa polygons · vector','3,025 کلّے · ویکٹر');
  co(S,lt,6.5,8.4,ks.x,ks.y-60,'Clean labels: 47/1 … 47/25','صاف لیبل: 47/1 … 47/25');
 }},
{t:'Voice-Guided Stakeout (Burji Layout)',ur:'آواز کے ساتھ اسٹیک آؤٹ (برجی)',d:14,steps:[
 [0,'Tap a burji pin to open its details.','برجی پن پر ٹیپ کریں۔'],
 [2.0,'Start Stakeout — Land Survo guides you to the exact spot.','اسٹیک آؤٹ شروع کریں، ایپ درست جگہ تک لے جاتی ہے۔'],
 [3.0,'Live distance, bearing line and direction arrow.','لائیو فاصلہ، سمت کی لائن اور تیر۔',1],
 [5.4,'Calm voice prompts tell you which way to walk.','آواز بتاتی ہے کس طرف چلنا ہے۔',1],
 [11,'Target reached — place the burji right here.','ہدف پر پہنچ گئے — برجی یہیں لگائیں۔',1]],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.grid=.3; var tg=P[1];
  var o=kv(lt,[[2.6,[-27.6,27.6]],[3.0,[-27.6,27.6]],[5.4,[-10.6,10.6]],[7.6,[-5.7,5.7]],[9.2,[-3,.2]],[11,[0,0]]]);
  var dot={x:tg.x+o[0]/FT,y:tg.y+o[1]/FT}, d=Math.hypot(o[0],o[1]);
  var mid={x:(dot.x+tg.x)/2,y:(dot.y+tg.y)/2};
  S.view=lt<2.6?keys(lt,[[0,[tg.x-4,tg.y+18,2.4]],[2.6,[tg.x-6,tg.y+14,2.6]]]):{cx:mid.x,cy:mid.y+lerp(14,5,sm(3,11,lt)),z:lerp(2.6,6,sm(5,11.3,lt)),rot:0};
  S.polys.push(finalPoly({fa:.3,labels:false})); for(var i=0;i<5;i++) S.pins.push({x:P[i].x,y:P[i].y,c:i===1?'#1E88E5':(i===0?'#16A34A':'#F59E0B')});
  var ts=w2s(S.view,tg); tap(S,lt,.8,ts.x,ts.y-30); S.V.pinpop=win(lt,1.0,2.25,.25); tapE(S,lt,2.0,'ppgo');
  if(lt>=2.4){ S.dot={x:dot.x,y:dot.y,acc:3.2,hd:Math.atan2(tg.x-dot.x,-(tg.y-dot.y))*180/Math.PI}; S.stake={from:dot,to:tg,t:lt,ok:lt>=11}; }
  S.V.stake=sm(2.4,2.8,lt); S.T.stD=(lt>=11?0.4:d).toFixed(1); S.stOk=lt>=11;
  var brg=(Math.atan2(-o[0],o[1])*180/Math.PI+360)%360; brg=(Math.atan2(tg.x-dot.x,-(tg.y-dot.y))*180/Math.PI+360)%360;
  var dirs=['N','NE','E','SE','S','SW','W','NW']; S.T.stDir=lt>=11?'on target ✓':'to target · '+dirs[Math.round(brg/45)%8];
  S.T.stB='Bearing '+brg.toFixed(1)+'° · Pin 2 · Burji'; S.stRot=brg;
  var VP=[[3.0,'Walk 39 feet North-East','39 فٹ شمال مشرق کی طرف چلیں'],[5.4,'15 feet North-East','15 فٹ شمال مشرق'],[7.6,'8 feet North-East','8 فٹ شمال مشرق'],[9.2,'3 feet East','3 فٹ مشرق'],[11,'Target reached','ہدف پر پہنچ گئے']];
  VP.forEach(function(p){ sfx(S,lt,p[0],p[0]===11?'chime':'beep'); sfx(S,lt,p[0]+.35,'say',p[1].replace('Walk 39','Walk thirty-nine'),p[2]) });
  var cur=null; VP.forEach(function(p){ if(lt>=p[0]) cur=p }); S.voice=0;
  if(cur){ S.V.vb=win(lt,cur[0],cur[0]+1.9,.25)+(cur[0]===11?sm(11,11.3,lt):0); S.T.vbE='“'+cur[1]+'”'; S.T.vbU=cur[2]; S.voice=win(lt,cur[0],cur[0]+1.4,.15) }
  co(S,lt,3.2,5.2,ts.x,ts.y,'Bearing guide line','سمت کی رہنما لائن');
  S.mag=win(lt,11.2,13.8)?{p:tg,a:win(lt,11.2,13.8),z:2.4,y:520}:null;
 }},
{t:'Exports: KML · KMZ · .MMP · PDF Report',ur:'ایکسپورٹ: KML · KMZ · MMP · پی ڈی ایف',d:14,steps:[
 [0,'Open Export from the toolbar.','ٹول بار سے ایکسپورٹ کھولیں۔'],
 [1.8,'Unified KML / KMZ / .MMP — every layer in one clean file.','ایک فائل میں تمام لیئرز — KML / KMZ / MMP۔'],
 [3.4,'Or generate a full PDF survey report.','یا مکمل پی ڈی ایف سروے رپورٹ بنائیں۔'],
 [6.0,'Saved straight to Documents › Land Survo.','سیدھا ڈاکیومنٹس › لینڈ سروو میں محفوظ۔'],
 [7.4,'Map snapshot, Kanal-Marla area, corner coordinates and distances.','نقشہ، کنال مرلہ رقبہ، کونوں کے کوآرڈینیٹس اور فاصلے۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.grid=.3; S.V.area=1;
  S.view={cx:PC.x,cy:PC.y+10,z:2.3,rot:0}; S.polys.push(finalPoly()); finalPins(S);
  var A=areaFt(P); S.T.aL='Polygon 1 · Killa 47/12'; S.T.aM=fmtArea(A); S.T.aS=(A/43560).toFixed(3)+' Acre · '+n0(A)+' sq ft';
  sfx(S,lt,.95,'sheet'); for(var ci2=0;ci2<18;ci2++) sfx(S,lt,3.9+ci2*1.4/18,'type'); sfx(S,lt,6.0,'ok'); sfx(S,lt,7.2,'whoosh');
  tap(S,lt,.8,BX(4),69); S.V.exp=win(lt,.95,3.7,.3); tapE(S,lt,2.0,'eo0'); tapE(S,lt,2.6,'eo1'); tapE(S,lt,3.4,'eo3');
  S.expSel=[lt>2.0,lt>2.6,false,lt>3.4];
  S.V.dlg=win(lt,3.7,5.95,.25); var nm='Killa_47_12_Survey'; S.T.fname=nm.slice(0,Math.round(cl((lt-3.9)/1.4,0,1)*nm.length))+(lt>5.3?'.pdf':'');
  tapE(S,lt,5.8,'dsave'); S.V.toast2=win(lt,6.0,7.6,.25);
  S.pdf=sm(7.2,7.9,lt); S.pdfHi=lt<8.6?-1:lt<10?0:lt<11.4?1:lt<12.7?2:3;
 }},
{t:'Offline License Activation & Download',ur:'آف لائن ایکٹیویشن اور ڈاؤن لوڈ',d:12,steps:[
 [0,'Activate once with your personal key — no internet needed.','ایک بار اپنی کی سے ایکٹیویٹ کریں، انٹرنیٹ ضروری نہیں۔'],
 [4.7,'Locked to your device, valid offline.','آپ کے فون سے منسلک، آف لائن کارآمد۔'],
 [6.5,'Download Land Survo for Android. iOS coming soon.','اینڈرائیڈ کے لیے ڈاؤن لوڈ کریں۔ آئی او ایس جلد۔']],
 fn:function(lt,S){
  S.mapA=1; S.V.chrome=1; S.view={cx:PC.x,cy:PC.y,z:2.3,rot:0}; S.polys.push(finalPoly()); finalPins(S);
  for(var ci3=0;ci3<18;ci3++) sfx(S,lt,1.1+ci3*2/18,'type'); sfx(S,lt,4.7,'chime'); sfx(S,lt,6.35,'big');
  S.V.lic=sm(.2,.6,lt); var key='LS4-7F3K-9Q2M-H8XD'; S.T.lkey=key.slice(0,Math.round(cl((lt-1.1)/2,0,1)*key.length));
  tapE(S,lt,3.6,'lact'); S.lic=lt<3.65?0:lt<4.65?1:2; S.V.licOk=sm(4.7,5.0,lt);
  S.outro=sm(6.3,7.1,lt);
 }}
];
// tap y for Activate button computed from layout
var START=[],TOT=0; CH.forEach(function(c){START.push(TOT);TOT+=c.d});

/* ================= stage refs ================= */
var stage=$('stage'), frame=$('frame'), ovl=$('ovl'), cosEl=$('cos'), mag=$('mag'), mgx=mag.getContext('2d');
var SX=1296, SY=86;
function fitStage(){ var w=frame.clientWidth; stage.style.transform='scale('+(w/1920)+')' }
addEventListener('resize',fitStage); fitStage();

/* ================= frame render ================= */
var lastCh=-1, lastStep=-1, pdfDrawn=false;
function locate(T){ T=cl(T,0,TOT-.0001); for(var i=CH.length-1;i>=0;i--) if(T>=START[i]) return {i:i,lt:T-START[i]}; return {i:0,lt:0} }
function render(T){
  var L=locate(T), c=CH[L.i], lt=L.lt;
  var S={view:{cx:PC.x,cy:PC.y,z:2,rot:0},mapA:1,layer:'sat',grid:0,kml:0,polys:[],pins:[],dot:null,cross:0,snap:null,stake:null,hiK:null,V:{},T:{},taps:[],fingers:[],cos:[],mag:null,pdf:0,outro:0,sfx:[]};
  c.fn(lt,S); audioFrame(S,L.i,lt);
  drawMap(mx,420,908,S,2);
  applyUI(S,lt);
  drawOverlay(S,lt);
  leftPanel(L.i,lt,S);
  // PDF report sheet
  var pdf=$('pdf'); pdf.style.opacity=S.pdf; pdf.style.visibility=S.pdf>0?'visible':'hidden'; pdf.style.transform='translateX('+((1-S.pdf)*260)+'px) rotate('+((1-S.pdf)*4)+'deg) scale('+(.92+.08*S.pdf)+')';
  if(S.pdf>0&&!pdfDrawn){ buildPdf(); pdfDrawn=true }
  [].forEach.call(document.querySelectorAll('#pdf .sec'),function(e){ cls(e,'hi',+e.dataset.s===S.pdfHi) });
  $('left').style.opacity=1-S.pdf;
  var o=$('outro'); o.style.opacity=S.outro; o.style.visibility=S.outro>0?'visible':'hidden'; o.style.transform='scale('+(1.04-.04*S.outro)+')';
  // chapter wipe
  $('wipe').style.width=(lt<1.2?io(cl(lt/1.0,0,1))*100:0)+'%'; $('wipe').style.opacity=1-sm(.9,1.2,lt);
  updCtl(T,L.i);
}
function applyUI(S,lt){
  var V=S.V;
  OV.forEach(function(el){ var k=el.id||el.dataset.g, a=V[el.id]!=null?V[el.id]:(el.dataset.g?V[el.dataset.g]:0)||0;
    if(el.id==='cbtn'||el.id==='area') a=V[el.id]||0;
    if(el._a===a) return; el._a=a; el.style.opacity=a; el.style.visibility=a>.002?'visible':'hidden';
    var sheet=el.classList.contains('sheet'); el.style.transform=(el.id==='toast'?'translateX(-50%) ':'')+'translateY('+((1-a)*(sheet?40:10))+'px)' });
  var deg=((S.view.rot||0)*180/Math.PI); txt('cmpD',Math.abs(deg).toFixed(1)+'°'); txt('cmpS',Math.abs(deg)<.05?'TRUE NORTH · LOCK':'ROTATED · TAP');
  $('cmpN').style.transform='rotate('+deg+'deg)'; $('cbN').setAttribute('transform','rotate('+deg+' 12 12)');
  if(S.T.gpsA) txt('gpsA',S.T.gpsA); else txt('gpsA','±1.8 m'); txt('gpsS',S.T.gpsS||'BOOST · FUSED');
  ['aL','aM','aS','toast','impSt','stD','stDir','stB','vbE','vbU','fname','lkey'].forEach(function(k){ if(S.T[k]!=null) txt(k,S.T[k]) });
  html('toast2','✓ Saved: <i>Documents/LandSurvo/Killa_47_12_Survey.pdf</i>');
  cls($('snapB'),'on',S.snapOn||lt<0);
  for(var i=0;i<3;i++) cls($('lo'+i),'sel',(S.traySel||0)===i);
  cls($('tbL'),'on',(S.palTab||0)===0); cls($('tbF'),'on',S.palTab===1);
  for(i=0;i<swEls.length;i++) cls(swEls[i],'on',(S.palSw||0)===i);
  var op=S.opac!=null?S.opac:.18; $('kn').style.left=(op*100/0.6)+'%'; txt('opv',Math.round(op*100)+'%');
  $('impP').style.width=((S.impP||0)*100)+'%'; cls($('fr0'),'sel',S.impSel);
  cls($('tgS'),'off',S.tgOff);
  cls($('stake'),'ok',S.stOk); $('stArr').style.transform='rotate('+(S.stRot||0)+'deg)';
  for(i=0;i<waveEls.length;i++){ var h=6+(S.voice||0)*(10+24*Math.abs(Math.sin(lt*9+i*.7)*Math.sin(lt*3.1+i*1.3))); waveEls[i].style.height=h+'px' }
  for(i=0;i<4;i++) cls($('eo'+i),'sel',S.expSel&&S.expSel[i]);
  var act=$('lact'); var st=S.lic||0; if(act._st!==st){ act._st=st; act.innerHTML=st===0?'Activate':st===1?'<span class="spin"></span>Verifying offline…':'✓ Activated' }
  // spotlight dim (on the screen) follows the magnifier target
  var sp=$('spot'); if(S.mag){ var p=w2s(S.view,S.mag.p); sp.style.opacity=S.mag.a*.9; sp.style.visibility='visible'; sp.style.background='radial-gradient(circle at '+p.x+'px '+p.y+'px,transparent 46px,rgba(0,0,0,.5) 92px)' } else { sp.style.opacity=0; sp.style.visibility='hidden' }
}
var LIC_ACT_Y=0;
function drawOverlay(S,lt){
  var s='';
  // finger taps: approach + ripple
  S.taps.forEach(function(t){ var x=t.x+SX, y=t.y+SY;
    if(t.age<0){ var k=1+t.age/.45; s+='<circle cx="'+x+'" cy="'+y+'" r="'+(26-8*k)+'" fill="rgba(255,255,255,'+(.25*k)+')" stroke="rgba(255,255,255,'+(.8*k)+')" stroke-width="2"/>' }
    else { var r=14+t.age*80, a=1-t.age/.7; s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="rgba(59,255,158,'+a+')" stroke-width="3"/>'+(t.age<.25?'<circle cx="'+x+'" cy="'+y+'" r="18" fill="rgba(255,255,255,'+(.55*(1-t.age/.25))+')"/>':'') } });
  S.fingers.forEach(function(f){ s+='<circle cx="'+(f.x+SX)+'" cy="'+(f.y+SY)+'" r="20" fill="rgba(255,255,255,'+(.32*f.a)+')" stroke="rgba(255,255,255,'+(.85*f.a)+')" stroke-width="2.5"/>' });
  // callouts: label left of the phone, arrow to target
  var html2='';
  S.cos.forEach(function(c,i){ var tx=c.x+SX, ty=c.y+SY, by=cl(ty,140,960), bx=1200;
    s+='<path d="M'+(bx+8)+' '+by+' C '+(bx+60)+' '+by+', '+(tx-50)+' '+ty+', '+tx+' '+ty+'" fill="none" stroke="rgba(59,255,158,'+c.a+')" stroke-width="2.5" stroke-dasharray="6 5"/>'+
       '<circle cx="'+tx+'" cy="'+ty+'" r="'+(7+3*Math.sin(lt*8))+'" fill="rgba(59,255,158,'+(.35*c.a)+')" stroke="rgba(59,255,158,'+c.a+')" stroke-width="2"/><circle cx="'+(bx+8)+'" cy="'+by+'" r="4" fill="rgba(59,255,158,'+c.a+')"/>';
    html2+='<div class="co" style="right:'+(1920-bx)+'px;top:'+by+'px;opacity:'+c.a+';transform:translateY(-50%) translateX('+((1-c.a)*-20)+'px)">'+c.en+(c.ur?'<small>'+c.ur+'</small>':'')+'</div>' });
  ovl.innerHTML=s; if(cosEl._h!==html2){ cosEl._h=html2; cosEl.innerHTML=html2 }
  // magnifier
  if(S.mag){ var p=w2s(S.view,S.mag.p), z=S.mag.z, R=140; mag.style.display='block'; mag.style.opacity=S.mag.a; mag.style.left=(1080-R)+'px'; mag.style.top=(S.mag.y-R)+'px';
    mgx.setTransform(1,0,0,1,0,0); mgx.clearRect(0,0,560,560); mgx.save(); mgx.beginPath(); mgx.arc(280,280,280,0,TAU); mgx.clip();
    var sw=280/z; mgx.drawImage(mc,(p.x-sw/2)*2,(p.y-sw/2)*2,sw*2,sw*2,0,0,560,560); mgx.restore();
    s='<line x1="'+(1080+R*.7)+'" y1="'+(S.mag.y+R*.7)+'" x2="'+(p.x+SX)+'" y2="'+(p.y+SY)+'" stroke="rgba(59,255,158,'+(.7*S.mag.a)+')" stroke-width="2"/><circle cx="'+(p.x+SX)+'" cy="'+(p.y+SY)+'" r="'+(140/z)+'" fill="none" stroke="rgba(59,255,158,'+S.mag.a+')" stroke-width="2"/>';
    ovl.insertAdjacentHTML('beforeend',s) } else mag.style.display='none';
}
function leftPanel(i,lt,S){
  var c=CH[i];
  if(lastCh!==i){ lastCh=i; lastStep=-1;
    txt('chTitle',c.t); txt('chUr',c.ur); html('chNo','<i></i>CHAPTER '+('0'+(i+1)).slice(-2)+' / '+('0'+CH.length).slice(-2));
    $('steps').innerHTML=c.steps.map(function(s,j){return '<li><b>'+(j+1)+'</b><span>'+s[1]+'</span></li>'}).join('');
    var L=$('left'); L.animate&&L.animate([{opacity:0,transform:'translateX(-30px)'},{opacity:1,transform:'none'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'}) }
  var si=0; c.steps.forEach(function(s,j){ if(lt>=s[0]) si=j });
  if(si!==lastStep){ lastStep=si; var li=$('steps').children; for(var j=0;j<li.length;j++){ cls(li[j],'on',j===si); cls(li[j],'done',j<si) }
    txt('subEn',c.steps[si][1]); txt('subUr',c.steps[si][2]); var sb=$('sub'); sb.classList.remove('flash'); void sb.offsetWidth; sb.classList.add('flash') }
}
function buildPdf(){
  var cv=$('pdfMap'), g=cv.getContext('2d');
  var S={view:{cx:PC.x,cy:PC.y,z:2.6,rot:0},mapA:1,layer:'sat',grid:.35,kml:0,polys:[finalPoly()],pins:[],dot:null,cross:0,snap:null,stake:null,hiK:null};
  finalPins(S); drawMap(g,700,270,S,2,350,135);
  g.setTransform(2,0,0,2,0,0); g.fillStyle='rgba(255,255,255,.92)'; rr(g,12,12,150,30,8); g.fill(); g.fillStyle='#122019'; g.font='800 12px Manrope,Arial'; g.textAlign='left'; g.fillText('N ↑  0.0° True North',22,31);
  var A=areaFt(P), a=km(A);
  $('pdfArea').innerHTML='<td>'+a.k+'</td><td>'+a.m.toFixed(2)+'</td><td>'+(A/43560).toFixed(3)+'</td><td>'+n0(A)+'</td><td>'+perimFt(P,true).toFixed(1)+' ft</td>';
  $('pdfCorners').innerHTML='<tr><th>Pin</th><th>Latitude</th><th>Longitude</th></tr>'+P.map(function(p,i){var q=ll(p);return '<tr><td>P'+(i+1)+'</td><td>'+q.la.toFixed(6)+'°</td><td>'+q.lo.toFixed(6)+'°</td></tr>'}).join('');
  var rows=P.map(function(p,i){var q=P[(i+1)%5];return '<tr><td>P'+(i+1)+' → P'+((i+1)%5+1)+'</td><td>'+(dist(p,q)*FT).toFixed(1)+' ft</td></tr>'}).join('');
  var k13c={x:kCorner(1,1,2,2).x+KW/2,y:kCorner(1,1,2,2).y+KH/2};
  rows+='<tr><td>Centroid → Killa 47/13</td><td>'+(dist(PC,k13c)*FT).toFixed(1)+' ft</td></tr><tr><td>P2 → Burji (staked)</td><td>0.4 ft</td></tr>';
  $('pdfSides').innerHTML='<tr><th>Segment</th><th>Length</th></tr>'+rows;
}

/* ================= audio: music + sfx (Web Audio, generated live) + narration (browser voices) ================= */
var AC=null, master, musicG, sfxG, revIn, soundOn=true, musicOn=true, voiceMode='en', FIRED={}, mTimer=0, nextBar=0, barIx=0;
function ensureAudio(){
  if(AC){ if(AC.state==='suspended') AC.resume(); return }
  var A=window.AudioContext||window.webkitAudioContext; if(!A) return; AC=new A();
  var comp=AC.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=3; comp.connect(AC.destination);
  master=AC.createGain(); master.gain.value=soundOn?1:0; master.connect(comp);
  musicG=AC.createGain(); musicG.gain.value=0; musicG.connect(master);
  sfxG=AC.createGain(); sfxG.gain.value=.55; sfxG.connect(master);
  // small generated reverb for pads and chimes
  var len=AC.sampleRate*2.2, ir=AC.createBuffer(2,len,AC.sampleRate);
  for(var c=0;c<2;c++){ var d=ir.getChannelData(c); for(var i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2) }
  var conv=AC.createConvolver(); conv.buffer=ir; var wet=AC.createGain(); wet.gain.value=.35; revIn=AC.createGain(); revIn.connect(conv); conv.connect(wet); wet.connect(master);
}
function hz(n){ return 440*Math.pow(2,(n-69)/12) }
function env(g,t,a,peak,dec,sus,rel,end){ g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.setTargetAtTime(sus,t+a,dec); g.gain.setTargetAtTime(0,end,rel) }
function osc(type,f,t,dur,vol,dest,glide){ var o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(glide) o.frequency.exponentialRampToValueAtTime(glide,t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.005); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g); g.connect(dest||sfxG); o.start(t); o.stop(t+dur+.05); return g }
function noise(t,dur,vol,fType,f0,f1,dest){ var b=AC.createBuffer(1,AC.sampleRate*dur,AC.sampleRate), d=b.getChannelData(0); for(var i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  var s=AC.createBufferSource(); s.buffer=b; var fl=AC.createBiquadFilter(); fl.type=fType; fl.frequency.setValueAtTime(f0,t); if(f1) fl.frequency.exponentialRampToValueAtTime(f1,t+dur); fl.Q.value=1.2;
  var g=AC.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+dur*.25); g.gain.exponentialRampToValueAtTime(.0001,t+dur); s.connect(fl); fl.connect(g); g.connect(dest||sfxG); s.start(t); s.stop(t+dur) }
var SFX={
  tap:function(t){ osc('sine',1400,t,.06,.35,null,700); noise(t,.03,.12,'highpass',3000) },
  pin:function(t){ osc('triangle',980,t,.22,.45,null,240); osc('sine',120,t+.04,.12,.35) },
  snap:function(t){ osc('sine',660,t,.12,.35); osc('sine',990,t+.07,.18,.35); var g=osc('sine',1320,t+.14,.4,.18); g.connect(revIn) },
  chime:function(t){ [72,76,79,84].forEach(function(n,i){ var g=osc('sine',hz(n),t+i*.08,1.1,.22); g.connect(revIn); osc('sine',hz(n+12),t+i*.08,.5,.05) }) },
  ok:function(t){ var g=osc('sine',hz(79),t,.5,.25); g.connect(revIn); var h=osc('sine',hz(84),t+.09,.7,.25); h.connect(revIn) },
  beep:function(t){ osc('sine',880,t,.13,.32); osc('sine',880,t+.18,.13,.32) },
  type:function(t){ noise(t,.025,.16,'bandpass',2600+Math.random()*900) },
  whoosh:function(t){ noise(t,.55,.22,'bandpass',300,3200) },
  sheet:function(t){ noise(t,.28,.12,'lowpass',500,2600) },
  big:function(t){ [57,64,69,72,76,81].forEach(function(n,i){ var g=osc('sine',hz(n),t+i*.06,2.2,.16); g.connect(revIn) }); noise(t,1.2,.12,'lowpass',8000,400) }
};
function playSfx(kind){ if(!AC||!soundOn) return; var f=SFX[kind]; if(f) f(AC.currentTime+.01) }
// ambient tech score: A-minor pad, soft bass pulse, delayed arpeggio, hats — 96 bpm
var PROG=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]], BAR=60/96*4;
function schedBar(t,ix){
  var ch=PROG[ix%4], beat=BAR/4;
  ch.forEach(function(n){ [-6,6].forEach(function(dt){ var o=AC.createOscillator(), f=AC.createBiquadFilter(), g=AC.createGain(); o.type='sawtooth'; o.frequency.value=hz(n); o.detune.value=dt;
    f.type='lowpass'; f.frequency.setValueAtTime(500,t); f.frequency.linearRampToValueAtTime(1100,t+BAR*.6); f.Q.value=.7; o.connect(f); f.connect(g); g.connect(musicG); g.connect(revIn);
    env(g,t,.9,.035,.8,.028,.5,t+BAR-.2); o.start(t); o.stop(t+BAR+1.6) }) });
  for(var b=0;b<8;b++){ var tb=t+b*beat/2;
    var o=AC.createOscillator(), g=AC.createGain(); o.type='sine'; o.frequency.value=hz(ch[0]-12); g.gain.setValueAtTime(0,tb); g.gain.linearRampToValueAtTime(b%2?.07:.13,tb+.01); g.gain.exponentialRampToValueAtTime(.0001,tb+beat*.45); o.connect(g); g.connect(musicG); o.start(tb); o.stop(tb+beat*.5);
    var an=ch[[0,2,1,3,2,1,3,2][b]]+12+(b>3?12:0), a=AC.createOscillator(), ag=AC.createGain(); a.type='triangle'; a.frequency.value=hz(an);
    ag.gain.setValueAtTime(0,tb); ag.gain.linearRampToValueAtTime(.045,tb+.008); ag.gain.exponentialRampToValueAtTime(.0001,tb+.32); a.connect(ag); ag.connect(musicG); ag.connect(revIn); a.start(tb); a.stop(tb+.35);
    if(b%2) noise(tb,.05,.03,'highpass',7000,null,musicG) }
}
function musicTick(){ if(!AC) return; var now=AC.currentTime; if(nextBar<now) nextBar=now+.05; while(nextBar<now+.6){ schedBar(nextBar,barIx++); nextBar+=BAR } }
function musicState(on){ if(!AC) return; var t=AC.currentTime, v=(on&&musicOn&&soundOn)?(speaking?.1:.26):0;
  musicG.gain.cancelScheduledValues(t); musicG.gain.setTargetAtTime(v,t,on?.4:.15);
  if(on&&musicOn){ if(!mTimer){ musicTick(); mTimer=setInterval(musicTick,200) } } else if(mTimer&&!on){ clearInterval(mTimer); mTimer=0 } }
// narration with the best voice this browser offers
var speaking=false, VOICES=[], vEN=null, vUR=null;
function pickVoices(){ if(!window.speechSynthesis) return; VOICES=speechSynthesis.getVoices();
  var pref=['Microsoft Aria Online','Microsoft Jenny Online','Google UK English Female','Microsoft Sonia','Google US English','Samantha','Microsoft Zira','Microsoft Aria','Daniel'];
  vEN=null; for(var i=0;i<pref.length&&!vEN;i++) vEN=VOICES.filter(function(v){return v.name.indexOf(pref[i])===0})[0]||null;
  if(!vEN) vEN=VOICES.filter(function(v){return /^en(-|_)/i.test(v.lang)})[0]||null;
  vUR=VOICES.filter(function(v){return /^ur/i.test(v.lang)})[0]||null; updVoiceBtn() }
if(window.speechSynthesis){ pickVoices(); speechSynthesis.onvoiceschanged=pickVoices }
function clean(t){ return t.replace(/0\.0°/g,'zero point zero degrees').replace(/(\d+)\/(\d+)/g,'$1 slash $2').replace(/\.MMP/g,'M M P').replace(/Sq ft/g,'square feet').replace(/ ft\b/g,' feet')
  .replace(/KML/g,'K M L').replace(/KMZ/g,'K M Z').replace(/PDF/g,'P D F').replace(/GNSS/g,'G N S S').replace(/IMU/g,'I M U').replace(/GPS/g,'G P S').replace(/—|·|›/g,',').replace(/…/g,'.') }
function say(en,ur,app){ if(!window.speechSynthesis||!soundOn||voiceMode==='off') return;
  var useUr=voiceMode==='ur'&&vUR&&ur, u=new SpeechSynthesisUtterance(useUr?ur:clean(en)); u.voice=useUr?vUR:vEN; u.lang=useUr?vUR.lang:(vEN?vEN.lang:'en-US');
  u.rate=cl((app?1.05:1.0)*Math.sqrt(speed),.7,1.5); u.pitch=app?1.15:1; u.volume=1;
  u.onstart=function(){ speaking=true; musicState(playing) }; u.onend=u.onerror=function(){ speaking=speechSynthesis.speaking; musicState(playing) };
  if(speechSynthesis.pending||app) speechSynthesis.cancel(); speechSynthesis.speak(u) }
function hush(){ if(window.speechSynthesis) speechSynthesis.cancel(); speaking=false }
var lastSay='', lastAudCh=-1;
function audioFrame(S,ci,lt){
  var c=CH[ci], si=0; c.steps.forEach(function(s,j){ if(lt>=s[0]) si=j });
  var key=ci+':'+si;
  if(!playing){ lastSay=key; lastAudCh=ci; return }
  if(ci!==lastAudCh){ lastAudCh=ci; if(lt<.5) playSfx('whoosh') }
  if(key!==lastSay){ lastSay=key; var st=c.steps[si]; if(!st[3]) say(st[1],st[2]) }
  S.sfx.forEach(function(e){ var k=ci+':'+e.k; if(!FIRED[k]){ FIRED[k]=1; if(e.kind==='say') say(e.en,e.ur,true); else playSfx(e.kind) } });
}

/* ================= player ================= */
var T=0, playing=false, speed=1, lastNow=0;
var bar=$('bar'), segs=[];
CH.forEach(function(c,i){ var s=document.createElement('div'); s.className='seg'; s.style.width='calc('+(c.d/TOT*100)+'% - 3px)'; s.innerHTML='<i></i>'; bar.appendChild(s); segs.push(s) });
function fmt(t){t=Math.max(0,t);return Math.floor(t/60)+':'+('0'+Math.floor(t%60)).slice(-2)}
var lastCtl=-1;
function updCtl(T,ci){ segs.forEach(function(s,i){ var p=cl((T-START[i])/CH[i].d,0,1); s.firstChild.style.width=(p*100)+'%'; cls(s,'cur',i===ci) });
  txt('time',fmt(T)+' / '+fmt(TOT)); txt('chLbl',(ci+1)+'. '+CH[ci].t) }
function loop(now){ var dt=lastNow?Math.min(.1,(now-lastNow)/1000):0; lastNow=now;
  if(playing){ T+=dt*speed; if(T>=TOT){ T=TOT-.001; setPlay(false) } }
  render(T); requestAnimationFrame(loop) }
function setPlay(p){ playing=p; if(p) ensureAudio(); else hush(); musicState(p); $('icPlay').innerHTML=p?'<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>':'<path d="M8 5v14l11-7z"/>'; $('poster').classList.toggle('hide',p||T>0.01) }
function seek(t){ T=cl(t,0,TOT-.001); FIRED={}; hush(); $('poster').classList.add('hide') }
function chapterAt(t){ return locate(t).i }
$('bPlay').onclick=function(){ if(T>=TOT-.01) T=0; setPlay(!playing) };
$('poster').onclick=function(){ setPlay(true) };
frame.addEventListener('click',function(e){ if(e.target.closest('#poster')) return; setPlay(!playing) });
$('bPrev').onclick=function(){ var i=chapterAt(T); seek(T-START[i]>1.2?START[i]:START[Math.max(0,i-1)]) };
$('bNext').onclick=function(){ var i=chapterAt(T); seek(START[Math.min(CH.length-1,i+1)]) };
$('bRst').onclick=function(){ seek(0); setPlay(true) };
$('bSpd').onclick=function(){ speed=speed===1?1.5:speed===1.5?.75:1; $('bSpd').textContent=speed+'×' };
$('bFs').onclick=function(){ var el=$('player'); if(document.fullscreenElement) document.exitFullscreen(); else if(el.requestFullscreen) el.requestFullscreen() };
function toggleClean(){ var p=$('player'); p.classList.toggle('clean'); var h=$('hint'); if(p.classList.contains('clean')){ h.style.opacity=1; setTimeout(function(){h.style.opacity=0},1600) } setTimeout(fitStage,30) }
$('bHide').onclick=toggleClean;
function updVoiceBtn(){ var b=$('bVoice'); if(b) b.textContent='Voice: '+(voiceMode==='off'?'Off':voiceMode==='ur'?(vUR?'اردو':'اردو (n/a)'):'EN') }
$('bVoice').onclick=function(){ voiceMode=voiceMode==='en'?'ur':voiceMode==='ur'?'off':'en'; hush(); updVoiceBtn() };
$('bMus').onclick=function(){ musicOn=!musicOn; $('bMus').textContent='♪ Music: '+(musicOn?'On':'Off'); musicState(playing) };
function setSound(on){ soundOn=on; if(AC) master.gain.setTargetAtTime(on?1:0,AC.currentTime,.05); if(!on) hush(); $('icSnd').innerHTML=on?'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>':'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>'; musicState(playing) }
$('bSnd').onclick=function(){ setSound(!soundOn) };
document.addEventListener('fullscreenchange',function(){ setTimeout(fitStage,50) });
function barT(e){ var r=bar.getBoundingClientRect(), x=cl(e.clientX-r.left,0,r.width); // map pixel → time across segments (3px gaps)
  var acc=0; for(var i=0;i<segs.length;i++){ var sr=segs[i].getBoundingClientRect(), sx=sr.left-r.left; if(x<=sx+sr.width+1.5) return START[i]+cl((x-sx)/sr.width,0,1)*CH[i].d } return TOT }
var drag=false;
bar.addEventListener('pointerdown',function(e){ drag=true; bar.setPointerCapture(e.pointerId); seek(barT(e)) });
bar.addEventListener('pointermove',function(e){ var t=barT(e), tip=$('tip'), r=bar.getBoundingClientRect(); tip.style.left=(e.clientX-r.left)+'px'; tip.textContent=(chapterAt(t)+1)+'. '+CH[chapterAt(t)].t+' · '+fmt(t); if(drag) seek(t) });
bar.addEventListener('pointerup',function(){ drag=false });
addEventListener('keydown',function(e){ if(e.target.tagName==='INPUT') return;
  if(e.code==='Space'){ e.preventDefault(); $('bPlay').click() } else if(e.key==='h'||e.key==='H') toggleClean(); else if(e.key==='ArrowRight') $('bNext').click(); else if(e.key==='ArrowLeft') $('bPrev').click(); else if(e.key==='f'||e.key==='F') $('bFs').click(); else if(e.key==='m'||e.key==='M') $('bSnd').click() });
// ?t=seconds deep link, ?autoplay=1
var q=new URLSearchParams(location.search); if(q.get('t')) seek(+q.get('t')); if(q.get('autoplay')==='1') setPlay(true);
window.__tut={seek:seek,render:render,setPlay:setPlay,TOT:TOT,START:START};
requestAnimationFrame(loop);
})();
