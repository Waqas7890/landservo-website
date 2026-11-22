/* Land Survo — site helpers: clickjacking guard + live "new update available" from version.json */
(function(){
  "use strict";
  // A meta CSP cannot set frame-ancestors, so refuse to run inside other sites' frames.
  if(window.top!==window.self){ var foreign=true; try{ foreign=window.top.location.origin!==location.origin }catch(e){}
    if(foreign){ document.documentElement.style.display='none'; try{ window.top.location.replace(location.href) }catch(e){} return } }
  function cmp(a,b){ a=String(a).split('.').map(Number); b=String(b).split('.').map(Number);
    for(var i=0;i<Math.max(a.length,b.length);i++){ var d=(a[i]||0)-(b[i]||0); if(d) return d>0?1:-1 } return 0 }
  function $(id){ return document.getElementById(id) }
  // only these hosts may serve the APK (GitHub Releases or this site)
  var SAFE=/^https:\/\/(github\.com\/Waqas7890\/|objects\.githubusercontent\.com\/|landservo\.online\/)/;
  fetch('version.json?ts='+Date.now(),{cache:'no-store',credentials:'omit'}).then(function(r){ return r.ok?r.json():null }).then(function(v){
    if(!v||!/^\d+(\.\d+)*$/.test(v.version||'')) return;
    var ver=v.version, rel=v.released||'', apk=String(v.apk_url||'');
    $('apkMeta').textContent='Android '+(v.min_android||'8.0')+'+ · v'+ver;
    var btn=$('apkBtn');
    if(apk&&SAFE.test(apk)){ btn.href=apk; btn.removeAttribute('aria-disabled'); btn.setAttribute('rel','noopener'); btn.setAttribute('download','') }
    else { btn.href='https://wa.me/923019289330?text='+encodeURIComponent('Assalam o Alaikum, I want the Land Survo APK v'+ver); btn.target='_blank'; btn.rel='noopener noreferrer'; btn.removeAttribute('aria-disabled');
      var en=btn.querySelector('.en'), ur=btn.querySelector('.ur'); if(en) en.textContent='Request APK'; if(ur) ur.textContent='اے پی کے منگوائیں' }
    if(/^[a-f0-9]{64}$/i.test(v.sha256||'')) $('apkSha').textContent='SHA-256: '+v.sha256.toLowerCase();
    var seen=null; try{ seen=localStorage.getItem('ls-seen-ver') }catch(e){}
    var fresh=rel&&(Date.now()-Date.parse(rel))<21*864e5, newer=seen&&cmp(ver,seen)>0;
    if(fresh||newer){
      var u=$('upd'); u.hidden=false;
      [].forEach.call(u.querySelectorAll('.uv'),function(e){ e.textContent=ver });
      $('updV').textContent='Land Survo v'+ver+(rel?' · '+new Date(rel+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'');
      var ur=document.documentElement.lang==='ur', notes=(ur?v.notes_ur:v.notes_en)||v.notes_en||[], ul=$('updN'); ul.textContent='';
      notes.slice(0,4).forEach(function(n){ var li=document.createElement('li'); li.textContent=String(n); ul.appendChild(li) });
      $('updGo').href=apk&&SAFE.test(apk)?apk:'#download';
    }
    try{ localStorage.setItem('ls-seen-ver',ver) }catch(e){}
  }).catch(function(){});
})();
