# Official course map - learn-ml-production-with-phoebe

"ML in Production: The Leader Cut". Bucket ds, diff 3 (Advanced), single track, 6 x 45 min.
Audience: both, leader-first; every session keeps one practitioner card, "What you would build"
(`div.wyb`). Built 2026-09-29. Raw research notes with quotes and URLs: `materials/source-notes.md`
(internal). This file is the one source of truth for every number a page may quote.

Evidence tiers: **read** = primary text read at source in this build · **reported** = seen only in a
secondary source, and must be marked "reported" on the page · **measured** = computed in this build
from the primary data file · **constructed** = invented for teaching, must say so on the page.

## Scope (Phoebe-approved)

This course owns the DECISIONS of taking ML to production: scoping and the baseline, deployment-pattern
choice, monitoring strategy (what you will act on), the retrain-policy decision and its economics,
feedback loops, and the kill / don't-productionize decision. It does not teach tooling.

## Seams (link, never re-teach)

| Topic | Owner | Link |
|---|---|---|
| Experiment tracking, registry | DataOps b5 | https://phoebefu6.github.io/learn-dataops-with-phoebe/courses/b5-experiment-tracking.html |
| Deploy scripts, serving, CI, model monitoring tooling | DataOps b6 | https://phoebefu6.github.io/learn-dataops-with-phoebe/courses/b6-model-deploy-monitor.html |
| Drift METRICS (PSI, KS, etc) and continuous eval | Model Evaluation b9 | https://phoebefu6.github.io/learn-model-evaluation-with-phoebe/courses/b9-drift-continuous-eval.html |
| Validation, effective challenge, ongoing monitoring governance | Model Risk (p8 ongoing monitoring, a2 challenge) | https://phoebefu6.github.io/learn-model-risk-with-phoebe/courses/p8-ongoing-monitoring.html |
| Pipeline data-quality monitors, freshness/volume/schema | Data Observability (a2, b5 distribution drift) | https://phoebefu6.github.io/learn-data-observability-with-phoebe/courses/a2-five-signals.html |
| Error analysis, what to fix next | ML Strategy (a3, p3) | https://phoebefu6.github.io/learn-ml-strategy-with-phoebe/courses/a3-look-at-100-mistakes.html |
| LLM / agent launch gates | Agent Launch | https://phoebefu6.github.io/learn-agent-launch-with-phoebe/ |

## Sessions and coverage

| # | File | Title | Level | Covers |
|---|---|---|---|---|
| 1 | 01-the-first-deployment-is-the-middle.html | The first deployment is the middle | 🟠 Advanced | Ng lifecycle (scoping, data, modeling, deployment) and the loop back; POC-to-production gap (reported); Sculley 2015 Figure 1 and the debt catalogue; ML Test Score as a readiness rubric |
| 2 | 02-scope-it-like-a-project.html | Scope it like a project | 🟠 Advanced | Ng scoping (diligence on feasibility and value, milestones); baselines incl. human-level and the no-model rule; Zinkevich Rules 1-4 and 16; metrics first |
| 3 | 03-shadow-canary-or-all-at-once.html | Shadow, canary, or all at once | 🟠 Advanced | Ng deployment patterns (shadow, canary, blue-green) and degrees of automation; rollback; ML Test Score Infra 6-7; Zinkevich Rules 29, 32, 37 (training/serving skew) |
| 4 | 04-the-retrain-policy-bench.html | The retrain-policy bench | 🔴 Bench | Elec2 replay; retrain cadence, window, alarm, label delay; no-model rung; Zinkevich Rule 8; Žliobaitė 2013; Huyen stateless vs stateful (reported) |
| 5 | 05-monitor-what-you-will-act-on.html | Monitor what you will act on | 🟠 Advanced | Ng monitoring (brainstorm what can go wrong; software, input, output metrics; thresholds that adapt); Sculley Section 7 (prediction bias, action limits, up-stream producers); ML Test Score monitoring section (7 tests); alert-to-action; feedback loops (Sculley direct/hidden; Huyen degenerate loops, feedback loop length); covariate/label/concept shift definitions (Huyen blog, read) |
| 6 | 06-when-not-to-productionize.html | When not to productionize | 🟠 Advanced | Kill decision; the failure-rate folklore (87%, 85%, 53%) corrected; ML Test Score bands; Zinkevich Rule 1; bench evidence (no-model at fast labels); capstone one-page production decision memo |

