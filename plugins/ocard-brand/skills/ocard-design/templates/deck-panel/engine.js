/* Ocard 白底標準／墨底標準 — viewer, adjust panel and brand-rule engine.
   One file for both grounds; the ground comes from <html data-ground>.
   The panel is built from the slides themselves: which settings a page gets depends on the
   data-* markers it carries (see README「元件標記」), so adding, removing or reordering
   slides never needs a hand-maintained page list. */
(function(){
  var INK=document.documentElement.getAttribute('data-ground')==='ink';
  var ICONS=JSON.parse(document.getElementById('ocard-icons').textContent||'{}');
  var TH=JSON.parse(document.getElementById('ocard-thumbs').textContent||'{}');
  var deck=document.getElementById('deck');
  function q(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function pg(n){return (n<10?'0':'')+n;}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  /* ---------- 1. wrap every <section> in a scaled frame; page numbers come from position ---------- */
  var SECS=q('#deck > section'),seen={};
  SECS.forEach(function(sc,i){
    var id=sc.getAttribute('data-id')||('p'+(i+1));while(seen[id])id+='-'+(i+1);seen[id]=1;sc.setAttribute('data-id',id);
    var it=document.createElement('div');it.className='item';it.setAttribute('data-id',id);
    it.innerHTML='<div class="cap"><span class="now">正在調整</span><b class="pgn">'+pg(i+1)+'</b> <span class="nm"></span></div><div class="frame"><div class="slide"></div></div>';
    it.querySelector('.nm').textContent=sc.getAttribute('data-label')||'';
    deck.insertBefore(it,sc);it.querySelector('.slide').appendChild(sc);
  });
  var ITEMS=q('#deck > .item');
  function PN(sc){var i=SECS.indexOf(sc);return i<0?'':pg(i+1);}
  function SID(el){var sc=el.closest('section[data-id]');return sc?sc.getAttribute('data-id'):'';}
  function numOf(id){for(var i=0;i<SECS.length;i++)if(SECS[i].getAttribute('data-id')===id)return pg(i+1);return '';}
  function nameOf(id){for(var i=0;i<SECS.length;i++)if(SECS[i].getAttribute('data-id')===id)return SECS[i].getAttribute('data-label')||'';return '';}
  document.getElementById('pg-total').textContent=SECS.length;
  var ro=new ResizeObserver(function(es){es.forEach(function(e){e.target.style.setProperty('--k',e.contentRect.width/1280);});});
  q('.frame',deck).forEach(function(f){ro.observe(f);});

  /* ---------- 2. Lucide icons: <i class="icon-name"> becomes inline SVG (no icon font, no network) ---------- */
  function icName(el){var m=/(?:^|\s)icon-([a-z0-9-]+)/.exec(el.getAttribute('class')||'');return m?m[1]:'';}
  function icSvg(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}
  function setIcon(el,n){if(!ICONS[n]||el.getAttribute('data-icnow')===n)return;el.setAttribute('class',(el.getAttribute('class')||'').replace(/(^|\s)icon-[a-z0-9-]+/,'$1icon-'+n));el.innerHTML=icSvg(n);el.setAttribute('data-icnow',n);}
  q('i[class*="icon-"]',deck).forEach(function(el){var n=icName(el);el.setAttribute('data-ic0',n);setIcon(el,n);});

  /* ---------- 3. settings ----------
     V holds only what was changed; everything else is a default. Saving, the edit/finished switch,
     編輯文字 and 下載 come from the shared kit (templates/_shared/ocard-kit.js). */
  var KIT=window.OcardKit,V=KIT.state.v;
  function save(){KIT.state.v=V;KIT.changed();}
  var NEUHEX=INK?'#FFFFFF':'#333333';
  var DEFG={cover:'六角照片',sec:'六角照片',card:'實心淺灰底',emode:'中性 白底灰框',acc:'#FC6815',nf:'編號',ns:'圖磚',nc:NEUHEX,bs:'打勾',bc:'#FC6815',ets:'純文字',etc:'#ADADAD',pn:true,marks:false,photo:'各頁原本的樣式'};
  function G(k){var v=V['g.'+k];return v==null||v===''?DEFG[k]:v;}
  function Pg(id,k,d){var v=V[id+'.'+k];return v==null||v===''?d:v;}

  var HEX={'#fc6815':'橘','#b287fd':'紫','#8b5cf6':'紫','#24c6b7':'青','#1aa89b':'青','#ffea00':'黃','#333333':'墨','#ffffff':'墨','#adadad':'淺灰'};
  function ck(v,d){v=String(v==null?'':v);var hx=HEX[v.toLowerCase()];if(hx)return hx;var ks=['橘','紫','青','黃','墨','白','黑','淺灰'];for(var i=0;i<ks.length;i++)if(v.indexOf(ks[i])>=0)return (ks[i]==='白'||ks[i]==='黑')?'墨':ks[i];return d;}
  var NEU=INK?'#FFFFFF':'#333333';
  var SAT=INK?{'橘':'#FF7A2E','紫':'#CDAEFF','青':'#6ED6CA','黃':'#FFEA00','墨':'#FFFFFF','淺灰':'rgba(255,255,255,.58)'}:{'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B','黃':'#FFEA00','墨':'#333333','淺灰':'#ADADAD'};
  var TXT=INK?{'橘':'#FF7A2E','紫':'#CDAEFF','青':'#6ED6CA','黃':'#FFEA00','墨':'#FFFFFF','淺灰':'rgba(255,255,255,.58)'}:{'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B','黃':'#333333','墨':'#333333','淺灰':'#ADADAD'};
  var LN=INK?TXT:{'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B','黃':'#FFEA00','墨':'#333333','淺灰':'#ADADAD'};
  var TINT=INK?{'橘':'#FF7A2E','紫':'#CDAEFF','青':'#6ED6CA','黃':'#FFEA00','墨':'#FFFFFF','淺灰':'rgba(255,255,255,.14)'}:{'橘':'#FFE8DC','紫':'#EEE5FF','青':'#E7F5F4','黃':'#FFEA00','墨':'#333333','淺灰':'#F2F2F2'};
  var BARC=INK?{'橘':'#FF7A2E','青':'#6ED6CA','紫':'#CDAEFF','黃':'#FFEA00'}:{'橘':'#FC6815','青':'#24C6B7','紫':'#B287FD','黃':'#FFEA00'};
  function ONT(k){if(k==='墨')return INK?'#333333':'#FFFFFF';if(INK&&k==='淺灰')return '#FFFFFF';return '#333333';}
  function TILE(k){if(k==='墨')return [INK?'#1A1A1A':'#333333','#FFEA00'];if(k==='黃')return ['#FFEA00','#333333'];if(k==='淺灰')return [TINT['淺灰'],INK?'#FFFFFF':'#5C5C5C'];return [TINT[k],INK?'#333333':SAT[k]];}
  function snap(el){if(el.__ocs===undefined)el.__ocs=el.getAttribute('style')||'';el.setAttribute('style',el.__ocs);}

  /* which pages carry what — the same rules decide the panel rows and how settings apply */
  function perCardTags(sc){var tags=sc.querySelectorAll('[data-tag]');return tags.length>=2&&!sc.querySelector('[data-emphgroup]')&&!sc.querySelector('[data-sublabel]');}
  function hasSub(sc){return !!sc.querySelector('[data-sublabel]')||sc.querySelectorAll('[data-tag]').length>0;}
  function emphKids(g){return Array.prototype.filter.call(g.children,function(c){return c.getAttribute('data-card')==='plain';});}

  /* which elements each panel row changes, and the box colour: lay(out) · card · num(bers & icons) · tag · bul(lets) · etc */
  function MKT(r){var k=r.gk||r.k,x=k.slice(k.indexOf('.')+1);
    if(k==='g.cover')return ['[data-coverstyle]','lay'];if(k==='g.sec')return ['[data-secstyle]','lay'];
    if(k==='g.photo')return ['[data-photoframe]','lay'];if(x==='photos')return ['image-slot','lay'];
    if(k==='g.card')return ['[data-card="plain"]','card'];
    if(k==='g.emode'||x==='emph')return ['[data-emphgroup]>[data-card="plain"]','card'];
    if(k==='g.acc')return ['[data-emphgroup]>[data-card="plain"],[data-emph="note"]','card'];if(x==='note')return ['[data-emph="note"]','card'];
    if(/^(nf|ns|nc)$/.test(x))return ['[data-metricno],[data-icon="on"]','num'];if(x==='icons')return r.bullet?['[data-bullet]','bul']:['[data-metricno]','num'];
    if(x==='nums')return ['[data-num]','num'];
    if(x==='sub'||x==='tagall'||/^tag\d+$/.test(x))return ['[data-tag],[data-sublabel]','tag'];
    if(k==='g.ets'||k==='g.etc')return ['[data-tagable]','tag'];
    if(k==='g.bs'||k==='g.bc')return ['[data-bullet]','bul'];
    if(/^logo(n|sz|c)$/.test(x))return ['[data-logobox]','lay'];if(x==='gender')return ['[data-icon="gf"],[data-icon="gm"]','etc'];if(x==='cta')return ['[data-ctaicon]','etc'];if(k==='g.pn')return ['[data-pagenum]','etc'];
    return null;}

  /* ---------- 4. apply every setting to the slides (brand logic from the Claude Design template) ---------- */
  function apply(){
    var cvs=String(G('cover')),cvk=cvs.indexOf('長方')>=0?'rect':cvs.indexOf('六角')>=0?'photo':'mark';
    q('[data-coverstyle]',deck).forEach(function(el){snap(el);if(el.getAttribute('data-coverstyle')!==cvk)el.style.display='none';});
    var scs=String(G('sec')),sck=scs.indexOf('黃')>=0?'yellow':scs.indexOf('mark')>=0?'mark':'photo';
    q('[data-secstyle]',deck).forEach(function(el){snap(el);if(el.getAttribute('data-secstyle')!==sck)el.style.display='none';});
    /* 照片呈現: each photo page marks its own layout (data-photomode) and how its pieces move for the other modes (data-pm-*) */
    var PMK={'半版分欄':'half','六角遮罩':'hex','卡片內嵌':'card','不放照片':'none'},pmv=String(G('photo'));
    q('section[data-photomode]',deck).forEach(function(sc){
      var m=PMK[pmv]||sc.getAttribute('data-photomode');if(m==='none'&&sc.hasAttribute('data-pm-nonone'))m=sc.getAttribute('data-photomode');
      q('[data-pm-half],[data-pm-hex],[data-pm-card],[data-pm-none]',sc).forEach(function(el){snap(el);var c=el.getAttribute('data-pm-'+m);if(c)el.style.cssText+=';'+c;});
      q('[data-photoframe] image-slot',sc).forEach(function(sl){
        function at(k,v){if(v==null){if(sl.hasAttribute(k))sl.removeAttribute(k);}else if(sl.getAttribute(k)!==v)sl.setAttribute(k,v);}
        if(m==='hex'){at('mask',sl.getAttribute('data-mask-hex'));at('fit','cover');}
        else{at('mask',null);at('shape','rect');at('radius','16');at('fit',sl.getAttribute('data-fit0')||'cover');}
      });
    });
    var accent=BARC[ck(G('acc'),'橘')]||BARC['橘'];
    var mode=String(G('emode'));
    q('[data-emph="card"]',deck).forEach(function(el){
      snap(el);
      if(mode.indexOf('輔助')>=0){el.style.background=INK?'#3D3D3D':'#F7F7F7';el.style.boxShadow='inset 10px 0 0 '+accent;el.style.paddingLeft='42px';}
    });
    q('[data-emph="note"]',deck).forEach(function(el){
      snap(el);
      var nv=String(Pg(SID(el),'note',el.getAttribute('data-def')||''));
      if(!nv){if(!el.getAttribute('data-accent'))el.style.boxShadow='inset 10px 0 0 '+accent;return;}
      if(nv.indexOf('無')>=0){el.style.boxShadow='none';el.style.paddingLeft='24px';return;}
      el.style.boxShadow='inset 10px 0 0 '+(nv.indexOf('跟隨')>=0?accent:(BARC[ck(nv,'青')]||accent));
    });
    var cs=String(G('card'));
    q('[data-card="plain"]',deck).forEach(function(el){
      snap(el);
      if(cs.indexOf('線框')>=0){el.style.background='transparent';el.style.boxShadow='inset 0 0 0 1px '+(INK?'rgba(255,255,255,.22)':'#E0E0E0');}
      else if(cs.indexOf('分欄')>=0){
        el.style.background='transparent';el.style.boxShadow='none';el.style.padding='4px 0';el.style.borderRadius='0';
        var prev=el.previousElementSibling;
        if(prev&&prev.getAttribute&&prev.getAttribute('data-card')==='plain'){el.style.borderLeft='1px solid '+(INK?'rgba(255,255,255,.16)':'#E8E8E8');el.style.paddingLeft='24px';}
      }
    });

    function tagOn(el,sty,k){
      if(sty==='純文字'){
        if(el.hasAttribute('data-tag')){el.style.background='transparent';el.style.boxShadow='none';el.style.padding='0';el.style.height='auto';}
        el.style.color=TXT[k];return;
      }
      var cs0=getComputedStyle(el),mt=parseFloat(cs0.marginTop)||0,abs=cs0.position==='absolute';
      el.style.display=el.tagName==='SPAN'?'inline-flex':'flex';el.style.alignItems='center';el.style.justifyContent='center';
      var pcs=el.parentElement?getComputedStyle(el.parentElement):null;el.style.alignSelf=(pcs&&pcs.display.indexOf('flex')>=0&&pcs.flexDirection.indexOf('row')===0)?'center':'flex-start';
      el.style.width='fit-content';el.style.height='auto';el.style.padding='5px 12px';el.style.borderRadius='999px';el.style.fontSize='14px';el.style.fontWeight='700';el.style.letterSpacing='0.04em';el.style.lineHeight='1.3';el.style.textTransform='none';
      if(mt>0&&mt<14)el.style.marginTop='14px';
      if(sty==='底色'){el.style.background=TINT[k];el.style.color=ONT(k);el.style.boxShadow='none';}
      else{el.style.background=abs?(INK?'#333333':'#FFFFFF'):'transparent';el.style.color=TXT[k];el.style.boxShadow='inset 0 0 0 1.33px '+LN[k];}
    }
    var pts=String(G('ets'));pts=pts.indexOf('外框')>=0?'外框':pts.indexOf('底色')>=0?'底色':'純文字';
    var ptk=ck(G('etc'),'淺灰');
    q('[data-tagable]',deck).forEach(function(el){snap(el);tagOn(el,pts,ptk);});
    q('[data-sublabel],[data-tag]',deck).forEach(function(el){
      snap(el);
      var sc=el.closest('section'),id=SID(el),v;
      if(el.hasAttribute('data-tag')&&perCardTags(sc)){var i=Array.prototype.indexOf.call(sc.querySelectorAll('[data-tag]'),el);v=String(Pg(id,'tag'+(i+1),Pg(id,'tagall',el.getAttribute('data-def')||'淺灰底')));}
      else v=String(Pg(id,'sub',sc.getAttribute('data-tagdef')||'淺灰底'));
      var sty=v.indexOf('外框')>=0?'外框':v.indexOf('純文字')>=0?'純文字':'底色';
      tagOn(el,sty,v.indexOf('跟隨')>=0?(el.getAttribute('data-ind')||'淺灰'):ck(v,'淺灰'));
    });

    var form=String(G('nf')),nsty=String(G('ns'));
    var nk=ck(G('nc'),'墨'),tl=TILE(nk);
    var nline=nk==='墨'?NEU:LN[nk],ntxt=nk==='墨'?NEU:TXT[nk];
    q('[data-icon]',deck).forEach(function(el){
      snap(el);
      var gk=el.getAttribute('data-icon');
      if(gk==='gf'||gk==='gm'){var gc=String(Pg(SID(el),'gender','預設 中灰'));var GC=gc.indexOf('紫')>=0?{gf:BARC['紫'],gm:BARC['青']}:gc.indexOf('橘')>=0?{gf:BARC['橘'],gm:BARC['青']}:gc.indexOf('墨')>=0?{gf:NEU,gm:NEU}:null;if(GC)el.style.color=GC[gk];return;}
      if(gk!=='on')return;
      var par=el.parentElement,filled=false;
      if(par&&par.offsetWidth<=64){var pb=getComputedStyle(par).backgroundColor;filled=pb&&pb!=='rgba(0, 0, 0, 0)'&&pb!=='transparent';}
      if(filled)return;
      if(nsty.indexOf('無框')>=0){el.style.color=ntxt;return;}
      el.style.display='inline-flex';el.style.alignItems='center';el.style.justifyContent='center';el.style.width='44px';el.style.height='44px';el.style.flex='0 0 auto';el.style.borderRadius='8px';el.style.fontSize='22px';el.style.lineHeight='1';
      if(nsty.indexOf('外框')>=0){el.style.background='transparent';el.style.color=nk==='黃'&&!INK?'#333333':nline;el.style.boxShadow='inset 0 0 0 1.33px '+nline;}
      else{el.style.background=tl[0];el.style.color=tl[1];}
    });
    var bs=String(G('bs')),bk=ck(G('bc'),'橘'),bc=SAT[bk];
    q('[data-bullet]',deck).forEach(function(el){
      var hasIc=!!el.querySelector('[data-b="icon"]'),bsx=(bs.indexOf('圖示')>=0&&!hasIc)?'打勾':bs;
      ['check','dot','num','icon'].forEach(function(t){
        var x=el.querySelector('[data-b="'+t+'"]');if(!x)return;snap(x);
        var on=(t==='check'&&bsx.indexOf('打勾')>=0)||(t==='dot'&&bsx.indexOf('圓點')>=0)||(t==='num'&&bsx.indexOf('編號')>=0)||(t==='icon'&&bsx.indexOf('圖示')>=0);
        x.style.display=on?(t==='check'||t==='icon'?'flex':'block'):'none';
        if(t==='dot')x.style.background=bc;else x.style.color=bc;
      });
    });
    q('[data-ctaicon]',deck).forEach(function(el){snap(el);if(String(Pg(SID(el),'cta','顯示')).indexOf('隱藏')>=0)el.style.display='none';});
    /* the highlighted column stays inside its own column: no negative margins, so nothing moves or sticks out */
    function colEmph(el){el.style.margin='0';el.style.padding='24px';el.style.borderRadius='16px';el.style.borderLeft='none';var nx=el.nextElementSibling;if(nx&&nx.getAttribute&&nx.getAttribute('data-card')==='plain')nx.style.borderLeft='none';}
    q('[data-litecard]',deck).forEach(function(el){el.removeAttribute('data-litecard');});
    q('[data-emphgroup]',deck).forEach(function(g){
      var v=String(Pg(SID(g),'emph',g.getAttribute('data-emphgroup')||'0')),mm=v.match(/(\d)/),idx=mm?+mm[1]-1:-1;if(mode==='無')idx=-1;
      emphKids(g).forEach(function(el,i){
        q('[style]',el).forEach(function(d){if(!d.closest('[data-tag],[data-icon],[data-metricno],[data-sublabel],[data-tagable],[data-bullet],[data-ctaicon]'))snap(d);});
        if(i!==idx)return;
        var padded=parseFloat(getComputedStyle(el).paddingLeft)>=24;
        if(mode.indexOf('輔助')>=0){
          if(cs.indexOf('分欄')>=0){el.style.borderLeft='4px solid '+accent;el.style.paddingLeft='24px';return;}
          if(cs.indexOf('線框')<0)el.style.background=INK?'#3D3D3D':'#F7F7F7';
          el.style.boxShadow='inset 10px 0 0 '+accent+(cs.indexOf('線框')>=0?',inset 0 0 0 1px '+(INK?'rgba(255,255,255,.22)':'#E0E0E0'):'');if(padded)el.style.paddingLeft='42px';return;}
        el.style.borderLeft='none';
        if(!INK){el.style.background='#FFFFFF';el.style.boxShadow='inset 0 0 0 1px #D6D6D6,0 3px 12px rgba(51,51,51,.10)';if(cs.indexOf('分欄')>=0)colEmph(el);return;}
        el.style.background='#F2F2F2';el.style.boxShadow='none';el.style.color='#333333';el.setAttribute('data-litecard','');if(cs.indexOf('分欄')>=0)colEmph(el);
        q('[style]',el).forEach(function(d){
          var c=d.style.color||'';
          if(/255, 255, 255/.test(c)){var a=c.match(/rgba\(255, 255, 255, ([\d.]+)\)/);d.style.color=(a&&+a[1]<.9)?'#5C5C5C':'#333333';}
          var bsh=d.style.boxShadow||'';if(/255, 255, 255/.test(bsh))d.style.boxShadow=bsh.replace(/rgba?\(255, 255, 255(, [\d.]+)?\)/g,'#333333');
          var bt=d.style.borderTopColor||'';if(/255, 255, 255/.test(bt))d.style.borderTopColor='rgba(51,51,51,.16)';
          if(d.style.background&&/255, 255, 255/.test(d.style.backgroundColor||''))d.style.backgroundColor='rgba(51,51,51,.06)';
        });
      });
    });

    var NL0=nline,NT0=ntxt,TL0=tl,LNW={'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B','黃':'#FFEA00','墨':'#333333','淺灰':'#ADADAD'},TXTW={'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B','黃':'#333333','墨':'#333333','淺灰':'#ADADAD'};
    function TILEW(k){return k==='墨'?['#333333','#FFEA00']:k==='黃'?['#FFEA00','#333333']:k==='淺灰'?['#E3E3E3','#5C5C5C']:[{'橘':'#FFE8DC','紫':'#EEE5FF','青':'#E7F5F4'}[k],{'橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B'}[k]];}
    function OSH(r,c){var a=[];for(var i=0;i<16;i++){var t=i*Math.PI/8;a.push((Math.cos(t)*r).toFixed(2)+'px '+(Math.sin(t)*r).toFixed(2)+'px 0 '+c);}return a.join(',');}
    q('[data-metricno]',deck).forEach(function(el){
      snap(el);
      var only=el.getAttribute('data-metricno')==='icon';
      var L=INK&&!!el.closest('[data-litecard]'),nl=L?LNW[nk]:NL0,nt=L?TXTW[nk]:NT0,tt=L?TILEW(nk):TL0;
      var past=el.getAttribute('data-metricno')==='past'; /* 「過去」欄：形式、樣式都跟著這頁，顏色固定淡灰 */
      if(past){nl=INK?'#5C5C5C':'#C9C9C9';nt=INK?'#8A8A8A':'#ADADAD';tt=INK?['#3D3D3D','#8A8A8A']:['#F2F2F2','#ADADAD'];}
      var id=SID(el),pf=String(Pg(id,'nf','')),fm=(pf&&pf.indexOf('跟隨')<0)?pf:form,ps=String(Pg(id,'ns','')),ns=(ps&&ps.indexOf('跟隨')<0)?ps:nsty;
      var mn=el.querySelector('[data-mn]'),mi=el.querySelector('[data-mi]')||el.querySelector('[data-pi]')||(only?el.querySelector('i'):null);
      if(mn)snap(mn);if(mi)snap(mi);
      el.removeAttribute('data-outline');
      var icon=only||(fm.indexOf('圖示')>=0&&!!mi);
      if(icon&&mi){if(mn)mn.style.display='none';mi.style.display='flex';mi.style.alignItems='center';mi.style.justifyContent='center';mi.style.lineHeight='1';mi.style.color='';}
      var stroke=!icon&&fm.indexOf('描邊')>=0,sl=!past&&nk==='黃'&&(!INK||L)?'#333333':nl;
      /* 描邊編號 reads larger than a solid figure (the outline adds weight), so it sets smaller */
      if(stroke){el.style.letterSpacing='0.08em';el.style.fontWeight='600';el.style.fontSize='15px';}
      if(ns.indexOf('外框')>=0){el.style.background='transparent';el.style.boxShadow='inset 0 0 0 1.33px '+nl;if(stroke){el.setAttribute('data-outline','');el.style.textShadow=OSH(1.4,sl);}else el.style.color=sl;}
      else if(ns.indexOf('無框')>=0){el.style.background='transparent';el.style.boxShadow='none';el.style.width='auto';el.style.height='auto';el.style.justifyContent='flex-start';el.style.borderRadius='0';if(stroke){el.setAttribute('data-outline','');el.style.textShadow=OSH(1.6,nl);el.style.fontSize='22px';}else{el.style.color=nt;el.style.fontSize=icon?'26px':'22px';}if(mi)mi.style.fontSize=only?'22px':'26px';}
      else{el.style.background=tt[0];if(stroke){el.style.color=tt[0];el.style.textShadow=OSH(1.4,tt[1]);}else el.style.color=tt[1];}
    });
    if(cs.indexOf('分欄')>=0)q('[data-card="plain"]',deck).forEach(function(el){
      var inE=!!el.closest('[data-emphgroup]');
      q('[style]',el).forEach(function(d){
        if(!inE&&d.__ocs===undefined)snap(d);
        if(d.style.borderTop&&d.style.borderTop.indexOf('solid')>=0)d.style.borderTop='none';
      });
    });
    q('[data-outline]',deck).forEach(function(el){
      var n=el.parentElement,c='';
      while(n&&n!==document.body){var bgc=getComputedStyle(n).backgroundColor;if(bgc&&bgc!=='rgba(0, 0, 0, 0)'&&bgc!=='transparent'){c=bgc;break;}n=n.parentElement;}
      el.style.color=c||'#FFFFFF';
    });
    /* chosen title icons (each [data-mi] has 3 candidates: its own + data-ic-alt) */
    q('i[data-mi],i[data-b="icon"]',deck).forEach(function(el){var id=SID(el),k=icKey(el);setIcon(el,Pg(id,k,el.getAttribute('data-ic0')));});
    /* 重點數字顏色: each big number can take an accent on its own */
    q('[data-num]',deck).forEach(function(el){snap(el);var sc=el.closest('section'),i=Array.prototype.indexOf.call(sc.querySelectorAll('[data-num]'),el),v=Pg(SID(el),'n'+(i+1),'');if(v&&NUMC[v])el.style.color=NUMC[v];});
    q('[data-pagenum]',deck).forEach(function(el){snap(el);var sc=el.closest('section'),p0=PN(sc),sp=el.querySelector('span'),tn=el.lastChild;if(p0&&sp)sp.textContent=p0;if(p0&&tn&&tn.nodeType===3)tn.nodeValue=' / '+pg(SECS.length);if(G('pn')===false)el.style.display='none';});
    /* 信任牆 logo：數量、大小、灰階 */
    q('[data-logos]',deck).forEach(function(g){var id=SID(g),bx=q('[data-logobox]',g),n=+Pg(id,'logon',String(bx.length))||bx.length,pad={'小':22,'中':12,'大':4}[Pg(id,'logosz','中')]||12,gray=Pg(id,'logoc','原色')==='灰階';
      bx.forEach(function(b,i){snap(b);if(i>=n)b.style.display='none';b.style.padding=pad+'px';var sl=b.querySelector('image-slot');if(sl)sl.style.filter=gray?'grayscale(1)':'';});});
    /* 顯示可調整區塊: every panel row of a page boxes the things it changes (MKT), so the boxes always match the panel */
    q('[data-mk]',deck).forEach(function(el){el.removeAttribute('data-mk');});
    if(G('marks'))SECS.forEach(function(sc){var id=sc.getAttribute('data-id');
      Object.keys(ROWS).forEach(function(k){var r=ROWS[k];if(r.pages==='all'||r.pages.indexOf(id)<0)return;var t=MKT(r);if(!t)return;
        q(t[0],sc).concat(sc.matches(t[0])?[sc]:[]).forEach(function(el){
          if(el.tagName==='SECTION')return;if(el.tagName==='IMAGE-SLOT'&&el.parentElement)el=el.parentElement;
          var pa=el.parentElement;if(t[1]==='lay'&&pa&&pa.tagName!=='SECTION'&&getComputedStyle(pa).overflow==='hidden')el=pa; /* a cropped photo: box what shows */
          if(el.style.display==='none'||el.getAttribute('data-mk'))return;el.setAttribute('data-mk',t[1]);});});});
    syncPanel();
  }
  function icKey(el){var sc=el.closest('section');if(el.getAttribute('data-b')==='icon')return 'bi'+(Array.prototype.indexOf.call(sc.querySelectorAll('i[data-b="icon"]'),el)+1);return 'ic'+(Array.prototype.indexOf.call(sc.querySelectorAll('i[data-mi]'),el)+1);}
  var NUMC=INK?{'墨':'#FFFFFF','橘':'#FF7A2E','紫':'#CDAEFF','青':'#6ED6CA'}:{'墨':'#333333','橘':'#FC6815','紫':'#8B5CF6','青':'#1AA89B'};

  /* ---------- 5. the panel schema, read off the slides ---------- */
  function svg(inner,h){return '<svg viewBox="0 0 96 '+(h||54)+'">'+inner+'</svg>';}
  var BARS='<g fill="#ADADAD"><rect x="12" y="18" width="12" height="3" rx="1.5"/><rect x="40" y="18" width="12" height="3" rx="1.5"/><rect x="68" y="18" width="12" height="3" rx="1.5"/></g>';
  function emphPic(n,count){
    var w=Math.min(38,Math.floor((84-(count-1)*4)/count)),gap=4,x0=Math.round((96-(count*w+(count-1)*gap))/2),s='';
    for(var k=0;k<count;k++){var x=x0+k*(w+gap),on=n===k+1;
      if(n===0)s+='<rect x="'+x+'" y="12" width="'+w+'" height="30" rx="4" fill="#F2F2F2"/>';
      else if(on)s+='<rect x="'+(x+.5)+'" y="12.5" width="'+(w-1)+'" height="29" rx="4" fill="#FFFFFF" stroke="#ADADAD"/>';
      else if(k>0&&k!==n)s+='<path d="M'+(x-gap/2)+' 14v26" stroke="#E8E8E8"/>';
      s+='<rect x="'+(x+4)+'" y="18" width="'+Math.min(12,w-8)+'" height="3" rx="1.5" fill="'+(on?'#333333':'#ADADAD')+'"/>';}
    return svg(s);
  }
  var STAR='<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>';
  function numPic(form,sty){
    var bg=sty==='圖磚'?'<rect x="36" y="9" width="24" height="24" rx="5" fill="#333333"/>':sty==='外框'?'<rect x="36.7" y="9.7" width="22.6" height="22.6" rx="5" fill="none" stroke="#333333" stroke-width="1.3"/>':'';
    var fg=sty==='圖磚'?'#FFEA00':'#333333',inner;
    if(form==='圖示')inner='<g transform="translate(40.5 13.5) scale(.62)" fill="none" stroke="'+fg+'" stroke-width="2.4" stroke-linejoin="round">'+STAR+'</g>';
    else inner='<text x="48" y="25.5" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="12" font-weight="700" '+(form==='描邊編號'?'fill="none" stroke="'+fg+'" stroke-width=".8"':'fill="'+fg+'"')+'>01</text>';
    return svg(bg+inner,42);
  }
  function labelPic(kind){var col='#ADADAD';
    if(kind==='純文字')return svg('<rect x="22" y="24" width="52" height="6" rx="3" fill="'+col+'"/>');
    if(kind==='外框')return svg('<rect x="16.7" y="16.7" width="62.6" height="20.6" rx="10.3" fill="none" stroke="'+col+'" stroke-width="1.4"/><rect x="28" y="24" width="40" height="6" rx="3" fill="'+col+'"/>');
    return svg('<rect x="16" y="16" width="64" height="22" rx="11" fill="#F2F2F2"/><rect x="28" y="24" width="40" height="6" rx="3" fill="#5C5C5C"/>');}
  function bulletPic(kind){var c='#FC6815';
    if(kind==='打勾')return svg('<path d="M38 21l5 5 10-11" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',42);
    if(kind==='圓點')return svg('<circle cx="48" cy="21" r="5" fill="'+c+'"/>',42);
    if(kind==='圖示')return svg('<g transform="translate(39 12) scale(.75)" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/></g>',42);
    return svg('<text x="48" y="26" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="14" font-weight="700" fill="'+c+'">1</text>',42);}
  var EMODE_PIC={'無':svg('<rect x="8" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/><rect x="36" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/><rect x="64" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/>'+BARS),'中性 白底灰框':svg('<path d="M34 14v26M62 14v26" stroke="#E8E8E8"/><rect x="36.5" y="12.5" width="23" height="29" rx="4" fill="#FFFFFF" stroke="#ADADAD"/>'+BARS),
    '輔助色側條':svg('<rect x="8" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/><rect x="36" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/><rect x="36" y="12" width="5" height="30" rx="2" fill="#FC6815"/><rect x="64" y="12" width="24" height="30" rx="4" fill="#F2F2F2"/>'+BARS)};
  var TXTL='<g fill="#ADADAD"><rect x="8" y="14" width="30" height="4" rx="2"/><rect x="8" y="23" width="40" height="3" rx="1.5"/><rect x="8" y="30" width="36" height="3" rx="1.5"/></g>';
  var HEXP='M202.35,41.39L143.87,7.63c-17.61-10.17-39.31-10.17-56.93,0L28.46,41.39C10.85,51.56,0,70.35,0,90.69v67.52c0,20.34,10.85,39.13,28.46,49.3l58.48,33.76c17.61,10.17,39.31,10.17,56.93,0l58.48-33.76c17.61-10.17,28.46-28.96,28.46-49.3v-67.52c0-20.34-10.85-39.13-28.46-49.3Z';
  var PHOTO_PIC={'各頁原本的樣式':svg(TXTL+'<rect x="58" y="8" width="14" height="38" rx="3" fill="#E8E8E8"/><path transform="translate(70 6) scale(.17)" d="'+HEXP+'" fill="#E8E8E8"/>'),
    '半版分欄':svg(TXTL+'<rect x="58" y="8" width="30" height="38" rx="4" fill="#E8E8E8"/>'),
    '六角遮罩':svg(TXTL+'<path transform="translate(56 2) scale(.1993)" d="'+HEXP+'" fill="#E8E8E8"/>'),
    '卡片內嵌':svg(TXTL+'<rect x="60" y="14" width="26" height="26" rx="4" fill="#E8E8E8"/>'),
    '不放照片':svg('<g fill="#ADADAD"><rect x="8" y="14" width="30" height="4" rx="2"/><rect x="8" y="23" width="80" height="3" rx="1.5"/><rect x="8" y="30" width="72" height="3" rx="1.5"/><rect x="8" y="37" width="76" height="3" rx="1.5"/></g>')};
  var CN={'#fc6815':'橘','#b287fd':'紫','#24c6b7':'青','#ffea00':'黃','#333333':'墨','#ffffff':'白','#adadad':'淺灰'};
  var SWHEX={'橘':BARC['橘'],'青':BARC['青'],'紫':BARC['紫'],'黃':'#FFEA00'};
  function O(v,pic,d){return {v:v,t:v,pic:pic,d:d};}
  function SW(list){return list.map(function(h){return {v:h,t:CN[h.toLowerCase()]||h,sw:h};});}
  function TAGOPTS(ind){return (ind?['外框 · 跟隨產業色','底色 · 跟隨產業色','純文字 · 跟隨產業色']:[]).concat(['淺灰底','橘色底','紫色底','青色底','黃色底',INK?'白色實心':'墨色實心','外框 · 淺灰','外框 · 橘','外框 · 紫','外框 · 青','外框 · 墨','純文字 · 淺灰','純文字 · 橘','純文字 · 紫','純文字 · 青','純文字 · 墨']).map(function(v){return {v:v,t:v,pill:v};});}
  function pages(sel){return SECS.filter(function(s){return s.matches(sel)||s.querySelector(sel);}).map(function(s){return s.getAttribute('data-id');});}
  function slotName(el){return (el.getAttribute('placeholder')||'照片').split('｜')[0];}

  function schema(){
    var GROUPS=[];
    GROUPS.push({t:'說明',rows:[{k:'g.marks',type:'switch',t:'顯示可調整區塊',d:'用虛線框出這頁面板裡每一項會改到的地方（顏色對應：青＝版面與照片、灰＝卡片、紫＝編號與數字、橘＝標籤、深色＝列點、金＝其他）',pages:'all'}]});
    var per=[];
    SECS.forEach(function(sc){
      var id=sc.getAttribute('data-id'),eg=sc.querySelector('[data-emphgroup]');
      if(eg){var c=emphKids(eg).length,op=[O('0',emphPic(0,c),'')];op[0].t='無';for(var i=1;i<=c;i++){var o=O(String(i),emphPic(i,c));o.t='第 '+i+' 張';op.push(o);}
        per.push({k:id+'.emph',t:'重點卡',pages:[id],def:eg.getAttribute('data-emphgroup')||'0',opts:op,cols:c+1>4?3:c+1,hint:'一頁只標一張重點卡。'});}
      var note=sc.querySelector('[data-emph="note"]');
      if(note)per.push({k:id+'.note',t:'解讀卡側條',pages:[id],def:note.getAttribute('data-def')||'跟隨全局',opts:['橘','青','紫','黃','跟隨全局','無側條'].map(function(v){return SWHEX[v]?{v:v,t:v,sw:SWHEX[v]}:{v:v,t:v==='跟隨全局'?'同重點側條':v};}),sw:true,hint:'「同重點側條」用「重點側條顏色」的設定。側條顏色要和這頁圖表的重點色一致。'});
      if(sc.querySelector('[data-metricno]')){
        per.push({k:id+'.nf',gk:'g.nf',type:'scoped',t:'編號／圖示 · 形式',pages:[id],opts:['編號','描邊編號','圖示'].map(function(v){return O(v,numPic(v,'圖磚'));})});
        per.push({k:id+'.ns',gk:'g.ns',type:'scoped',t:'編號／圖示 · 樣式',pages:[id],opts:['圖磚','外框','無框'].map(function(v){return O(v,numPic('編號',v));})});
      }
      var mis=sc.querySelectorAll('i[data-mi],i[data-b="icon"]');
      if(mis.length){var items=[];Array.prototype.forEach.call(mis,function(el){
          /* the heading next to the number: the host's text without the number itself */
          var box=el.closest('[data-metricno]')||el.closest('[data-bullet]'),host=box?box.parentElement:null,title='';
          if(host){var c=host.cloneNode(true);q('[data-metricno],[data-bullet]',c).forEach(function(x){x.remove();});
            if(el.hasAttribute('data-mi')){ /* the heading next to the number: the first piece of text after it */
              var w=document.createTreeWalker(c,NodeFilter.SHOW_TEXT),t;while((t=w.nextNode())){if(/\S/.test(t.nodeValue)){title=t.nodeValue.trim();break;}}}
            else{title=(c.textContent||'').replace(/\s+/g,' ').trim();}
            title=title.length>22?title.slice(0,21)+'…':title;}
          if(!title)title='第 '+(items.length+1)+' 個';
          items.push([icKey(el),title.slice(0,24),[el.getAttribute('data-ic0')].concat((el.getAttribute('data-ic-alt')||'').split(',').filter(Boolean)).slice(0,3)]);});
        var isB=!sc.querySelector('i[data-mi]');
        per.push({k:id+'.icons',type:'icons',t:isB?'列點圖示':'標題圖示',pages:[id],items:items,bullet:isB,hint:isB?'每個列點有 3 個依意思挑的圖示，第一個是預設；點選後列點自動切成「圖示」（整份套用）。':'每個標題有 3 個依意思挑的圖示，第一個是預設；點選後這一頁自動切成圖示。'});}
      var nums=sc.querySelectorAll('[data-num]');
      if(nums.length)per.push({k:id+'.nums',type:'nums',t:'重點數字顏色',pages:[id],items:Array.prototype.map.call(nums,function(el,i){return ['n'+(i+1),el.textContent.trim()];}),hint:'一頁建議只用一種方式標出重點：「重點卡」或「數字上色」擇一。'});
      var ind=!!sc.querySelector('[data-tag][data-ind]');
      if(perCardTags(sc)){
        if(ind)per.push({k:id+'.tagall',t:'內文標籤 · 整頁一次套用',pages:[id],def:'',opts:TAGOPTS(true),pills:true,hint:'「跟隨產業色」：每個標籤用自己產業的顏色（例：餐飲橘、零售紫、美業青）。選這裡會清掉下面逐張的設定。'});
        Array.prototype.forEach.call(sc.querySelectorAll('[data-tag]'),function(t,i){per.push({k:id+'.tag'+(i+1),t:'內文標籤 · 第 '+(i+1)+' 張（'+t.textContent.trim()+'）',pages:[id],def:t.getAttribute('data-def')||'淺灰底',opts:TAGOPTS(!!t.getAttribute('data-ind')),pills:true,tagOf:id});});}
      else if(hasSub(sc))per.push({k:id+'.sub',t:'內文標籤',pages:[id],def:sc.getAttribute('data-tagdef')||'淺灰底',opts:TAGOPTS(ind),pills:true});
      if(sc.querySelector('[data-icon="gf"],[data-icon="gm"]'))per.push({k:id+'.gender',t:'性別圖示顏色',pages:[id],def:'預設 中灰',opts:['預設 中灰','女紫・男青','女橘・男青','墨色'].map(function(v){return O(v);}),cols:2});
      if(sc.querySelector('[data-ctaicon]'))per.push({k:id+'.cta',t:'聯絡按鈕圖示',pages:[id],def:'顯示',opts:[O('顯示'),O('隱藏')],cols:2});
      if(sc.querySelector('[data-logos]')){var nb=sc.querySelectorAll('[data-logobox]').length,cn=[];for(var j=1;j<=nb;j++)cn.push(O(String(j)));
        per.push({k:id+'.logon',t:'Logo 數量',pages:[id],def:String(nb),opts:cn,cols:4,hint:'沒用到的位置會收起來，剩下的置中排列。'});
        per.push({k:id+'.logosz',t:'Logo 大小',pages:[id],def:'中',opts:['小','中','大'].map(function(v){return O(v);})});
        per.push({k:id+'.logoc',t:'Logo 顏色',pages:[id],def:'原色',opts:['原色','灰階'].map(function(v){return O(v);}),cols:2,hint:'灰階：多家品牌並列時顏色不會搶。個別 logo 的大小與位置，放好後按「照片」的「調整範圍」微調。'});}
      var slots=sc.querySelectorAll('image-slot');
      if(slots.length)per.push({k:id+'.photos',type:'photos',t:'照片',pages:[id],slots:Array.prototype.slice.call(slots)});
    });
    GROUPS.push({t:'這一頁',per:true,rows:per});
    var R=function(k,t,sel,opts,extra){var p=pages(sel);if(!p.length)return null;var r={k:'g.'+k,t:t,pages:p,def:DEFG[k],opts:opts};for(var e in extra)r[e]=extra[e];return r;};
    var g1=[R('cover','封面樣式','[data-coverstyle]',['六角照片','長方照片','灰色 logo mark'].map(function(v,i){return O(v,TH['封面樣式（全局）']&&TH['封面樣式（全局）'][i]);})),
            R('sec','章節頁樣式','[data-secstyle]',['六角照片','灰色 logo mark','品牌黃六角形'].map(function(v,i){return O(v,TH['章節頁樣式（全局）']&&TH['章節頁樣式（全局）'][i]);}))];
    var g2=[R('card','卡片外觀','[data-card="plain"]',['實心淺灰底','線框','無底色 · 細線分欄'].map(function(v,i){return O(v,TH['卡片樣式（全局）']&&TH['卡片樣式（全局）'][i]);})),
            R('emode','重點強調方式','[data-emphgroup]',['無','中性 白底灰框','輔助色側條'].map(function(v){return O(v,EMODE_PIC[v]);}),{hint:'要先在「這一頁」選一張重點卡才看得到效果；選側條時，若這頁還沒選，會自動選第 1 張。'}),
            R('acc','重點側條顏色','[data-emphgroup],[data-emph="note"]',SW(['#FC6815','#24C6B7','#B287FD','#FFEA00']),{sw:true,hint:'輔助色側條的重點卡、解讀卡選「同重點側條」時用這個顏色。橘 → 紫 → 青的順序取用，沒有分類色可跟時才用黃。'})];
    var g3=[R('nf','編號／圖示 · 形式','[data-metricno]',['編號','描邊編號','圖示'].map(function(v){return O(v,numPic(v,'圖磚'));})),
            R('ns','編號／圖示 · 樣式','[data-metricno],[data-icon="on"]',['圖磚','外框','無框'].map(function(v){return O(v,numPic('編號',v));})),
            R('nc','編號／圖示 · 顏色','[data-metricno],[data-icon="on"]',SW([NEUHEX,'#ADADAD','#FC6815','#B287FD','#24C6B7']),{sw:true,hint:'黃色圖磚是品牌規範禁止的用法，所以不提供。'})];
    var g4=[R('bs','列點 · 形狀','[data-bullet]',['打勾','圓點','編號'].concat(pages('[data-b="icon"]').length?['圖示']:[]).map(function(v){return O(v,bulletPic(v));})),
            R('bc','列點 · 顏色','[data-bullet]',SW(['#FC6815','#B287FD','#24C6B7',NEUHEX,'#ADADAD']),{sw:true,hint:'黃色列點是品牌規範禁止的用法，所以不提供。'})];
    var g5=[R('ets','頁面標籤 · 樣式','[data-tagable]',['純文字','外框','底色'].map(function(v){return O(v,labelPic(v));}),{d:'每頁左上角的小標'}),
            R('etc','頁面標籤 · 顏色','[data-tagable]',SW(['#ADADAD','#FC6815','#B287FD','#24C6B7'].concat(INK?['#FFEA00']:[]).concat([NEUHEX])),{sw:true,hint:INK?'':'白底不提供黃色：黃字在白底上看不清楚。'})];
    var gP=[R('photo','照片呈現','section[data-photomode]',['各頁原本的樣式','半版分欄','六角遮罩','卡片內嵌','不放照片'].map(function(v){return O(v,PHOTO_PIC[v]);}),{hint:'整份一致。「各頁原本的樣式」＝每頁維持版型設計時的照片樣式（例：02 宣言是六角遮罩、20 圖文列表是半版分欄）；選其他四種會把這些頁統一成同一種。21 深度個案一定放照片，沒有「不放照片」。'})];
    var g6=[(function(){var p=pages('[data-pagenum]');return p.length?{k:'g.pn',type:'switch',t:'顯示頁碼',d:'每頁右下角的頁碼',pages:p}:null;})()];
    /* 重點卡 and 解讀卡側條 sit with the card settings: 卡片外觀 → 重點強調方式 → 重點卡 → 重點側條顏色 → 解讀卡側條 */
    var EM=per.filter(function(r){return /\.emph$/.test(r.k);}),NO=per.filter(function(r){return /\.note$/.test(r.k);});
    GROUPS[1].rows=per.filter(function(r){return EM.indexOf(r)<0&&NO.indexOf(r)<0;});
    var c2=g2.filter(Boolean),ie=c2.findIndex(function(r){return r.k==='g.emode';});
    if(ie<0){c2=EM.concat(c2);}else{c2.splice.apply(c2,[ie+1,0].concat(EM));}
    var ia=c2.findIndex(function(r){return r.k==='g.acc';});
    if(ia<0)c2=c2.concat(NO);else c2.splice.apply(c2,[ia+1,0].concat(NO));
    g2=c2;
    [['封面與章節',g1],['照片',gP],['卡片',g2],['編號與圖示',g3],['列點',g4],['頁面標籤',g5],['頁面',g6]].forEach(function(x){var rows=x[1].filter(Boolean);if(rows.length)GROUPS.push({t:x[0],rows:rows});});
    return GROUPS;
  }

  /* ---------- 6. build the panel ---------- */
  var GROUPS=schema(),ROWS={},body=document.getElementById('p-body');
  GROUPS.forEach(function(g){g.rows.forEach(function(r){ROWS[r.k]=r;});});
  function val(r){var v=V[r.k];return v==null||v===''?r.def:v;}
  function pillHTML(v){
    var sty=v.indexOf('外框')>=0?'外框':v.indexOf('純文字')>=0?'純文字':'底色',k=ck(v,'淺灰');
    if(v.indexOf('跟隨')>=0)return '<span class="pv">'+['橘','紫','青'].map(function(c){return '<span style="'+(sty==='底色'?'background:'+TINT[c]+';color:'+ONT(c):sty==='外框'?'color:'+TXT[c]+';box-shadow:inset 0 0 0 1.33px '+LN[c]:'color:'+TXT[c]+';padding:0 3px')+';margin:0 1px;padding-inline:5px">產</span>';}).join('')+'</span>';
    var css=sty==='底色'?'background:'+TINT[k]+';color:'+ONT(k):sty==='外框'?'color:'+TXT[k]+';box-shadow:inset 0 0 0 1.33px '+LN[k]:'color:'+TXT[k]+';padding:0';
    return '<span class="pv"><span style="'+css+'">'+(sty==='純文字'?'標籤':'標籤')+'</span></span>';
  }
  var photoRows=[];
  GROUPS.forEach(function(g){
    var gd=document.createElement('div');gd.className='grp';gd.innerHTML='<h3>'+g.t+'</h3>';g.el=gd;
    g.rows.forEach(function(r){
      var row=document.createElement('div');row.className='row';row.id='r-'+r.k.replace(/\./g,'-');r.el=row;
      var where=r.pages==='all'?'':(r.pages.length===1?numOf(r.pages[0])+' '+nameOf(r.pages[0]):'影響 '+r.pages.map(numOf).join(' '));
      var head='<div class="row-h"><b>'+esc(r.t)+'</b><i class="scope"></i><span>'+esc(where)+'</span></div>';
      if(r.type==='switch'){
        row.innerHTML='<div class="sw-row"><div><b>'+r.t+'</b><em>'+r.d+'</em></div><button class="sw" type="button" role="switch" aria-label="'+r.t+'"></button></div>';
        row.querySelector('.sw').onclick=function(){var k=r.k.slice(2);V[r.k]=!G(k);save();apply();};
      }else if(r.type==='icons'){
        var ih=head+'<div class="icl">';
        r.items.forEach(function(it){ih+='<div class="icl-r"><span class="icl-n">'+esc(it[1])+'</span><div class="icl-o" data-ick="'+it[0]+'">';
          it[2].forEach(function(n){ih+='<button type="button" data-v="'+n+'" aria-label="'+n+'" title="'+n+'">'+icSvg(n)+'</button>';});ih+='</div></div>';});
        row.innerHTML=ih+'</div><p class="hint">'+r.hint+'</p>';
        row.querySelectorAll('.icl-o').forEach(function(box){box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=r.pages[0],k=box.getAttribute('data-ick');V[id+'.'+k]=b.getAttribute('data-v');if(k.indexOf('bi')===0)V['g.bs']='圖示';else V[id+'.nf']='圖示';save();apply();});});
      }else if(r.type==='scoped'){
        var sh='<div class="row-h"><b>'+esc(r.t)+'</b><span class="seg" role="group" aria-label="套用範圍"><button type="button" data-sc="one">只改這頁</button><button type="button" data-sc="all">整份套用</button></span></div><div class="opts">';
        r.opts.forEach(function(o){sh+='<button class="opt" type="button" data-v="'+esc(o.v)+'">'+(o.pic||'')+'<b>'+esc(o.t)+'</b></button>';});
        row.innerHTML=sh+'</div><p class="hint scoped-h"></p>';
        row.querySelector('.seg').addEventListener('click',function(e){var b=e.target.closest('[data-sc]');if(!b)return;
          if(b.getAttribute('data-sc')==='all')delete V[r.k];else V[r.k]=String(Pg(r.pages[0],r.k.split('.').pop(),'')||G(r.gk.slice(2)));save();apply();});
        row.querySelector('.opts').addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b)return;
          if(V[r.k]!=null&&V[r.k]!==''&&String(V[r.k]).indexOf('跟隨')<0)V[r.k]=b.getAttribute('data-v');else V[r.gk]=b.getAttribute('data-v');save();apply();});
      }else if(r.type==='nums'){
        var nh=head+'<div class="nl">';
        r.items.forEach(function(it){nh+='<div class="nl-r"><span class="nl-n">'+esc(it[1])+'</span><div class="nl-o" data-nk="'+it[0]+'">';
          ['墨','橘','紫','青'].forEach(function(c){nh+='<button class="opt swo" type="button" data-v="'+c+'"><i style="background:'+NUMC[c]+'"></i><b>'+(c==='墨'&&INK?'白':c)+'</b></button>';});nh+='</div></div>';});
        row.innerHTML=nh+'</div><p class="hint">'+r.hint+'</p><p class="warn">這頁已經用「重點卡」標出重點，數字再上色會和它重複，畫面上會同時出現兩個重點。</p>';
        row.querySelectorAll('.nl-o').forEach(function(box){box.addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b)return;var k=r.pages[0]+'.'+box.getAttribute('data-nk');if(b.getAttribute('data-v')==='墨')delete V[k];else V[k]=b.getAttribute('data-v');save();apply();});});
      }else if(r.type==='photos'){
        var ph=head+'<div class="pp">';
        r.slots.forEach(function(sl,i){ph+='<div class="pp-r" data-i="'+i+'"><span class="pp-n">'+esc(slotName(sl))+'<em></em></span><div class="pp-b"><button class="btn btn-ink" type="button" data-pa="add">選擇照片</button><button class="btn btn-ghost" type="button" data-pa="edit">調整範圍</button><button class="btn btn-ghost" type="button" data-pa="remove">移除</button></div></div>';});
        row.innerHTML=ph+'</div><p class="hint">也可以直接把照片拖進簡報的灰色框。放好後按「調整範圍」或雙擊照片，拖曳移動、縮放。</p>';
        row.querySelectorAll('.pp-r').forEach(function(pr){var sl=r.slots[+pr.getAttribute('data-i')];
          pr.querySelector('[data-pa="add"]').onclick=function(){if(sl.openFilePicker)sl.openFilePicker();};
          pr.querySelector('[data-pa="edit"]').onclick=function(){sl.scrollIntoView({block:'center',behavior:'smooth'});var b=sl.shadowRoot&&sl.shadowRoot.querySelector('[data-act="edit"]');if(b)setTimeout(function(){b.click();},350);};
          pr.querySelector('[data-pa="remove"]').onclick=function(){var b=sl.shadowRoot&&sl.shadowRoot.querySelector('[data-act="remove"]');if(b)b.click();};
        });
        photoRows.push(r);
      }else{
        var cls=r.pills?'pills':r.sw?'sws':(r.cols===4?'four':r.cols===2||r.opts.length===2?'two':'');
        var h=head+(r.d?'<p class="hint" style="margin:-4px 0 10px">'+r.d+'</p>':'')+'<div class="opts '+cls+'">';
        r.opts.forEach(function(o){
          if(o.pill)h+='<button class="opt pl" type="button" data-v="'+esc(o.v)+'">'+pillHTML(o.v)+'<b>'+esc(o.t)+'</b></button>';
          else if(o.sw)h+='<button class="opt swo" type="button" data-v="'+esc(o.v)+'"><i style="background:'+o.sw+'"></i><b>'+esc(o.t)+'</b></button>';
          else if(r.sw)h+='<button class="opt swo" type="button" data-v="'+esc(o.v)+'"><i style="background:transparent;box-shadow:inset 0 0 0 1px #ADADAD"></i><b>'+esc(o.t)+'</b></button>';
          else h+='<button class="opt" type="button" data-v="'+esc(o.v)+'">'+(o.pic||'')+'<b>'+esc(o.t)+'</b>'+(o.d?'<em>'+o.d+'</em>':'')+'</button>';
        });
        row.innerHTML=h+'</div>'+(r.hint?'<p class="hint">'+r.hint+'</p>':'')+(/\.emph$/.test(r.k)?'<p class="warn">這頁的重點數字已經上色，再選重點卡會和它重複，畫面上會同時出現兩個重點。</p>':'');
        row.querySelector('.opts').addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b)return;V[r.k]=b.getAttribute('data-v');
          if(/\.tagall$/.test(r.k))Object.keys(V).forEach(function(k){if(k.indexOf(r.pages[0]+'.tag')===0&&k!==r.k)delete V[k];});
          if(r.k==='g.emode'&&V[r.k].indexOf('輔助')>=0){(curPage?[curPage]:pages('[data-emphgroup]')).forEach(function(id){var er=ROWS[id+'.emph'];if(er&&String(val(er))==='0'){V[er.k]='1';if(!er.el.hidden){er.el.classList.add('flash');setTimeout(function(){er.el.classList.remove('flash');},900);}}});}
          save();apply();});
      }
      gd.appendChild(row);
    });
    body.appendChild(gd);
  });
  function syncPanel(){
    var pr_=ROWS['g.photo'];if(pr_&&pr_.el){var nn_=!!(curPage&&document.querySelector('section[data-id="'+curPage+'"][data-pm-nonone]')),b_=pr_.el.querySelector('.opt[data-v="不放照片"]');if(b_)b_.hidden=nn_;} /* 21 深度個案 always keeps its photos */
    Object.keys(ROWS).forEach(function(k){var r=ROWS[k];if(!r.el)return;
      if(r.type==='switch')r.el.querySelector('.sw').setAttribute('aria-checked',G(k.slice(2))?'true':'false');
      else if(r.type==='icons')r.el.querySelectorAll('.icl-o').forEach(function(box){var cur=Pg(r.pages[0],box.getAttribute('data-ick'),'');var el=null;
          q('i[data-mi]',document.querySelector('section[data-id="'+r.pages[0]+'"]')).forEach(function(x){if(icKey(x)===box.getAttribute('data-ick'))el=x;});
          cur=cur||(el&&el.getAttribute('data-ic0'));box.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===cur?'true':'false');});});
      else if(r.type==='photos'){paintPhotos(r);}
      else if(r.type==='scoped'){var own=V[r.k]!=null&&V[r.k]!==''&&String(V[r.k]).indexOf('跟隨')<0,cur=own?V[r.k]:G(r.gk.slice(2));
        r.el.querySelectorAll('.seg button').forEach(function(b){b.setAttribute('aria-pressed',(b.getAttribute('data-sc')==='one')===own?'true':'false');});
        r.el.querySelectorAll('.opt').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===String(cur)?'true':'false');});
        r.el.querySelector('.scoped-h').textContent=own?'只有這一頁用這個設定；切到「整份套用」就回到整份的設定（'+G(r.gk.slice(2))+'）。':'跟整份簡報一樣；改這裡會改到每一頁（自己設定過的頁除外）。';}
      else if(r.type==='nums'){var id=r.pages[0],any=false;r.el.querySelectorAll('.nl-o').forEach(function(box){var v=Pg(id,box.getAttribute('data-nk'),'墨');if(v!=='墨')any=true;box.querySelectorAll('.opt').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===v?'true':'false');});});
        var er=ROWS[id+'.emph'],emOn=er&&String(val(er))!=='0';r.el.classList.toggle('conflict',any&&emOn);if(er)er.el.classList.toggle('conflict',any&&emOn);}
      else{var v=String(val(r));r.el.querySelectorAll('.opt').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')).toLowerCase()===v.toLowerCase()?'true':'false');});
      }
      r.el.hidden=r._vis===false||!!dimOf(r);
    });
    q('.grp',pageBox).forEach(function(g){g.hidden=!q('.row',g).some(function(x){return !x.hidden;});});
  }
  /* settings that do nothing with the current choices are hidden; they appear as soon as they apply */
  function pageNoteFollows(id){var sc=id&&document.querySelector('section[data-id="'+id+'"]'),n=sc&&sc.querySelector('[data-emph="note"]');return !!n&&String(Pg(id,'note',n.getAttribute('data-def')||'')).indexOf('跟隨')>=0;}
  function dimOf(r){
    var k=r.k,em=String(G('emode')),id=r.pages&&r.pages.length===1?r.pages[0]:curPage;
    if(k==='g.acc'){
      if(!curPage)return em.indexOf('輔助')<0&&!pages('[data-emph="note"]').length;
      if(pageNoteFollows(curPage))return false;               /* the 解讀卡 on this page uses it */
      var g=ROWS[curPage+'.emph'];                            /* a highlighted card on this page uses it in 側條 mode */
      return !(em.indexOf('輔助')>=0&&g&&String(val(g))!=='0');}
    if(/\.emph$/.test(k))return em==='無';
    if(r.type==='icons'&&!r.bullet){var f=Pg(id,'nf','');f=f&&String(f).indexOf('跟隨')<0?f:G('nf');return String(f).indexOf('圖示')<0;}
    if(r.type==='icons'&&r.bullet)return String(G('bs')).indexOf('圖示')<0;
    if(r.type==='photos'){var sc=document.querySelector('section[data-id="'+id+'"]');return !!(sc&&sc.hasAttribute('data-photomode')&&!sc.hasAttribute('data-pm-nonone')&&String(G('photo'))==='不放照片');}
    return false;
  }
  function paintPhotos(r){
    r.el.querySelectorAll('.pp-r').forEach(function(pr){var sl=r.slots[+pr.getAttribute('data-i')],has=sl.hasAttribute('data-filled'),shown=!!(sl.offsetWidth||sl.getClientRects().length);
      var lb=sl.closest('[data-logobox]');pr.hidden=!!(lb&&lb.style.display==='none');
      pr.querySelector('em').textContent=shown?(has?'已放照片':'尚未放照片'):'這個樣式目前沒有顯示';
      pr.querySelector('[data-pa="add"]').textContent=has?'更換照片':'選擇照片';pr.querySelector('[data-pa="add"]').hidden=!shown;
      pr.querySelector('[data-pa="edit"]').hidden=!has||!shown;pr.querySelector('[data-pa="remove"]').hidden=!has;});
  }
  if(window.MutationObserver)new MutationObserver(function(){photoRows.forEach(paintPhotos);}).observe(deck,{subtree:true,attributes:true,attributeFilter:['data-filled']});

  /* reset: only the page being adjusted (its own rows); with no page selected, everything */
  document.getElementById('p-reset').onclick=function(){
    if(curPage){Object.keys(V).forEach(function(k){if(k.indexOf(curPage+'.')===0)delete V[k];});}
    else{Object.keys(V).forEach(function(k){delete V[k];});}
    save();apply();
  };

  /* ---------- 7. panel: one page's settings (the slide in the middle of the screen), or all ---------- */
  var panel=document.getElementById('panel'),adj=document.getElementById('btn-adjust'),scopeEl=document.getElementById('p-scope'),curPage='',showAll=false;
  /* which part of the slide each setting changes: the panel lists one page's settings in slide order, related ones together */
  function clusterOf(r,sec){
    var k=r.k,id=sec.getAttribute('data-id'),loc=k.indexOf(id+'.')===0?k.slice(id.length+1):null,hasCard=!!sec.querySelector('[data-card="plain"]');
    var NUM='[data-metricno],[data-icon="on"]';
    var M={'g.ets':['頁面標籤','[data-tagable]',1],'g.etc':['頁面標籤','[data-tagable]',2],
      'g.cover':['封面','[data-coverstyle]',1],'g.sec':['章節頁','[data-secstyle]',1],
      'g.photo':['照片','[data-photoframe],image-slot',1],
      'g.card':['卡片','[data-card="plain"]',1],'g.emode':['卡片','[data-card="plain"]',2],
      'g.acc':hasCard?['卡片','[data-card="plain"]',4]:['解讀卡','[data-emph="note"]',1],
      'g.nf':['編號與圖示',NUM,1],'g.ns':['編號與圖示',NUM,3],'g.nc':['編號與圖示',NUM,4],
      'g.bs':['列點','[data-bullet]',1],'g.bc':['列點','[data-bullet]',3],
      'g.pn':['頁碼','[data-pagenum]',1]};
    if(M[k])return M[k];
    var L={'emph':['卡片','[data-card="plain"]',3],'note':['解讀卡','[data-emph="note"]',2],
      'nf':['編號與圖示',NUM,1],'ns':['編號與圖示',NUM,3],
      'icons':r.bullet?['列點','[data-bullet]',2]:['編號與圖示',NUM,2],
      'nums':['重點數字','[data-num]',1],'sub':['內文標籤','[data-sublabel],[data-tag]',1],'tagall':['內文標籤','[data-tag]',1],
      'logon':['Logo','[data-logos]',1],'logosz':['Logo','[data-logos]',2],'logoc':['Logo','[data-logos]',3],'gender':['性別圖示','[data-icon="gf"],[data-icon="gm"]',1],'cta':['聯絡按鈕','[data-ctaicon]',1],'photos':sec.querySelector('[data-logos]')?['Logo','[data-logos]',4]:sec.querySelector('[data-coverstyle]')?['封面','[data-coverstyle]',2]:sec.querySelector('[data-secstyle]')?['章節頁','[data-secstyle]',2]:['照片','image-slot',2]};
    if(loc&&L[loc])return L[loc];
    if(loc&&/^tag\d+$/.test(loc))return ['內文標籤','[data-tag]',1+ +loc.slice(3)];
    return ['其他',null,1];
  }
  var pageBox=document.createElement('div');pageBox.id='p-page';
  function filter(n){
    curPage=n||'';panel.classList.toggle('filtered',!!n);
    /* back to the full list: every row returns to its own group */
    GROUPS.forEach(function(g){g.rows.forEach(function(r){g.el.appendChild(r.el);});});
    document.getElementById('p-title').textContent=n?'調整第 '+numOf(n)+' 頁':'調整簡報';
    GROUPS.forEach(function(g){var any=false;
      g.rows.forEach(function(r){
        var show=!n||r.pages==='all'||r.pages.indexOf(n)>=0;r._vis=show;r.el.hidden=!show;if(show&&r.pages!=='all')any=true;
        var sc=r.el.querySelector('.scope');
        if(sc){sc.hidden=!n;var one=r.pages.length===1;sc.textContent=one?'只改這頁':'整份套用';sc.classList.toggle('one',one);}
      });
      if(g.per)g.el.querySelector('h3').textContent='逐頁設定';
      g.el.hidden=!!n?g.t!=='說明':false;
    });
    if(n){
      var sec=SECS.filter(function(x){return x.getAttribute('data-id')===n;})[0],its=[];
      var hasScoped=!!ROWS[n+'.nf'];
      GROUPS.forEach(function(g){if(g.t==='說明')return;g.rows.forEach(function(r){if(hasScoped&&(r.k==='g.nf'||r.k==='g.ns')){r.el.hidden=true;r._vis=false;}if(r._vis){var c=clusterOf(r,sec);its.push({el:r.el,group:c[0],sel:c[1],rank:c[2],quote:['卡片','照片','封面','章節頁','列點','解讀卡','性別圖示','聯絡按鈕'].indexOf(c[0])<0});}});});
      var first=GROUPS[0].el;first.parentNode.insertBefore(pageBox,first.nextSibling);pageBox.hidden=false;
      KIT.orderPanel(pageBox,sec,its);
    }else pageBox.hidden=true;
    syncPanel();
    if(n)scopeEl.innerHTML='目前顯示第 '+numOf(n)+' 頁（其他頁會暫時變淡）能改的項目，往下捲動會自動換成下一頁。標「整份套用」的選項，會一起改到其他用到它的頁面。「恢復預設」只還原這一頁的「只改這頁」項目。 <button type="button" id="p-all">顯示全部選項</button>';
    else scopeEl.innerHTML='';
    var all=document.getElementById('p-all');if(all)all.onclick=function(){showAll=true;filter('');mark('');body.scrollTop=0;};
  }
  function mark(n){deck.classList.toggle('has-editing',!!n);ITEMS.forEach(function(it){it.classList.toggle('editing',it.getAttribute('data-id')===n);});}
  var pin=0;
  function openPanel(n){showAll=false;filter(n);mark(n);body.scrollTop=0;document.body.classList.add('open-panel');adj.setAttribute('aria-expanded','true');
    /* opening the panel narrows the slides; keep the chosen page in view and don't let the reflow switch pages */
    pin=Date.now();var it=ITEMS.filter(function(x){return x.getAttribute('data-id')===n;})[0];if(it)setTimeout(function(){it.scrollIntoView({block:'center'});pin=Date.now();},320);}
  function closePanel(){document.body.classList.remove('open-panel');adj.setAttribute('aria-expanded','false');mark('');}
  function pageInView(){
    var best=ITEMS[0]&&ITEMS[0].getAttribute('data-id'),bd=1e9,mid=window.innerHeight/2;
    ITEMS.forEach(function(it){var r=it.querySelector('.frame').getBoundingClientRect(),d=Math.abs(r.top+r.height/2-mid);if(d<bd){bd=d;best=it.getAttribute('data-id');}});
    return best;
  }
  adj.onclick=function(){document.body.classList.contains('open-panel')?closePanel():openPanel(pageInView());};
  var tick=false;
  window.addEventListener('scroll',function(){
    if(tick||showAll||!document.body.classList.contains('open-panel')||Date.now()-pin<700)return;tick=true;
    requestAnimationFrame(function(){tick=false;var n=pageInView();if(n!==curPage){filter(n);mark(n);}});
  },{passive:true});
  document.getElementById('p-close').onclick=closePanel;
  document.getElementById('scrim').onclick=closePanel;
  /* one way in: the toolbar「調整」opens the page in view (decided 2026-10-06; no per-slide button) */

  /* ---------- 8. presenting ---------- */
  var cur=0;
  function show(i){cur=Math.max(0,Math.min(ITEMS.length-1,i));ITEMS.forEach(function(it,j){it.classList.toggle('cur',j===cur);});}
  function start(){
    closePanel();var top=0;ITEMS.forEach(function(it,j){if(it.getBoundingClientRect().top<window.innerHeight/2)top=j;});
    document.body.classList.add('presenting');show(top);
    try{var p=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }
  function stop(){document.body.classList.remove('presenting');try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}ITEMS[cur].scrollIntoView({block:'center'});}
  document.getElementById('btn-play').onclick=start;
  document.getElementById('p-exit').onclick=stop;
  document.getElementById('p-prev').onclick=function(){show(cur-1);};
  document.getElementById('p-next').onclick=function(){show(cur+1);};
  deck.addEventListener('click',function(e){if(!document.body.classList.contains('presenting'))return;show(e.clientX>window.innerWidth/2?cur+1:cur-1);});
  document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&document.body.classList.contains('presenting'))stop();});
  document.addEventListener('keydown',function(e){
    if(document.body.classList.contains('presenting')){
      if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();show(cur+1);}
      else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(cur-1);}
      else if(e.key==='Escape')stop();
    }else if(e.key==='Escape')closePanel();
  });

  /* ---------- 9. edit mode, 存檔, 編輯文字, 下載 (shared kit) ---------- */
  function slotsLock(lock){q('image-slot',deck).forEach(function(sl){if(lock)sl.setAttribute('readonly','');else sl.removeAttribute('readonly');try{if(sl._render)sl._render();}catch(e){}});}
  slotsLock(true);
  var adjOpen=adj.onclick;
  adj.onclick=function(){if(document.body.classList.contains('open-panel')||KIT.canAdjust())adjOpen();};
  var openPanel0=openPanel;openPanel=function(n){if(KIT.canAdjust())openPanel0(n);};
  document.getElementById('p-save').onclick=function(){KIT.save();};
  KIT.init({
    mount:document.getElementById('okit-mount'),
    sections:function(){return SECS;},
    photos:function(){
      if(!window.__ocardSlots)return Promise.resolve({});
      return window.__ocardSlots().then(function(sl){var out={};Object.keys(sl).forEach(function(k){var v=sl[k];if(k==='__t'||!v)return;
        if(typeof v==='string'){out[k]={u:v,s:1,x:0,y:0};return;}var o=Object.assign({},v);if(o.h)o.u=o.h;delete o.h;delete o.f;if(o.u)out[k]=o;});
        if(Object.keys(out).length)out.__t=Date.now();return out;});
    },
    photosInDesign:false,
    onState:function(st){V=st.v;apply();},
    onMode:function(m){slotsLock(m==='view');if(m==='view'&&document.body.classList.contains('open-panel'))closePanel();}
  });
  apply();
  /* fonts change text metrics, which some rules measure; re-apply once they are in */
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(apply);
  window.ocardDeck={apply:apply,values:function(){return JSON.parse(JSON.stringify(V));},reset:function(){Object.keys(V).forEach(function(k){delete V[k];});save();apply();},schema:function(){return GROUPS.map(function(g){return {group:g.t,rows:g.rows.map(function(r){return {key:r.k,title:r.t,pages:r.pages==='all'?'all':r.pages.map(numOf)};})};});}};
})();
