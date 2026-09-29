import re,json,difflib
from pathlib import Path
raw=json.load(open('tmp/pdfs/extracted.json'))
def clean(s):
 s=re.sub(r'\s+',' ',s).strip()
 return re.sub(r'\s+([,.;?!])',r'\1',s)
def paras(s):return '\n\n'.join(clean(p) for p in re.split(r'\n\n|\n(?=\s*(?:-|[1-5]\.\s))',s) if p.strip())
def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
topics=[
 ('foundations','Foundations & nursing history','Public health roles, milestones, and professional practice.'),
 ('prevention','Prevention & health promotion','Prevention levels, healthy behaviors, and population health.'),
 ('epidemiology','Epidemiology & research','Disease patterns, study designs, screening, and rates.'),
 ('infection','Communicable disease','Transmission, immunizations, and infection prevention.'),
 ('disaster','Disasters & emergency response','Preparedness, triage, and community emergencies.'),
 ('home','Home health & care coordination','Home visits, referrals, caregiving, and continuity of care.'),
 ('ethics','Ethics, advocacy & communication','Client rights, ethical principles, and therapeutic communication.'),
 ('education','Teaching & behavior change','Learning theories, health literacy, and readiness to change.'),
 ('assessment','Community assessment & planning','Partnerships, assessment models, and program evaluation.'),
 ('equity','Social determinants & equity','Access, economic stability, food security, and support.'),
 ('culture','Culture & inclusive care','Cultural humility, assessment, and responsive nursing care.'),
 ('environment','Environmental & occupational health','Environmental exposures, workplace health, and safety.'),
 ('policy','Health policy & insurance','Public agencies, Medicare, Medicaid, and health care funding.')]