## Verified facts

### Sculley et al. 2015, Hidden Technical Debt in Machine Learning Systems (NeurIPS 2015) - read
- 10 authors, all Google: D. Sculley, Gary Holt, Daniel Golovin, Eugene Davydov, Todd Phillips, Dietmar Ebner, Vinay Chaudhary, Michael Young, Jean-Francois Crespo, Dan Dennison.
- Figure 1 caption: "Only a small fraction of real-world ML systems is composed of the ML code, as shown by the small black box in the middle. The required surrounding infrastructure is vast and complex."
- Figure 1 boxes (9 + ML Code): Configuration; Data Collection; Feature Extraction; Data Verification; Machine Resource Management; Analysis Tools; Process Management Tools; Serving Infrastructure; Monitoring; ML Code. Sizes are drawn, not quantified.
- The figure gives NO percent. The Glue Code section does: "a mature system might end up being (at most) 5% machine learning code and (at least) 95% glue code". Hedged ("might"), an argument, not a measurement. Pages must say "might" and must not attribute a measured share.
- Ng's lecture says "maybe only 5-10%" is ML code (reported, Leung notes). Different figure; never merged with Sculley's.
- Debt catalogue: CACE "Changing Anything Changes Everything" (entanglement); correction cascades ("improvement deadlock"); undeclared consumers; unstable data dependencies (fix: versioned copy of a signal); underutilized data dependencies (legacy, bundled, epsilon, correlated features; leave-one-feature-out); feedback loops, direct and hidden; glue code; pipeline jungles; dead experimental codepaths (Knight Capital, $465 million in 45 minutes, as cited by the paper); abstraction debt; common smells; configuration debt; changes in the external world (fixed thresholds; monitoring and testing: prediction bias, action limits, up-stream producers); data testing, reproducibility, process management, cultural debt.
- Monitoring passage: "Comprehensive live monitoring of system behavior in real time combined with automated response is critical for long-term system reliability." "The key question is: what to monitor?"
- Prediction bias: distribution of predicted labels should equal observed labels; a null model can pass it; slice it.

### Zinkevich, Rules of Machine Learning (Google Developers, page updated 2025-08-25) - read
- 43 rules.
- Rule 1 "Don't be afraid to launch a product without machine learning." "If you think that machine learning will give you a 100% boost, then a heuristic will get you 50% of the way there." (illustrative rule of thumb, not a measurement; pages must say so). "If machine learning is not absolutely required for your product, don't use it until you have data."
- Rule 2 "First, design and implement metrics." Rule 3 "Choose machine learning over a complex heuristic." ("A simple heuristic can get your product out the door. A complex heuristic is unmaintainable.") Rule 4 "Keep the first model simple and get the infrastructure right." Rule 5 "Test the infrastructure independently from the machine learning."
- Rule 8 "Know the freshness requirements of your system." Asks: "How much does performance degrade if you have a model that is a day old? A week old? A quarter old?" Ads "must update daily"; Google Play Search "negative impact in under a month". No percentages.
- Rule 9 "Detect problems before exporting models." (AUC check before export.)
- Rule 10 "Watch for silent failures." Column populated in 90% of examples dropping to 60%; Play table stale for 6 months, refreshing it gave "a boost of 2% in install rate".
- Rule 11 "Give feature columns owners and documentation." Rule 16 "Plan to launch and iterate." ("Many teams have launched a model per quarter or more for years.")
- Rule 29 save serving-time features and log them for training. Rule 32 re-use code between training and serving. Rule 37 "Measure Training/Serving Skew" (next-day vs live discrepancy "probably indicates an engineering error").

