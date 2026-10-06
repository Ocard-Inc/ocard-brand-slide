import base64,re,os,sys
# python3 build.py                      -> ocard-deck-hexgeo.html (the template)
# python3 build.py my-deck.html         -> my-deck.out.html (a copied/edited src.html)
#   --state FILE / -o OUT / --dc        same as templates/deck-panel/build.py (存檔內容寫進成品)
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'../_shared'))
import kit_build
H=os.path.dirname(os.path.abspath(__file__))
args=sys.argv[1:]
def opt(n):
    if n in args:
        i=args.index(n);v=args[i+1];del args[i:i+2];return v
OUT=opt('-o');STATE=opt('--state');DC='--dc' in args
if DC:args.remove('--dc')
SRC=args[0] if args else os.path.join(H,'src.html')
OUT=OUT or (os.path.join(H,'ocard-deck-hexgeo.html') if not args else re.sub(r'\.html?$','',SRC)+'.out.html')
s=open(SRC,encoding='utf-8').read()
s=s.replace("document.getElementById('ic-chart').innerHTML","'__IC_CHART__'").replace('<template id="ic-chart">__IC_CHART__</template>\n','').replace('<template id="ic-chart">__IC_CHART__</template>','')
A=os.path.join(H,'../../assets/logos/ofb-horizontal-dark.svg')
t=re.sub(r'<metadata>.*?</metadata>','',open(A,encoding='utf-8').read(),flags=re.S)
logo='data:image/svg+xml;base64,'+base64.b64encode(t.encode()).decode()
def ic(p): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'
I={'GIFT':'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
   'CHART':'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
   'PHONE':'<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
   'IMG':'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
   'CROWN':'<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
   'CARD':'<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
   'USERS':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
   'NEXT':'<path d="m9 18 6-6-6-6"/>',
   'ARROW':'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
   'CHAT':'<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>'}
s=s.replace('__LOGO_H__',logo)
M=re.sub(r'<metadata>.*?</metadata>','',open(os.path.join(H,'../../assets/logos/ofb-mark.svg'),encoding='utf-8').read(),flags=re.S)
s=s.replace('__MARK__','data:image/svg+xml;base64,'+base64.b64encode(M.encode()).decode())
for k,v in I.items(): s=s.replace('__IC_%s__'%k,ic(v))
assert '__' not in re.sub(r'data:[^"]+','',s)
s=s.replace(kit_build.MARK_HEAD,kit_build.head_blocks(kit_build.load_state(STATE,OUT))).replace(kit_build.MARK_KIT,kit_build.kit_script())
# ---- embed only the glyphs this deck uses, so the HTML looks the same without network or installed fonts ----
def embed_fonts(html):
    try:
        from fontTools import subset
    except ImportError:
        print('fontTools not installed: fonts load from Google Fonts (needs network)'); return html
    import io
    visible=re.sub(r'data:[^"\')\s]+','',html)                     # skip base64 payloads
    chars=set(visible)|set(chr(c) for c in range(0x20,0x7F))|set('，。、：；！？「」『』（）〔〕｜－＋…—–·／')
    text=''.join(sorted(c for c in chars if ord(c)>=0x20))
    faces=''
    for fam,fn in [('Montserrat','Montserrat-Variable.ttf'),('Noto Sans TC','NotoSansTC-Variable.ttf')]:
        opt=subset.Options(); opt.flavor='woff2'; opt.layout_features=['*']; opt.notdef_outline=True
        font=subset.load_font(os.path.join(H,'../../assets/fonts',fn),opt)
        sub=subset.Subsetter(opt); sub.populate(text=text); sub.subset(font)
        buf=io.BytesIO(); subset.save_font(font,buf,opt)
        b64=base64.b64encode(buf.getvalue()).decode()
        print('%s: %d KB embedded'%(fam,len(buf.getvalue())//1024))
        faces+='@font-face{font-family:"%s";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:100 900;font-style:normal;font-display:block}\n'%(fam,b64)
    html=re.sub(r'<link rel="preconnect"[^>]*>\n?','',html)
    html=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?','',html)
    return html.replace('<style>','<style>\n'+faces,1)
s=embed_fonts(s)
open(OUT,'w',encoding='utf-8').write(s)
if DC:
    dc=re.sub(r'\.html?$','',OUT)+'.dc.html'
    open(dc,'w',encoding='utf-8').write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet><style>html,body{margin:0;height:100%;background:#FAFAFA}</style></helmet>\n<iframe src="./'+os.path.basename(OUT)+'" title="Ocard 六角幾何拼貼簡報" style="display:block;width:100%;height:100vh;border:0;background:#FAFAFA"></iframe>\n</x-dc>\n</body>\n</html>\n')
print(len(s))
