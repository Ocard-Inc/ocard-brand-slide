import json,html,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
d=json.load(open('style-picker-options.json',encoding='utf-8'))
# every option (label, desc, svg) lives in style-picker-options.json, which the Claude Design forms read too
Q=[]
def take(key,qid,title,sub,default,opts):
    Q.append(dict(id=qid,title=title,sub=sub,default=default,opts=opts))
def J(k): return [dict(label=o['label'],desc=o['desc'],svg=o['svg']) for o in d[k]]
# Step 1a
take(None,'density','資訊密度','每一頁要放多少內容；會直接影響總頁數','標準',J('資訊密度'))
# Step 2a: pick the deck style. Each style is its own template with its own Step 2b page; add a new style here and give it a page below.
take(None,'template','簡報風格','選一種版型，接下來只回答這個版型的題目','白底標準',J('簡報風格'))
# Step 2b: 白底標準／墨底標準 (same layouts, different ground). Chapter pages, card style and radius are not asked: defaults apply and the panel can change cards later.
take(None,'cover','封面樣式','第一頁右側的畫面','六角照片',J('封面樣式'))
take(None,'photo','照片呈現','案例頁照片的擺法','半版分欄',J('照片呈現'))
# Step 2b: 六角幾何拼貼
take(None,'hcover','封面樣式','六角幾何拼貼的第一頁','六角膠囊拼貼',J('封面樣式（六角幾何拼貼）'))
ALLQ={q['id']:q for q in Q}
DEFAULTS_STD='  <div class="fixed"><span class="sw" aria-hidden="true" style="background:#F2F2F2"></span><div><b>其他設定直接套用預設</b><br><span>章節頁會產出（六角照片）、卡片用實心淺灰底、標準圓角；產出後不要章節頁可以再拿掉，卡片樣式可在調整面板改。</span></div></div>\n'
DEFAULTS_HEX='  <div class="fixed"><span class="sw" aria-hidden="true" style="background:#FAFAFA"></span><div><b>其他設定直接套用預設</b><br><span>輔助色、編號、小標記號、圖示和照片，產出後都能在簡報的「調整」面板裡改。</span></div></div>\n'
PAGES=[
 dict(out='density-picker.artifact.html',ids=['density'],title='Ocard 簡報資訊密度',eyebrow='STEP 1 · 資訊密度',h1='每一頁想放多少內容？',
      lead='密度會決定頁數：越精簡頁數越多、每頁字越大；越詳盡頁數越少、每頁資訊越多。<b>這一頁用來看示意，請在對話裡點選同一題並按確認</b>，Claude 就會開始整理頁面大綱，這個視窗可以關掉。',
      fixed='',key='ocard-density-picker',prefix='資訊密度：',head='資訊密度：',doc='picks/density'),
 dict(out='template-picker.artifact.html',ids=['template'],title='Ocard 簡報風格',eyebrow='STEP 2 · 簡報風格',h1='選一種簡報風格',
      lead='每種風格是一套獨立的版型，選好後只會再問這個版型的幾個題目。<b>這一頁用來看示意，請在對話裡點選同一題並按確認</b>，這個視窗可以關掉。',
      fixed='',key='ocard-template-picker',prefix='簡報風格：',head='簡報風格：',doc='picks/template'),
 dict(out='style-picker.artifact.html',ids=['cover','photo'],title='Ocard 簡報風格選擇',eyebrow='STEP 2 · 白底／墨底標準',h1='選出你喜歡的簡報樣子',
      lead='這一頁用來看示意，白底與墨底標準共用這些題目。<b>對話裡會有同樣的選擇題，點選並按確認後 Claude 就會開始做簡報</b>，這個視窗可以關掉。也可以在這頁點選後按「確認選擇」，再回對話說一聲「選好了」。不確定的題目跳過就好，會套用標示「預設」的選項。',
      fixed=DEFAULTS_STD,key='ocard-style-picker',prefix='風格選擇：',head='風格選擇：',doc='picks/latest'),
 dict(out='hexgeo-picker.artifact.html',ids=['hcover'],title='Ocard 六角幾何拼貼',eyebrow='STEP 2 · 六角幾何拼貼',h1='選一款封面',
      lead='六角幾何拼貼只需要決定封面。<b>這一頁用來看示意，請在對話裡點選同一題並按確認</b>，Claude 就會開始做簡報，這個視窗可以關掉。完整的版面規則見 <code>style-hexgeo.board.html</code>。',
      fixed=DEFAULTS_HEX,key='ocard-hexgeo-picker',prefix='六角幾何拼貼：',head='六角幾何拼貼：',doc='picks/hexgeo'),
]
L='ABCDEFG'
TPL=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'style-picker.artifact.tpl.html'),encoding='utf-8').read()
for P in PAGES:
    QS=[ALLQ[i] for i in P['ids']]
    sec=''
    for n,q in enumerate(QS,1):
        cards=''
        for i,o in enumerate(q['opts']):
            dflt='<i class="dft">預設</i>' if o['label']==q['default'] else ''
            cards+='<button class="opt" type="button" data-q="%s" data-v="%s" aria-pressed="false"><span class="pic">%s</span><span class="nm"><b class="lt">%s</b><b>%s</b>%s</span><span class="ds">%s</span></button>'%(q['id'],html.escape(o['label']),o['svg'],L[i],html.escape(o['label']),dflt,html.escape(o['desc']))
        num='<span class="qn">Q%d</span>'%n if len(QS)>1 else ''
        sec+='<section class="q" id="q-%s"><div class="qh">%s<h2>%s</h2><p>%s</p></div><div class="opts">%s</div></section>\n'%(q['id'],num,q['title'],q['sub'],cards)
    meta=json.dumps([{'id':q['id'],'title':q['title'],'default':q['default'],'labels':[o['label'] for o in q['opts']]} for q in QS],ensure_ascii=False)
    page=TPL
    for k,v in [('@@SECTIONS@@',sec),('@@META@@',meta),('@@TITLE@@',P['title']),('@@EYEBROW@@',P['eyebrow']),('@@H1@@',P['h1']),('@@LEAD@@',P['lead']),
                ('@@FIXED@@',P['fixed']),('@@KEY@@',P['key']),('@@PREFIXHEAD@@',P['head']),('@@PREFIX@@',P['prefix']),('@@DOC@@',P['doc'])]:
        page=page.replace(k,v)
    assert '@@' not in page, P['out']
    open(P['out'],'w',encoding='utf-8').write(page)
    print(P['out'],len(page))

