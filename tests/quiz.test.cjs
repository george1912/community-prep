const assert=require('node:assert/strict');
global.window={};require('../data.js');
const originals=new Map(window.STUDY_DATA.cards.map(c=>[c.id,{question:c.originalQuestion,answer:c.originalAnswer}]));
require('../quiz-data.js');require('../blueprint.js');
const cards=window.STUDY_DATA.cards;
assert.equal(cards.length,270);
assert.equal(new Set(cards.map(c=>c.id)).size,270);
assert.equal(cards.filter(c=>c.type==='choice').length,245);
assert.equal(cards.filter(c=>c.type==='multiple').length,25);
for(const c of cards){
 assert.ok(c.rationale.trim(),`Rationale ${c.id}`);
 assert.deepEqual(c.options.map(o=>o.label),Array.from({length:c.options.length},(_,i)=>String.fromCharCode(65+i)));
 assert.equal(c.originalQuestion,originals.get(c.id).question);
 assert.equal(c.originalAnswer,originals.get(c.id).answer);
 assert.ok(c.correct.every(i=>Number.isInteger(i)&&i>=0&&i<c.options.length));
 assert.equal(new Set(c.correct).size,c.correct.length);
 assert.ok(c.correct.length<c.options.length);
 assert.equal(new Set(c.options.map(o=>o.text.toLowerCase().trim())).size,c.options.length);
 if(c.type==='choice'){assert.equal(c.options.length,4);assert.equal(c.correct.length,1);}
 else {assert.ok(c.correct.length>1);assert.match(c.question,/select all/i);}
 assert.equal(c.answer,c.correct.map(i=>c.options[i].label+'. '+c.options[i].text).join('\n\n'));
}
// The decimal weight in source card 59 must never become its own answer choice.
assert.equal(cards[58].options.length,4);
assert.ok(cards[58].options.some(o=>/2\.2 kg/.test(o.text)));
assert.equal(cards[62].options[cards[62].correct[0]].text,'Primary prevention');
assert.equal(cards[106].correct.length,2);
assert.match(cards[151].answer,/24\.5/);
assert.ok(cards[242].options.some(o=>/end-stage renal disease/.test(o.text)));
for(const s of window.BLUEPRINT.sections)for(const id of s.ids)assert.ok(cards.some(c=>c.id===id));
console.log('PASS: all 270 quizzes; 245 four-option questions; 25 select-all; rationales; source preservation; answer keys; blueprint references.');
