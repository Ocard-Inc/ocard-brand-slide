/* Ocard deck kit — shared by every Ocard deck template (白底標準、墨底標準、六角幾何拼貼, and every new one).
   It decides where the deck is being opened and gives every template the same 存檔 / 編輯文字 / 下載:

   - inside Claude (a Claude page the viewer can edit, or Claude Design in Edit mode) → edit mode:
     the template's adjust panel, 編輯文字, 存檔. Saved = written into the deck itself (Claude page)
     or into .ocard-deck.state.json next to it (Claude Design).
   - anywhere else (a downloaded HTML, a plain browser) → the finished deck: no panel, nothing editable.
   - 下載 everywhere: PDF (not editable) or PPTX (editable; Keynote opens it too).

   A template uses it like this (see templates/deck-panel/engine.js):
     OcardKit.init({
       mount: element,                 // where the 存檔／編輯文字／下載 controls go
       sections: () => [elements],     // each slide's 1280×720 root, carrying a stable data-id
       photos: () => Promise<{key: photo}>,  // optional: photos to save with the deck
       photosInDesign: true|false,     // false when the template's photo slots save themselves in Claude Design
       onState(state) {...},           // saved state arrived or changed (state.v = the template's settings)
       onMode(mode) {...}              // 'view' | 'artifact' | 'design' | 'dev'
     });
     OcardKit.state.v  — the template's settings (read/write), then OcardKit.changed()
     OcardKit.canAdjust() — call before opening the panel (in Claude Design it asks for Edit mode first)

   The page also needs <script type="application/json" id="ocard-state"> and, for 存檔 on a Claude page,
   <script id="ocard-cap"> that snapshots the untouched document (both written by build.py). */
