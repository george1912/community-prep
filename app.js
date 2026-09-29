(() => {
  'use strict';
  const { cards, topics } = window.STUDY_DATA;
  const byId = new Map(cards.map(c => [c.id, c]));
  const topicMap = new Map(topics.map(t => [t.id, t]));
  const blueprint = window.BLUEPRINT;
  const topicGroups = topics.map(t => ({ ...t, ids: cards.filter(c => c.topic === t.id).map(c => c.id) }));
  const groupMap = new Map([...topicGroups, ...blueprint.sections].map(group => [group.id, group]));
  const blueprintIds = [...new Set(blueprint.sections.flatMap(section => section.ids))];
  const main = document.querySelector('#main');
  const storageKey = 'community-practice-v1';
  let storageWorks = true;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; }
  catch { storageWorks = false; }
  const progress = {};
  if (saved.progress && typeof saved.progress === 'object') {
    for (const [id, mark] of Object.entries(saved.progress)) {
      if (byId.has(Number(id)) && ['known', 'review'].includes(mark)) progress[id] = mark;
    }
  }
  let session = validateSession(saved.session);
  let mode = 'practice';
  if (session && saved.quizVersion !== window.QUIZ_VERSION) session = { ...session, index: 0, responses: {} };
  let organization = saved.organization === 'topics' ? 'topics' : 'blueprint';
  let questionSize = [80, 90, 100, 110, 125, 150].includes(saved.questionSize) ? saved.questionSize : 100;
  let view = 'home';
  let openTopics = new Set();
  let toastTimer;

  function validateSession(value) {
    if (!value || !Array.isArray(value.ids) || !value.ids.length ||
        !value.ids.every(id => byId.has(id)) || !Number.isInteger(value.index) ||
        value.index < 0 || value.index > value.ids.length) return null;
    return { ids: value.ids, index: value.index, title: typeof value.title === 'string' ? value.title : 'Study round',
      responses: value.responses && typeof value.responses === 'object' ? value.responses : {} };
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ progress, session, mode, organization, questionSize, quizVersion: window.QUIZ_VERSION })); }
    catch { storageWorks = false; toast('Browser storage is unavailable. Progress will last for this visit only.'); }
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
  function toast(message) {
    const node = document.querySelector('#toast');
    node.textContent = message; node.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('visible'), 3500);
  }
  function shuffled(ids) {
    const out = [...ids];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function pill(c) {
    const mark = progress[c.id];
    return mark === 'known' ? '<span class="pill known">Got it</span>' : mark === 'review' ?
      '<span class="pill review">Review again</span>' : '<span class="pill neutral">Not studied</span>';
  }
  function home() {
    view = 'home'; document.body.classList.remove('quiz-active');
    const isBlueprint = organization === 'blueprint';
    const groups = isBlueprint ? blueprint.sections : topicGroups;
    const scope = isBlueprint ? blueprintIds : cards.map(c => c.id);
    const known = Object.values(progress).filter(v => v === 'known').length;
    const review = Object.values(progress).filter(v => v === 'review').length;
    const scopeReview = scope.filter(id => progress[id] === 'review').length;
    const unfinished = session && session.index < session.ids.length;
    main.innerHTML = `${!storageWorks ? '<p class="save-warning">Browser storage is unavailable. Your marks will last for this visit only.</p>' : ''}
      <div class="organization-bar"><div><span class="field-label">Organize my practice</span><p>${isBlueprint ? 'Follow your teacher’s study guide.' : 'Browse the complete question bank.'}</p></div><div class="mode-switch organization-switch" role="group" aria-label="Organize practice"><button data-action="organization" data-value="blueprint" aria-pressed="${isBlueprint}">Blueprint mode</button><button data-action="organization" data-value="topics" aria-pressed="${!isBlueprint}">All topics</button></div></div>
      <section class="window"><div class="titlebar"><h2>Your study desk</h2><span class="right">READY WHEN YOU ARE</span></div><div class="window-body">
        <div class="intro"><div><h2>${isBlueprint ? 'Let’s work through the blueprint.' : 'Small rounds. Steady progress.'}</h2><p>${isBlueprint ? 'Pick a section below, talk through the key ideas, then try its matching cards. Or start a short round across the eight sections.' : 'Pick a topic or mix things up. Choose an answer, reveal the result, and read the rationale. Missed questions are saved for another look.'}</p></div>
          <div class="actions"><button class="btn primary" data-action="mixed">${isBlueprint ? '10 blueprint questions' : 'Start 10 questions'} →</button><button class="btn warm" data-action="review" ${scopeReview ? '' : 'disabled'}>Review again (${scopeReview})</button>
          ${unfinished ? `<button class="btn" data-action="resume">Resume · ${session.index + 1} of ${session.ids.length} →</button>` : ''}</div></div>
        <p class="progress-caption">Your progress across all 270 cards</p>
        <div class="stats"><div class="stat"><strong>${cards.length - known - review}</strong><span>Not studied</span></div><div class="stat"><strong>${known}</strong><span>Got it</span></div><div class="stat"><strong>${review}</strong><span>Review again</span></div></div>
      </div></section>
      <section class="window"><div class="titlebar"><h2 id="browse-heading" tabindex="-1">${isBlueprint ? 'Your blueprint · table of contents' : 'All topics · table of contents'}</h2><span class="right">${groups.length} ${isBlueprint ? 'SECTIONS' : 'TOPICS'}</span></div><div class="window-body">
        <p class="browse-intro">${isBlueprint ? 'Your teacher’s Autumn 2026 outline, in its original order. Choose a section to get started.' : 'Choose a category to open its cards. Your full deck is here.'}</p>
        <nav class="contents-grid" aria-label="${isBlueprint ? 'Blueprint' : 'Topic'} table of contents">${groups.map((g,i) => `<button class="contents-link" data-action="jump" data-id="${g.id}"><span class="contents-number">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(g.title)}</strong><small>${g.ids.length} matching ${g.ids.length===1?'card':'cards'}</small></span><span aria-hidden="true">↘</span></button>`).join('')}</nav>
        ${isBlueprint ? `<p class="blueprint-context">${blueprintIds.length} unique cards matched to the outline. Some appear in more than one section; your progress is shared.</p><details class="study-methods"><summary>How your teacher suggests studying</summary><p>Use these cards alongside your ATI modules, class notes, and discussions. After an answer, try explaining it, applying it to a new situation, and deciding why it fits.</p><ul>${blueprint.studyMethods.map(method=>`<li>${esc(method)}</li>`).join('')}</ul><p>Based on the teacher’s Autumn 2026 blueprint.</p></details>` : ''}
        <div class="results-line"><span id="match-count" role="status"></span><button class="text-button compact" data-action="collapse">Collapse all</button></div><div id="topics"></div>
        ${isBlueprint ? `<aside class="extra-practice"><h3>There’s more in your deck.</h3><p>${cards.length-blueprintIds.length} additional cards sit outside these matches, including other nursing and epidemiology questions.</p><button class="btn" data-action="organization" data-value="topics">Browse all 270 cards →</button></aside>` : ''}
      </div></section>`;
    renderTopics();
  }
  function renderTopics() {
    const isBlueprint = organization === 'blueprint';
    const groups = isBlueprint ? blueprint.sections : topicGroups;
    const scope = new Set(groups.flatMap(group => group.ids));
    const found = cards.filter(c => scope.has(c.id));
    const foundIds = new Set(found.map(c => c.id));
    document.querySelector('#match-count').textContent = `${found.length} unique ${found.length === 1 ? 'card' : 'cards'} to explore`;
    document.querySelector('#topics').innerHTML = groups.map((t, i) => {
      const list = t.ids.filter(id => foundIds.has(id)).map(id => byId.get(id));
      if (!list.length && !isBlueprint) return '';
      const known = list.filter(c => progress[c.id] === 'known').length;
      return `<details class="topic" id="section-${t.id}" data-topic="${t.id}" ${openTopics.has(t.id) ? 'open' : ''}>
        <summary><span class="topic-num">${String(i + 1).padStart(2,'0')}</span><div class="topic-copy"><h3>${esc(t.title)}</h3><div class="topic-sub">${known ? `${known} marked “Got it” · ` : ''}${list.length} ${list.length===1?'card':'cards'}</div></div><span class="chevron" aria-hidden="true">▼</span></summary>
        <div class="topic-body">${isBlueprint ? `<div class="conversation"><h4>${esc(t.conversation)}</h4><p>${esc(t.description)}</p></div><div class="focus-grid">${t.focuses.map((focus,index)=>{
          const ids=focus.ids.filter(id=>foundIds.has(id));
          return `<div class="focus-card"><h4>${esc(focus.title)}</h4><p>${esc(focus.prompt)}</p>${focus.gap?`<p class="coverage-note"><strong>Review in class notes</strong>${esc(focus.gap)}</p>`:''}<button class="text-button" data-action="focus" data-id="${t.id}" data-focus="${index}" ${ids.length?'':'disabled'}>${ids.length ? `Practice ${ids.length} ${ids.length===1?'card':'cards'} →` : 'Review in your class notes'}</button></div>`;
        }).join('')}</div><details class="blueprint-objectives"><summary>See the teacher’s wording</summary><ul>${t.objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ul></details>` : ''}
        <div class="topic-tools"><p>${isBlueprint ? 'Ready to put it together?' : esc(t.description)}</p><button class="btn" data-action="topic" data-id="${t.id}" ${list.length?'':'disabled'}>Study ${list.length} ${list.length===1?'card':'cards'} →</button></div>
        ${isBlueprint ? `<details class="card-previews"><summary>Preview the ${list.length} matching cards</summary>` : ''}
        <div class="card-grid">${list.map(c => `<button class="preview" data-action="card" data-group="${t.id}" data-id="${c.id}" aria-label="Open card ${c.id}: ${esc(c.question)}"><span class="preview-top"><span>QUESTION ${String(c.id).padStart(3,'0')}</span><span>${c.options.length ? c.type==='multiple' ? 'SELECT ALL' : 'MULTIPLE CHOICE' : 'RECALL'}</span></span><span class="preview-question">${esc(c.question)}</span><span class="preview-foot">${pill(c)}<span>Open ↗</span></span></button>`).join('') || '<p class="empty">No matching questions in this section.</p>'}</div>${isBlueprint?'</details>':''}
        <button class="text-button back-to-contents" data-action="contents">↑ Back to contents</button></div></details>`;
    }).join('') || '<div class="empty"><h3>No cards found</h3><p>Choose another topic.</p></div>';
    document.querySelectorAll('.topic').forEach(el => el.addEventListener('toggle', () => {
      if (el.open) openTopics.add(el.dataset.topic); else openTopics.delete(el.dataset.topic);
    }));
  }
  function mixedRound() {
    if (organization === 'topics') { start(shuffled(cards.map(c=>c.id)).slice(0,10), 'Mixed practice · 10 questions'); return; }
    // Cycle through the eight sections, sampling without repeating a shared card.
    const sections = shuffled(blueprint.sections).map(s => shuffled(s.ids));
    const chosen = new Set();
    for (let round=0; chosen.size<10 && round<10; round++) {
      for (const ids of sections) {
        const id=ids.find(id=>!chosen.has(id));
        if (id!==undefined) chosen.add(id);
        if (chosen.size===10) break;
      }
    }
    start([...chosen], 'Blueprint mix · 10 questions');
  }
  function start(ids, title) {
    if (!ids.length) { toast('No cards in this selection yet.'); return; }
    session = { ids, index: 0, title, responses: {} }; save(); showCard(); focusTop();
  }
  function response() {
    const id = session.ids[session.index];
    if (!session.responses[id]) session.responses[id] = { selected: [], revealed: false, draft: '', mark: null, correct: null, graded: false };
    return session.responses[id];
  }
  function focusTop() { main.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function showCard() {
    if (session.index >= session.ids.length) { summary(); return; }
    view = 'study'; document.body.classList.add('quiz-active');
    const c = byId.get(session.ids[session.index]), r = response();
    main.innerHTML = `<section class="window quiz-window">
      <div class="titlebar"><button class="quiz-back" data-action="home">← Topics</button><h2>${esc(session.title)}</h2><span class="right">${session.index + 1} / ${session.ids.length}</span></div>
      <div class="quiz-toolbar"><span>Q${c.id} · ${c.type==='multiple'?'Select all that apply':'Choose one answer'}</span>
      <div class="question-size" role="group" aria-label="Question text size"><button class="btn" data-action="size" data-direction="down" aria-label="Make question text smaller" ${questionSize===80?'disabled':''}>−</button><button class="text-button" data-action="size" data-direction="reset" aria-label="Reset question size to 100 percent"><span id="size-value" role="status">${questionSize}%</span></button><button class="btn" data-action="size" data-direction="up" aria-label="Make question text larger" ${questionSize===150?'disabled':''}>+</button></div></div>
      <article class="question-sheet quiz-workspace ${r.revealed?'is-revealed':''}" style="--question-scale:${questionSize/100}">
      <div class="quiz-question" tabindex="0" aria-label="Question and choices"><h3 class="question-text">${esc(c.question)}</h3>
      <div class="options" role="group" aria-label="Answer choices">${c.options.map((o,i)=>{
        const selected=r.selected.includes(i), correct=r.revealed&&c.correct.includes(i), wrong=r.revealed&&selected&&!c.correct.includes(i);
        return `<button class="option ${selected?'chosen':''} ${correct?'correct':''} ${wrong?'incorrect':''}" data-action="option" data-option="${i}" aria-pressed="${selected}" ${r.revealed?'disabled':''}><span class="letter">${esc(o.label)}</span><span class="option-text">${esc(o.text)}</span>${correct?'<span class="option-mark">✓ Answer</span>':wrong?'<span class="option-mark">Your choice</span>':''}</button>`;
      }).join('')}</div></div>
      ${r.revealed?answerMarkup(c,r):'<aside class="quiz-placeholder"><h3>Answer & rationale</h3><p>Pick your answer, then reveal to see why.</p></aside>'}
      </article>
      <div class="quiz-controls"><button class="text-button" data-action="previous" ${session.index===0?'disabled':''}>← Previous</button>
      ${r.revealed?`<button class="text-button" data-action="rate" data-mark="review">Review again ↻</button><button class="btn primary" data-action="skip">${session.index===session.ids.length-1?'See results':'Next'} →</button>`:`<button class="text-button" data-action="skip">Skip →</button><button class="btn primary" data-action="reveal" ${!r.selected.length?'disabled':''}>Reveal answer</button>`}</div></section>`;
  }
  function answerMarkup(c,r) {
    const label = r.graded ? r.correct ? '✓ Correct' : 'Another look' : 'Answer';
    const rationale = c.rationale;
    const short = rationale;
    return `<section class="answer-block" tabindex="0" aria-label="Answer and rationale"><h3 class="answer-label">${label}</h3><div class="answer-text">Correct ${c.correct.length>1?'answers':'answer'}: ${c.correct.map(i=>esc(c.options[i].label)).join(', ')}</div>
      ${r.draft ? `<p class="instruction"><strong>Your recall:</strong> ${esc(r.draft)}</p>` : ''}
      <div class="rationale"><h3>Rationale</h3>${rationale ? `<p>${esc(short)}${short!==rationale && !short.endsWith('.')?'…':''}</p>${short!==rationale?`<details><summary>Read the full rationale</summary><p>${esc(rationale)}</p></details>`:''}` : '<p>The PDF provides an answer but no rationale for this card.</p>'}</div>
      ${c.rationaleUrl?`<a class="rationale-reference" href="${esc(c.rationaleUrl)}" target="_blank" rel="noopener">Supporting reference ↗</a>`:''}
      ${c.note ? `<aside class="source-note"><strong>${c.needsReview ? 'Check with your course materials' : 'Source clarification'}</strong>${esc(c.note.text)}${c.note.url?`<br><a href="${esc(c.note.url)}" target="_blank" rel="noopener">Read supporting reference ↗</a>`:''}</aside>`:''}
      <details class="original"><summary>Source · PDF ${c.pages.length>1?'pages':'page'} ${c.pages.join(', ')} · Original card ${c.id}</summary><p>${c.addedChoices ? 'Answer choices were added for practice; they are not official ATI options. ' : ''}${c.rationaleKind==='Study explanation'?'The explanation was added for this quiz. ':''}The original source wording is preserved below.</p><pre>${esc(c.originalQuestion)}\n\nSOURCE ANSWER\n${esc(c.originalAnswer)}</pre><p>Page references refer to the original Quizlet export.</p></details></section>`;
  }
  function summary() {
    view = 'summary'; document.body.classList.remove('quiz-active'); save();
    const responses = session.ids.map(id => session.responses[id] || {});
    const got = responses.filter(r => r.mark === 'known').length;
    const again = responses.filter(r => r.mark === 'review').length;
    const scored = responses.filter(r => r.graded);
    const correct = scored.filter(r => r.correct).length;
    main.innerHTML = `<button class="text-button back" data-action="home">← Back to topics</button><section class="window"><div class="titlebar"><h2>Round complete</h2><span class="right">NICE WORK</span></div><div class="window-body"><div class="summary-sheet"><div class="result-symbol" aria-hidden="true">[ ✓ ]</div><h2>A little more prepared.</h2><p>${session.ids.length} ${session.ids.length===1?'card':'cards'} in this round. Every revisit is another chance to remember.</p><div class="stats"><div class="stat"><strong>${got}</strong><span>Marked “Got it”</span></div><div class="stat"><strong>${again}</strong><span>Review again</span></div><div class="stat"><strong>${session.ids.length-got-again}</strong><span>Skipped</span></div></div>${scored.length?`<p><strong>Practice checks: ${correct} / ${scored.length} correct.</strong><br>Correct answers are marked “Got it.” Missed questions are saved for review.</p>`:'<p>No answers were checked in this round. Try choosing an answer before revealing.</p>'}<div class="actions">${again?'<button class="btn warm" data-action="round-review">Revisit this round’s tricky cards ↻</button>':''}<button class="btn primary" data-action="mixed">Another 10 questions →</button><button class="btn" data-action="home">Explore topics</button></div></div></div></section>`;
    focusTop();
  }
  main.addEventListener('click', e => {
    const button = e.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action==='home') { save(); home(); focusTop(); }
    else if (action==='mixed') mixedRound();
    else if (action==='review') start(shuffled((organization==='blueprint'?blueprintIds:cards.map(c=>c.id)).filter(id=>progress[id]==='review')), organization==='blueprint'?'Blueprint · review again':'Review again');
    else if (action==='resume') { showCard(); focusTop(); }
    else if (action==='organization') {
      organization=button.dataset.value; save(); home();
      main.querySelector(`.organization-switch [data-value="${organization}"]`).focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    }
    else if (action==='jump') {
      openTopics.add(button.dataset.id); home();
      const section=document.getElementById(`section-${button.dataset.id}`);
      section.open=true; section.querySelector('summary').focus({preventScroll:true}); section.scrollIntoView({block:'start',behavior:'instant'});
    }
    else if (action==='contents') {
      document.querySelector('#browse-heading').focus({preventScroll:true});
      document.querySelector('#browse-heading').scrollIntoView({block:'start',behavior:'instant'});
    }
    else if (action==='collapse') {
      openTopics.clear(); document.querySelectorAll('#topics .topic').forEach(el=>{el.open=false;});
    }
    else if (action==='focus') {
      const section=groupMap.get(button.dataset.id), focus=section.focuses[Number(button.dataset.focus)];
      start(focus.ids, `Blueprint · ${focus.title}`);
    }
    else if (action==='topic') {
      const group=groupMap.get(button.dataset.id);
      start(group.ids, `${organization==='blueprint'?'Blueprint · ':''}${group.title}`);
    }
    else if (action==='card') {
      const id=Number(button.dataset.id), c=byId.get(id);
      const group=groupMap.get(button.dataset.group) || groupMap.get(c.topic);
      const ids=group.ids;
      const index=ids.indexOf(id);
      start([...ids.slice(index),...ids.slice(0,index)], `${organization==='blueprint'?'Blueprint · ':''}${group.title}`);
    }
    else if (action==='size') {
      const sizes=[80,90,100,110,125,150], index=sizes.indexOf(questionSize);
      questionSize=button.dataset.direction==='reset'?100:sizes[Math.max(0,Math.min(sizes.length-1,index+(button.dataset.direction==='up'?1:-1)))];
      const sheet=main.querySelector('.question-sheet'); sheet.style.setProperty('--question-scale',questionSize/100);
      main.querySelector('#size-value').textContent=`${questionSize}%`;
      main.querySelector('[data-direction=down]').disabled=questionSize===80;
      main.querySelector('[data-direction=up]').disabled=questionSize===150; save();
    }
    else if (action==='mode') { mode=button.dataset.mode; save(); showCard(); }
    else if (action==='option') {
      const r=response(), c=byId.get(session.ids[session.index]), i=Number(button.dataset.option);
      if (r.revealed) return;
      if (c.type==='multiple') r.selected=r.selected.includes(i)?r.selected.filter(x=>x!==i):[...r.selected,i];
      else r.selected=[i];
      const y=main.querySelector('.quiz-question').scrollTop; save(); showCard(); main.querySelector('.quiz-question').scrollTop=y;
      main.querySelector(`[data-option="${i}"]`)?.focus({preventScroll:true});
    }
    else if (action==='reveal') {
      const r=response(), c=byId.get(session.ids[session.index]);
      r.revealed=true;
      if (mode==='practice' && c.options.length && r.selected.length) {
        r.graded=true; r.correct=r.selected.length===c.correct.length && r.selected.every(i=>c.correct.includes(i));
        r.mark=r.correct?'known':'review'; progress[c.id]=r.mark;
      }
      save(); showCard();
      const answer=main.querySelector('.answer-block'); answer.setAttribute('tabindex','-1'); answer.focus({preventScroll:true});

    }
    else if (action==='rate') {
      const r=response(); r.mark=button.dataset.mark; progress[session.ids[session.index]]=r.mark;
      session.index++; save(); showCard(); focusTop();
    }
    else if (action==='skip') { session.index++; save(); showCard(); focusTop(); }
    else if (action==='previous') { session.index=Math.max(0,session.index-1); save(); showCard(); focusTop(); }
    else if (action==='round-review') start(session.ids.filter(id=>session.responses[id]?.mark==='review'), 'This round · review again');
  });
  const dialog=document.querySelector('#about');
  document.querySelector('#source-info').addEventListener('click',()=>dialog.showModal());
  document.querySelector('#reset-progress').addEventListener('click', () => {
    document.querySelector('#reset-confirm').hidden = false; document.querySelector('#confirm-reset').focus();
  });
  document.querySelector('#cancel-reset').addEventListener('click', () => { document.querySelector('#reset-confirm').hidden = true; document.querySelector('#reset-progress').focus(); });
  document.querySelector('#confirm-reset').addEventListener('click', () => {
    document.querySelector('#reset-confirm').hidden = true;
    Object.keys(progress).forEach(id => delete progress[id]); session = null; mode = 'practice'; openTopics = new Set();
    save(); dialog.close(); home(); focusTop(); toast('Study progress reset. Ready for a fresh start.');
  });
  dialog.querySelector('.window-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog && (e.clientX<dialog.getBoundingClientRect().left || e.clientX>dialog.getBoundingClientRect().right || e.clientY<dialog.getBoundingClientRect().top || e.clientY>dialog.getBoundingClientRect().bottom))dialog.close();});
  home();
})();
