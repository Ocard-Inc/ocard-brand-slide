"""Turn Lucide icon names into inline SVG content for the deck's panel.

Usage:  python3 lucide_pick.py trending-up user-plus calendar-check ...
        Prints a JSON object {"lu-<name>": "<path .../>"} to paste into LUC in src.html.
        python3 lucide_pick.py --search member card
        Lists icon names whose name or tags match every word (tags are English), to pick 3 per heading.

Icons come from lucide-static 0.544.0 (ISC licence, no credit needed), the same version as the other Ocard templates.
They are read from ../../assets/icons/lucide/ first, so no network is needed; the npm registry is only a fallback.
Browse names at https://lucide.dev/icons
"""
import io, json, os, re, sys, tarfile, urllib.request

VER = '0.544.0'
HERE = os.path.dirname(os.path.abspath(__file__))
LOCAL = os.path.join(HERE, '../../assets/icons/lucide')
URL = 'https://registry.npmjs.org/lucide-static/-/lucide-static-%s.tgz' % VER
_icons = _tags = None

def _load():
    global _icons, _tags
    if _icons is not None:
        return
    p = os.path.join(LOCAL, 'icons.json')
    if os.path.exists(p):
        _icons = json.load(open(p, encoding='utf-8'))
        _tags = json.load(open(os.path.join(LOCAL, 'tags.json'), encoding='utf-8'))
        return
    tgz = tarfile.open(fileobj=io.BytesIO(urllib.request.urlopen(URL, timeout=60).read()))
    _icons, _tags = {}, {}
    for m in tgz.getmembers():
        if m.name.startswith('package/icons/') and m.name.endswith('.svg'):
            svg = tgz.extractfile(m).read().decode('utf-8')
            inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
            _icons[os.path.basename(m.name)[:-4]] = re.sub(r'\s*\n\s*', '', inner).replace(' />', '/>')
        elif m.name == 'package/tags.json':
            _tags = json.load(tgz.extractfile(m))

def icon(name):
    _load()
    if name not in _icons:
        sys.exit('unknown Lucide icon: ' + name)
    return _icons[name]

def search(words):
    _load()
    words = [w.lower() for w in words]
    hits = []
    for n in _icons:
        hay = ' '.join([n] + _tags.get(n, [])).lower()
        if all(w in hay for w in words):
            hits.append(n)
    return hits

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--search']:
        print('\n'.join(search(a[1:])))
    else:
        print(json.dumps({'lu-' + n: icon(n) for n in a}, ensure_ascii=False))