(function(){
  if(window.OcardKit)return;
  var K=window.OcardKit={},cfg={},stateEl=document.getElementById('ocard-state');
  function q(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function parse(t){try{return JSON.parse(t||'{}')||{};}catch(e){return {};}}
  function norm(s){s=s||{};return {v:s.v||{},text:s.text||{},photos:s.photos||{},t:s.t||0};}
  function clone(o){return JSON.parse(JSON.stringify(o));}
  K.saved=norm(parse(stateEl&&stateEl.textContent));
  K.state=clone(K.saved);
  K.mode='view';
  var FILE=decodeURIComponent(location.pathname.split('/').pop()||'deck'),SIDE='.ocard-deck.state.json';
  var PH=null;try{if(window.parent!==window&&window.parent.omelette&&window.parent.omelette.writeFile)PH=window.parent;}catch(e){}
  var ART=null,DL=null,dirty=false,ui={};

  /* ---------- unsaved work survives a reload (IndexedDB: photos can be large) ---------- */
  var DKEY='ocard-kit-draft:'+location.pathname;
  function idb(){return new Promise(function(res){var t=setTimeout(function(){res(null);},1500);try{var r=indexedDB.open('ocard-kit',1);r.onupgradeneeded=function(){r.result.createObjectStore('d');};r.onsuccess=function(){clearTimeout(t);res(r.result);};r.onerror=function(){clearTimeout(t);res(null);};}catch(e){clearTimeout(t);res(null);}});}
  function draftGet(){return idb().then(function(db){return db?new Promise(function(res){var g=db.transaction('d').objectStore('d').get(DKEY);g.onsuccess=function(){res(g.result||null);};g.onerror=function(){res(null);};}):null;});}
  function draftPut(v){return idb().then(function(db){if(!db)return;var tx=db.transaction('d','readwrite');if(v)tx.objectStore('d').put(v,DKEY);else tx.objectStore('d').delete(DKEY);});}
  var dT=0;
  K.changed=function(){
    dirty=JSON.stringify([K.state.v,K.state.text,K.state.photos])!==JSON.stringify([K.saved.v,K.saved.text,K.saved.photos]);
    clearTimeout(dT);dT=setTimeout(function(){draftPut(dirty?{base:K.saved.t,state:K.state}:null);},300);
    paint();
  };

  /* ---------- text edits (編輯文字) ---------- */
  function sections(){return cfg.sections?cfg.sections():[];}
  function sid(sec){return sec.getAttribute('data-id')||String(sections().indexOf(sec));}
  function path(el,sec){var p=[];while(el&&el!==sec){var par=el.parentElement;p.unshift(Array.prototype.indexOf.call(par.children,el));el=par;}return p.join('.');}
  function at(sec,p){var el=sec;p.split('.').forEach(function(i){el=el&&el.children[+i];});return el;}
  var SKIP='svg,i,style,script,image-slot,[data-pagenum],[data-noedit],.okit';
  function textEls(sec){
    return q('*',sec).filter(function(el){
      if(el.closest(SKIP))return false;
      for(var n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&/\S/.test(n.nodeValue))return true;
      return false;});
  }
  function clean(el){var c=el.cloneNode(true);q('.nbx,.hic,[data-gen]',c).forEach(function(x){x.remove();});q('[contenteditable]',c).forEach(function(x){x.removeAttribute('contenteditable');});c.removeAttribute('contenteditable');return c.innerHTML;}
  function applyText(){
    sections().forEach(function(sec){var id=sid(sec);Object.keys(K.state.text).forEach(function(k){
      var m=k.split('/');if(m[0]!==id)return;var el=at(sec,m[1]);if(!el)return;
      if(el.__okOrig===undefined)el.__okOrig=clean(el);
      if(clean(el)!==K.state.text[k]){var keep=q('.nbx,.hic,[data-gen]',el);el.innerHTML=K.state.text[k];keep.forEach(function(x){el.insertBefore(x,el.firstChild);});}
    });});
  }
  var editing=false;
  function setTextEdit(on){
    editing=on;document.body.classList.toggle('okit-editing',on);if(ui.txt)ui.txt.setAttribute('aria-pressed',on?'true':'false');
    sections().forEach(function(sec){var id=sid(sec);textEls(sec).forEach(function(el){
      if(on){el.setAttribute('contenteditable','true');el.spellcheck=false;
        if(!el.__okBound){el.__okBound=true;el.addEventListener('input',function(){if(el.__okOrig===undefined)el.__okOrig=null;K.state.text[id+'/'+path(el,sec)]=clean(el);K.changed();});
          el.addEventListener('keydown',function(e){if(e.key==='Escape')el.blur();});}}
      else el.removeAttribute('contenteditable');});});
  }

  /* ---------- where are we ---------- */
  function designEditing(){try{return !!PH.document.body.hasAttribute('data-dc-editor-on');}catch(e){return false;}}
  K.canAdjust=function(){if(K.mode==='design'&&!designEditing()){if(ui.tip)ui.tip.hidden=false;return false;}return K.mode!=='view';};
  function setMode(m){
    K.mode=m;document.body.classList.toggle('can-edit',m!=='view');
    if(m!=='view'&&!document.getElementById('okit-gf')){
      /* new characters typed while editing: the embedded fonts only carry the glyphs the deck had */
      var l=document.createElement('link');l.id='okit-gf';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@400;500;700;800;900&display=swap';document.head.appendChild(l);}
    paint();if(cfg.onMode)cfg.onMode(m);
  }
  function resolvePhotos(ph){ /* design sidecar keeps each photo in its own file */
    var ks=Object.keys(ph||{}).filter(function(k){return ph[k]&&ph[k].f&&!ph[k].src&&!ph[k].u;});
    return Promise.all(ks.map(function(k){return fetch(ph[k].f,{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(v){if(v)ph[k]=v;else delete ph[k];}).catch(function(){delete ph[k];});})).then(function(){return ph||{};});
  }
  function start(){
    var p=Promise.resolve();
    if(PH){
      p=fetch(SIDE,{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}).then(function(j){
        var mine=j&&j.files&&j.files[FILE];if(!mine)return;return resolvePhotos(mine.photos||{}).then(function(ph){mine.photos=ph;K.saved=norm(mine);K.state=clone(K.saved);});
      }).then(function(){return 'design';});
      setInterval(function(){var on=designEditing();if(on!==document.body.hasAttribute('data-dc-editor-on'))document.body.toggleAttribute('data-dc-editor-on',on);if(on&&ui.tip)ui.tip.hidden=true;if(!on&&editing)setTextEdit(false);},600);
    }else if(window.claude&&typeof window.claude.use==='function'){
      window.claude.use('downloads').then(function(d){DL=d;}).catch(function(){});
      p=Promise.all([window.claude.use('artifact'),window.claude.use('user')]).then(function(r){
        if(!r[0])return 'view';if(r[1]&&typeof r[1].canEdit==='function'&&!r[1].canEdit())return 'view';ART=r[0];return 'artifact';}).catch(function(){return 'view';});
    }else p=Promise.resolve(location.hash==='#edit'?'dev':'view');
    return p.then(function(m){
      if(m==='view')return m;
      return draftGet().then(function(d){if(d&&d.base===K.saved.t&&d.state){K.state=norm(d.state);}}).then(function(){return m;});
    }).then(function(m){
      applyText();if(cfg.onState)cfg.onState(K.state);setMode(m);K.changed();
    });
  }

  /* ---------- 存檔 ---------- */
  function js(o){return JSON.stringify(o).replace(/<\//g,'<\\/');}
  function buildDoc(state){
    var src=window.__ocardSrc||'',i=src.indexOf('<script id="ocard-cap">'),j=src.indexOf('<\/script>',i);
    if(i<0||j<0)throw new Error('no-source');
    var pre=src.slice(0,j+9).replace(/(<script type="application\/json" id="ocard-state">)[\s\S]*?(<\/script>)/,function(m,a,b){return a+js(state)+b;});
    var after=q('script[data-ocard-after]').map(function(s){return s.outerHTML;}).join('\n');
    return '<!DOCTYPE html>\n'+pre+'\n'+after+'\n</body>\n</html>';
  }
  var busy=false;
  K.save=function(){
    if(busy||K.mode==='view')return;
    if(K.mode==='design'&&!designEditing()){ui.tip.hidden=false;return;}
    busy=true;paint('存檔中…');
    var t=Date.now();
    var done=function(st){K.saved=norm(clone(st));K.state.t=t;dirty=false;draftPut(null);busy=false;paint();};
    var fail=function(m){busy=false;paint(m,true);};
    var photosP=cfg.photos&&!(K.mode==='design'&&cfg.photosInDesign===false)?cfg.photos():Promise.resolve({});
    photosP.then(function(ph){
      var st={v:K.state.v,text:K.state.text,photos:ph||{},t:t};
      if(K.mode==='design'){
        var w=PH.omelette.writeFile,refs={},keys=Object.keys(st.photos);
        var fk=FILE.replace(/[^A-Za-z0-9_-]/g,'_');
        return keys.reduce(function(p,k){var f='.ocard-photo.'+fk+'.'+String(k).replace(/[^A-Za-z0-9_-]/g,'_')+'.json';refs[k]={f:f};
            return p.then(function(){return w(f,JSON.stringify(st.photos[k]));});},Promise.resolve())
          .then(function(){return fetch(SIDE,{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});})
          .then(function(j){j=(j&&typeof j==='object')?j:{};j.files=j.files||{};j.files[FILE]={v:st.v,text:st.text,photos:refs,t:t};return w(SIDE,JSON.stringify(j));})
          .then(function(){done(st);},function(){fail('存檔失敗，請確認已進入 Edit 模式後再按一次');});
      }
      if(K.mode==='artifact'){
        var html=buildDoc(st);
        if(html.length>15.5e6)return fail('照片太大，存不進去：請換小一點的照片或少放幾張');
        return Promise.resolve(ART.publish(html)).then(function(){done(st);},function(e){var c=e&&e.code;
          fail(c==='conflict'?'有人剛存過新版本，頁面已更新，請再調整一次':c==='not_writer'||c==='not_granted'?'你沒有這份簡報的編輯權限，無法存檔':'存檔失敗，請再按一次');});
      }
      /* local check (#edit): no file to write — hand the settings to Claude */
      var txt=JSON.stringify(st);busy=false;
      try{navigator.clipboard.writeText(txt).then(function(){paint('已複製存檔內容，貼給 Claude 就能寫進簡報檔');},function(){console.log(txt);paint('無法複製，存檔內容在主控台',true);});}catch(e){console.log(txt);}
    }).catch(function(){fail('存檔失敗，請再按一次');});
  };

  /* ---------- 下載 ---------- */
  var LIB={h2i:'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js',pdf:'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',pptx:'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'};
  var loaded={};
  function lib(k){if(!loaded[k])loaded[k]=new Promise(function(res,rej){var s=document.createElement('script');s.src=LIB[k];s.onload=res;s.onerror=function(){loaded[k]=null;rej(new Error('lib'));};document.head.appendChild(s);});return loaded[k];}
  function title(){return (document.title||'Ocard 簡報').replace(/[\\/:*?"<>|]/g,' ').trim();}
  function deliver(name,blob){
    if(DL)return Promise.resolve(DL.save({filename:name,data:blob})).catch(function(e){if(e&&e.code==='declined')return;throw e;});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},4000);return Promise.resolve();
  }
  function quiet(on){document.body.classList.toggle('okit-capturing',on);if(on&&editing)setTextEdit(false);}
  var fontCSS=null;
  function fonts(){if(fontCSS!==null)return Promise.resolve(fontCSS);var css='';q('style').forEach(function(s){var m=s.textContent.match(/@font-face\{[^}]*\}/g);if(m)css+=m.join('\n');});fontCSS=css;return Promise.resolve(css);}
  var BLANK='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  /* skip empty <img> (an unfilled photo slot): with no src it would point at the page itself */
  function keep(n){return !(n.tagName==='IMG'&&!n.getAttribute('src'))&&!(n.classList&&n.classList.contains('okit'));}
  function shot(el,opt){return fonts().then(function(fc){return window.htmlToImage.toCanvas(el,Object.assign({pixelRatio:2,cacheBust:false,fontEmbedCSS:fc,imagePlaceholder:BLANK,filter:keep,style:{transform:'none',margin:'0'}},opt||{}));});}
  function seq(list,fn){var out=[];return list.reduce(function(p,x,i){return p.then(function(){return fn(x,i).then(function(r){out.push(r);});});},Promise.resolve()).then(function(){return out;});}
  function toPDF(){
    var secs=sections();
    return lib('h2i').then(function(){return lib('pdf');}).then(function(){
      var doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'px',format:[1920,1080],hotfixes:['px_scaling'],compress:true});
      return seq(secs,function(sec,i){paint('產生 PDF：'+(i+1)+' / '+secs.length);
        return shot(sec,{width:1280,height:720,pixelRatio:2}).then(function(c){if(i)doc.addPage([1920,1080],'landscape');doc.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,1920,1080,undefined,'FAST');});
      }).then(function(){return doc.output('blob');});
    });
  }

  /* PPTX: real text boxes, shapes and pictures, so PowerPoint / Keynote can edit everything */
  function rgba(c){var m=/rgba?\(([^)]+)\)/.exec(c||'');if(!m)return null;var p=m[1].split(',').map(function(x){return parseFloat(x);});var a=p.length>3?p[3]:1;if(!a)return null;
    return {hex:p.slice(0,3).map(function(x){return ('0'+Math.round(x).toString(16)).slice(-2);}).join('').toUpperCase(),tr:Math.round((1-a)*100)};}
  function shadows(s){if(!s||s==='none')return [];var out=[],depth=0,cur='';for(var i=0;i<s.length;i++){var ch=s[i];if(ch==='(')depth++;if(ch===')')depth--;if(ch===','&&!depth){out.push(cur.trim());cur='';}else cur+=ch;}if(cur.trim())out.push(cur.trim());
    return out.map(function(x){var col=(x.match(/rgba?\([^)]*\)|#[0-9a-fA-F]+/)||[''])[0],n=x.replace(col,'').match(/-?[\d.]+px/g)||[];return {color:col,inset:/inset/.test(x),x:parseFloat(n[0]||0),y:parseFloat(n[1]||0),blur:parseFloat(n[2]||0),spread:parseFloat(n[3]||0)};});}
  var CJK=/([⺀-鿿豈-﫿＀-￯　-〿]+)/;
  function toPPTX(){
    var secs=sections();
    return lib('h2i').then(function(){return lib('pptx');}).then(function(){
      /* 1920 × 1080 (20 × 11.25 in at 96 px/in): the 1280 × 720 slide scales up 1.5× — type sizes, lines and gaps too */
      var P=new window.PptxGenJS();P.defineLayout({name:'OCARD_1920',width:20,height:11.25});P.layout='OCARD_1920';P.title=title();
      var SC=1.5,IN=20/1280,PT=.75*SC;
      return seq(secs,function(sec,si){paint('產生 PPTX：'+(si+1)+' / '+secs.length);
        var S=P.addSlide(),r0=sec.getBoundingClientRect(),k=r0.width/1280||1,consumed=new Set(),jobs=[];
        function bx(r,pad){pad=pad||{};return {x:((r.left-r0.left)/k+(pad.l||0))*IN,y:((r.top-r0.top)/k+(pad.t||0))*IN,w:Math.max(1,(r.width/k-(pad.l||0)-(pad.r||0)))*IN,h:Math.max(1,(r.height/k-(pad.t||0)-(pad.b||0)))*IN};}
        var bg=rgba(getComputedStyle(sec).backgroundColor);if(bg)S.background={color:bg.hex};
        function pic(el){var r=el.getBoundingClientRect();if(!r.width||!r.height)return;var b=bx(r);
          /* <img> (logos, QR): draw the picture itself — an SVG <img> cloned on its own comes out blank */
          if(el.tagName==='IMG'){if(!el.getAttribute('src'))return;jobs.push(new Promise(function(res){var im=new Image();im.onload=function(){var sc=4,c=document.createElement('canvas');c.width=Math.max(1,Math.round(r.width/k*sc));c.height=Math.max(1,Math.round(r.height/k*sc));
            c.getContext('2d').drawImage(im,0,0,c.width,c.height);try{S.addImage({data:c.toDataURL('image/png'),x:b.x,y:b.y,w:b.w,h:b.h});}catch(e){}res();};im.onerror=function(){res();};im.src=el.currentSrc||el.src;}));return;}
          jobs.push(shot(el,{pixelRatio:el.tagName==='IMAGE-SLOT'||r.width/k>300?2:4,skipFonts:true}).then(function(c){S.addImage({data:c.toDataURL('image/png'),x:b.x,y:b.y,w:b.w,h:b.h});}).catch(function(){}));}
        function boxShapes(el,cs){
          var r=el.getBoundingClientRect();if(!r.width||!r.height)return;var b=bx(r),rad=parseFloat(cs.borderTopLeftRadius)||0,minS=Math.min(r.width,r.height)/k;
          var shp=rad>0?P.ShapeType.roundRect:P.ShapeType.rect,rr=rad>0?Math.min(.5,rad/minS):0;
          var fill=rgba(cs.backgroundColor),sh=shadows(cs.boxShadow),ring=null,outer=null,bars=[];
          sh.forEach(function(s){var c=rgba(s.color);if(!c)return;if(s.inset&&!s.x&&!s.y&&s.spread>0)ring={c:c,w:s.spread};else if(s.inset&&s.x>0)bars.push({c:c,w:s.x});else if(!s.inset&&(s.blur||s.y))outer={c:c,blur:s.blur,y:s.y};});
          var bl=parseFloat(cs.borderLeftWidth)||0,blc=rgba(cs.borderLeftColor);
          if(fill||ring||outer){var o={x:b.x,y:b.y,w:b.w,h:b.h,fill:fill?{color:fill.hex,transparency:fill.tr}:{type:'none'},line:ring?{color:ring.c.hex,width:ring.w*PT,transparency:ring.c.tr}:{type:'none'}};
            if(rr)o.rectRadius=rr*Math.min(b.w,b.h);if(outer)o.shadow={type:'outer',blur:outer.blur*PT,offset:outer.y*PT,angle:90,color:outer.c.hex,opacity:Math.max(.05,1-outer.c.tr/100)};S.addShape(shp,o);}
          bars.forEach(function(bb){S.addShape(P.ShapeType.rect,{x:b.x,y:b.y,w:bb.w*IN,h:b.h,fill:{color:bb.c.hex},line:{type:'none'}});});
          if(bl&&blc&&cs.borderLeftStyle!=='none')S.addShape(P.ShapeType.rect,{x:b.x,y:b.y,w:bl*IN,h:b.h,fill:{color:blc.hex,transparency:blc.tr},line:{type:'none'}});
          ['Top','Bottom'].forEach(function(sd){var w=parseFloat(cs['border'+sd+'Width'])||0,c=rgba(cs['border'+sd+'Color']);if(w&&c&&cs['border'+sd+'Style']!=='none')S.addShape(P.ShapeType.rect,{x:b.x,y:sd==='Top'?b.y:b.y+b.h-w*IN,w:b.w,h:w*IN,fill:{color:c.hex,transparency:c.tr},line:{type:'none'}});});
          /* the half-height marker highlight */
          if(/gradient/.test(cs.backgroundImage)&&/255, 234, 0/.test(cs.backgroundImage))Array.prototype.forEach.call(el.getClientRects(),function(cr){var bb=bx(cr);S.addShape(P.ShapeType.rect,{x:bb.x,y:bb.y+bb.h*.46,w:bb.w,h:bb.h*.48,fill:{color:'FFEA00'},line:{type:'none'}});});
        }
        function runs(el,out,base){
          for(var n=el.firstChild;n;n=n.nextSibling){
            if(n.nodeType===3){var t=n.nodeValue.replace(/\s+/g,' ');if(!t)continue;var cs=getComputedStyle(el);if(cs.textTransform==='uppercase')t=t.toUpperCase();
              var col=rgba(cs.color)||{hex:'333333',tr:0},o={color:col.hex,bold:(parseInt(cs.fontWeight,10)||400)>=600,fontSize:Math.round(parseFloat(cs.fontSize)*PT*2)/2,charSpacing:(parseFloat(cs.letterSpacing)||0)*PT};
              if(col.tr)o.transparency=col.tr;
              t.split(CJK).forEach(function(seg){if(!seg)return;out.push({text:seg,options:Object.assign({fontFace:CJK.test(seg)?'Noto Sans TC':'Montserrat'},o)});});}
            else if(n.nodeType===1){var c2=getComputedStyle(n);if(c2.display==='none')continue;
              if(n.tagName==='BR'){out.push({text:'',options:{breakLine:true}});continue;}
              if(c2.display==='inline'&&!n.matches(SKIP)){consumed.add(n);boxShapes(n,c2);runs(n,out);}}
          }
          return out;
        }
        function visit(el){
          if(consumed.has(el))return;var cs=getComputedStyle(el);
          if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)===0)return;
          if(el.matches('.okit,[data-noprint]'))return;
          if(el.tagName==='IMAGE-SLOT'||el.tagName==='IMG'||el.tagName==='svg'||el.tagName==='CANVAS'||(cs.clipPath&&cs.clipPath!=='none')){pic(el);return;}
          if(el!==sec)boxShapes(el,cs);
          var has=false;for(var n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&/\S/.test(n.nodeValue)){has=true;break;}
          if(has&&el!==sec){
            var rs=runs(el,[]);while(rs.length&&!rs[0].text.trim()&&!rs[0].options.breakLine)rs.shift();
            if(rs.length){rs[0].text=rs[0].text.replace(/^\s+/,'');var last=rs[rs.length-1];last.text=last.text.replace(/\s+$/,'');
              var pl=parseFloat(cs.paddingLeft)||0,pr=parseFloat(cs.paddingRight)||0,pt=parseFloat(cs.paddingTop)||0,pb=parseFloat(cs.paddingBottom)||0,r=el.getBoundingClientRect(),b=bx(r,{l:pl,r:pr,t:pt,b:pb});
              var lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.4,one=(r.height/k-pt-pb)<lh*1.5,al=cs.textAlign;
              var flexMid=/flex/.test(cs.display)&&cs.alignItems==='center';
              /* one-line text gets room to spare (fonts differ slightly in PowerPoint/Keynote), anchored on its alignment side */
              var extra=one?b.w*.25+.1:b.w*.04,ra=al==='right'||al==='end',x=b.x-(al==='center'?extra/2:ra?extra:0);
              S.addText(rs,{x:x,y:b.y,w:b.w+extra,h:b.h,margin:0,valign:flexMid?'middle':'top',align:al==='center'?'center':ra?'right':'left',lineSpacing:lh*PT,wrap:!one,fit:'none',paraSpaceBefore:0,paraSpaceAfter:0});
            }
          }
          Array.prototype.forEach.call(el.children,visit);
        }
        visit(sec);
        return Promise.all(jobs);
      }).then(function(){return P.write({outputType:'blob'});});
    });
  }
  K.download=function(kind){
    if(busy)return;busy=true;quiet(true);if(ui.menu)ui.menu.hidden=true;
    var name=title()+(kind==='pdf'?'.pdf':'.pptx');
    var p=kind==='pdf'?toPDF():toPPTX();
    p.then(function(blob){paint('準備下載…');return deliver(name,blob);})
     .then(function(){busy=false;quiet(false);paint(kind==='keynote'?'已下載 .pptx：用 Keynote 開啟就能編輯':'已下載');})
     .catch(function(e){busy=false;quiet(false);paint(e&&e.message==='lib'?'下載需要網路，請連上網路後再試':e&&e.code==='unavailable'?'這個畫面無法下載檔案':'下載失敗，請再試一次',true);});
  };

  /* ---------- controls ---------- */
  var CSS='.okit{display:flex;align-items:center;gap:8px;flex-wrap:wrap;position:relative}'+
  '.okit button{font:inherit;font-size:14px;font-weight:700;height:36px;padding:0 14px;border-radius:999px;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--chrome-text,#333333);box-shadow:inset 0 0 0 1px var(--chrome-line-strong,#D6D6D6)}'+
  '.okit button.ink{background:var(--chrome-ink-btn,#333333);color:var(--chrome-ink-btn-text,#FFFFFF);box-shadow:none}'+
  '.okit button[aria-pressed="true"]{background:#FFEA00;color:#333333;box-shadow:none}'+
  '.okit button:focus-visible{outline:1px solid currentColor;box-shadow:0 0 0 3px #FFF8C8}'+
  '.okit svg{width:16px;height:16px;flex:0 0 auto}'+
  '.okit-st:empty{display:none}.okit-st{font-size:13px;color:var(--chrome-muted,#8A8A8A);white-space:nowrap}.okit-st.dirty{color:var(--chrome-text,#333333);font-weight:700}'+
  '.okit-st.dirty::before{content:"";display:inline-block;width:8px;height:8px;border-radius:999px;background:#FC6815;margin-right:6px;vertical-align:1px}.okit-st.bad{color:#FC6815;font-weight:700}'+
  '.okit-menu{position:absolute;right:0;top:44px;z-index:60;width:280px;padding:6px;border-radius:12px;background:var(--chrome-surface,#FFFFFF);box-shadow:0 0 0 1px var(--chrome-line,#E8E8E8),0 12px 32px rgba(26,26,26,.16)}'+
  '.okit-menu button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;height:auto;padding:10px 12px;border-radius:8px;box-shadow:none;text-align:left}'+
  '.okit-menu button:hover{background:var(--chrome-sunken,#FAFAFA)}.okit-menu small{font-weight:400;font-size:12px;color:var(--chrome-text-2,#5C5C5C)}'+
  'body:not(.can-edit) .okit-edit{display:none!important}'+
  '.okit-tip{position:fixed;top:72px;right:16px;z-index:70;width:min(320px,calc(100% - 32px));padding:14px 40px 14px 16px;border-radius:12px;background:var(--chrome-surface,#FFFFFF);color:var(--chrome-text,#333333);font-size:13px;line-height:1.6;box-shadow:0 0 0 1px var(--chrome-line,#E8E8E8),0 8px 24px rgba(26,26,26,.16)}'+
  '.okit-tip b{display:block;font-size:14px;margin-bottom:4px}.okit-tip button{position:absolute;top:8px;right:8px;width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:inherit;font-size:18px;cursor:pointer}'+
  '.okit-editing [contenteditable="true"]{outline:1px dashed rgba(252,104,21,.6);outline-offset:2px;cursor:text}.okit-editing [contenteditable="true"]:focus{outline:2px solid #FC6815}'+
  '.okit-capturing .okit-menu{display:none}'+
  '@media print{.okit,.okit-tip{display:none!important}}';
  var I={save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
    txt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>',
    dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>'};
  function hm(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
  function paint(msg,bad){
    if(!ui.st)return;ui.st.classList.toggle('dirty',!!dirty&&!msg);ui.st.classList.toggle('bad',!!bad);
    ui.st.textContent=msg||(K.mode==='view'?'':dirty?'有未存檔的調整':K.saved.t?'已存檔 · '+hm(K.saved.t):'尚未存檔');
  }
  /* ---------- panel order: one page's settings in the order their parts sit on the slide ----------
     items: [{el: row element, group: '卡片', sel: CSS selector of the part it changes, rank: order inside the group}]
     Groups are placed top-to-bottom, left-to-right by where their part is on the slide; related rows stay together. */
  K.orderPanel=function(host,sec,items){
    var r0=sec.getBoundingClientRect(),k=r0.width/1280||1,G={},order=[];
    items.forEach(function(it){
      var g=G[it.group];if(!g){g=G[it.group]={name:it.group,items:[],top:1e9,left:1e9,ex:[]};order.push(g);}g.items.push(it);
      var els=it.sel?q(it.sel,sec):[],vis=els.filter(function(e){return e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';});
      if(it.quote!==false)(vis.length?vis:els).forEach(function(e){var tx=(e.textContent||'').replace(/\s+/g,' ').trim();tx=tx.length>14?tx.slice(0,13)+'…':tx;if(tx&&g.ex.indexOf(tx)<0&&g.ex.length<3)g.ex.push(tx);});
      (vis.length?vis:els).forEach(function(e){var r=e.getBoundingClientRect(),t=(r.top-r0.top)/k,l=(r.left-r0.left)/k;if(!r.width&&!r.height)return;
        t=Math.max(0,t);l=Math.max(0,l);
        /* a tall picture on the right (bleeding side photo) is read after the text column beside it */
        if(r.height/k>360&&(r.left-r0.left)/k>=560)t=Math.max(t,640);
        if(t<g.top-6||(Math.abs(t-g.top)<=6&&l<g.left)){g.top=t;g.left=l;}});
    });
    order.sort(function(a,b){return (Math.round(a.top/16)-Math.round(b.top/16))||(a.left-b.left);});
    host.innerHTML='';
    /* each group names the part it changes and quotes the page's own text, so it's clear what is being adjusted */
    order.forEach(function(g){var d=document.createElement('div');d.className='grp';d.innerHTML='<h3><span></span><small style="font-weight:400;letter-spacing:0;margin-left:8px;color:inherit;opacity:.8"></small></h3>';d.firstChild.firstChild.textContent=g.name;
      if(g.ex.length)d.firstChild.lastChild.textContent='「'+g.ex.join('、')+'」';
      g.items.sort(function(a,b){return (a.rank||0)-(b.rank||0);}).forEach(function(it){d.appendChild(it.el);});host.appendChild(d);});
  };

  K.init=function(c){
    cfg=c||{};
    var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
    var box=document.createElement('div');box.className='okit';box.setAttribute('data-noprint','');
    box.innerHTML='<span class="okit-st" role="status" aria-live="polite"></span>'+
      '<button type="button" class="okit-edit" data-k="txt" aria-pressed="false" title="直接點簡報上的文字修改">'+I.txt+'<span>編輯文字</span></button>'+
      '<button type="button" class="okit-edit ink" data-k="save">'+I.save+'<span>存檔</span></button>'+
      '<button type="button" data-k="dl" aria-haspopup="true">'+I.dl+'<span>下載</span></button>'+
      '<div class="okit-menu" hidden><button type="button" data-f="pdf"><b>PDF</b><small>不可編輯，適合寄送、列印</small></button>'+
      '<button type="button" data-f="pptx"><b>PowerPoint（.pptx）</b><small>可編輯：文字、色塊、照片都能改</small></button>'+
      '<button type="button" data-f="keynote"><b>Keynote</b><small>可編輯：下載 .pptx，用 Keynote 開啟</small></button></div>';
    (cfg.mount||document.body).appendChild(box);
    ui={st:box.querySelector('.okit-st'),txt:box.querySelector('[data-k=txt]'),menu:box.querySelector('.okit-menu')};
    var tip=document.createElement('div');tip.className='okit-tip';tip.hidden=true;tip.setAttribute('data-noprint','');
    tip.innerHTML='<b>請先進入編輯模式</b>按 Claude Design 上方工具列的「Edit」，再調整或存檔。沒有進入編輯，調整無法存檔。<button type="button" aria-label="關閉">×</button>';
    tip.querySelector('button').onclick=function(){tip.hidden=true;};document.body.appendChild(tip);ui.tip=tip;
    box.querySelector('[data-k=save]').onclick=K.save;
    ui.txt.onclick=function(){if(!K.canAdjust())return;setTextEdit(!editing);};
    box.querySelector('[data-k=dl]').onclick=function(e){e.stopPropagation();ui.menu.hidden=!ui.menu.hidden;};
    ui.menu.addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(b)K.download(b.getAttribute('data-f'));});
    document.addEventListener('click',function(e){if(!box.contains(e.target))ui.menu.hidden=true;});
    applyText();
    K.ready=start();
    return K;
  };
})();
