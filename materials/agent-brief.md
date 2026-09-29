# Agent brief - shared by every fan-out page of learn-ml-production-with-phoebe

Filled from `~/.claude/skills/course-builder/references/agent-brief.template.md` on 2026-09-29.
Internal build document: never link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   4 options per quiz question and the `div.wyb` practitioner card:
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ml-production-with-phoebe/courses/01-the-first-deployment-is-the-middle.html`
   For rhythm and the bench's numbers you may also read (do not copy its bench markup):
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ml-production-with-phoebe/courses/04-the-retrain-policy-bench.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams and the
   bench canon. Use ONLY its numbers; never invent a statistic; if a fact is missing, teach the
   uncertainty. `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ml-production-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines):
   `/Users/phoebe.fu/Documents/Claude_Work/github_repo/learn-ml-production-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-ml-production-with-phoebe</a> / Session N of 6`,
#toggle-all, #zoom-toggle) · masthead (eyebrow "ML in Production: The Leader Cut · Session N of 6",
h1 with one `<span class="accent">`, .sub, .chip-row with the level chip "🟠 Advanced" then two
audience chips (one for leaders, one for builders) and the time chip "45 min", .agenda a1-a4) ·
main.wrap · section#intro (Part 0 "Where we start": kicker, .lede, .legend pills as in the template,
.callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N` with
section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`,
`.caret ▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page ·
section#demo-1 Build-along (klabel "Build-along", kicker `.tag.demo "★ 22 min · everyone builds"`,
.lede, ONE figure, `.steps > .step`, each with a `<p>` then a `.prompt-box.good` carrying a
`span.label` "★ Block N · ..."; the build-along is a decision document the learner fills in for
their own system, as in the template) · then ONE `div.wyb` card exactly like the template's
(`<span class="wyb-pill">What you would build</span>`, a paragraph, one `.prompt-box.good` of
Python or config, a closing paragraph that links the owning sibling session for the tooling) ·
optional `.callout.tip` · section#exercise Homework (klabel "Homework", h2 "Before session N+1",
`.tag.exercise "30 min"`, ol, 4 items) · section#quiz (klabel "Check yourself", h2 "Three
questions", the "Clear all three..." line, 3 x `.quiz-q data-answer="0-based"`, `p.qtext`, four
`button.qopt` "A · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the correct letter) ·
section#official, klabel "Sources covered", h2 EXACTLY "What this session teaches, and where it came
from", `.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY
"Every fact on this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Session N cheat sheet <span>· pin this</span>", .grid-2 of six
.cheat-item) · `.callout.next` with `.nx-pill` "Next session" · footer.pagefoot ·
`<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url;
`<title>Session N · <Title> - learn ml production with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry, leader-first: every Part ends in a decision a leader
signs. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines is guidance about depth, never a
target: never collapse whitespace, dissolve a list into a paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. For constructed data print "your
  numbers will differ", never invented outputs as if run. Bench numbers: only the canon table and
  custom configs in the map, quoted exactly (two decimals), and only ones the session 4 widget
  prints for that setting.
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
- Citations in the exact form of the map's appendix; anything marked reported is "reported" on the
  page. Ng lecture content is reported (compiled lecture notes); Ng course page facts are read.
  Huyen: blog posts are read, the book is reported, and no number from the book.
- NEVER "lottery" or "lotteries"; say the mechanism. A verbatim quoted title in curly quotes is the
  only exception.
- Default to the English word. No Chinese terms needed on these pages.
- Titles, widget ids and class names must not collide with siblings. Do not reuse the ids
  `rtp-bench`, `bench`; do not invent new CSS classes (use only classes present in style.css and
  the template page).
- Seams: do NOT teach tooling (MLflow, registries, CI, Kubernetes), drift statistics (PSI, KS,
  ADWIN), validation governance, pipeline data-quality monitors, or error analysis. Name them in one
  line and link the owner from the map's seams table.
- Never "87 percent of models fail" or "85 percent of AI projects fail" as fact anywhere; session 6
  owns the correction.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): #A23B72 (accent) #6B2049 (deep) #B8508A (mid)