# ---- overview card (style-picker.card.html): every question and option, defaults framed in yellow ----
def card_q(no,q):
    h='<div style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><span style="font-family:Montserrat,sans-serif;font-weight:700;font-size:14px;color:#ADADAD">%s</span><span style="font-weight:700;font-size:20px">%s</span><span style="font-size:14px;color:#5C5C5C">%s</span></div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px">'%(no,q['title'],q['sub'])
    for i,o in enumerate(q['opts']):
        d=o['label']==q['default']
        frame='box-shadow:inset 0 0 0 3px #FFEA00;padding:3px' if d else 'box-shadow:inset 0 0 0 1px #E0E0E0;padding:1px'
        tag='<span style="font-size:12px;font-weight:700;background:#FFEA00;color:#333333;border-radius:999px;padding:2px 10px">預設</span>' if d else ''
        svg=o['svg'].replace('<svg ','<svg style="display:block;width:100%;height:auto;border-radius:10px" ',1)
        h+='<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><div style="border-radius:12px;overflow:hidden;%s;background:#FFFFFF">%s</div><div style="display:flex;align-items:center;gap:8px"><span style="font-family:Montserrat,sans-serif;font-weight:700;font-size:14px;color:#ADADAD">%s</span><span style="font-weight:700;font-size:16px">%s</span>%s</div><div style="font-size:14px;line-height:1.6;color:#5C5C5C;text-wrap:pretty">%s</div></div>'%(frame,svg,L[i],html.escape(o['label']),tag,html.escape(o['desc']))
    return h+'</div></div>'
def card_step(eyebrow,note):
    return '<div style="display:flex;flex-direction:column;gap:4px;padding-top:8px;border-top:1px solid #E8E8E8"><div style="font-family:Montserrat,sans-serif;font-size:13px;font-weight:700;letter-spacing:.14em;color:#ADADAD;margin-top:16px">%s</div><div style="font-size:15px;color:#5C5C5C;line-height:1.6">%s</div></div>'%(eyebrow,note)
CARD_STEPS=[('STEP 1A · 交大綱之前','先決定資訊密度，大綱照這個密度拆頁。',[('1a','density')]),
 ('STEP 2A · 大綱確認之後','先選簡報風格。每種風格是一套獨立的版型，接下來只問這個版型的題目。',[('2a','template')]),
 ('STEP 2B · 白底標準／墨底標準','兩種底色共用這兩題。章節頁預設產出（六角照片）、卡片預設實心淺灰底、圓角固定標準圓角，都不另外問；產出後不要章節頁可以再拿掉，卡片樣式可在調整面板改。',[('Q1','cover'),('Q2','photo')]),
 ('STEP 2B · 六角幾何拼貼','只問封面。輔助色、編號、小標記號、圖示和照片，產出後都在簡報的調整面板裡改；完整規則見 <code>style-hexgeo.board.html</code>。',[('Q1','hcover')])]
body=''.join(card_step(e,n)+''.join(card_q(no,ALLQ[i]) for no,i in qs) for e,n,qs in CARD_STEPS)
CARD=('<!-- @dsCard group="Workflow" viewport="1100x@@H@@" name="風格選擇圖卡" subtitle="選項表單中出現的題目：Step 1a 資訊密度、Step 2a 簡報風格、Step 2b 各版型的題目，黃框為預設" -->\n'
 '<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="utf-8"><link rel="stylesheet" href="../styles.css"><style>body{margin:0;background:#FFFFFF;color:#333333;font-family:"Noto Sans TC",sans-serif}a{color:#333333}a:hover{color:#FC6815}</style></head><body>'
 '<div style="max-width:1100px;box-sizing:border-box;padding:48px 56px;display:flex;flex-direction:column;gap:36px"><div style="display:flex;flex-direction:column;gap:8px"><div style="font-family:Montserrat,sans-serif;font-size:13px;font-weight:700;letter-spacing:.14em;color:#ADADAD">STYLE PICKER</div><div style="font-size:30px;font-weight:800;letter-spacing:-.02em">簡報風格選項一覽</div><div style="height:5px;width:64px;background:#FFEA00;border-radius:999px"></div>'
 '<div style="font-size:15px;color:#5C5C5C;line-height:1.6;margin-top:6px;text-wrap:pretty">這些題目會以選項表單逐題出現，點選後送出即完成；跳過的題目套用黃框標示的預設。每個選項都有字母，沒辦法點選時可以直接回覆字母。圖與說明來源：<code>style-picker-options.json</code>，改完執行 <code>python3 style-picker.build.py</code>。</div></div>'
 +body+'</div></body></html>\n')
CARD_H=2260
open('style-picker.card.html','w',encoding='utf-8').write(CARD.replace('@@H@@',str(CARD_H)))
print('style-picker.card.html',len(CARD))