### Breck, Cai, Nielsen, Salib, Sculley, The ML Test Score (IEEE Big Data 2017) - read
- 28 tests, 4 sections of 7: features and data; model development; ML infrastructure; monitoring.
- Scoring: 0.5 point manual (documented, distributed), 1 point automated and repeated; final score = MINIMUM of the four section scores ("a system must consider all in order to raise the score").
- Bands: 0 "More of a research project than a productionized system." (0,1] "Not totally untested, but it is worth considering the possibility of serious holes in reliability." (1,2] "There's been first pass at basic productionization, but additional investment may be needed." (2,3] "Reasonably tested, but it's possible that more of those tests and procedures may be automated." (3,5] "Strong levels of automated testing and monitoring, appropriate for mission-critical systems." >5 "Exceptional levels of automated testing and monitoring."
- Monitoring tests: 1 dependency changes result in notification; 2 data invariants hold for inputs; 3 training and serving are not skewed; 4 models are not too stale; 5 models are numerically stable; 6 computing performance has not regressed; 7 prediction quality has not regressed.
- Model tests include 4 "The impact of model staleness is known" and 5 "A simpler model is not better". Infra 6 canary, Infra 7 "Models can be quickly and safely rolled back to a previous serving version." (Infra 4-6 full headings truncated in extraction: quote only the short forms.)
- 36 Google teams met; "none of these tests was implemented by more than 80% of teams"; Monitor 3 training/serving skew "Perhaps the most important and least implemented test".

### DeepLearning.AI / Coursera, Machine Learning in Production (Andrew Ng) - pages read, lectures reported
- Title "Machine Learning in Production"; weeks: 1 "Overview of the ML Lifecycle and Deployment", 2 "Modeling Challenges and Strategies", 3 "Data Definition and Baseline" (scoping is an optional part of week 3). read.
- Page stats drift; do NOT quote enrolment/ratings.
- Lifecycle scoping -> data -> modeling -> deployment, with loops back (reported).
- "proof of concept (POC) to production gap" (reported).
- Deployment patterns: shadow mode; canary ("maybe 5% (or even less of traffic initially)"); blue green (easy rollback) (reported).
- Degrees of automation: human only -> shadow mode -> AI assistance -> partial automation -> full automation; AI assistance and partial automation are "human in the loop" (reported).
- Concept drift = mapping x to y changes; data drift = distribution of x changes (reported; Ng uses them loosely at times).
- Monitoring: brainstorm what could go wrong; software metrics (memory, compute, latency, throughput, server load), input metrics, output metrics; set alarm thresholds and adapt them over time (reported).

### Huyen, Designing Machine Learning Systems (O'Reilly 2022)
- Book text NOT read. Blog posts by the author read (read, blog):
- Covariate shift P(X) changes, P(Y|X) same; label shift P(Y) changes, P(X|Y) same; concept drift P(Y|X) changes, P(X) same.
- Feedback loop length: time from serving a prediction to getting feedback on it; fraud dispute window "a month to three months".
- Degenerate feedback loop: system's outputs used to create or process the same system's inputs.
- Stateless retraining (from scratch) vs stateful training (fine-tuning); "continual learning isn't about the retraining frequency, but the manner in which the model is retrained."
- Four stages: 1 manual, stateless retraining; 2 automated retraining (frequency "set based on gut feeling"); 3 automated, stateful training; 4 continual learning (time-, performance- or drift-based triggers).
- Grubhub "reduced their training cost 45 times" after stateless -> stateful daily retraining: reported (a company claim relayed by the blog).
- The book's data-freshness experiment: NOT read, no numbers cited.

### Elec2 / OpenML 151 - read + measured
- 45,312 half-hour rows, 7 May 1996 to 5 December 1998, NSW electricity market; label UP/DOWN of NSW price relative to its 24-hour moving average; normalised by A. Bifet. read (OpenML).
- DOWN 26,075 / UP 19,237 (57.5% DOWN) on the full file. measured.
- The ARFF header records `weka.filters.unsupervised.attribute.ReplaceMissingValues`; vicprice, vicdemand, transfer are constant for the first 17,424 rows (363 days), moving from row 17,424 (5 May 1997). read (header) + measured. Pages say "missing and filled in before the file was published" and "roughly the first year".
- Harries 1999 Splice-2 technical report not read; cited as the dataset's origin only.
- Baselines on the FULL file via `fetch_openml(data_id=151, as_frame=True)`, measured 2026-09-29 (session 2 snippet, exact code):
  `y = (df["class"] == "UP").astype(int)`; `len(df), round(1 - y.mean(), 4)` -> `45312 0.5755`;
  `round((y == y.shift(1)).iloc[1:].mean(), 4)` -> `0.8533` (repeat the previous half-hour);
  `round((y == y.shift(48)).iloc[48:].mean(), 4)` -> `0.6562` (repeat the same half-hour yesterday, i.e. a label one day late).

