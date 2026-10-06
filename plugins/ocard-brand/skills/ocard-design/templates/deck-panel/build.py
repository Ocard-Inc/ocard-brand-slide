"""Build an Ocard 白底標準／墨底標準 deck into one self-contained HTML file.

  python3 build.py white                      slides-white.html -> ../deck-white/ocard-deck-white.html
  python3 build.py ink                        slides-ink.html   -> ../deck-ink/ocard-deck-ink.html
  python3 build.py white my-slides.html       a copied/edited slides file -> my-slides.out.html
  python3 build.py ink my-slides.html -o deck.html
  options:
    --state FILE   put saved adjustments (and photos) into the deck. FILE is a saved Claude page (.html),
                   a Claude Design sidecar folder's .ocard-deck.state.json, or the settings Claude was handed (.json)
    --photos FILE  Claude Design photo sidecar (.image-slots.state.json); per-photo files next to it are read too
    --dc           also write <name>.dc.html next to the output: the Claude Design entry that embeds it

The output carries everything it needs: the viewer and adjust panel (shell.html + engine.js),
the photo slots (image-slot.js), logos and QR as data URIs, the Lucide icons the slides use,
and only the glyphs of Montserrat / Noto Sans TC the text needs. It opens offline, in a plain
browser, in Claude Code, and inside Claude Design (WhiteDeck.dc.html / InkDeck.dc.html embed it).
Re-run after every text change so new characters get embedded.
"""
import base64, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, '../../assets'))

args = [a for a in sys.argv[1:]]
def opt(name):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return None
out = opt('-o'); state_src = opt('--state'); photos_src = opt('--photos')
want_dc = '--dc' in args
if want_dc: args.remove('--dc')
ground = 'ink' if args and args[0] == 'ink' else 'white'
if args and args[0] in ('white', 'ink'):
    args = args[1:]
src = args[0] if args else os.path.join(HERE, 'slides-%s.html' % ground)
if out is None:
    out = os.path.join(HERE, '../deck-%s/ocard-deck-%s.html' % (ground, ground)) if not args else re.sub(r'\.html?$', '', src) + '.out.html'

def read(p):
    return open(p, encoding='utf-8').read()

slides = read(src)
m = re.search(r'<title>(.*?)</title>\s*', slides, re.S)
title = m.group(1).strip() if m else 'Ocard 簡報'
if m:
    slides = slides[:m.start()] + slides[m.end():]

# ---- assets referenced as ../../assets/<path> (or any …/assets/<path>) become data URIs ----
def data_uri(rel):
    p = os.path.join(ASSETS, rel)
    if rel.endswith('.svg'):
        t = re.sub(r'<metadata>.*?</metadata>', '', read(p), flags=re.S)
        return 'data:image/svg+xml;base64,' + base64.b64encode(t.encode()).decode()
    mime = 'image/png' if rel.endswith('.png') else 'image/jpeg'
    return 'data:%s;base64,' % mime + base64.b64encode(open(p, 'rb').read()).decode()
slides = re.sub(r'src="(?:[^"]*/)?assets/((?:logos|qr)/[^"]+)"', lambda m: 'src="%s"' % data_uri(m.group(1)), slides)

# ---- Lucide icons: the ones on the slides plus every alternative offered in the panel ----
LUCIDE = json.load(open(os.path.join(ASSETS, 'icons/lucide/icons.json'), encoding='utf-8'))
names = set(re.findall(r'class="[^"]*\bicon-([a-z0-9-]+)', slides))
for alt in re.findall(r'data-ic-alt="([^"]*)"', slides):
    names.update(n for n in alt.split(',') if n)
missing = sorted(n for n in names if n not in LUCIDE)
if missing:
    sys.exit('Unknown Lucide icon name(s): %s — check lucide.dev/icons or python3 ../deck-hexgeo/lucide_pick.py --search' % ', '.join(missing))
icons = {n: LUCIDE[n] for n in sorted(names)}

# ---- saved adjustments and photos (存檔) ----
state = {}
def block(html, id_):
    m = re.search(r'<script type="application/json" id="%s">(.*?)</script>' % id_, html, re.S)
    return json.loads(m.group(1).replace('<\\/', '</')) if m and m.group(1).strip() else None
