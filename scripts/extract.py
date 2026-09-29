import pdfplumber,re,json
cards=[]
with pdfplumber.open('source.pdf') as pdf:
 for pi,p in enumerate(pdf.pages):
  words=p.extract_words()
  markers=[w for w in words if w['x0']<45 and 60<w['top']<756 and re.fullmatch(r'\d+\.',w['text'])]
  boundaries=[(60,None)]+[(w['top']-1,int(w['text'][:-1])) for w in markers]+[(756,None)]
  for j,(top,num) in enumerate(boundaries[:-1]):
   bottom=boundaries[j+1][0]
   if num is not None:cards.append({'id':num,'qraw':'','araw':'','pages':[]})
   if not cards or bottom<=top:continue
   def col(x0,x1):
    ws=[w for w in words if x0<=w['x0']<x1 and top<=w['top']<bottom]
    lines=[]
    for w in sorted(ws,key=lambda w:(round(w['top']/3),w['x0'])):
     if not lines or abs(w['top']-lines[-1][0])>3:lines.append((w['top'],[]))
     lines[-1][1].append(w['text'])
    return ''.join(('\n\n' if i and y-lines[i-1][0]>30 else '\n')+' '.join(v) for i,(y,v) in enumerate(lines)).strip()
   q,a=col(45,231),col(231,612)
   if q or a:
    cards[-1]['qraw']+='\n'+q;cards[-1]['araw']+='\n'+a
    if pi+1 not in cards[-1]['pages']:cards[-1]['pages'].append(pi+1)
for c in cards:
 for k in ['qraw','araw']:
  c[k]=re.sub(r'(\w)-\n(\w)',r'\1\2',c[k]).strip()
assert [c['id'] for c in cards]==list(range(1,271)),[c['id'] for c in cards]
assert all(c['qraw'] and c['araw'] for c in cards)
open('tmp/pdfs/extracted.json','w').write(json.dumps(cards,indent=2))
for c in cards:print(f"{c['id']}: {' '.join(c['qraw'].split())[:190]} | {' '.join(c['araw'].split())[:150]}")
