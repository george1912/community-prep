const fs = require('node:fs');
const assert = require('node:assert/strict');
global.window={};require('../data.js');
const parse = file => Object.fromEntries(fs.readFileSync(file,'utf8').trim().split('\n').map(line=>{const [id,...parts]=line.split('|');return [id,parts];}));
const distractors=parse('content/distractors.txt');
const rationales=parse('content/rationales.txt');
const records={};
const sequences={
  4:['Sheppard–Towner Act (1921)','Social Security Act (1935)','Civil Rights Act (1964)','Medicare and Medicaid Act (1965)','HIPAA (1996)'],
  61:['Formulate the research question','Review related literature','Design the study','Analyze the findings'],
  109:['Precontemplation','Contemplation','Preparation','Action','Maintenance'],
  244:['Medicare','SAMHSA','CHIP','Affordable Care Act']
};
const references={
  28:'https://www.cdc.gov/hiv/prevention/pep.html',
  32:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4ab110e4-7b91-42aa-8052-f24cd79293f0',
  39:'https://www.cdc.gov/smallpox/hcp/laboratories/specimen-collection-suspect-smallpox-cases.html',
  41:'https://www.cdc.gov/radiation-emergencies/treatment/potassium-iodide.html',
  49:'https://www.cdc.gov/tb/hcp/testing-diagnosis/tuberculin-skin-test.html'
};
for(const c of window.STUDY_DATA.cards){
  let question=c.question, correctTexts=[], wrong=[], addedChoices=!c.options.length;
  let rationale=c.rationale || rationales[c.id]?.[0];
  assert.ok(rationale,`Missing rationale ${c.id}`);
  if(c.options.length){
    correctTexts=c.correct.map(i=>c.options[i].text);
    wrong=c.options.filter((_,i)=>!c.correct.includes(i)).map(o=>o.text);
  }else if(sequences[c.id]){
    const sequence=sequences[c.id];
    correctTexts=[sequence.join(' → ')];
    wrong=[ [sequence[1],sequence[0],...sequence.slice(2)], [...sequence.slice(0,-2),sequence.at(-1),sequence.at(-2)], [...sequence].reverse() ].map(a=>a.join(' → '));
    if(c.id===4)question='Which sequence lists these public health laws from oldest to newest?';
    if(c.id===61)question='Which sequence should a community health nurse follow when conducting a research study?';
  }else{
    correctTexts=c.answer.startsWith('-')?c.answer.split(/\n\s*\n(?=-)/).map(t=>t.replace(/^-\s*/,'')):[c.answer];
    wrong=distractors[c.id];assert.ok(wrong,`Missing choices ${c.id}`);
  }
  if(c.id===90)correctTexts=correctTexts.map(s=>s.replace('the inhaled','the inhaler'));
  if(c.id===243){
    question='Which clients may qualify for Medicare, subject to the program’s eligibility requirements? Select all that apply.';
    correctTexts=['A 60-year-old who meets the qualifying disability requirements','A 70-year-old who meets the age-based enrollment requirements','A young adult with end-stage renal disease requiring dialysis or a kidney transplant who meets eligibility requirements'];
    rationale='Medicare generally serves people 65 or older and certain younger people with qualifying disabilities or end-stage renal disease. Chronic kidney disease alone is not enough. Medicaid is a different program with income-related eligibility rules.';
  }
  if(c.id===270)rationale='Medicaid is administered by states under federal requirements. Funding is shared by states and the federal government; it is not funded by the state alone.';
  if(c.id===209){question='Which population does the supplied study set identify as having the largest recent growth rate? The source gives no reference period; answer according to its key.';rationale='The source key identifies Hispanic and Latino. Because the source does not give a time period or citation, this is a review of that key rather than a current demographic comparison.';}
  if(c.id===220){question='Which workforce statistic does the supplied study set cite as a barrier to a diverse nursing workforce? The source gives no reference year.';}
  if(c.id===222){wrong=['Hispanic and Latino American','Asian American','White American'];}
  if(c.id===152){wrong=['22.4% (24 divided by all 107 attendees)','75.5% (those exposed who did not become ill)','91.6% (98 divided by all 107 attendees)'];}
  const multiple=correctTexts.length>1;
  if(multiple && !/select all/i.test(question))question=question.replace(/\s*SATA\.?$/i,'')+' Select all that apply.';
  // Deterministic varied positions keep option IDs stable when an unfinished quiz resumes.
  const keyed=c.options.length ? c.options.map((o,i)=>({text:o.text,right:c.correct.includes(i)})) : [...correctTexts.map(text=>({text,right:true})),...wrong.map(text=>({text,right:false}))];
  let seed=(c.id*2654435761)>>>0;
  for(let i=keyed.length-1;addedChoices && i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[keyed[i],keyed[j]]=[keyed[j],keyed[i]];}
  const options=keyed.map((o,i)=>({label:String.fromCharCode(65+i),text:o.text}));
  const correct=keyed.flatMap((o,i)=>o.right?[i]:[]);
  assert.ok(options.length>=4&&options.length<=6,`Option count ${c.id}: ${options.length}`);
  assert.equal(new Set(options.map(o=>o.text.toLowerCase().trim())).size,options.length,`Duplicate ${c.id}`);
  assert.ok(correct.length>0&&correct.length<options.length,`Key ${c.id}`);
  if(!multiple)assert.equal(options.length,4,`Single-answer count ${c.id}`);
  records[c.id]={question,options,correct,type:multiple?'multiple':'choice',answer:correct.map(i=>options[i].label+'. '+options[i].text).join('\n\n'),rationale,addedChoices,rationaleKind:c.rationale && ![209,243,270].includes(c.id)?'Source rationale':'Study explanation',rationaleUrl:references[c.id]||null};
}
fs.writeFileSync('quiz-data.js','// Generated by scripts/build-quiz.cjs. Original source wording remains in data.js.\nwindow.QUIZ_VERSION = 2;\nwindow.QUIZ_DATA = '+JSON.stringify(records,null,2)+';\nwindow.STUDY_DATA.cards.forEach(card => Object.assign(card, window.QUIZ_DATA[card.id]));\n');
console.log('Built',Object.keys(records).length,'quizzes;',Object.values(records).filter(c=>c.type==='multiple').length,'select-all;',Object.values(records).filter(c=>c.addedChoices).length,'with supplemental choices.');
