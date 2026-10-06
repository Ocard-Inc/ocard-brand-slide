/* Ocard charts — one chart engine for every deck template; each template supplies only its look (a theme).
   A chart on a slide is a sized box holding its data:

     <div data-chart style="position:absolute;left:64px;top:220px;width:700px;height:320px">
       <script type="application/json">{"type":"bar","labels":["Q1","Q2","Q3"],"values":[120,160,210],"highlight":2}<\/script>
     </div>

   OcardCharts.render(root, theme) draws every [data-chart] inside root as SVG (redraw any time; e.g. after an
   accent change). Brand rules are built in: a pale base and ONE highlighted item in the accent colour; several
   accent colours only when they mark different categories (donut, stacked bars); no black or yellow bars.
   Types: bar · hbar · stacked · line (area, smooth) · donut · funnel · kpi (number + sparkline) · progress
   (segmented) · heatmap · timeline. See README.md next to this file for every field. */
(function(){
  var C=window.OcardCharts={};
  var NS='http://www.w3.org/2000/svg';
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function fmt(v,spec){if(v==null||isNaN(v))return '';var d=spec.decimals!=null?spec.decimals:(Math.abs(v)<10&&v%1?1:0);var s=Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});return (spec.prefix||'')+s+(spec.unit||'');}
  function niceMax(m){if(m<=0)return 1;var p=Math.pow(10,Math.floor(Math.log10(m))),n=m/p;var st=[1,1.2,1.5,2,2.5,3,4,5,6,8,10];for(var i=0;i<st.length;i++)if(n<=st[i])return st[i]*p;return 10*p;}
  var THEMES={
    white:{font:'"Montserrat","Noto Sans TC",sans-serif',text:'#333333',text2:'#5C5C5C',muted:'#ADADAD',grid:'#E8E8E8',base:'#E8E8E8',
      accent:'#FC6815',accentTint:'#FFE8DC',series:['#FC6815','#B287FD','#24C6B7','#ADADAD'],tints:['#FFE8DC','#EEE5FF','#E7F5F4','#F2F2F2'],
      up:'#1AA89B',down:'#FC6815',done:'#333333',doneMark:'#FFEA00',ring:'#D6D6D6',surface:'#FFFFFF',shape:'round',radius:8,
      acc:{orange:['#FC6815','#FFE8DC'],teal:['#24C6B7','#E7F5F4'],purple:['#B287FD','#EEE5FF']},tintBase:true,
      size:{axis:14,label:15,value:18,big:42,title:20}},
    ink:{font:'"Montserrat","Noto Sans TC",sans-serif',text:'#FFFFFF',text2:'rgba(255,255,255,.72)',muted:'rgba(255,255,255,.58)',grid:'rgba(255,255,255,.16)',base:'rgba(255,255,255,.16)',
      accent:'#FF7A2E',accentTint:'rgba(255,122,46,.28)',series:['#FF7A2E','#CDAEFF','#6ED6CA','rgba(255,255,255,.38)'],tints:['rgba(255,122,46,.28)','rgba(205,174,255,.28)','rgba(110,214,202,.28)','rgba(255,255,255,.12)'],
      up:'#6ED6CA',down:'#FF7A2E',done:'#FFFFFF',doneMark:'#333333',ring:'rgba(255,255,255,.38)',surface:'#333333',shape:'round',radius:8,
      acc:{orange:['#FF7A2E','rgba(255,122,46,.28)'],teal:['#6ED6CA','rgba(110,214,202,.28)'],purple:['#CDAEFF','rgba(205,174,255,.28)']},tintBase:false,
      size:{axis:14,label:15,value:18,big:42,title:20}},
    hexgeo:{font:'"Montserrat","Noto Sans TC",sans-serif',text:'#333333',text2:'#5C5C5C',muted:'#ADADAD',grid:'#E8E8E8',base:'#E8E8E8',
      accent:'#FC6815',accentTint:'#FFE8DC',series:['#FC6815','#B287FD','#24C6B7','#ADADAD'],tints:['#FFE8DC','#EEE5FF','#E7F5F4','#F2F2F2'],
      up:'#1AA89B',down:'#FC6815',done:'#333333',doneMark:'#FFEA00',ring:'#D6D6D6',surface:'#FAFAFA',shape:'hex',radius:0,
      acc:{orange:['#FC6815','#FFE8DC'],teal:['#24C6B7','#E7F5F4'],purple:['#B287FD','#EEE5FF']},tintBase:true,
      size:{axis:14,label:15,value:22,big:56,title:22}}
  };
  C.themes=THEMES;

  /* ---------- shapes: the template's look lives here (rounded bars vs. the Ocard hexagon) ---------- */
  function bar(x,y,w,h,fill,T,horizontal,ends){ /* ends: 'both' (capsule, centred bars) or default = one pointed end (the bar's tip) */
    if(h<=0||w<=0)return '';
    if(T.shape==='hex'){ /* hexagon tip: the bar ends in the Ocard hex point; the base stays flat */
      var p,c;
      if(!horizontal){c=Math.min(w*.29,h*(ends==='both'?.5:1));p=ends==='both'?[[x+w/2,y],[x+w,y+c],[x+w,y+h-c],[x+w/2,y+h],[x,y+h-c],[x,y+c]]:[[x+w/2,y],[x+w,y+c],[x+w,y+h],[x,y+h],[x,y+c]];}
      else{c=Math.min(h*.29,w*(ends==='both'?.5:1));p=ends==='both'?[[x,y+h/2],[x+c,y],[x+w-c,y],[x+w,y+h/2],[x+w-c,y+h],[x+c,y+h]]:[[x,y],[x+w-c,y],[x+w,y+h/2],[x+w-c,y+h],[x,y+h]];}
      if(ends==='flat')return '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" fill="'+fill+'"/>';
      return '<path d="M'+p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join('L')+'Z" fill="'+fill+'" stroke="'+fill+'" stroke-width="'+Math.min(3,Math.min(w,h)*.05).toFixed(1)+'" stroke-linejoin="round"/>';
    }
    var rr=Math.min(T.radius,w/2,h/2);
    if(ends==='flat')rr=0;
    return '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="'+rr+'" fill="'+fill+'"/>';
  }
  function dot(cx,cy,r,fill,T,stroke){
    if(T.shape==='hex'){var p=[];for(var i=0;i<6;i++){var a=Math.PI/3*i-Math.PI/2;p.push((cx+r*1.12*Math.cos(a)).toFixed(1)+','+(cy+r*1.12*Math.sin(a)).toFixed(1));}
      return '<path d="M'+p.join('L')+'Z" fill="'+fill+'" stroke="'+(stroke||fill)+'" stroke-width="'+(stroke?2:r*.3).toFixed(1)+'" stroke-linejoin="round"/>';}
    return '<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+r+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="2"':'')+'/>';
  }
  function text(x,y,s,o){o=o||{};return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" font-size="'+o.size+'" font-weight="'+(o.weight||400)+'" fill="'+o.fill+'" text-anchor="'+(o.anchor||'start')+'"'+(o.ls?' letter-spacing="'+o.ls+'"':'')+(o.base?' dominant-baseline="'+o.base+'"':'')+'>'+esc(s)+'</text>';}
  function curve(pts,smooth){
    if(!smooth||pts.length<3)return 'M'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join('L');
    var d='M'+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
    for(var i=0;i<pts.length-1;i++){var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2,t=.18;
      d+='C'+(p1[0]+(p2[0]-p0[0])*t).toFixed(1)+','+(p1[1]+(p2[1]-p0[1])*t).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])*t).toFixed(1)+','+(p2[1]-(p3[1]-p1[1])*t).toFixed(1)+' '+p2[0].toFixed(1)+','+p2[1].toFixed(1);}
    return d;
  }
  var uid=0;

  /* ---------- the chart types ---------- */
  var R={};
  R.bar=function(W,H,s,T){ /* vertical bars: pale base, one highlighted */
    var v=s.values||[],n=v.length,max=s.max||niceMax(Math.max.apply(null,v)),lab=T.size.axis,top=T.size.value+14,bottom=lab+16,ch=H-top-bottom,gap=s.gap!=null?s.gap:(T.shape==='hex'?.42:.34),bw=W/n*(1-gap),o='';
    v.forEach(function(x,i){var h=Math.max(2,ch*x/max),cx=W/n*(i+.5),hi=i===s.highlight;
      o+=bar(cx-bw/2,top+ch-h,bw,h,hi?T.accent:(s.baseColor||T.base),T);
      if(s.valueLabels!==false)o+=text(cx,top+ch-h-10,fmt(x,s),{size:hi?T.size.value:T.size.axis,weight:hi?700:400,fill:hi?T.text:T.text2,anchor:'middle'});
      o+=text(cx,H-4,(s.labels||[])[i],{size:lab,weight:hi?700:400,fill:hi?T.text:T.muted,anchor:'middle'});});
    return o;
  };
  R.hbar=function(W,H,s,T){ /* horizontal bars with labels on the left */
    var v=s.values||[],n=v.length,max=s.max||niceMax(Math.max.apply(null,v)),lw=s.labelWidth||Math.min(220,W*.3),vw=80,bw=W-lw-vw,rowH=H/n,bh=rowH*(T.shape==='hex'?.5:.56),o='';
    v.forEach(function(x,i){var cy=rowH*(i+.5),w=Math.max(2,bw*x/max),hi=i===s.highlight;
      o+=text(0,cy,(s.labels||[])[i],{size:T.size.label,weight:hi?700:400,fill:hi?T.text:T.text2,base:'middle'});
      o+=bar(lw,cy-bh/2,w,bh,hi?T.accent:(s.baseColor||T.base),T,true,'both');
      o+=text(lw+w+12,cy,fmt(x,s),{size:hi?T.size.value:T.size.axis,weight:hi?700:400,fill:hi?T.text:T.text2,base:'middle'});});
    return o;
  };
  R.stacked=function(W,H,s,T){ /* categories share the bar; colours carry the categories (legend on top) */
    var se=s.series||[],n=(s.labels||[]).length,tot=[],o='',legH=T.size.label+20,lab=T.size.axis,bottom=lab+16,ch=H-legH-bottom-24;
    for(var i=0;i<n;i++)tot[i]=se.reduce(function(a,x){return a+(x.values[i]||0);},0);
    var max=s.max||niceMax(Math.max.apply(null,tot)),bw=W/n*.5,lx=0;
    se.forEach(function(x,k){o+=dot(lx+6,legH/2-4,6,T.series[k%T.series.length],T);o+=text(lx+18,legH/2-4,x.name,{size:T.size.label,fill:T.text2,base:'middle'});lx+=32+x.name.length*T.size.label*1.05;});
    for(i=0;i<n;i++){var cx=W/n*(i+.5),y=legH+24+ch;
      se.forEach(function(x,k){var h=ch*(x.values[i]||0)/max;y-=h;o+=bar(cx-bw/2,y,bw,h-(k<se.length-1?2:0),T.series[k%T.series.length],T,false,k===se.length-1?null:'flat');});
      o+=text(cx,y-8,fmt(tot[i],s),{size:T.size.axis,weight:700,fill:T.text,anchor:'middle'});
      o+=text(cx,H-4,s.labels[i],{size:lab,fill:T.muted,anchor:'middle'});}
    return o;
  };
  R.line=function(W,H,s,T){ /* trend: one accent line (+ optional grey comparison), soft area, dot on the last point */
    var v=s.values||[],n=v.length,cmp=s.compare||null,all=v.concat(cmp?cmp.values:[]),max=s.max||niceMax(Math.max.apply(null,all)),min=s.min!=null?s.min:0,lab=T.size.axis,top=12,bottom=s.labels?lab+18:8,ch=H-top-bottom,o='',id='ocg'+(++uid);
    function P(vals){return vals.map(function(x,i){return [n>1?W*i/(n-1):W/2,top+ch-(x-min)/(max-min)*ch];});}
    if(s.grid!==false)for(var g=0;g<=3;g++){var gy=top+ch*g/3;o+='<line x1="0" x2="'+W+'" y1="'+gy.toFixed(1)+'" y2="'+gy.toFixed(1)+'" stroke="'+T.grid+'" stroke-width="1"/>';}
    if(cmp)o+='<path d="'+curve(P(cmp.values),s.smooth)+'" fill="none" stroke="'+T.muted+'" stroke-width="2" stroke-dasharray="6 6"/>';
    var pts=P(v),d=curve(pts,s.smooth);
    if(s.area!==false){o+='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+T.accent+'" stop-opacity=".22"/><stop offset="1" stop-color="'+T.accent+'" stop-opacity="0"/></linearGradient></defs>';
      o+='<path d="'+d+'L'+pts[n-1][0].toFixed(1)+','+(top+ch)+'L'+pts[0][0].toFixed(1)+','+(top+ch)+'Z" fill="url(#'+id+')"/>';}
    o+='<path d="'+d+'" fill="none" stroke="'+T.accent+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    var hi=s.highlight!=null?s.highlight:n-1;o+=dot(pts[hi][0],pts[hi][1],6,T.accent,T,T.surface);
    if(s.valueLabels!==false)o+=text(Math.min(W-4,Math.max(4,pts[hi][0])),pts[hi][1]-16,fmt(v[hi],s),{size:T.size.value,weight:700,fill:T.text,anchor:hi===n-1?'end':hi===0?'start':'middle'});
    if(s.labels)s.labels.forEach(function(l,i){if(n>8&&i%Math.ceil(n/8)&&i!==n-1)return;o+=text(pts[i][0],H-4,l,{size:lab,fill:i===hi?T.text:T.muted,weight:i===hi?700:400,anchor:i===0?'start':i===n-1?'end':'middle'});});
    return o;
  };
  R.donut=function(W,H,s,T){ /* share of a whole: categories in the accent order, centre total */
    var v=s.values||[],tot=v.reduce(function(a,b){return a+b;},0),r=Math.min(H/2,W*.28),cx=r,cy=H/2,th=r*.26,o='',a0=-Math.PI/2;
    v.forEach(function(x,i){var a1=a0+2*Math.PI*x/tot,col=T.series[Math.min(i,T.series.length-1)],lg=a1-a0>Math.PI?1:0,ri=r-th,gapA=v.length>1?.012:0;
      var A=a0+gapA,B=a1-gapA,p=function(rad,a){return (cx+rad*Math.cos(a)).toFixed(1)+','+(cy+rad*Math.sin(a)).toFixed(1);};
      o+='<path d="M'+p(r,A)+'A'+r+','+r+' 0 '+lg+' 1 '+p(r,B)+'L'+p(ri,B)+'A'+ri+','+ri+' 0 '+lg+' 0 '+p(ri,A)+'Z" fill="'+col+'"/>';a0=a1;});
    o+=text(cx,cy-4,s.center!=null?s.center:fmt(tot,s),{size:T.size.big*.8,weight:800,fill:T.text,anchor:'middle',base:'middle'});
    if(s.centerLabel)o+=text(cx,cy+T.size.big*.5,s.centerLabel,{size:T.size.axis,fill:T.text2,anchor:'middle'});
    var lx=2*r+48,rowH=Math.min(56,H/v.length),ly=H/2-rowH*v.length/2+rowH/2;
    v.forEach(function(x,i){var y=ly+rowH*i;o+=dot(lx+7,y,7,T.series[Math.min(i,T.series.length-1)],T);
      o+=text(lx+26,y,(s.labels||[])[i],{size:T.size.label,fill:T.text2,base:'middle'});
      o+=text(W,y,Math.round(x/tot*100)+'%',{size:T.size.value,weight:700,fill:T.text,anchor:'end',base:'middle'});});
    return o;
  };
  R.funnel=function(W,H,s,T){ /* steps narrowing; conversion to the next step on the right */
    var v=s.values||[],n=v.length,max=v[0]||1,lw=s.labelWidth||Math.min(200,W*.26),rw=120,bw=W-lw-rw,rowH=H/n,bh=rowH*.7,o='';
    v.forEach(function(x,i){var w=Math.max(bh,bw*x/max),cy=rowH*(i+.5),hi=i===s.highlight;
      o+=text(0,cy,(s.labels||[])[i],{size:T.size.label,weight:hi?700:400,fill:hi?T.text:T.text2,base:'middle'});
      o+=bar(lw+(bw-w)/2,cy-bh/2,w,bh,hi?T.accent:T.base,T,true,'both');
      o+=text(lw+bw/2,cy,fmt(x,s),{size:T.size.value,weight:700,fill:hi?(T.shape==='hex'||T.text==='#FFFFFF'?'#333333':'#FFFFFF'):T.text,anchor:'middle',base:'middle'});
      if(i>0)o+=text(W,cy,Math.round(x/v[i-1]*100)+'%',{size:T.size.label,weight:700,fill:hi?T.accent:T.text2,anchor:'end',base:'middle'});});
    return o;
  };
  R.kpi=function(W,H,s,T){ /* a number, its change, and the trend under it */
    var big=s.size||T.size.big,o='',up=(s.delta||0)>=0,dc=s.deltaGood===false?(up?T.down:T.up):(up?T.up:T.down),arrow=up?'↗':'↘';
    o+=text(0,big*.85,s.value,{size:big,weight:800,fill:T.text,ls:'-0.02em'});
    if(s.delta!=null)o+=text(0,big*.85+30,arrow+' '+Math.abs(s.delta)+'%'+(s.deltaLabel?'  '+s.deltaLabel:''),{size:T.size.label,weight:700,fill:dc});
    if(s.label)o+=text(0,big*.85+(s.delta!=null?56:30),s.label,{size:T.size.label,fill:T.text2});
    var top=big*.85+(s.delta!=null?78:52),h=H-top;if(h>30&&s.trend)o+='<g transform="translate(0 '+top.toFixed(1)+')">'+R.line(W,h,{values:s.trend,smooth:s.smooth!==false,valueLabels:false,grid:false,highlight:s.trend.length-1,min:Math.min.apply(null,s.trend)-(Math.max.apply(null,s.trend)-Math.min.apply(null,s.trend))*.25,max:Math.max.apply(null,s.trend)},T)+'</g>';
    return o;
  };
  R.progress=function(W,H,s,T){ /* segmented progress: N segments, filled up to the value; scale on top */
    var seg=s.segments||20,max=s.max||100,val=s.value||0,filled=Math.round(seg*val/max),gap=T.shape==='hex'?6:5,sw=(W-gap*(seg-1))/seg,top=s.scale===false?0:T.size.axis+12,bh=Math.min(H-top-(s.label?T.size.big+40:0),80),o='';
    if(s.scale!==false)[0,25,50,75,100].forEach(function(t){o+=text(W*t/100,T.size.axis,String(Math.round(max*t/100)),{size:T.size.axis,fill:T.muted,anchor:t===0?'start':t===100?'end':'middle'});});
    for(var i=0;i<seg;i++){var x=i*(sw+gap),on=i<filled;o+=bar(x,top,sw,bh,on?T.accent:T.base,Object.assign({},T,{radius:Math.min(4,sw/2)}),false,'both');}
    if(s.label!==false)o+=text(0,top+bh+T.size.big+12,s.valueLabel||fmt(val,Object.assign({unit:'%'},s)),{size:T.size.big,weight:700,fill:T.text,ls:'-0.02em'});
    if(s.caption)o+=text(0,top+bh+T.size.big+44,s.caption,{size:T.size.label,fill:T.text2});
    return o;
  };
  R.heatmap=function(W,H,s,T){ /* rows × columns; darker = more (accent tints), the peak cell marked */
    var rows=s.rows||[],cols=s.cols||[],v=s.values||[],lw=s.labelWidth||64,top=T.size.axis+12,cw=(W-lw)/cols.length,ch=(H-top)/rows.length,max=0,mi=-1,mj=-1,o='';
    v.forEach(function(r,i){r.forEach(function(x,j){if(x>max){max=x;mi=i;mj=j;}});});
    cols.forEach(function(c,j){o+=text(lw+cw*(j+.5),T.size.axis,c,{size:T.size.axis,fill:T.muted,anchor:'middle'});});
    rows.forEach(function(r,i){o+=text(0,top+ch*(i+.5),r,{size:T.size.axis,fill:T.text2,base:'middle'});
      cols.forEach(function(c,j){var x=(v[i]||[])[j]||0,t=x/max,pk=i===mi&&j===mj;
        o+='<rect x="'+(lw+cw*j+2).toFixed(1)+'" y="'+(top+ch*i+2).toFixed(1)+'" width="'+(cw-4).toFixed(1)+'" height="'+(ch-4).toFixed(1)+'" rx="'+(T.shape==='hex'?2:4)+'" fill="'+T.accent+'" fill-opacity="'+(pk?1:(.08+t*.62)).toFixed(2)+'"/>';
        if(s.valueLabels)o+=text(lw+cw*(j+.5),top+ch*(i+.5),fmt(x,s),{size:T.size.axis-1,weight:pk?700:400,fill:pk||t>.6?'#FFFFFF':T.text2,anchor:'middle',base:'middle'});});});
    return o;
  };
  R.timeline=function(W,H,s,T){ /* steps with done / now / next states */
    var it=s.items||[],n=it.length,rowH=H/n,r=14,o='',cur=s.current!=null?s.current:it.findIndex(function(x){return x.state==='now';});
    it.forEach(function(x,i){var cy=rowH*i+r+2,st=x.state||(i<cur?'done':i===cur?'now':'next');
      if(i<n-1)o+='<line x1="'+r+'" x2="'+r+'" y1="'+(cy+r+6)+'" y2="'+(cy+rowH-r-6)+'" stroke="'+(st==='done'?T.done:T.ring)+'" stroke-width="2"/>';
      if(st==='done'){o+=dot(r,cy,r,T.done,T);o+='<path d="M'+(r-5)+','+cy+' l4,4 l7,-8" fill="none" stroke="'+T.doneMark+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';}
      else if(st==='now'){o+=dot(r,cy,r,T.surface,T,T.accent);o+=dot(r,cy,5,T.accent,T);}
      else o+=dot(r,cy,r,T.surface,T,T.ring);
      var tx=r*2+20;
      if(x.date)o+=text(tx,cy-6,x.date,{size:T.size.axis,fill:T.muted});
      o+=text(tx,cy+(x.date?20:6),x.title,{size:T.size.title,weight:700,fill:st==='next'?T.text2:T.text});
      if(x.text)o+=text(tx,cy+(x.date?46:32),x.text,{size:T.size.label,fill:T.text2});});
    return o;
  };

  C.types=Object.keys(R);
  function specOf(el){var j=el.querySelector('script[type="application/json"]');try{return JSON.parse(j?j.textContent:el.getAttribute('data-chart')||'{}');}catch(e){return {};}}
  C.spec=specOf;
  C.render=function(root,theme){
    var T=typeof theme==='string'?THEMES[theme]:Object.assign({},THEMES.white,theme||{});
    Array.prototype.forEach.call((root||document).querySelectorAll('[data-chart]'),function(el){
      var s=specOf(el),fn=R[s.type];if(!fn)return;
      var a=(T.acc||{})[s.accent||'orange'];var TT=a?Object.assign({},T,{accent:a[0],accentTint:a[1],base:T.tintBase?a[1]:T.base}):T;
      if(a&&s.accent&&s.accent!=='orange'){var ser=T.series.slice(),i=ser.indexOf(a[0]);if(i>0){ser.splice(i,1);ser.unshift(a[0]);}TT.series=ser;}
      var W=el.offsetWidth||parseFloat(el.style.width)||600,H=el.offsetHeight||parseFloat(el.style.height)||300;
      var old=el.querySelector(':scope > svg[data-ocard-chart]');if(old)old.remove();
      var svg=document.createElementNS(NS,'svg');svg.setAttribute('data-ocard-chart','');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);
      svg.setAttribute('style','display:block;overflow:visible;font-family:'+T.font);svg.setAttribute('role','img');svg.setAttribute('aria-label',s.title||s.type);
      svg.innerHTML=fn(W,H,s,TT);el.appendChild(svg);
    });
  };
})();