groups={
 'foundations':[3,6,10,17,18,68,81,84,85,87,95,141],
 'prevention':[13,16,21,27,29,30,36,37,46,60,63,67,72,76,77,124,143,252,253,258,265],
 'epidemiology':[19,22,31,49,61,130]+list(range(149,162))+[165,166,167,168,169,170,171,173,174,175,176,177,178],
 'infection':[23,25,28,32,39,56,80,106,185,234,235,239],
 'disaster':[5,24,26,33,41,42,48,50,52,57,238],
 'home':[40,44,45,51,54,55,59,71,99,103,196],
 'ethics':[7,38,43,53,73,83,86,88,89,91,92,93,94,96,97,98,100,101,102,104,105,162,163,164,194],
 'education':[11,58,62,64,65,69,79,90]+list(range(107,115))+[116,117,118,120,121,122,123,201],
 'assessment':[34,78,115,119]+list(range(125,130))+list(range(131,141))+[142,144,145,146,147,148],
 'equity':[2,35,47,66,70,172,181,182,183,184,186,187,190,191,192,193,195,197,198,199,200,202,203],
 'culture':[82]+list(range(204,229)),
 'environment':[15,74,75,180,188]+list(range(229,234))+[236,237,240],
 'policy':[1,4,8,9,12,14,20,179,189]+list(range(241,252))+[254,255,256,257,259,260,261,262,263,264,266,267,268,269,270]
}
lookup={i:t for t,ids in groups.items() for i in ids}
assert len(lookup)==270,sorted(set(range(1,271))-set(lookup))
notes={
12:('The PDF labels the answer “3,” but its wording matches option 4. Practice scoring uses the wording. Most people pay no Part A premium; Part B generally has a monthly premium.','https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/what-does-medicare-cost'),
23:('The source simplifies treatment to 60 days. CDC distinguishes treatment of illness from post-exposure prophylaxis; duration depends on the clinical situation.','https://www.cdc.gov/mmwr/volumes/72/rr/rr7206a1.htm'),
62:('The source lists selected stages and uses “planning.” Card 109 gives the full sequence using “preparation.”',''),
130:('Source correction: notification by states to CDC is voluntary. Reporting requirements to state or local health departments are governed by applicable laws.','https://ndc.services.cdc.gov/wp-content/uploads/what_data_users_should_know.pdf'),
149:('The short source answer is incomplete. Its own rationale correctly states that prevalence includes both new and existing cases.',''),
152:('24 ÷ 98 × 100 = 24.49% (about 24.5%). The source rounds 0.245 to 25%; rounding the original value directly to a whole percent gives 24%. Follow the precision requested on the exam.',''),
201:('The source answer describes a method without naming it; the rationale identifies teach-back.',''),
209:('The source does not specify a time period for “recent” or cite the population statistic. Treat this as a source-key item to check with your course materials.',''),
220:('This percentage has no year or citation in the source. Check the assigned course reference before memorizing the statistic.',''),
222:('This source item generalizes across a population. Historical harms provide context, but assess each person’s experiences and trust individually.',''),
243:('The source overstates eligibility. Chronic kidney disease alone does not establish Medicare eligibility; ESRD, qualifying disability, and other eligibility conditions matter.','https://www.medicare.gov/basics/end-stage-renal-disease'),
270:('Medicaid is administered by states under federal requirements and funded jointly by states and the federal government.','https://www.medicaid.gov/medicaid')}
cards=[]
for c in raw:
 n=c['id'];q=c['qraw'];a=c['araw']
 if 'Rationale:' in a:ans,rat=a.split('Rationale:',1)
 elif '\n\n' in a:ans,rat=a.split('\n\n',1)
 else:ans,rat=a,''
 # Multiple answer lists and ordering in the earliest cards must stay together.
 if n in (4,16,61):ans,rat=a,''
 opts=[];stem=q
 if n<=61 and n not in (4,61):
  matches=list(re.finditer(r'(?:^|\n)\s*([A-D1-5])\.\s*',q))
  if len(matches)>=3:
   stem=q[:matches[0].start()]
   opts=[{'label':m.group(1),'text':clean(q[m.end():matches[i+1].start() if i+1<len(matches) else len(q)])} for i,m in enumerate(matches)]
 correct=[]
 if opts:
  for part in re.split(r'\n(?=[1-5A-D]\.\s)',ans):
   target=norm(re.sub(r'^[1-5A-D]\.\s*','',clean(part)))
   scores=[1.0 if target.startswith(norm(o['text'])) else difflib.SequenceMatcher(None,target,norm(o['text'])).ratio() for o in opts]
   if max(scores)>.78:correct.append(scores.index(max(scores)))
  assert correct,(n,ans,opts)
  if len(correct)==1:
   option=opts[correct[0]]
   rest=re.sub(r'^[1-5A-D]\.\s*','',clean(ans))
   normalized=norm(option['text'])
   if norm(rest).startswith(normalized):
    count=0;cut=0
    for ix,ch in enumerate(rest):
     if ch.lower() in 'abcdefghijklmnopqrstuvwxyz0123456789':count+=1
     if count==len(normalized):cut=ix+1;break
    extra=re.sub(r'^[^a-zA-Z0-9]+','',rest[cut:])
    ans=option['label']+'. '+option['text']
    if extra:rat=extra+'\n\n'+rat
 card={'id':n,'topic':lookup[n],'question':clean(stem),'options':opts,'correct':correct,'answer':paras(ans),'rationale':paras(rat),'pages':c['pages'],'originalQuestion':paras(q),'originalAnswer':paras(a),'note':None}
 if n in notes:card['note']={'text':notes[n][0],'url':notes[n][1]}
 if n==130:card['answer']='States voluntarily notify CDC of nationally notifiable diseases.';card['rationale']='Distinguish notification to CDC from legally required reporting to state or local public health authorities.'
 if n==149:card['answer']='Prevalence includes new and existing cases of disease in a population.'
 if n==152:
  card['answer']='Approximately 24.5% (24 ÷ 98 × 100).'
  card['rationale']='Divide the 24 people who became ill after eating watermelon by the 98 who ate watermelon, then multiply by 100. The denominator is those who ate the food, not all 107 picnic attendees.'
 if n==201:card['answer']='Teach-back: ask the client to explain the instructions in their own words.'
 if n in (209,220,243):card['needsReview']=True
 card['type']='multiple' if len(correct)>1 else 'choice' if opts else 'recall'
 cards.append(card)
Path('data.js').write_text('window.STUDY_DATA = '+json.dumps({'topics':[dict(id=t,title=title,description=d) for t,title,d in topics],'cards':cards},ensure_ascii=False,indent=2)+';\n')
print('Cards',len(cards),'Options',sum(bool(c['options']) for c in cards),'Rationales',sum(bool(c['rationale']) for c in cards))
print('No rationales:',[c['id'] for c in cards if not c['rationale']])
print('Topics',[(t[0],sum(c['topic']==t[0] for c in cards)) for t in topics])