#EBC6DA (soft) #FBEFF5 (accent-50) #2A1621 (ink) #6A4B5C (muted) #E2CBD7 (faint) #F1E3EA
(hairline) #9A5B00 (ochre, the contrast colour) #6E4000 (ochre ink, for text) #FDF1DE (ochre-50)
· `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel or item.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `s<session><letter>`, e.g. s2a, s2b, s2c,
  s2d (session 2, figures a to d in page order).
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  accent line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, ink stroke
  1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none" stroke="#2A1621" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for
  hand-placed items, under 1 for panels). Fills: white, #FBEFF5, the hachure for "the pile" or "the
  data", and the ochre ONLY for the one thing the figure is about. One doodle anchor per figure,
  simple strokes, never a mascot. Text classes: `.PH` 800 12px ink heading · `.PL` 600 12px ink
  label · `.PS` 400 11px muted · `.PB` 800 11px ochre-ink #6E4000 · `.PV` 800 12-16px deep #6B2049
  value · `.PW` 800 12px white on a fill · `.PA` 700 11px accent axis caption · `.PN` 400 12px muted
  note. Hand-stacked items must not overlap as painted rects (the gate flags a pile).
- ALL `<text>` outside the filtered group, sans stack, never below 10.5px.
- Fit (owner: `diagram-kit.md`): max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px;
  full-width note under 110 chars; 40px between neighbouring point labels; bottom note 22px below the
  last row, H clears it by 8px. When in doubt, shorten. Text centred in a box must fit the box.
- Floor: one figure per Part plus one in the build-along. Draw the MECHANISM (traffic splitting to
  two model versions, the label arriving late, the loop from prediction to future training data,
  the stop rule's branches), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story from the map's cases (Ng's examples are reported; Sculley,
Zinkevich, Breck, Žliobaitė, Elec2 and the Gartner/VentureBeat texts are read). Constructed cases say
"constructed" on the page: the worked scoping memo (Northline Grid, a constructed electricity
retailer), rollout percentages beyond Ng's "maybe 5%", the alert table, the decision memo.
Leader-first: open every Part with the decision, then the mechanism. Builders get the `.wyb` card.

## Cross-links (absolute URLs)

- DataOps b5 experiment tracking: https://phoebefu6.github.io/learn-dataops-with-phoebe/courses/b5-experiment-tracking.html
- DataOps b6 deploy and monitor: https://phoebefu6.github.io/learn-dataops-with-phoebe/courses/b6-model-deploy-monitor.html
- Model Evaluation b9 drift and continuous eval: https://phoebefu6.github.io/learn-model-evaluation-with-phoebe/courses/b9-drift-continuous-eval.html
- Model Risk p8 ongoing monitoring: https://phoebefu6.github.io/learn-model-risk-with-phoebe/courses/p8-ongoing-monitoring.html
- Model Risk a2 effective challenge: https://phoebefu6.github.io/learn-model-risk-with-phoebe/courses/a2-effective-challenge.html
- Data Observability a2 five signals: https://phoebefu6.github.io/learn-data-observability-with-phoebe/courses/a2-five-signals.html
- Data Observability a4 alert or noise: https://phoebefu6.github.io/learn-data-observability-with-phoebe/courses/a4-alert-or-noise.html
- ML Strategy a3 error analysis: https://phoebefu6.github.io/learn-ml-strategy-with-phoebe/courses/a3-look-at-100-mistakes.html
- ML Strategy a6 one-page memo: https://phoebefu6.github.io/learn-ml-strategy-with-phoebe/courses/a6-the-one-page-memo.html
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chain and session titles

Footer left: `Session N of 6 · learn-ml-production-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>`
Footer right: `<a href="PREV.html">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT.html">Next: <title> →</a>`
(last page: `← Prev: ...` and `<a href="../index.html">Course home</a>`).

Session titles and files (exact, sentence case, one accent span in h1):
1. `01-the-first-deployment-is-the-middle.html` The first deployment is the middle
2. `02-scope-it-like-a-project.html` Scope it like a project
3. `03-shadow-canary-or-all-at-once.html` Shadow, canary, or all at once
4. `04-the-retrain-policy-bench.html` The retrain-policy bench
5. `05-monitor-what-you-will-act-on.html` Monitor what you will act on
6. `06-when-not-to-productionize.html` When not to productionize
