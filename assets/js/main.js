var EARTH_SRC="assets/img/earth.jpg";

(function(){
  // ---------- language ----------
  var html=document.documentElement, bEn=document.getElementById('bEn'), bUr=document.getElementById('bUr');
  function setLang(l){ html.lang=l; bEn.setAttribute('aria-pressed',l==='en'); bUr.setAttribute('aria-pressed',l==='ur'); try{localStorage.setItem('ls-lang',l)}catch(e){} }
  bEn.onclick=function(){setLang('en')}; bUr.onclick=function(){setLang('ur')};
  try{ var sl=localStorage.getItem('ls-lang'); if(sl) setLang(sl) }catch(e){}

  // ---------- phone mockups ----------
  var I={
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>', loc:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/>',
    layers:'<path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/>', poly:'<path d="M12 3l8 6-3 10H7L4 9z"/>', cam:'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-2h3L15 7"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', map:'<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/>', del:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>', redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>', lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0"/>'};
  function ic(n){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[n]+'</svg>' }
  function chrome(){ return '<div class="bar1">'+['menu','search','loc','layers','poly','cam','gear'].map(ic).join('')+'</div>'+
    '<div class="bar2">'+['eye','map','del','undo','redo','lock'].map(ic).join('')+'</div>'+
    '<div class="fab"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M9 11V5a2 2 0 0 1 4 0v6M13 10a2 2 0 0 1 4 0v3M9 11a2 2 0 0 0-4 0v2c0 4 3 7 7 7s6-3 6-6v-1"/></svg>Slide Me</div>' }
  function gps(){ return '<div class="gps"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E9E5A" stroke-width="2.2"><rect x="9" y="9" width="6" height="6" transform="rotate(45 12 12)"/><path d="M4 9l3-3 3 3-3 3zM14 19l3-3 3 3-3 3"/></svg><b>±1.9 m</b><em>BOOST</em></div>' }
  function pin(x,y,c){ return '<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y-26)+'" stroke="#fff" stroke-width="2.4"/><circle cx="'+x+'" cy="'+(y-30)+'" r="7.5" fill="'+c+'" stroke="#fff" stroke-width="2"/>' }
  function lbl(x,y,t){ var w=t.length*5.6+14; return '<rect x="'+(x-w/2)+'" y="'+(y-9)+'" width="'+w+'" height="18" rx="9" fill="rgba(18,24,20,.85)"/><text x="'+x+'" y="'+(y+4)+'" fill="#fff" font-size="10" font-weight="800" text-anchor="middle" font-family="Manrope,Arial">'+t+'</text>' }
  var M={
    measure:{bg:'42.1% 47.3%',zoom:'1260%',svg:function(){ var P=[[70,240],[205,226],[214,372],[86,392]], s='<polygon points="'+P.join(' ')+'" fill="rgba(229,57,53,.16)" stroke="#E53935" stroke-width="3" stroke-linejoin="round"/>';
      s+=lbl(138,232,'412.6 ft')+lbl(222,300,'401.3 ft')+lbl(150,382,'395.8 ft')+lbl(76,316,'418.0 ft'); P.forEach(function(p,i){s+=pin(p[0],p[1],i?'#D32F2F':'#0E8A4F')}); return s },
      over:'<div class="info"><small>Parcel 1 · 4 pts</small><b>3.79 acres</b><span>165,140 sq ft</span></div>'},
    measure2:{bg:'43.9% 49.9%',zoom:'1395%',svg:function(){ var P=[[60,250],[190,236],[226,330],[150,410],[70,380]], s='<polygon points="'+P.join(' ')+'" fill="rgba(229,57,53,.16)" stroke="#E53935" stroke-width="3" stroke-linejoin="round"/>';
      s+=lbl(125,240,'388 ft')+lbl(212,283,'302 ft')+lbl(190,372,'337 ft'); P.forEach(function(p,i){s+=pin(p[0],p[1],i?'#D32F2F':'#0E8A4F')}); s+='<line x1="70" y1="380" x2="150" y2="300" stroke="#E53935" stroke-width="2" stroke-dasharray="6 5"/><g transform="translate(150 300)" stroke="#E53935" stroke-width="2.4"><path d="M-16 0h-10M16 0h10M0-16v-10M0 16v10"/><circle r="3" fill="#E53935"/></g>'; return s },
      over:'<div class="info"><small>Parcel 2 · 5 pts</small><b>2.94 acres</b><span>128,060 sq ft</span></div>'},
    grid:{bg:'38.6% 44.6%',zoom:'1170%',svg:function(){ var x0=40,y0=200,c=42,s='', n=0;
      for(var r=0;r<5;r++) for(var k=0;k<5;k++){ var col=r%2?4-k:k; n=r*5+k+1; var cx=x0+col*c+c/2, cy=y0+r*c+c/2; s+='<circle cx="'+cx+'" cy="'+cy+'" r="10.5" fill="#fff" stroke="#1E9E5A" stroke-width="2"/><text x="'+cx+'" y="'+(cy+4)+'" font-size="10" font-weight="800" fill="#137A43" text-anchor="middle" font-family="Manrope,Arial">'+n+'</text>' }
      var g=''; for(var i=0;i<=5;i++){ g+='<line x1="'+(x0+i*c)+'" y1="'+y0+'" x2="'+(x0+i*c)+'" y2="'+(y0+5*c)+'" stroke="#fff" stroke-width="1.6"/><line x1="'+x0+'" y1="'+(y0+i*c)+'" x2="'+(x0+5*c)+'" y2="'+(y0+i*c)+'" stroke="#fff" stroke-width="1.6"/>' }
      return '<rect x="'+x0+'" y="'+y0+'" width="'+5*c+'" height="'+5*c+'" fill="rgba(0,0,0,.12)" stroke="#E53935" stroke-width="3"/>'+g+s+pin(x0,y0+5*c,'#0E8A4F') },
      over:'<div class="info"><small>Square grid · 25 plots</small><b>25 × 1.1 acres</b><span>27.8 acres total</span></div>'},
    stake:{bg:'48.3% 39.4%',zoom:'1350%',svg:function(){ return '<circle cx="140" cy="330" r="46" fill="rgba(66,133,244,.16)" stroke="rgba(66,133,244,.5)"/><line x1="140" y1="330" x2="176" y2="262" stroke="#34C474" stroke-width="3" stroke-dasharray="7 5"/>'+pin(176,262,'#1E88E5')+
      '<path d="M140 330l-12-26 12 6 12-6z" fill="rgba(66,133,244,.35)"/><circle cx="140" cy="330" r="9" fill="#4285F4" stroke="#fff" stroke-width="3"/>' },
      over:'<div class="guide"><small>STAKEOUT · POINT 3</small>3 ft North · 2 ft East</div>'}
  };
  document.querySelectorAll('.scr').forEach(function(el){ var m=M[el.dataset.mock]; if(!m) return;
    el.style.backgroundPosition=m.bg; el.style.backgroundSize=m.zoom;
    el.innerHTML='<svg class="ov" viewBox="0 0 280 600" preserveAspectRatio="xMidYMid slice">'+m.svg()+'</svg>'+chrome()+gps()+m.over });

  // ---------- intro v2 ----------
  // Orbit (0–2s) → into the lens (2–3.4s) → optical zoom to Punjab fields (3.4–5.2s) → site (5.2–6s).
  // Everything the WebGL scene needs is in this file (Three.js inline, Earth texture as a data URI,
  // satellite/clouds/atmosphere generated in code), so it renders from file:// and https:// alike.
  var $=function(id){return document.getElementById(id)};
  var intro=$('intro'), gl=$('gl'), fx=$('fx'), c2=fx.getContext('2d'), iris=$('iris'), ci=iris.getContext('2d'), wash=$('wash'), hud=$('hud');
  var hLat=$('hLat'), hLon=$('hLon'), hAlt=$('hAlt'), hZm=$('hZm'), hAi=$('hAi'), hBar=$('hBar'), hFix=$('hFix'), retRot=$('retRot'), skipB=$('skip');
  var TAU=Math.PI*2, W=1, H=1, dpr=1, running=false, t0=0, raf=0, noGL=false;
  var LATd=30.9693, LONd=70.9428, LAT=LATd*Math.PI/180;
  var renderer=null, scene, camera, earthG, earthM, cloudM, atmo, sat, starsA, starsB, satS=0.028, ORB=1.22;
  var V3, D, E, E2, INC=.42, NORTH, qT, qI, mB, zb, xb, yb, sl, lastT=-1, sunL, bounceL, sunDir, tmpA, tmpB, tmpC, tmpD;
  function clamp(x,a,b){return x<a?a:x>b?b:x}
  function sm(a,b,x){x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)}
  function lerp(a,b,k){return a+(b-a)*k}

  // fields imagery for the final stage (2D canvas, so file:// never blocks it) + a procedural stand-in
  var imgF=new Image(); imgF.decoding='async'; imgF.src='assets/img/fields.webp';
  var fallbackF=null;
  function fieldsImg(){
    if(imgF.complete&&imgF.naturalWidth) return imgF;
    if(!fallbackF){ fallbackF=document.createElement('canvas'); fallbackF.width=1750; fallbackF.height=1804; var g=fallbackF.getContext('2d');
      g.fillStyle='#2f4a24'; g.fillRect(0,0,1750,1804);
      for(var y=0;y<1804;y+=9) for(var x=0;x<1750;x+=7){ var r=Math.random(); g.fillStyle=r<.55?'rgb('+(30+r*40|0)+','+(70+r*60|0)+',32)':r<.8?'rgb(96,92,58)':'rgb(58,78,40)'; g.fillRect(x,y,7,9) } }
    return fallbackF;
  }

  // ---------- GLSL ----------
  var NOISE='float hs(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}'+
    'float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}'+
    'float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}';
  var VS='varying vec2 vUv;varying vec3 vN;varying vec3 vW;varying vec3 vP;void main(){vUv=uv;vP=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
  var EARTH_FS='uniform sampler2D map;uniform float uHas;uniform vec3 sunDir;uniform float uHaze;varying vec2 vUv;varying vec3 vN;varying vec3 vW;varying vec3 vP;'+NOISE+
    'void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(sunDir);vec3 day;'+
    'if(uHas>.5)day=texture2D(map,vUv).rgb;else{float c=fbm(vP*2.4);day=mix(vec3(.02,.05,.14),vec3(.2,.3,.13),smoothstep(.53,.57,c));}'+
    'float lum=dot(day,vec3(.299,.587,.114));float oc=max(smoothstep(.015,.07,day.b-day.r),1.-smoothstep(.035,.1,lum))*(1.-smoothstep(.22,.36,lum));'+
    'float dt=fbm(vP*260.)*.55+n3(vP*1800.)*.45;day*=mix(1.,.8+.42*dt,(1.-oc)*.75);'+
    'day=mix(day,day*vec3(.7,1.,1.45)+vec3(.008,.03,.085),oc);day=pow(day,vec3(.9))*1.1;'+
    'float nl=dot(N,L);float dif=smoothstep(-.12,.45,nl);vec3 Hh=normalize(L+V);float nh=max(dot(N,Hh),0.);'+
    'float sp=(pow(nh,160.)*.85+pow(nh,16.)*.05)*oc;float fr=pow(1.-max(dot(N,V),0.),3.);'+
    'vec3 col=day*(.03+dif*1.12)+vec3(1.,.93,.8)*sp*dif;col+=vec3(.22,.55,1.)*fr*(.2+.95*dif);'+
    'col+=vec3(.4,.14,.02)*smoothstep(.22,0.,abs(nl))*.1;col=mix(col,vec3(.58,.76,.98)*(.35+.65*dif),uHaze);gl_FragColor=vec4(col,1.);}';
  var CLOUD_FS='uniform float uT;uniform vec3 sunDir;uniform vec3 uD;uniform float uOp;varying vec2 vUv;varying vec3 vN;varying vec3 vW;varying vec3 vP;'+NOISE+
    'void main(){vec3 N=normalize(vN),L=normalize(sunDir);float b=smoothstep(.99996,.999996,dot(normalize(vW),uD));'+
    'float c=fbm(vP*3.1+vec3(uT*.012,0.,uT*.007));float dt=dot(normalize(vW),uD);c=smoothstep(.47-b*.42,.76-b*.3,c);c*=1.-smoothstep(.9975,.99985,dt)*(1.-b)*.9;float d=fbm(vP*22.+3.)*.65+.35;float a=c*d;'+
    'float dif=smoothstep(-.12,.5,dot(N,L));gl_FragColor=vec4(vec3(.06+dif*1.02),a*.92*uOp);}';
  var ATMO_VS='varying vec3 vNv;varying vec3 vNw;void main(){vNv=normalize(normalMatrix*normal);vNw=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
  var ATMO_FS='uniform vec3 sunDir;uniform float uA;varying vec3 vNv;varying vec3 vNw;void main(){float i=pow(clamp(.74-dot(vNv,vec3(0,0,1.)),0.,1.),3.2);'+
    'float lit=smoothstep(-.35,.6,dot(vNw,normalize(sunDir)))*.85+.15;gl_FragColor=vec4(mix(vec3(.15,.45,1.),vec3(.45,.95,1.),i)*i*1.7*lit*uA,1.);}';

  // ---------- satellite: photoreal Earth-observation spacecraft (WorldView / Sentinel-2 class), built in code ----------
  // Body frame: +Z = nadir (telescope looks at Earth), +X = flight direction, ±Y = solar-array wings.
  function mkCanvas(w,h){ var c=document.createElement('canvas'); c.width=w; c.height=h; return c }
  function texOf(c,srgb,rep){ var t=new THREE.CanvasTexture(c); t.anisotropy=renderer.capabilities.getMaxAnisotropy(); t.wrapS=t.wrapT=THREE.RepeatWrapping; if(rep) t.repeat.set(rep[0],rep[1]); if(srgb) t.encoding=THREE.sRGBEncoding; return t }
  function rnd(seed){ return function(){ seed=(seed*16807)%2147483647; return (seed-1)/2147483646 } }
  // crinkled MLI foil: faceted height field → colour, normal and roughness maps
  function foilMaps(base,alt,seed){
    var N=512, R=rnd(seed), hc=mkCanvas(N,N), g=hc.getContext('2d');
    g.fillStyle='#808080'; g.fillRect(0,0,N,N);
    for(var i=0;i<1400;i++){ var x=R()*N, y=R()*N, r=8+R()*46, v=60+R()*140|0; g.fillStyle='rgba('+v+','+v+','+v+','+(.35+R()*.45)+')';
      g.beginPath(); g.moveTo(x,y); for(var k=0;k<3+(R()*3|0);k++) g.lineTo(x+(R()-.5)*r*2,y+(R()-.5)*r*2); g.closePath(); g.fill() }
    for(i=0;i<220;i++){ var x0=R()*N, y0=R()*N, a=R()*6.283, L=20+R()*120; g.strokeStyle=R()<.5?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)'; g.lineWidth=.6+R()*1.4;
      g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(x0+Math.cos(a+.4)*L*.5,y0+Math.sin(a+.4)*L*.5,x0+Math.cos(a)*L,y0+Math.sin(a)*L); g.stroke() }
    var hd=g.getImageData(0,0,N,N).data, cc=mkCanvas(N,N), nc=mkCanvas(N,N), rc=mkCanvas(N,N);
    var cx=cc.getContext('2d'), nx=nc.getContext('2d'), rx=rc.getContext('2d'), ci2=cx.createImageData(N,N), ni=nx.createImageData(N,N), ri=rx.createImageData(N,N);
    function H(x,y){ x=(x+N)%N; y=(y+N)%N; return hd[(y*N+x)*4]/255 }
    for(var y=0;y<N;y++) for(var x=0;x<N;x++){ var p=(y*N+x)*4, h=H(x,y), dx=(H(x+1,y)-H(x-1,y))*5.5, dy=(H(x,y+1)-H(x,y-1))*5.5, l=Math.sqrt(dx*dx+dy*dy+1);
      ni.data[p]=(-dx/l*.5+.5)*255; ni.data[p+1]=(dy/l*.5+.5)*255; ni.data[p+2]=(1/l*.5+.5)*255; ni.data[p+3]=255;
      var m=.82+.36*h, tape=(y%171<4||x%233<3)?.72:1, k=Math.max(0,Math.sin(x*.011+y*.007)*.5+.5)*.25;
      ci2.data[p]=Math.min(255,(base[0]*(1-k)+alt[0]*k)*m*tape); ci2.data[p+1]=Math.min(255,(base[1]*(1-k)+alt[1]*k)*m*tape); ci2.data[p+2]=Math.min(255,(base[2]*(1-k)+alt[2]*k)*m*tape); ci2.data[p+3]=255;
      var rv=(.2+Math.abs(dx)*.08+(1-h)*.12+(tape<1?.25:0))*255; ri.data[p]=ri.data[p+1]=ri.data[p+2]=Math.min(255,rv); ri.data[p+3]=255 }
    cx.putImageData(ci2,0,0); nx.putImageData(ni,0,0); rx.putImageData(ri,0,0);
    return {map:texOf(cc,true),normalMap:texOf(nc),roughnessMap:texOf(rc)}
  }
  // monocrystalline silicon cells: pseudo-square cells, silver fingers, busbars, gaps
  function cellMaps(){
    var N=1024, C=mkCanvas(N,N), Rg=mkCanvas(N,N), g=C.getContext('2d'), r=Rg.getContext('2d'), R=rnd(7), cols=6, rows=7, gap=10, cw=(N-gap)/cols, ch=(N-gap)/rows, cut=cw*.12;
    g.fillStyle='#d9dde3'; g.fillRect(0,0,N,N); r.fillStyle='#b0b0b0'; r.fillRect(0,0,N,N);
    for(var j=0;j<rows;j++) for(var i=0;i<cols;i++){ var x=gap+i*cw, y=gap+j*ch, w=cw-gap, h=ch-gap, s=R()*.12;
      function cell(ctx){ ctx.beginPath(); ctx.moveTo(x+cut,y); ctx.lineTo(x+w-cut,y); ctx.lineTo(x+w,y+cut); ctx.lineTo(x+w,y+h-cut); ctx.lineTo(x+w-cut,y+h); ctx.lineTo(x+cut,y+h); ctx.lineTo(x,y+h-cut); ctx.lineTo(x,y+cut); ctx.closePath() }
      var gr=g.createLinearGradient(x,y,x+w,y+h); gr.addColorStop(0,'rgb('+(14+s*40|0)+','+(26+s*50|0)+','+(64+s*60|0)+')'); gr.addColorStop(1,'rgb(6,12,'+(30+s*30|0)+')');
      g.fillStyle=gr; cell(g); g.fill(); r.fillStyle='#363636'; cell(r); r.fill();
      g.save(); cell(g); g.clip(); g.strokeStyle='rgba(200,208,220,.34)'; g.lineWidth=1; for(var f=y+5;f<y+h;f+=7){ g.beginPath(); g.moveTo(x,f); g.lineTo(x+w,f); g.stroke() }
      for(var b=1;b<=3;b++){ var bx=x+w*b/4; g.fillStyle='rgba(222,226,234,.9)'; g.fillRect(bx-2.5,y,5,h); r.fillStyle='#707070'; r.fillRect(bx-2.5,y,5,h) } g.restore() }
    g.strokeStyle='#9aa3ad'; g.lineWidth=10; g.strokeRect(0,0,N,N);
    return {map:texOf(C,true),roughnessMap:texOf(Rg)}
  }
  function brushed(n,seed,rep){ var c=mkCanvas(n,n), g=c.getContext('2d'), R=rnd(seed); g.fillStyle='#8c8c8c'; g.fillRect(0,0,n,n);
    for(var i=0;i<n*3;i++){ var v=100+R()*90|0; g.fillStyle='rgba('+v+','+v+','+v+',.35)'; g.fillRect(0,R()*n,n,.6+R()*1.2) } return texOf(c,false,rep) }
  function carbon(){ var n=128, c=mkCanvas(n,n), g=c.getContext('2d'); g.fillStyle='#0d0f12'; g.fillRect(0,0,n,n);
    for(var y=0;y<n;y+=16) for(var x=0;x<n;x+=16){ var a=((x+y)/16)%2; var gr=g.createLinearGradient(x,y,a?x+16:x,a?y:y+16); gr.addColorStop(0,'#15181d'); gr.addColorStop(.5,'#3a3f48'); gr.addColorStop(1,'#15181d'); g.fillStyle=gr; g.fillRect(x+1,y+1,14,14) }
    return texOf(c,true,[1,8]) }
  function tiles(){ var n=512, c=mkCanvas(n,n), g=c.getContext('2d'); g.fillStyle='#6d737b'; g.fillRect(0,0,n,n);
    for(var y=0;y<n;y+=32) for(var x=0;x<n;x+=32){ var v=200+((x*7+y*13)%40); g.fillStyle='rgb('+v+','+v+','+(v+6)+')'; g.fillRect(x+1.5,y+1.5,29,29) } return texOf(c,true) }
  function glintTex(){ var n=256, c=mkCanvas(n,n), g=c.getContext('2d'), gr=g.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);
    gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(.45,'rgba(0,120,140,.0)'); gr.addColorStop(.7,'rgba(0,229,255,.55)'); gr.addColorStop(.82,'rgba(59,255,158,.6)'); gr.addColorStop(.92,'rgba(120,80,255,.25)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr; g.fillRect(0,0,n,n); return texOf(c,true) }

  function makeSat(env){
    var T=THREE, g=new T.Group(), body=new T.Group(); g.add(body);
    var envI=env?1:0, noEnv=!env;
    function S(o){ if(env){ o.envMap=env; o.envMapIntensity=o.envMapIntensity||1 } else if(o.metalness>.5){ o.metalness=.45 } return new T.MeshStandardMaterial(o) }
    var gf=foilMaps([246,190,92],[214,128,62],11), sf=foilMaps([212,214,220],[180,186,196],29), bf=foilMaps([52,52,58],[36,38,44],41);
    var gold=S(Object.assign({color:0xffffff,metalness:.92,roughness:.28,normalScale:new T.Vector2(.9,.9)},gf));
    var silverMLI=S(Object.assign({color:0xffffff,metalness:.9,roughness:.3,normalScale:new T.Vector2(.7,.7)},sf));
    var blackMLI=S(Object.assign({color:0xffffff,metalness:.6,roughness:.42,normalScale:new T.Vector2(.8,.8)},bf));
    var cm=cellMaps(), cells=S({map:cm.map,roughnessMap:cm.roughnessMap,color:0xffffff,metalness:.65,roughness:.22,envMapIntensity:1.2});
    var back=S({color:0xc9ccd1,metalness:.2,roughness:.6}), alu=S({color:0xc4c8ce,metalness:1,roughness:.32,roughnessMap:brushed(256,3,[1,1])});
    var ti=S({color:0xaaa7a2,metalness:1,roughness:.36,roughnessMap:brushed(256,5,[2,1])}), cf=S({map:carbon(),color:0xffffff,metalness:.35,roughness:.4});
    var osr=S({map:tiles(),color:0xffffff,metalness:.95,roughness:.12,envMapIntensity:1.3}), white=S({color:0xeceef1,metalness:.05,roughness:.55,side:T.DoubleSide});
    var flat=S({color:0x07080a,metalness:.2,roughness:.92,side:T.DoubleSide}), nozzle=S({color:0x6d5a48,metalness:1,roughness:.42,side:T.DoubleSide});
    var glass=new T.MeshPhysicalMaterial({color:0x061019,metalness:0,roughness:.03,clearcoat:1,clearcoatRoughness:.02,reflectivity:1,transparent:true,opacity:.55,depthWrite:false,envMap:env,envMapIntensity:2.4});
    var inner=new T.MeshPhysicalMaterial({color:0x03070c,metalness:.1,roughness:.06,clearcoat:1,clearcoatRoughness:.03,envMap:env,envMapIntensity:1.8});
    var glintM=new T.MeshBasicMaterial({map:glintTex(),transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.3});
    function add(geo,mat,x,y,z,rx,ry,rz,parent){ var m=new T.Mesh(geo,mat); m.position.set(x||0,y||0,z||0); m.rotation.set(rx||0,ry||0,rz||0); m.castShadow=m.receiveShadow=true; (parent||body).add(m); return m }
    function rod(a,b,r,mat,parent){ var A=new T.Vector3(a[0],a[1],a[2]), B=new T.Vector3(b[0],b[1],b[2]), d=B.clone().sub(A), m=add(new T.CylinderGeometry(r,r,d.length(),10),mat,0,0,0,0,0,0,parent);
      m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize()); return m }
    // bus: gold MLI faces, silver MLI on the flanks, OSR radiator on the zenith deck, aluminium edge rails
    var BX=1.4, BY=1.0, BZ=1.1;
    add(new T.BoxGeometry(BX,BY,BZ),[gold,gold,silverMLI,silverMLI,gold,gold]);
    add(new T.BoxGeometry(BX*.96,BY*.96,.03),osr,0,0,-BZ/2-.016);
    add(new T.BoxGeometry(BX+.02,.04,.04),alu,0,BY/2,BZ/2); add(new T.BoxGeometry(BX+.02,.04,.04),alu,0,-BY/2,BZ/2); add(new T.BoxGeometry(BX+.02,.04,.04),alu,0,BY/2,-BZ/2); add(new T.BoxGeometry(BX+.02,.04,.04),alu,0,-BY/2,-BZ/2);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(s){ add(new T.BoxGeometry(.04,.04,BZ+.02),alu,s[0]*BX/2,s[1]*BY/2,0); add(new T.BoxGeometry(.04,BY+.02,.04),alu,s[0]*BX/2,0,s[1]*BZ/2) });
    add(new T.BoxGeometry(.5,.36,.04),blackMLI,.3,.2,BZ/2+.02);
    // telescope: titanium mount, black-MLI barrel with titanium rings, sunshade, multi-element AR-coated optics
    var Z0=BZ/2;
    add(new T.CylinderGeometry(.5,.52,.08,64),ti,0,0,Z0+.04,Math.PI/2);
    add(new T.CylinderGeometry(.4,.44,.5,64,1,true),blackMLI,0,0,Z0+.33,Math.PI/2);
    [Z0+.12,Z0+.36,Z0+.58].forEach(function(z){ add(new T.TorusGeometry(.43,.018,12,72),ti,0,0,z) });
    add(new T.CylinderGeometry(.46,.42,.22,64,1,true),ti,0,0,Z0+.69,Math.PI/2);
    add(new T.CylinderGeometry(.445,.405,.22,64,1,true),flat,0,0,Z0+.69,Math.PI/2);
    add(new T.TorusGeometry(.455,.016,12,72),alu,0,0,Z0+.8);
    [[.3,Z0+.5],[.22,Z0+.42],[.13,Z0+.36]].forEach(function(e){ add(new T.CircleGeometry(e[0],64),inner,0,0,e[1]); add(new T.RingGeometry(e[0],e[0]+.06,64),flat,0,0,e[1]-.001) });
    add(new T.CircleGeometry(.4,72),glass,0,0,Z0+.585).castShadow=false;
    var glint=add(new T.CircleGeometry(.4,72),glintM,0,0,Z0+.59); glint.castShadow=glint.receiveShadow=false;
    // star trackers on the zenith deck (baffled hoods), aft
    [-1,1].forEach(function(s){ var st=new T.Group(); st.position.set(-.45,s*.25,-BZ/2-.03); st.rotation.set(s*.5,-.35,0); body.add(st);
      add(new T.BoxGeometry(.16,.16,.1),ti,0,0,-.05,0,0,0,st); add(new T.CylinderGeometry(.06,.06,.12,24),blackMLI,0,0,-.16,Math.PI/2,0,0,st);
      add(new T.CylinderGeometry(.12,.065,.2,32,1,true),flat,0,0,-.32,Math.PI/2,0,0,st); add(new T.TorusGeometry(.12,.008,8,32),ti,0,0,-.42,0,0,0,st) });
    // X-band dish on a gimballed boom, pointed at Earth, with feed horn and struts
    var dg=new T.Group(); dg.position.set(-BX/2-.02,0,Z0-.25); body.add(dg);
    rod([0,0,0],[-.32,0,.22],.025,ti,dg); add(new T.SphereGeometry(.05,16,12),alu,-.32,0,.22,0,0,0,dg);
    var pts=[]; for(var i=0;i<=24;i++){ var rr=i/24*.3; pts.push(new T.Vector2(rr,rr*rr*1.4)) }
    var dish=add(new T.LatheGeometry(pts,64),white,-.32,0,.26,Math.PI/2,0,0,dg);
    add(new T.ConeGeometry(.035,.09,16,1,true),ti,-.32,0,.42,-Math.PI/2,0,0,dg);
    [0,2.094,4.189].forEach(function(a){ rod([-.32+Math.cos(a)*.27,Math.sin(a)*.27,.36],[-.32,0,.45],.006,ti,dg) });
    // propulsion: four bells aft + RCS clusters
    var bell=[]; for(i=0;i<=12;i++){ var q=i/12; bell.push(new T.Vector2(.025+.06*q*q,-q*.16)) }
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(s){ var b=add(new T.LatheGeometry(bell,24),nozzle,-BX/2-.01,s[0]*.28,s[1]*.3,0,0,-Math.PI/2);
      add(new T.CylinderGeometry(.03,.03,.04,12),ti,-BX/2+.01,s[0]*.28,s[1]*.3,0,0,Math.PI/2);
      var rc=add(new T.BoxGeometry(.06,.06,.06),ti,BX/2-.05,s[0]*(BY/2+.03),s[1]*(BZ/2-.08));
      add(new T.ConeGeometry(.018,.05,10,1,true),nozzle,BX/2-.05,s[0]*(BY/2+.07),s[1]*(BZ/2-.08),0,0,s[0]>0?0:Math.PI) });
    // GNSS patch + antennas
    add(new T.CylinderGeometry(.07,.07,.02,24),white,.35,-.25,-BZ/2-.04,Math.PI/2); rod([.55,.35,-BZ/2],[.55,.35,-BZ/2-.35],.006,ti);
    // solar-array wings: drive (SADA), carbon-fibre yoke truss, three hinged panels; whole wing rotates about Y to face the Sun
    var wings=[];
    [-1,1].forEach(function(s){
      add(new T.CylinderGeometry(.09,.11,.12,32),ti,0,s*(BY/2+.06),0);
      var w=new T.Group(); w.position.set(0,s*(BY/2+.12),0); body.add(w); wings.push(w);
      var y0=.02, y1=.62;
      rod([0,s*y0,0],[.32,s*y1,0],.014,cf,w); rod([0,s*y0,0],[-.32,s*y1,0],.014,cf,w); rod([0,s*y0,.0],[0,s*y1,.0],.016,cf,w);
      rod([.32,s*y1,0],[-.32,s*y1,0],.016,alu,w); rod([.16,s*.32,0],[-.16,s*.32,0],.01,cf,w);
      add(new T.SphereGeometry(.03,12,10),alu,0,s*y0,0,0,0,0,w);
      for(var k=0;k<3;k++){ var yc=s*(y1+.04+.5+k*1.03);
        add(new T.BoxGeometry(.96,1.0,.03),[alu,alu,alu,alu,back,cells],0,yc,0,0,0,0,w);
        add(new T.BoxGeometry(.98,.025,.045),alu,0,yc+s*.51,0,0,0,0,w); add(new T.BoxGeometry(.98,.025,.045),alu,0,yc-s*.51,0,0,0,0,w);
        if(k<2) [-.3,.3].forEach(function(xh){ add(new T.CylinderGeometry(.018,.018,.06,12),ti,xh,yc+s*.53,0,0,0,0,w) }) } });
    g.userData={wings:wings,glint:glintM,wingA:0};
    g.scale.setScalar(satS);
    return g;
  }

  // procedural space environment for reflections: black sky, Sun, blue Earth albedo glow from the nadir hemisphere
  function spaceEnv(earthDir){
    var w=512, h=256, c=mkCanvas(w,h), g=c.getContext('2d'), id=g.createImageData(w,h), d=id.data, R=rnd(3);
    for(var y=0;y<h;y++){ var v=1-(y+.5)/h, th=(v-.5)*Math.PI;
      for(var x=0;x<w;x++){ var u=(x+.5)/w, ph=(u-.5)*2*Math.PI, dx=Math.cos(th)*Math.cos(ph), dy=Math.sin(th), dz=Math.cos(th)*Math.sin(ph), p=(y*w+x)*4;
        var e=dx*earthDir.x+dy*earthDir.y+dz*earthDir.z, s=dx*sunDir.x+dy*sunDir.y+dz*sunDir.z;
        var ea=Math.max(0,Math.min(1,(e-.05)/.6)), lim=Math.exp(-Math.pow((e-.1)/.08,2));
        var r=ea*58+lim*70, gg=ea*78+lim*110, b=ea*110+lim*160;
        var sun=Math.pow(Math.max(s,0),900)*255+Math.pow(Math.max(s,0),40)*60; r+=sun; gg+=sun*.97; b+=sun*.9;
        if(ea<.01&&R()<.002){ r=gg=b=180 }
        d[p]=Math.min(255,r); d[p+1]=Math.min(255,gg); d[p+2]=Math.min(255,b); d[p+3]=255 } }
    g.putImageData(id,0,0);
    var t=new THREE.CanvasTexture(c); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.sRGBEncoding; return t
  }
  // verify the prefiltered env actually works on this GPU (some drivers return black/NaN); fall back to lights-only if not
  function envWorks(env){
    try{ var T=THREE, rt=new T.WebGLRenderTarget(16,16), sc=new T.Scene(), cam=new T.PerspectiveCamera(30,1,.1,10); cam.position.z=3;
      sc.add(new T.Mesh(new T.SphereGeometry(1,24,16),new T.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.35,envMap:env})));
      renderer.setRenderTarget(rt); renderer.render(sc,cam); var px=new Uint8Array(16*16*4); renderer.readRenderTargetPixels(rt,0,0,16,16,px); renderer.setRenderTarget(null); rt.dispose();
      var sum=0; for(var i=0;i<px.length;i+=4) sum+=px[i]+px[i+1]+px[i+2]; return sum/(256*3)>4 }catch(e){ return false }
  }

  function build(){
    if(!window.THREE) throw new Error('no three');
    var T=THREE; V3=T.Vector3;
    renderer=new T.WebGLRenderer({canvas:gl,antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setClearColor(0x000000,1);
    renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.0; renderer.outputEncoding=T.sRGBEncoding;
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
    scene=new T.Scene(); camera=new T.PerspectiveCamera(38,1,.01,1200);
    D=new V3(0,Math.sin(LAT),Math.cos(LAT)); E=new V3(1,0,0); NORTH=new V3(0,1,0).sub(D.clone().multiplyScalar(D.y)).normalize();
    E2=E.clone().multiplyScalar(Math.cos(INC)).addScaledVector(NORTH,Math.sin(INC)).normalize();
    qT=new T.Quaternion(); qI=new T.Quaternion(); mB=new T.Matrix4(); zb=new V3(); xb=new V3(); yb=new V3(); sl=new V3();
    sunDir=new V3(-.55,.38,.78).normalize(); tmpA=new V3(); tmpB=new V3(); tmpC=new V3(); tmpD=new V3();
    // Earth texture (inline data URI — never CORS-blocked)
    var tex=new T.Texture(); tex.anisotropy=renderer.capabilities.getMaxAnisotropy(); tex.minFilter=T.LinearMipmapLinearFilter;
    earthM=new T.ShaderMaterial({uniforms:{map:{value:tex},uHas:{value:0},sunDir:{value:sunDir},uHaze:{value:0}},vertexShader:VS,fragmentShader:EARTH_FS});
    var im=new Image(); im.onload=function(){ tex.image=im; tex.needsUpdate=true; earthM.uniforms.uHas.value=1 }; im.src=EARTH_SRC;
    cloudM=new T.ShaderMaterial({uniforms:{uT:{value:0},sunDir:{value:sunDir},uD:{value:D},uOp:{value:1}},vertexShader:VS,fragmentShader:CLOUD_FS,transparent:true,depthWrite:false});
    earthG=new T.Group(); scene.add(earthG);
    earthG.add(new T.Mesh(new T.SphereGeometry(1,160,120),earthM));
    var cl=new T.Mesh(new T.SphereGeometry(1.012,128,96),cloudM); earthG.add(cl); earthG.userData.cl=cl;
    atmo=new T.Mesh(new T.SphereGeometry(1.13,96,72),new T.ShaderMaterial({uniforms:{sunDir:{value:sunDir},uA:{value:1}},vertexShader:ATMO_VS,fragmentShader:ATMO_FS,side:T.BackSide,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
    scene.add(atmo);
    // rotate Earth so Layyah (Punjab) sits on direction D
    var u=(LONd+180)/360, px=-Math.cos(TAU*u), pz=Math.sin(TAU*u);
    earthG.userData.baseY=Math.atan2(-px,pz);
    // starfield
    function stars(n,size,op){ var p=new Float32Array(n*3), c=new Float32Array(n*3); for(var i=0;i<n;i++){ var z=Math.random()*2-1, a=Math.random()*TAU, r=420+Math.random()*80, q=Math.sqrt(1-z*z);
        p[i*3]=r*q*Math.cos(a); p[i*3+1]=r*z; p[i*3+2]=r*q*Math.sin(a); var k=.75+Math.random()*.25, w=Math.random(); c[i*3]=k*(w<.15?.8:1); c[i*3+1]=k*(w<.15?.9:1); c[i*3+2]=k*(w>.85?.8:1) }
      var g=new T.BufferGeometry(); g.setAttribute('position',new T.BufferAttribute(p,3)); g.setAttribute('color',new T.BufferAttribute(c,3));
      var s=new T.Points(g,new T.PointsMaterial({size:size,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:op,depthWrite:false})); scene.add(s); return s }
    starsA=stars(5200,1.25,.85); starsB=stars(420,2.4,1);
    // cinematic space lighting: hard Sun with shadows, blue Earth-albedo bounce from below, faint fill
    sunL=new T.DirectionalLight(0xfff4e8,3.4); sunL.castShadow=true; var sz=Math.min(screen.width,screen.height)<700?1024:2048;
    sunL.shadow.mapSize.set(sz,sz); var sc=sunL.shadow.camera; sc.left=sc.bottom=-.17; sc.right=sc.top=.17; sc.near=.05; sc.far=1.4; sunL.shadow.bias=-.0004; sunL.shadow.normalBias=.0015;
    scene.add(sunL); scene.add(sunL.target);
    bounceL=new T.DirectionalLight(0x86a9d6,.6); scene.add(bounceL); scene.add(bounceL.target);
    scene.add(new T.HemisphereLight(0x0b1020,0x2a4568,.22));
    var env=null;
    try{ var mid=-.75, earthDir=D.clone().multiplyScalar(Math.cos(mid)).addScaledVector(E2,Math.sin(mid)).normalize().negate();
      var pm=new T.PMREMGenerator(renderer), eq=spaceEnv(earthDir); env=pm.fromEquirectangular(eq).texture; eq.dispose(); pm.dispose();
      if(!envWorks(env)) env=null }catch(e){ env=null }
    sat=makeSat(env); scene.add(sat);
    renderer.compile(scene,camera);
  }

  // ---------- choreography ----------
  function satPos(t,out){ var f=-1.5+1.5*Math.min(t,3.4)/3.4; return out.copy(D).multiplyScalar(Math.cos(f)*ORB).addScaledVector(E2,Math.sin(f)*ORB) }
  function satVel(t,out){ var f=-1.5+1.5*Math.min(t,3.4)/3.4; return out.copy(D).multiplyScalar(-Math.sin(f)).addScaledVector(E2,Math.cos(f)).normalize() }
  // nadir-stabilised attitude: +Z to Earth's centre, +X along the ground track; slerped so it never snaps or flips
  function satAttitude(sp,vel,t){
    zb.copy(sp).negate().normalize(); xb.copy(vel).addScaledVector(zb,-vel.dot(zb)).normalize(); yb.crossVectors(zb,xb);
    mB.makeBasis(xb,yb,zb); qT.setFromRotationMatrix(mB);
    var dt=t-lastT, first=lastT<0||dt<0||dt>.25, k=first?1:1-Math.exp(-dt*12);
    if(first) sat.quaternion.copy(qT); else sat.quaternion.slerp(qT,k);
    sat.position.copy(sp); sat.updateMatrixWorld(true);
    // solar wings track the Sun about their own axis (shortest-path, damped)
    qI.copy(sat.quaternion).invert(); sl.copy(sunDir).applyQuaternion(qI);
    var u=sat.userData, tgt=Math.atan2(-sl.x,-sl.z), da=Math.atan2(Math.sin(tgt-u.wingA),Math.cos(tgt-u.wingA));
    u.wingA+=first?da:da*(1-Math.exp(-dt*4)); u.wings[0].rotation.y=u.wings[1].rotation.y=u.wingA;
    lastT=t;
    sunL.position.copy(sp).addScaledVector(sunDir,.6); sunL.target.position.copy(sp); sunL.target.updateMatrixWorld();
    bounceL.position.copy(sp).addScaledVector(zb,.6); bounceL.target.position.copy(sp); bounceL.target.updateMatrixWorld();
  }
  var camLook=null, lensW=null, P0=null, C1=null, C2=null, P3=null, screenLens={x:0,y:0};
  function bez(a,b,c,d,k,out){ var m=1-k; return out.set(0,0,0).addScaledVector(a,m*m*m).addScaledVector(b,3*m*m*k).addScaledVector(c,3*m*k*k).addScaledVector(d,k*k*k) }
  function render3D(t){
    var T=THREE; if(!camLook){ camLook=new V3(); lensW=new V3(); P0=new V3(); C1=new V3(); C2=new V3(); P3=new V3() }
    var sp=satPos(t,tmpA), vel=satVel(t,tmpB), up=tmpC.copy(sp).normalize(), A=tmpD.copy(up).negate();
    earthG.rotation.y=earthG.userData.baseY-.55*(1-sm(0,3.4,t));
    cloudM.uniforms.uT.value=t;
    satAttitude(sp,vel,t);
    lensW.set(0,0,1.35); sat.localToWorld(lensW);
    var fov=38, near=.02, haze=0;
    if(t<2){ // stage 1: wide orbit shot, dolly onto the satellite with Earth behind it
      var e=Math.pow(sm(.15,2,t),1.15);
      var af=Math.max(1,Math.min(2.2,H/W)), cf=Math.pow(af,.7);
      var wide=P0.set(-.25,.95,3.9).multiplyScalar(af), close=C1.copy(sp).addScaledVector(up,.42*cf).addScaledVector(vel,-.38*cf);
      camera.position.copy(wide).lerp(close,e);
      camLook.set(0,.22,0).lerp(sp,sm(.2,1.8,t)*.9);
      camera.up.set(0,1,0); camera.lookAt(camLook); sat.visible=true;
    } else if(t<3.4){ // stage 2: swoop under the bus and fly straight into the lens aperture
      var q=(t-2)/1.4, k=q*q*(2.2-1.2*q);
      var cf2=Math.pow(Math.max(1,Math.min(2.2,H/W)),.7);
      P0.copy(sp).addScaledVector(up,.42*cf2).addScaledVector(vel,-.38*cf2);
      C1.copy(sp).addScaledVector(up,.12).addScaledVector(vel,-.42);
      C2.copy(lensW).addScaledVector(A,.1).addScaledVector(vel,-.14);
      P3.copy(lensW).addScaledVector(A,.0025);
      bez(P0,C1,C2,P3,k,camera.position);
      camLook.copy(sp).lerp(lensW,sm(0,.5,q));
      camera.up.set(0,1,0); camera.lookAt(camLook); fov=lerp(38,58,sm(.3,1,q));
      near=clamp(camera.position.distanceTo(lensW)*.25,.0004,.02); sat.visible=true;
    } else { // stage 3: looking out through the lens, optical zoom down onto Layyah
      var p=clamp((t-3.4)/1.05,0,1), pe=Math.pow(p,1.1), h=(ORB-1)*Math.pow(.004,pe);
      camera.position.copy(D).multiplyScalar(1+h);
      camera.up.copy(NORTH); camera.lookAt(D); fov=lerp(40,24,sm(0,1,p));
      near=Math.max(h*.2,.00005); haze=sm(.2,.012,h)*.38; sat.visible=false;
      earthG.userData.cl.visible=h>.0125; cloudM.uniforms.uOp.value=sm(.0115,.03,h);
      render3D.h=h;
    }
    if(t<3.4){ earthG.userData.cl.visible=true; cloudM.uniforms.uOp.value=1; render3D.h=ORB-1 }
    var cd=camera.position.length(); atmo.material.uniforms.uA.value=sm(1.3,1.75,cd); atmo.visible=cd>1.3;
    starsA.material.opacity=.85*sm(0,.9,t); starsB.material.opacity=sm(0,.9,t);
    earthM.uniforms.uHaze.value=haze;
    camera.fov=fov; camera.near=near; camera.far=1200; camera.aspect=W/H; camera.updateProjectionMatrix();
    if(sat.visible){ var fc=tmpB.copy(camera.position).sub(lensW).normalize().dot(zb); sat.userData.glint.opacity=.06+.6*Math.pow(Math.max(fc,0),3)*(.85+.15*Math.sin(t*3)) }
    renderer.render(scene,camera);
    if(t<3.4){ var v=lensW.clone().project(camera); screenLens.x=(v.x*.5+.5)*W; screenLens.y=(-v.y*.5+.5)*H;
      screenLens.r=(.455*satS/Math.max(camera.position.distanceTo(lensW),1e-5))/Math.tan(fov*Math.PI/360)*H/2 }
  }

  // lens interior: barrel rings, glass reflections and rotating precision aperture blades
  function drawIris(t){
    ci.clearRect(0,0,W,H);
    if(t<2.8||t>4.05) return;
    var diag=Math.hypot(W,H), cx, cy, Rb, ra, rot, al;
    if(t<3.4){ var k=sm(2.8,3.4,t); cx=screenLens.x; cy=screenLens.y; Rb=Math.min(screenLens.r,diag*1.7); ra=Rb*.84*lerp(.92,0,sm(3.12,3.4,t)); rot=k*1.4; al=sm(.1*diag,.28*diag,Rb); if(al<=0) return }
    else { var o=sm(3.4,3.95,t); cx=W/2; cy=H/2; Rb=diag*(1.16+.5*o); ra=diag*.62*o; rot=1.4+o*1.2; al=1-sm(3.8,4.05,t) }
    ci.save(); ci.globalAlpha=al;
    ci.fillStyle='#000'; ci.beginPath(); ci.rect(0,0,W,H); ci.arc(cx,cy,Rb,0,TAU,true); ci.fill();
    // barrel wall + engraved rings
    var g=ci.createRadialGradient(cx,cy,Rb*.8,cx,cy,Rb); g.addColorStop(0,'#05080b'); g.addColorStop(.7,'#141b21'); g.addColorStop(1,'#020304');
    ci.fillStyle=g; ci.beginPath(); ci.arc(cx,cy,Rb,0,TAU); ci.arc(cx,cy,Rb*.84,0,TAU,true); ci.fill();
    [[.995,'rgba(0,229,255,.9)',2],[.93,'rgba(64,240,200,.35)',1],[.88,'rgba(255,255,255,.12)',1],[.845,'rgba(59,255,158,.7)',1.5]].forEach(function(r){ ci.strokeStyle=r[1]; ci.lineWidth=r[2]; ci.beginPath(); ci.arc(cx,cy,Rb*r[0],0,TAU); ci.stroke() });
    // aperture blades
    var Ri=Rb*.84, N=9;
    ci.save(); ci.beginPath(); ci.arc(cx,cy,Ri,0,TAU); ci.arc(cx,cy,Math.max(ra,.1),0,TAU,true); ci.clip();
    var bg=ci.createRadialGradient(cx-Ri*.2,cy-Ri*.3,0,cx,cy,Ri); bg.addColorStop(0,'#2a333b'); bg.addColorStop(1,'#0a0e12'); ci.fillStyle=bg; ci.fillRect(cx-Ri,cy-Ri,Ri*2,Ri*2);
    for(var i=0;i<N;i++){ var a=rot+i*TAU/N, x=cx+Math.cos(a)*ra, y=cy+Math.sin(a)*ra, tx=-Math.sin(a), ty=Math.cos(a);
      ci.fillStyle=i%2?'rgba(255,255,255,.035)':'rgba(0,0,0,.25)'; ci.beginPath(); ci.moveTo(x,y); ci.lineTo(x+tx*Ri*2.2,y+ty*Ri*2.2); var a2=a+TAU/N, x2=cx+Math.cos(a2)*ra, y2=cy+Math.sin(a2)*ra; ci.lineTo(x2+tx*Ri*2.2,y2+ty*Ri*2.2); ci.lineTo(x2,y2); ci.closePath(); ci.fill();
      ci.strokeStyle='rgba(150,220,255,.55)'; ci.lineWidth=1.2; ci.beginPath(); ci.moveTo(x,y); ci.lineTo(x+tx*Ri*2.2,y+ty*Ri*2.2); ci.stroke() }
    ci.restore();
    if(ra>2){ ci.strokeStyle='rgba(0,229,255,.85)'; ci.lineWidth=2; ci.beginPath(); ci.arc(cx,cy,ra,0,TAU); ci.stroke() }
    // glass reflections across the whole optic
    ci.globalCompositeOperation='screen';
    var gl2=ci.createRadialGradient(cx-Ri*.35,cy-Ri*.4,0,cx-Ri*.35,cy-Ri*.4,Ri*.9); gl2.addColorStop(0,'rgba(120,200,255,.22)'); gl2.addColorStop(1,'rgba(120,200,255,0)');
    ci.fillStyle=gl2; ci.beginPath(); ci.arc(cx,cy,Ri,0,TAU); ci.fill();
    ci.lineCap='round'; ci.strokeStyle='rgba(255,255,255,.55)'; ci.lineWidth=Math.max(2,Ri*.012); ci.beginPath(); ci.arc(cx,cy,Ri*.72,3.6+rot*.2,4.3+rot*.2); ci.stroke();
    ci.strokeStyle='rgba(160,255,220,.35)'; ci.lineWidth=Math.max(1.5,Ri*.006); ci.beginPath(); ci.arc(cx,cy,Ri*.55,.4-rot*.3,1.0-rot*.3); ci.stroke();
    ci.restore(); ci.globalCompositeOperation='source-over';
  }

  // final stage: Sentinel-2 fields with AI-detected murabba / killa boundaries
  var TX=0.737, TY=0.62, MUR=35; // target in image fraction, murabba size in image px (~316 m)
  function drawFields(t){
    var img=fieldsImg(), iw=img.width||img.naturalWidth, ih=img.height||img.naturalHeight;
    if(img===imgF){ iw=imgF.naturalWidth; ih=imgF.naturalHeight }
    var u=clamp((t-4.3)/1.7,0,1), eu=1-Math.pow(1-u,2.2), z=Math.exp(lerp(0,Math.log(5.2),eu));
    var cover=Math.max(W/iw,H/ih), s=cover*z, k=sm(0,.6,u), cxp=lerp(.5,TX,k), cyp=lerp(.5,TY,k);
    var ox=W/2-iw*cxp*s, oy=H/2-ih*cyp*s;
    c2.setTransform(dpr,0,0,dpr,0,0); c2.imageSmoothingEnabled=true; c2.imageSmoothingQuality='high';
    c2.drawImage(img,ox,oy,iw*s,ih*s);
    c2.fillStyle='rgba(0,26,30,.16)'; c2.fillRect(0,0,W,H);
    // murabba grid around the target
    var gx0=TX*iw-4.5*MUR, gy0=TY*ih-3.5*MUR, cols=9, rows=7, sx=function(x){return ox+x*s}, sy=function(y){return oy+y*s};
    var sr=sm(4.55,5.35,t), scanY=lerp(sy(gy0)-20,sy(gy0+rows*MUR)+20,sr);
    if(sr>0){
      c2.save(); c2.beginPath(); c2.rect(0,0,W,scanY); c2.clip();
      var kp=MUR/5*s; // killa sub-grid once it is big enough to read
      if(kp>7){ c2.strokeStyle='rgba(0,229,255,'+(.32*sm(7,14,kp))+')'; c2.lineWidth=1; c2.beginPath();
        for(var i=0;i<=cols*5;i++){ var x=sx(gx0+i*MUR/5); c2.moveTo(x,sy(gy0)); c2.lineTo(x,sy(gy0+rows*MUR)) }
        for(i=0;i<=rows*5;i++){ var y=sy(gy0+i*MUR/5); c2.moveTo(sx(gx0),y); c2.lineTo(sx(gx0+cols*MUR),y) } c2.stroke() }
      c2.beginPath(); for(i=0;i<=cols;i++){ x=sx(gx0+i*MUR); c2.moveTo(x,sy(gy0)); c2.lineTo(x,sy(gy0+rows*MUR)) } for(i=0;i<=rows;i++){ y=sy(gy0+i*MUR); c2.moveTo(sx(gx0),y); c2.lineTo(sx(gx0+cols*MUR),y) }
      c2.strokeStyle='rgba(59,255,158,.22)'; c2.lineWidth=6; c2.stroke(); c2.strokeStyle='rgba(120,255,200,.95)'; c2.lineWidth=1.6; c2.stroke();
      // highlighted parcel
      var hx=sx(gx0+4*MUR), hy=sy(gy0+3*MUR), hs=MUR*s;
      c2.fillStyle='rgba(59,255,158,.16)'; c2.fillRect(hx,hy,hs,hs); c2.strokeStyle='#3BFF9E'; c2.lineWidth=2.6; c2.strokeRect(hx,hy,hs,hs);
      // corner nodes
      var pulse=.6+.4*Math.sin(t*12);
      for(var r=0;r<=rows;r++) for(var c=0;c<=cols;c++){ var nx=sx(gx0+c*MUR), ny=sy(gy0+r*MUR), big=(r===3||r===4)&&(c===4||c===5);
        c2.fillStyle='rgba(0,229,255,'+(.25*pulse)+')'; c2.beginPath(); c2.arc(nx,ny,big?9:5.5,0,TAU); c2.fill();
        c2.fillStyle=big?'#3BFF9E':'#E9FFF8'; c2.beginPath(); c2.arc(nx,ny,big?3.6:2.3,0,TAU); c2.fill() }
      c2.restore();
      // scan beam
      if(sr<1){ var gb=c2.createLinearGradient(0,scanY-40,0,scanY); gb.addColorStop(0,'rgba(0,229,255,0)'); gb.addColorStop(1,'rgba(0,229,255,.28)'); c2.fillStyle=gb; c2.fillRect(0,scanY-40,W,40);
        c2.fillStyle='rgba(150,255,230,.9)'; c2.fillRect(0,scanY-1,W,2) }
      if(sr>.55){ var la=sm(.55,.8,sr); c2.globalAlpha=la; c2.font='700 '+Math.max(11,Math.min(14,W/70))+'px "JetBrains Mono",monospace'; var txt='MURABBA 47 · 25 KILLA · AI LOCK';
        var tw=c2.measureText(txt).width+18; c2.fillStyle='rgba(4,22,24,.78)'; c2.fillRect(hx,hy-30,tw,24); c2.strokeStyle='rgba(59,255,158,.8)'; c2.lineWidth=1; c2.strokeRect(hx+.5,hy-29.5,tw-1,23);
        c2.fillStyle='#3BFF9E'; c2.fillText(txt,hx+9,hy-13); c2.globalAlpha=1 }
    }
    // vignette
    var vg=c2.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.6); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,10,12,.55)'); c2.fillStyle=vg; c2.fillRect(0,0,W,H);
    return z;
  }

  function fmt(n,d){ return n.toFixed(d) }
  function updHud(t,z){
    var a=sm(3.15,3.55,t)*(1-sm(5.2,5.7,t)); hud.style.opacity=a; if(a<=0) return;
    retRot.setAttribute('transform','rotate('+(t*28%360)+')');
    var conv=1-sm(3.4,4.6,t), j=Math.sin(t*37)*.0006*conv;
    hLat.textContent=fmt(LATd+conv*.84+j,4)+'° N'; hLon.textContent=fmt(LONd-conv*1.27-j,4)+'° E';
    var h=t<4.35&&render3D.h?render3D.h:.012/(z||1), km=h*6371;
    hAlt.textContent=km>=1?fmt(km,1)+' km':fmt(km*1000,0)+' m'; hZm.textContent='×'+fmt(t<3.4?1:(.22/h),1);
    var sr=sm(4.55,5.35,t); hBar.style.width=(t<3.55?0:Math.max(sm(3.55,4.5,t)*35,sr*100))+'%';
    hAi.textContent=sr<=0?'AI PARCEL SCAN · '+(t<3.6?'STANDBY':'ARMING'):sr<1?'AI PARCEL SCAN · '+Math.round(sr*100)+'%':'AI PARCELS DETECTED · 63 MURABBA';
    hFix.textContent=t<3.7?'FIX: ACQUIRING…':'FIX: 3D · GNSS L1 + L5 · LOCKED';
  }

  function frame(){
    if(!running) return;
    var t=(performance.now()-t0)/1000;
    if(renderer && t<4.75) render3D(t); else if(!renderer){ /* no WebGL: black until the field stage */ }
    drawIris(renderer?t:Math.max(t,4.1));
    // cloud pierce → fields
    var w=sm(4.05,4.38,t)*(1-sm(4.42,4.85,t)); wash.style.opacity=w;
    var fo=sm(4.3,4.42,t); fx.style.opacity=fo; var z=0;
    if(fo>0){ z=drawFields(t) }
    updHud(t,z);
    // stage 4: dissolve into the site
    var out=sm(5.2,6.0,t); intro.style.opacity=1-out; skipB.style.opacity=1-sm(5.0,5.4,t);
    if(out>.35) document.body.classList.remove('intro-on');
    if(t>=6.0){ finish(); return }
    raf=requestAnimationFrame(frame);
  }
  function size(){
    W=innerWidth; H=innerHeight; dpr=Math.min(2,devicePixelRatio||1);
    [fx,iris].forEach(function(c){ c.width=Math.round(W*dpr); c.height=Math.round(H*dpr) });
    ci.setTransform(dpr,0,0,dpr,0,0); c2.setTransform(dpr,0,0,dpr,0,0);
    if(renderer){ renderer.setPixelRatio(Math.min(devicePixelRatio||1,W<760?2:1.75)); renderer.setSize(W,H,false) }
  }
  function finish(){ running=false; cancelAnimationFrame(raf); intro.classList.add('done'); intro.style.opacity=''; document.body.classList.remove('lock','intro-on');
    ci.clearRect(0,0,W,H) }
  function play(){
    if(!renderer && !noGL){ try{ build() }catch(e){ renderer=null; noGL=true } }
    size(); intro.classList.remove('done'); intro.style.opacity=1; skipB.style.opacity=1; fx.style.opacity=0; wash.style.opacity=0; hud.style.opacity=0;
    camLook=null; lastT=-1; document.body.classList.add('lock','intro-on'); running=true;
    t0=performance.now()-(renderer?0:3900); raf=requestAnimationFrame(frame);
  }
  addEventListener('resize',function(){ if(running) size() });
  skipB.onclick=finish;
  addEventListener('keydown',function(e){ if(running&&e.key==='Escape') finish() });
  $('replay').onclick=function(){ scrollTo(0,0); play() };
  try{ play() }catch(e){ finish() }

})();