### Žliobaitė 2013, How good is the Electricity benchmark for evaluating concept drift adaptation (arXiv 1301.3524) - read
- "moving average of one" (repeat the current label) scores 85.3 percent on Elec2; 51 percent if labels were independent; prior of DOWN 58 percent; used in over 40 concept drift experiments.
- "random change alarms may boost the accuracy figures"; recommends comparing against the moving average of one.
- This build reproduces 85.33 percent on the full 45,312 rows. measured.

### Failure-rate folklore (session 6) - read
- "87% of data science projects never make it into production": VentureBeat, 19 July 2019, "VB Staff", labelled Sponsored, a write-up of a Transform 2019 panel (IBM's Deborah Leff, Gap's Chris Chapo). Text says "only 13% ..., or just one out of every 10", internally inconsistent, no survey cited. Verdict: unsourced talk figure.
- "Gartner: 85% of AI projects fail": the 13 Feb 2018 release says "through 2022, 85 percent of AI projects will deliver erroneous outcomes due to bias in data, algorithms or the teams responsible for managing them." A prediction about bias, not a failure rate.
- "53% make it from prototype to production": Gartner 2019 AI in Organizations Survey average, as restated in a 22 Aug 2022 release; the 2022 update says "on average, 54% of AI projects make it from pilot to production", survey Oct-Dec 2021, 699 respondents (US, Germany, UK). read (archived release). The 2020 release usually cited: reported.
- Sibling check: learn-ship-playbook-with-phoebe s05 already treats "the 85 percent forecast and the 87 percent claim" as not stated as fact. Consistent; no sibling fix needed.

## Bench canon (session 4) - measured, node == Python

Sample: every 3rd row of the 45,312 (15,104 rows, 1.5 h apart, 16/day, 112/week), 5 inputs
quantised round(v*255), period and weekday from the row index, sin/cos of period as a 16-entry
integer table. 166,527 bytes JSON. Model: ridge least squares (lambda 65025 in integer units) on 9
inputs (bias, nswprice, nswdemand, vicprice, vicdemand, transfer, sin, cos, weekend), labels +/-1,
score > 0 = UP. First model on rows [0, 448) (4 weeks). Scored rows 448..15103 = 14,656.
Labels known at step t: rows [0, t - D + 1). Alarm: window of the last M labelled rows predicted
since the last fit; base = first full window; fire when correct*100 < base*100 - theta*M.

Agreement: `python3 materials/elec_reference.py --json` and `node materials/check-node.js --json`
give identical correct counts, retrain counts and 33 four-week block counts for all 8 presets x 3
delays (24/24), plus 9 custom configs. Always DOWN on scored rows: 57.72% (8,460/14,656).
Full-file persistence: 85.33%. Victoria inputs start varying at sample row 5,811.

| Preset | D=1 (1.5 h) | D=16 (1 day, default) | D=112 (1 week) | Retrains |
|---|---|---|---|---|
| none (repeat last known label) | 74.63 (10,938) | 65.35 (9,577) | 65.80 (9,643) | 0 |
| never | 68.70 (10,068) | 68.70 (10,068) | 68.70 (10,068) | 0 |
| quarterly (13 wk, all) | 72.52 (10,629) | 72.44 (10,617) | 72.33 (10,601) | 10 |
| monthly (4 wk, all) | 73.10 (10,713) | 73.11 (10,715) | 73.03 (10,703) | 32 |
| weekly (all) | 73.51 (10,774) | 73.55 (10,779) | 73.30 (10,743) | 130 |
| alarm (10 pts, 4-wk window, all) | 72.78 (10,666) | 72.78 (10,666) | 72.61 (10,642) | 6 |
| recent (weekly, last 4 wk) | 69.89 (10,243) | 69.88 (10,241) | 68.98 (10,109) | 130 |
| twitchy ANTI (every step, last 8 rows) | 69.45 (10,179) | 61.91 (9,074) | 62.42 (9,148) | 14,655 |