if state_src:
    t = read(state_src)
    if state_src.endswith(('.html', '.htm')):
        state = block(t, 'ocard-state') or {}
    else:
        j = json.loads(t)
        if 'files' in j:   # Claude Design sidecar: pick this deck's entry; photos live in their own files next to it
            name = os.path.basename(out); state = j['files'].get(name) or (next(iter(j['files'].values())) if len(j['files']) == 1 else {})
            base = os.path.dirname(os.path.abspath(state_src)); ph = {}
            for k, v in (state.get('photos') or {}).items():
                if isinstance(v, dict) and v.get('f'):
                    p = os.path.join(base, v['f'])
                    if os.path.exists(p): ph[k] = json.loads(read(p))
                elif v: ph[k] = v
            state['photos'] = ph
        else:
            state = j
if photos_src:
    j = json.loads(read(photos_src)); base = os.path.dirname(os.path.abspath(photos_src))
    for k, v in list(j.items()):
        if k == '__t' or not v: continue
        if isinstance(v, str): v = {'u': v, 's': 1, 'x': 0, 'y': 0}
        if v.get('f') and not v.get('u'):
            p = os.path.join(base, v['f'])
            if os.path.exists(p): v['u'] = json.loads(read(p))
            v.pop('f', None)
        if v.get('u'): state.setdefault('photos', {})[k] = v
    if state.get('photos'): import time; state['photos']['__t'] = int(time.time() * 1000)

def js_json(o):
    return json.dumps(o, ensure_ascii=False).replace('</', '<\\/')

parts = {
    'GROUND': ground,
    'GROUND_NAME': '墨底標準' if ground == 'ink' else '白底標準',
    'TITLE': title,
    'SLIDES': slides,
    'ICONS': js_json(icons),
    'THUMBS': js_json(json.load(open(os.path.join(HERE, 'panel-thumbs.json'), encoding='utf-8'))),
    'IMAGE_SLOT': read(os.path.join(HERE, 'image-slot.js')),
    'ENGINE': read(os.path.join(HERE, 'engine.js')),
    'STATE': js_json(state),
    'KIT': read(os.path.join(HERE, '../_shared/ocard-kit.js')),
}
html = re.sub(r'__(%s)__' % '|'.join(parts), lambda m: parts[m.group(1)], read(os.path.join(HERE, 'shell.html')))

# ---- embed only the glyphs this deck uses, so it looks the same without network or installed fonts ----
def embed_fonts(html):
    try:
        from fontTools import subset
    except ImportError:
        print('fontTools not installed (pip install fonttools brotli): fonts load from Google Fonts, which needs network')
        return html
    visible = re.sub(r'data:[^"\')\s]+', '', html)
    chars = set(visible) | set(chr(c) for c in range(0x20, 0x7F)) | set('，。、：；！？「」『』（）〔〕｜－＋…—–·／×')
    text = ''.join(sorted(c for c in chars if ord(c) >= 0x20))
    faces = ''
    for fam, fn in [('Montserrat', 'Montserrat-Variable.ttf'), ('Noto Sans TC', 'NotoSansTC-Variable.ttf')]:
        opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.notdef_outline = True
        font = subset.load_font(os.path.join(ASSETS, 'fonts', fn), opt)
        sub = subset.Subsetter(opt); sub.populate(text=text); sub.subset(font)
        buf = io.BytesIO(); subset.save_font(font, buf, opt)
        print('%s: %d KB embedded' % (fam, len(buf.getvalue()) // 1024))
        faces += '@font-face{font-family:"%s";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:100 900;font-style:normal;font-display:block}\n' % (fam, base64.b64encode(buf.getvalue()).decode())
    html = re.sub(r'<link rel="preconnect"[^>]*>\n?', '', html)
    html = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n?', '', html)
    return html.replace('<style>', '<style>\n' + faces, 1)

html = embed_fonts(html)
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
open(out, 'w', encoding='utf-8').write(html)
if want_dc:
    dc = re.sub(r'\.html?$', '', out) + '.dc.html'
    open(dc, 'w', encoding='utf-8').write('''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet><style>html,body{margin:0;height:100%%;background:#F2F2F2}</style></helmet>
<iframe src="./%s" title="%s" style="display:block;width:100%%;height:100vh;border:0;background:#F2F2F2"></iframe>
</x-dc>
</body>
</html>
''' % (os.path.basename(out), title))
    print('Claude Design entry: %s (needs support.js from ../deck-%s/ in the same folder)' % (os.path.relpath(dc), ground))
print('%s  %d KB  (%s, %d slides, %d icons)' % (os.path.relpath(out), len(html.encode()) // 1024, parts['GROUND_NAME'], len(re.findall(r'<section\b', slides)), len(icons)))
