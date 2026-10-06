"""Helpers every Ocard deck build.py shares (so every template gets 存檔 / 編輯文字 / 下載 the same way).

  state = load_state(state_src, out_path, photos_src)   # --state / --photos → the saved state to embed
  html  = html.replace(MARK_HEAD, head_blocks(state))   # <script id="ocard-state"> + the snapshot script
  html  = html.replace(MARK_KIT, kit_script())          # the shared kit (ocard-kit.js)

--state takes a saved Claude page (.html), a Claude Design sidecar (.ocard-deck.state.json, photos in their own
files next to it) or the settings a user pasted back (.json). --photos takes the deck-panel photo-slot sidecar
(.image-slots.state.json) from Claude Design.
"""
import json, os, re, time

HERE = os.path.dirname(os.path.abspath(__file__))
MARK_HEAD = '<!--OCARD-KIT-HEAD-->'
MARK_KIT = '<!--OCARD-KIT-->'

def _read(p):
    return open(p, encoding='utf-8').read()

def js_json(o):
    return json.dumps(o, ensure_ascii=False).replace('</', '<\\/')

def load_state(state_src=None, out_path='', photos_src=None):
    state = {}
    if state_src:
        t = _read(state_src)
        if state_src.endswith(('.html', '.htm')):
            m = re.search(r'<script type="application/json" id="ocard-state">(.*?)</script>', t, re.S)
            state = json.loads(m.group(1).replace('<\\/', '</')) if m and m.group(1).strip() else {}
        else:
            j = json.loads(t)
            if 'files' in j:
                name = os.path.basename(out_path)
                state = j['files'].get(name) or (next(iter(j['files'].values())) if len(j['files']) == 1 else {})
                base = os.path.dirname(os.path.abspath(state_src)); ph = {}
                for k, v in (state.get('photos') or {}).items():
                    if isinstance(v, dict) and v.get('f'):
                        p = os.path.join(base, v['f'])
                        if os.path.exists(p): ph[k] = json.loads(_read(p))
                    elif v: ph[k] = v
                state['photos'] = ph
            else:
                state = j
    if photos_src:
        j = json.loads(_read(photos_src)); base = os.path.dirname(os.path.abspath(photos_src))
        for k, v in list(j.items()):
            if k == '__t' or not v: continue
            if isinstance(v, str): v = {'u': v, 's': 1, 'x': 0, 'y': 0}
            if v.get('f') and not v.get('u'):
                p = os.path.join(base, v['f'])
                if os.path.exists(p): v['u'] = json.loads(_read(p))
                v.pop('f', None)
            if v.get('u'): state.setdefault('photos', {})[k] = v
        if state.get('photos'): state['photos']['__t'] = int(time.time() * 1000)
    return state

def head_blocks(state):
    return ('<!-- 存檔內容：按「存檔」或 build.py --state 時寫入，請勿手動編輯 -->\n'
            '<script type="application/json" id="ocard-state">%s</script>\n'
            '<script id="ocard-cap">window.__ocardSrc=document.documentElement.outerHTML;</script>') % js_json(state)

def kit_script():
    return '<script id="ocard-kit" data-ocard-after>\n%s\n</script>' % _read(os.path.join(HERE, 'ocard-kit.js'))
