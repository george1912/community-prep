# Community Prep

A standalone, responsive quiz page with 270 community nursing cards organized into 13 topics. Its visual styling follows the supplied pediatrics reference; it does not modify that site.

## Run

Serve this directory with `python3 -m http.server 5179 --bind 127.0.0.1`, then open http://127.0.0.1:5179. The app is plain HTML/CSS/JavaScript with no build or API keys. It can also be opened directly using index.html; a local server is recommended for consistent browser storage and PDF links.

For static hosting, deploy `index.html`, `styles.css`, `app.js`, `data.js`, `quiz-data.js`, `blueprint.js` together. The site is published at https://george1912.github.io/community-prep/.

## Blueprint navigation

Blueprint mode is the initial organization view. It follows the eight sections in the teacher's Autumn 2026 document, with conversational study prompts and curated question matches. All topics remains available with all 270 cards.

- 173 distinct cards are mapped to blueprint sections. Sections can overlap; the same card ID shares progress everywhere. The 97 remaining cards remain available in All topics.
- A table of contents opens a complete section even if a previous search had no results. Search and filters are optional and collapsed by default. Numeric searches match the card number exactly; word searches normalize punctuation and support multiple terms.
- Focus groups let students practice a particular concept or the whole blueprint section. Missing or partial coverage is identified, including UNICEF, HBM components, food deserts, and implicit bias.
- Blueprint mixed rounds sample across the eight sections without duplicate questions. Review rounds use cards in the selected organization view. The overall progress totals always cover all 270 cards.
- The chosen organization view, card marks, and unfinished round survive reloads using the existing storage key. Changing views does not reset progress.
- `blueprint.js` stores curated assignments, original objectives, and study prompts. The original PDF and Word attachments remain local and are excluded from the public repository. These assignments are study aids, not teacher-provided exam counts or an assurance of complete coverage.

## Content and behavior

- Source: the supplied 134-page Quizlet PDF export, all 270 numbered cards.
- All 270 questions use selectable choices: 245 single-answer A–D questions and 25 select-all questions. Missing distractors were authored for practice and are not official ATI options.
- All questions have rationales. The original 221 source rationales are retained or clarified; the 49 missing explanations were added for study.
- Original question/answer wording and PDF page references are retained on every card.
- Identified source problems are annotated. Cards 130, 149, 152, and 201 have clarified displayed answers; the original answers remain accessible. Card 12's numeric key is matched to the option wording. Clinical accuracy of the full source bank has not been independently audited.
- Search, topic browsing, mixed rounds, multiple-choice scoring, automatic review of missed answers, review queue, and resume are supported.
- Browser localStorage saves progress on this device. No server, account, or cross-device sync.
- Google Fonts supplies Pixelify Sans and IBM Plex Sans, with local fallback fonts.

## Rebuilding data

`scripts/extract.py` uses pdfplumber to extract question and answer columns separately, respecting numbered card boundaries across pages. It reads a local `source.pdf`, which is not published. `scripts/build-data.py` creates `data.js` from the extraction and maintains topic assignments and source clarifications.

Keep the scripts and temporary extraction artifacts out of public hosting if they are not needed. Original PDF and Word downloads are excluded from the public site.

## Question size

Use − and + above the question to adjust text from 80% to 150%; tap the percentage to reset to 100%. Question text, choices, answers, and rationales scale together, with more compact spacing at smaller sizes. The preference is saved on the current device.

## Building the quiz

Run `node scripts/build-quiz.cjs` after rebuilding `data.js`. Supplemental choices and explanations are maintained in `content/`. The generated `quiz-data.js` adds the quiz layer while preserving each original question and answer. Option order is deterministic so saved answers remain stable. Version 2 restarts incompatible pre-quiz rounds while preserving existing study marks.

Run `node tests/quiz.test.cjs` to validate all question formats, keys, rationales, source preservation, and blueprint references.