At default D=1 day, $500/retrain (constructed cost, set by the learner): spend quarterly $5,000,
monthly $16,000, weekly $65,000, alarm $3,000, recent $65,000, twitchy $7,327,500. vs never:
quarterly +3.75 pts ($1,335/pt), monthly +4.41 ($3,624/pt), weekly +4.85 ($13,399/pt), alarm +4.08
($735/pt), recent +1.18 ($55,066/pt), twitchy -6.78, none -3.35. Weekly vs none +8.20. Twitchy vs
none -3.43.

Custom configs (D=1 day): daily schedule all history 73.55 (10,779), 915 retrains; alarm 5 pts/4 wk
71.38 (10,462), 8 retrains; alarm 0 pts/4 wk 73.24 (10,734), 26; alarm 15 pts/4 wk 70.49 (10,331), 1;
alarm 2 pts/1 wk 69.76 (10,224), 10; alarm 0 pts/1 day 72.79 (10,668), 209; alarm 10 pts on last 4
wk window 68.14 (9,986), 6; weekly on last 26 wk 71.79 (10,522), 130.

Never-retrain four-week blocks: 73.7 79.0 72.8 74.6 then mostly low 60s to low 70s, 58.5 at block
24 (1998); weekly blocks reach 82-83 in blocks 6-7 and 13.

## Constructed cases (must say "constructed" on the page)
- The $500 cost per retrain (bench default; learner sets it).
- Session 2 scoping worksheet example: a constructed demand-forecast team ("Northline Grid", a constructed retailer of electricity) with constructed numbers.
- Session 3 rollout example numbers (traffic shares beyond Ng's "maybe 5%").
- Session 5 alert table example.
- Session 6 decision memo worked example.

## Not covered (honest list)
- Tooling (MLflow, registries, Kubernetes, feature stores, CI): DataOps b5/b6.
- Drift statistics and detectors (PSI, KS, ADWIN, DDM): Model Evaluation b9. The bench uses plain rolling accuracy.
- Continual / stateful training: described (Huyen, blog) but not benchmarked; the bench refits from scratch.
- Model risk validation and sign-off governance: Model Risk.
- LLM-specific deployment and evaluation: Agent Launch, AI Observability.
- Ng course weeks 2 (modeling challenges) and the labelling half of week 3: ML Strategy owns error analysis.
- Huyen's book chapters and her data-freshness experiment: not read, no numbers.
- Harries 1999 report text: not read.
- Coursera certificate and videos stay official; nothing here replaces them.

## Citation appendix (exact forms for pages)
- Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J.-F., Dennison, D. (2015). Hidden Technical Debt in Machine Learning Systems. NeurIPS 2015.
- Zinkevich, M. Rules of Machine Learning: Best Practices for ML Engineering. Google for Developers.
- Breck, E., Cai, S., Nielsen, E., Salib, M., Sculley, D. (2017). The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction. IEEE Big Data 2017.
- Ng, A. Machine Learning in Production. DeepLearning.AI, on Coursera.
- Huyen, C. (2022). Designing Machine Learning Systems. O'Reilly. (reported) and Huyen, C. (2022). Data Distribution Shifts and Monitoring; Real-time machine learning: challenges and solutions. huyenchip.com.
- Harries, M. (1999). Splice-2 comparative evaluation: Electricity pricing. Technical report, University of New South Wales. Via OpenML dataset 151 "electricity".
- Žliobaitė, I. (2013). How good is the Electricity benchmark for evaluating concept drift adaptation. arXiv:1301.3524.
- VB Staff (2019). Why do 87% of data science projects never make it into production? VentureBeat, 19 July 2019.
- Gartner (2018). Gartner Says Nearly Half of CIOs Are Planning to Deploy Artificial Intelligence. Press release, 13 Feb 2018.
- Gartner (2022). Gartner Survey Reveals 80% of Executives Think Automation Can Be Applied to Any Business Decision. Press release, 22 Aug 2022.
