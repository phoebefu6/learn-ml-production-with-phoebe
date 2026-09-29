# Source notes - learn-ml-production-with-phoebe

Internal build input. Compiled 2026-09-29. Every fact carries a short verbatim quote, the URL read, and a tier:
- **read-at-source** = I read the primary text myself (PDF text extracted, or page HTML fetched).
- **reported** = seen only in a secondary source (named).
- **measured** = I computed it myself from the primary data file.

Quotes are copied from extracted text; ligatures ("fi", "fl") restored, otherwise verbatim.

---

## 1. Sculley et al. 2015, "Hidden Technical Debt in Machine Learning Systems" (NeurIPS 2015)

URL read: https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf (9 pages; Figure 1 rendered to PNG and read visually)

- **Authors (10, all Google, Inc.)**: D. Sculley, Gary Holt, Daniel Golovin, Eugene Davydov, Todd Phillips, Dietmar Ebner, Vinay Chaudhary, Michael Young, Jean-Francois Crespo, Dan Dennison. Tier: read-at-source.
- **Abstract list of risk factors**: "boundary erosion, entanglement, hidden feedback loops, undeclared consumers, data dependencies, configuration issues, changes in the external world". Tier: read-at-source.
- **Figure 1 caption (exact)**: "Only a small fraction of real-world ML systems is composed of the ML code, as shown by the small black box in the middle. The required surrounding infrastructure is vast and complex." Tier: read-at-source.
- **Figure 1 box labels (exact, read from rendered figure)**: Configuration; Data Collection; Feature Extraction; Data Verification; Machine Resource Management; Analysis Tools; Process Management Tools; Serving Infrastructure; Monitoring; and the tiny black box "ML Code". That is 9 surrounding boxes + ML Code. Box sizes are drawn, not quantified. Tier: read-at-source.
- **Percent claim - CORRECTION to the brief**: Figure 1 and its caption give NO percent. BUT the Glue Code section DOES give a number: "a mature system might end up being (at most) 5% machine learning code and (at least) 95% glue code". It is hedged ("might end up being"), framed as an argument for writing a native solution, not a measurement. Tier: read-at-source.
- Section 5 opener: "only a tiny fraction of the code in many ML systems is actually devoted to learning or prediction". Tier: read-at-source.
- **CACE / Entanglement**: "We refer to this here as the CACE principle: Changing Anything Changes Everything." Tier: read-at-source.
- **Correction cascades**: "a correction cascade can create an improvement deadlock". Tier: read-at-source.
- **Undeclared consumers**: "some of these consumers may be undeclared, silently using the output of a given model as an input to another system." Tier: read-at-source.
- **Unstable data dependencies**: "some input signals are unstable, meaning that they qualitatively or quantitatively change behavior over time." Mitigation: "create a versioned copy of a given signal." Tier: read-at-source.
- **Underutilized data dependencies**: "input signals that provide little incremental modeling benefit." Sub-kinds named: Legacy Features, Bundled Features, epsilon-Features, Correlated Features. Detection: "exhaustive leave-one-feature-out evaluations". Tier: read-at-source.
- **Feedback loops**: "live ML systems ... often end up influencing their own behavior if they update over time." Direct: "A model may directly influence the selection of its own future training data." Hidden: "two systems influence each other indirectly through the world." Tier: read-at-source.
- **Glue code**: "a massive amount of supporting code is written to get data into and out of general-purpose packages." Tier: read-at-source.
- **Pipeline jungles**: "a jungle of scrapes, joins, and sampling steps, often with intermediate files output." Tier: read-at-source.
- **Dead experimental codepaths**: Knight Capital example: "losing $465 million in 45 minutes, apparently because of unexpected behavior from obsolete experimental codepaths". Tier: read-at-source (the paper itself cites ref [15] for this).
- Other named items: Abstraction Debt; Common Smells (Plain-Old-Data Type Smell, Multiple-Language Smell, Prototype Smell). Tier: read-at-source.
- **Configuration debt**: "the number of lines of configuration can far exceed the number of lines of the traditional code." Tier: read-at-source.
- **Section 7 "Dealing with Changes in the External World"**: "Experience has shown that the external world is rarely stable." Tier: read-at-source.
- **Fixed thresholds in dynamic systems**: "if a model updates on new data, the old manually set threshold may be invalid." Tier: read-at-source.
- **Monitoring and Testing (the passage)**: "Comprehensive live monitoring of system behavior in real time combined with automated response is critical for long-term system reliability." Then: "The key question is: what to monitor?" Tier: read-at-source.
  - **Prediction Bias**: "the distribution of predicted labels is equal to the distribution of observed labels." Also notes a null model can pass it; "Slicing prediction bias by various dimensions isolate issues quickly". Tier: read-at-source.
  - **Action Limits**: "it can be useful to set and enforce action limits as a sanity check." Tier: read-at-source.
  - **Up-Stream Producers**: "These up-stream processes should be thoroughly monitored, tested, and routinely meet a service level objective". Tier: read-at-source.
- Section 8 "Other Areas": Data Testing Debt, Reproducibility Debt, Process Management Debt, Cultural Debt. Tier: read-at-source.
- Short version presented earlier: "A short version of this paper was presented at the SE4ML workshop in 2014 in Montreal, Canada." Tier: read-at-source.

## 2. Zinkevich, "Rules of Machine Learning: Best Practices for ML Engineering"

URL read: https://developers.google.com/machine-learning/guides/rules-of-ml (page footer: "Last updated 2025-08-25 UTC.")

- **Author**: Martin Zinkevich. **Total rules: 43** - page says "Read on to learn all 43 rules!" Rules numbered #1 to #43 confirmed. Tier: read-at-source.
- **Rule #1 (exact title)**: "Don't be afraid to launch a product without machine learning." Tier: read-at-source.
  - Supporting text (the 50% line, exact): "If you think that machine learning will give you a 100% boost, then a heuristic will get you 50% of the way there." Tier: read-at-source. NOTE: this is an illustrative rule of thumb, not a measurement.
  - Also: "If machine learning is not absolutely required for your product, don't use it until you have data." Tier: read-at-source.
- **Rule #2**: "First, design and implement metrics." Tier: read-at-source.
- **Rule #3**: "Choose machine learning over a complex heuristic." Text: "A simple heuristic can get your product out the door. A complex heuristic is unmaintainable." Tier: read-at-source.
- **Rule #4**: "Keep the first model simple and get the infrastructure right." Text: "The first model provides the biggest boost to your product, so it doesn't need to be fancy." Tier: read-at-source.
- **Rule #5**: "Test the infrastructure independently from the machine learning." Tier: read-at-source.
- **Rule #8**: "Know the freshness requirements of your system." CORRECTION to the brief: Rule 8 gives NO degradation percentages. It asks questions: "How much does performance degrade if you have a model that is a day old? A week old? A quarter old?" Examples given: "Most ad serving systems have new advertisements to handle every day, and must update daily." and "if the ML model for Google Play Search is not updated, it can have a negative impact in under a month." Tier: read-at-source.
- **Rule #9**: "Detect problems before exporting models." Text: "Many teams continuously deploying models check the area under the ROC curve (or AUC) before exporting." Tier: read-at-source.
- **Rule #10**: "Watch for silent failures." Numbers in it (exact): "a feature column could be populated in 90% of the examples, and suddenly drop to 60% of the examples." and "Play once had a table that was stale for 6 months, and refreshing the table alone gave a boost of 2% in install rate." Tier: read-at-source.
- **Rule #11 (exact title differs from brief)**: "Give feature columns owners and documentation." Tier: read-at-source.
- **Rule #16**: "Plan to launch and iterate." Text: "Many teams have launched a model per quarter or more for years." Tier: read-at-source.
- **Rule #29 (exact)**: "The best way to make sure that you train like you serve is to save the set of features used at serving time, and then pipe those features to a log to use them at training time." Tier: read-at-source.
- **Rule #32**: "Re-use code between your training pipeline and your serving pipeline whenever possible." Tier: read-at-source.
- **Rule #37**: "Measure Training/Serving Skew." Splits skew into train-vs-holdout, holdout-vs-next-day, next-day-vs-live; on the last: "a discrepancy here probably indicates an engineering error." Tier: read-at-source.

## 3. Breck, Cai, Nielsen, Salib, Sculley, "The ML Test Score" (IEEE Big Data 2017)

URL read: https://research.google.com/pubs/archive/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf (6 pages; copyright line "(c)2017 IEEE")

- **Authors**: Eric Breck, Shanqing Cai, Eric Nielsen, Michael Salib, D. Sculley (Google, Inc.). Tier: read-at-source.
- **28 tests**: "we present 28 specific tests and monitoring needs". Tier: read-at-source.
- **Four sections, 7 tests each** (section headings exact): "II. TESTS FOR FEATURES AND DATA", "III. TESTS FOR MODEL DEVELOPMENT", "IV. TESTS FOR ML INFRASTRUCTURE", "V. MONITORING TESTS FOR ML". Tables I, II, IV say "BRIEF LISTING OF THE SEVEN ..." tests; Table III lists Infra 1-7. Tier: read-at-source.
- **Data tests (Table I)**: 1 Feature expectations are captured in a schema. 2 All features are beneficial. 3 No feature's cost is too much. 4 Features adhere to meta-level requirements. 5 The data pipeline has appropriate privacy controls. 6 New features can be added quickly. 7 All input feature code is tested. Tier: read-at-source.
- **Model tests (Table II)**: 1 Model specs are reviewed and submitted. 2 Offline and online metrics correlate. 3 All hyperparameters have been tuned. 4 The impact of model staleness is known. 5 A simpler model is not better. 6 Model quality is sufficient on important data slices. 7 The model is tested for considerations of inclusion. Tier: read-at-source.
- **Infra tests (body headings)**: 1 Training is reproducible. 2 Model specification code is unit tested. 3 The full ML pipeline is integration tested. 4 Model quality is validated before attempting to serve it [heading truncated in extraction after "before attempting"]. 5 The model allows debugging by observing [...]. 6 Models are tested via a canary process [...]. 7 Models can be quickly and safely rolled back to a previous serving version. Tier: read-at-source (items 4-6 partly truncated; check PDF before quoting in full).
- **Monitoring tests (Table IV, exact)**: 1 Dependency changes result in notification. 2 Data invariants hold for inputs. 3 Training and serving are not skewed. 4 Models are not too stale. 5 Models are numerically stable. 6 Computing performance has not regressed. 7 Prediction quality has not regressed. Tier: read-at-source.
  - Body-heading versions: "Monitor 2: Data invariants hold in training and serving inputs"; "Monitor 3: Training and serving features compute the same values"; "Monitor 6: The model has not experienced a dramatic or slow-leak regressions in training speed, serving latency, throughput, or RAM usage"; "Monitor 7: The model has not experienced a regression in prediction quality on served data". Tier: read-at-source.
  - Monitor 3 how-to: "it is crucial to log a sample of actual serving traffic." Tier: read-at-source.
  - Monitor 5 how-to: "Explicitly monitor the initial occurrence of any NaNs or infinities." Tier: read-at-source.
- **Scoring rule (exact)**: "half a point is awarded for executing the test manually, with the results documented and distributed." / "A full point is awarded if there is a system in place to run that test automatically on a repeated basis." / "The final ML Test Score is computed by taking the minimum of the scores aggregated for each of the 4 sections." Tier: read-at-source.
- **Why minimum**: "we believe all four sections are important, and so a system must consider all in order to raise the score." Tier: read-at-source.
- **Table V interpretation bands (exact)**:
  - 0: "More of a research project than a productionized system."
  - (0,1]: "Not totally untested, but it is worth considering the possibility of serious holes in reliability."
  - (1,2]: "There's been first pass at basic productionization, but additional investment may be needed."
  - (2,3]: "Reasonably tested, but it's possible that more of those tests and procedures may be automated."
  - (3,5]: "Strong levels of automated testing and monitoring, appropriate for mission-critical systems."
  - > 5: "Exceptional levels of automated testing and monitoring."
  Tier: read-at-source. (Max possible per section = 7, so a section score is 0-7.)
- **36 teams**: "We met with 36 teams from across Google working in a diverse array of product areas". Figure 4 = "average score for each test across the 36 systems we examined." Tier: read-at-source.
- **Adoption stat**: "none of these tests was implemented by more than 80% of teams" ("in a survey of several dozen teams at Google"); "most tests had a nonzero score for at least half of the teams surveyed". Tier: read-at-source.
- **Least-implemented, most important**: "Perhaps the most important and least implemented test is the one for training/serving skew (Monitor 3)." Tier: read-at-source.
- Integration testing (Infra 3) "stood out as a test with much lower adoption than most." A hypothetical TFX system "already scored as 'reasonably tested'". Tier: read-at-source.
- The paper does NOT publish a per-team score distribution in text (only Figure 4 averages as a chart). Tier: read-at-source.

## 4. DeepLearning.AI / Coursera, "Machine Learning in Production" (Andrew Ng)

URLs read: https://www.coursera.org/learn/introduction-to-machine-learning-in-production ; https://www.deeplearning.ai/courses/machine-learning-in-production/ (both fetched 2026-09-29)

- **Official title**: "Machine Learning in Production" (both pages). Instructor: Andrew Ng. Tier: read-at-source. Historically called "Introduction to Machine Learning in Production", Course 1 of the MLOps / Machine Learning Engineering for Production specialization - the URL slug keeps "introduction-to"; the older name is reported only (Kenneth Leung notes, TDS summary).
- **Week titles - CORRECTION to the brief**: both official pages say Week 2 is "Modeling Challenges and Strategies", not "Select and train a model".
  - Week 1: "Overview of the ML Lifecycle and Deployment"
  - Week 2: "Modeling Challenges and Strategies" (DLAI lists a lesson "Select and train a model"; Coursera lists an assignment "Selecting and Training a Model")
  - Week 3: "Data Definition and Baseline" (DLAI lessons: "Define Data and Establish Baseline", "Label and Organize Data", "Scoping (optional)")
  Tier: read-at-source.
- Week 1 video list (Coursera): Welcome; Steps of an ML Project; Case study: speech recognition; Course outline; Key challenges; Deployment patterns; Monitoring; Pipeline monitoring. Tier: read-at-source.
- Week 3 includes Scoping videos: "What is scoping?", "Scoping process", "Diligence on feasibility and value", "Diligence on value", "Milestones and resourcing". Tier: read-at-source.
- Course description: "production systems need to handle relentlessly evolving data." (DLAI) Tier: read-at-source.
- **Page statistics (as displayed 2026-09-29, will drift)**: Coursera: "161,829 already enrolled"; "4.8" from "3,369 reviews"; "98% Most learners liked this course"; "1 week at 10 hours a week"; "3 modules"; "6 assignments"; module times 3 h / 3 h / 5 h. DLAI: "10h59m", "41 Video Lessons", "4 Code Examples", "5 Graded Assignments". Tier: read-at-source.
- Lecture content below is from **student-compiled notes of the lecture transcripts**, "Compiled by Kenneth Leung", PDF at https://raw.githubusercontent.com/kennethleungty/MLOps-Specialization-Notes/main/1.%20Introduction%20to%20Machine%20Learning%20in%20Production/Week%201%20-%20Overview%20of%20ML%20Lifecycle%20and%20Deployment.pdf . Official lecture notes are behind the course login. **Tier for all bullets below: reported** (near-transcript secondary).
  - **Lifecycle stages**: "First is scoping, in which you have to define the project or decide what to work on." then data ("defining the data and establishing a baseline, and then labelling and organizing the data"), then modeling ("select and train the model and also perform error analysis"), then deployment. Stage names Scoping / Data / Modeling / Deployment.
  - **POC to production gap**: "Sometimes people refer to it as the proof of concept (POC) to production gap."
  - **Ng's own ML-code share claim**: "For many machine learning projects, maybe only 5-10% is actually machine learning code." (Different figure from Sculley's hedged 5%; do not merge them.)
  - **Concept drift vs data drift**: "Concept drift, which is when the definition of what is y given x, changes." / "Data drift, which is if the distribution of x changes, even if the mapping from x or y does not change." Also: "This problem is sometimes called concept drift or data drift." (Ng uses the pair loosely in places.)
  - **Deployment patterns**: shadow mode ("algorithm shadow the human inspector and running parallel"), canary ("roll out to a small fraction, maybe 5% (or even less of traffic initially)"), blue green ("the old version of your software is called the blue ..."; advantage: "an easy way to enable rollback").
  - **Degrees of automation** (order): human only -> shadow mode -> AI assistance -> partial automation -> full automation. Quote: "one extreme would be if there's no automation, (human only system)". "both AI assistance and partial automation are examples of human in the loop".
  - **Monitoring**: "brainstorm all the things that could possibly go wrong"; software metrics ("memory, compute, latency, throughput, server load"); "input metrics, which measure whether your input distribution X has changed"; output metrics; then "set thresholds for alarms" (example: server load "above 0.91"). "It is okay if you adapt the metrics and the thresholds over time".

## 5. Chip Huyen, "Designing Machine Learning Systems" (O'Reilly 2022)

URLs read:
- https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html (blog; self-described as "a work-in-progress, created for the course CS 329S: Machine Learning Systems Design (Stanford, 2022)", points to the book for the full text)
- https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html
- https://raw.githubusercontent.com/chiphuyen/dmls-book/main/summary.md (author's own chapter summaries in her book repo)
- O'Reilly page https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/ - FETCH FAILED (Access Denied). Book text itself not read.

- **Covariate shift**: "Covariate shift is when P(X) changes, but P(Y|X) remains the same." Tier: read-at-source (blog).
- **Label shift**: "Label shift is when P(Y) changes, but P(X|Y) remains the same." Also "also known as prior shift, prior probability shift or target shift". Tier: read-at-source (blog).
- **Concept drift**: "Concept drift is when P(Y|X) changes, but P(X) remains the same." Tier: read-at-source (blog).
- She notes the terms are often conflated: "these are three distinct subtypes of data shift." Tier: read-at-source (blog).
- **Natural labels / feedback loop length**: "the time it takes from when a prediction is served until when the feedback on it is provided is the feedback loop length." Fraud example: "A typical dispute window is a month to three months." Tier: read-at-source (blog; same sentence in dmls summary.md Ch. 4 summary).
- **Degenerate feedback loop**: "a degenerate feedback loop is created when a system's outputs are used to create or process the same system's inputs". Tier: read-at-source (blog).
- **Stateless vs stateful**: "Most companies do stateless retraining - the model is trained from scratch each time. Continual learning means allowing stateful training - the model continues training on new data (fine-tuning)." Tier: read-at-source (real-time blog).
  - "continual learning isn't about the retraining frequency, but the manner in which the model is retrained." Tier: read-at-source.
  - "Once your infrastructure is set up to do stateful training, the training frequency is just a knob to twist." Tier: read-at-source.
  - Grubhub: "after switching from stateless daily retraining to stateful daily retraining, reduced their training cost 45 times (2021)." Tier: read-at-source (blog), itself a report of Grubhub's claim.
- **Four stages of continual learning (blog headings, exact)**: "Stage 1. Manual, Stateless Retraining"; "Stage 2. Automated Retraining"; "Stage 3. Automated, Stateful Training"; "Stage 4. Continual Learning". Stage 1 note: "A vast majority of companies outside the tech industry ... are in this stage." Stage 2: retraining frequency usually "set based on gut feeling". Tier: read-at-source (blog). The book's chapter-9 version may word stages differently - not read.
  - Author summary.md wording (verbatim, note oddity): "from the manual, training from scratch stage to automated, stateless continual learning." Tier: read-at-source. Flag: this contradicts the blog's "stateful" Stage 3; don't quote it without checking the book.
- **How often to update / value of data freshness**: summary.md: "'How often should I update my models?' by urging them to consider the value of data freshness to their models and the trade-offs between model iteration and data iteration." Tier: read-at-source (summary only). The book's actual data-freshness experiment and any numbers in it: NOT READ - do not cite numbers.
- Stage-4 update triggers: "time-based (e.g. every 5 minutes), performance-based ... or drift-based". Tier: read-at-source (blog).

## 6. Elec2 / OpenML dataset 151 "electricity"

URLs read: https://www.openml.org/api/v1/json/data/151 ; https://www.openml.org/api/v1/json/data/qualities/151 ; data file https://data.openml.org/datasets/0000/0151/dataset_151.pq (downloaded and inspected); https://search.r-project.org/CRAN/refmans/dynaTree/html/elec2.html ; https://arxiv.org/pdf/1301.3524 (Zliobaite 2013)

- **Instances**: "contains 45,312 instances dated from 7 May 1996 to 5 December 1998." Tier: read-at-source (OpenML). Confirmed shape 45,312 x 9. Tier: measured.
- **Granularity**: "Each example of the dataset refers to a period of 30 minutes, i.e. there are 48 instances for each time period of one day." Tier: read-at-source.
- **Source market**: "collected from the Australian New South Wales Electricity Market" ; prices "are set every five minutes." Tier: read-at-source.
- **Target**: "The class label identifies the change of the price (UP or DOWN) in New South Wales relative to a moving average of the last 24 hours". Tier: read-at-source.
- **Columns (9)**: date, day, period, nswprice, nswdemand, vicprice, vicdemand, transfer, class. OpenML qualities: NumberOfFeatures 9 (incl. target), 7 numeric, 2 symbolic (day, class), NumberOfMissingValues 0. Tier: read-at-source (API).
- **Class balance**: DOWN 26,075 / UP 19,237 (57.5% DOWN). Tier: measured (matches OpenML MajorityClassSize 26075, MinorityClassSize 19237). Zliobaite: "The prior probability of DOWN is 58%." Tier: read-at-source.
- **Normalisation**: "The data was normalized by A. Bifet." Date "normalized between 0 and 1"; all prices/demands/transfer normalized 0-1. Tier: read-at-source.
- **Missing/filled early values - NOT stated on OpenML** (OpenML says 0 missing). What I found:
  - Measured: vicprice, vicdemand and transfer hold one constant value (0.003467, 0.422915, 0.414912) for the first **17,424 rows** (= 363 days), changing first at normalized date 0.442326. Tier: measured. Interpretation (placeholder fill) is inference, not documented on OpenML.
  - dynaTree R docs: "27552 records ... subsampled as the completely observed portion of 45312 total records with missing values." Tier: read-at-source (secondary documentation). Note 45,312 - 27,552 = 17,760, which does NOT equal my 17,424 - do not state one number as the "missing" count without deciding which definition.
  - dynaTree also: drift expected because "the electricity market was expanded to include adjacent areas." Tier: read-at-source (secondary).
- **License**: OpenML API field `licence : Public`. Tier: read-at-source.
- **Citation on OpenML**: "**Please cite**: None". Relevant papers listed: "M. Harries. Splice-2 comparative evaluation: Electricity pricing. Technical report, The University of South Wales, 1999." (sic - OpenML says "South Wales"; the dynaTree docs and ResearchGate give "University of New South Wales, School of Computer Science and Engineering"). Also Gama, Medas, Castillo, Rodrigues 2004 "Learning with drift detection", SBIA. Creators: M. Harries, J. Gama, A. Bifet. Tag includes "concept_drift", "OpenML-CC18". Tier: read-at-source.
- **Benchmark caveat (useful for the course)**: Zliobaite 2013: a naive "same as current label" predictor "gives much higher 85% accuracy" vs 51% if labels were independent; "Autocorrelation peaks at every 48 instances (24 hours)". "It has been used in over 40 concept drift experiments" (Google Scholar, Jan 2013). Tier: read-at-source.

## 7. Two widely repeated failure-rate claims

### "87% of data science projects never make it into production" (VentureBeat 2019)
URL read: https://web.archive.org/web/2019id_/https://venturebeat.com/2019/07/19/why-do-87-of-data-science-projects-never-make-it-into-production/ (live venturebeat.com URL blocked by a bot checkpoint; archived copy read)
- Byline "VB Staff", July 19, 2019; labelled "Sponsored". Tier: read-at-source.
- Origin is a **conference panel write-up**, not a survey: Deborah Leff (IBM CTO for data science and AI) and Chris Chapo (Gap SVP data and analytics) "on stage at Transform 2019". Tier: read-at-source.
- The 87% appears only as its complement, with no source: "why do only 13% of data science projects, or just one out of every 10, actually make it into production?" The sentence is internally inconsistent (13% is not one in ten) and no survey, study or methodology is cited anywhere in the article. Tier: read-at-source. Verdict: unsourced talk-derived figure.

### Gartner "85% of AI projects fail"
URL read: https://web.archive.org/web/2023id_/https://www.gartner.com/en/newsroom/press-releases/2018-02-13-gartner-says-nearly-half-of-cios-are-planning-to-deploy-artificial-intelligence (live gartner.com returned 403)
- The actual text is a **forecast about bias, not a failure rate**: "Gartner predicts that through 2022, 85 percent of AI projects will deliver erroneous outcomes due to bias in data, algorithms or the teams responsible for managing them." Feb 13, 2018. Tier: read-at-source. Verdict: a prediction ("strategic planning assumption"), not survey data; "85% fail" misquotes it.

### Gartner "53% make it from prototype to production"
URL read: https://web.archive.org/web/2023id_/https://www.gartner.com/en/newsroom/press-releases/2022-08-22-gartner-survey-reveals-80-percent-of-executives-think-automation-can-be-applied-to-any-business-decision
- It's a survey figure: "the Gartner 2019 AI in Organizations Survey, which reported an average of 53% of AI projects that make it to production." Tier: read-at-source.
- The 2022 update: "on average, 54% of AI projects make it from pilot to production." Survey "conducted online from October through December 2021 among 699 respondents in the U.S., Germany and the U.K." Tier: read-at-source.
- The October 2020 Gartner release usually cited for "only 53% of projects make it from AI prototypes to production" (Top Strategic Technology Trends for 2021) - NOT READ (archive rate-limited). Tier: reported (search-result snippets only). Sample size of the 2019 survey not found.

---

## Could NOT read
- Sculley 2015 PDF: fully read. Nothing missing.
- ML Test Score: headings for Infra 4, 5, 6 are cut off in text extraction; full wording unconfirmed.
- Coursera/DLAI official lecture notes and video transcripts (login required). All lecture-content facts are "reported" via Kenneth Leung's compiled notes (GitHub). Weeks 2-3 notes PDFs not opened.
- O'Reilly page for Designing Machine Learning Systems (Access Denied). The book text itself was not read, so the data-freshness experiment and any numbers in it are unverified; I skipped unofficial full-text PDFs on purpose.
- Harries 1999 Splice-2 technical report (CiteSeerX returned an HTML stub; ResearchGate only a listing). Its contents, including any note on missing Victoria data, are unverified.
- J. Gama's ALES page (inescporto.pt), the original Elec2 host: connection failed.
- Gama et al. 2014 "A survey on concept drift adaptation" (ACM CSUR): not tried past search; paywalled - Elec2 mentions not checked.
- Live venturebeat.com (bot checkpoint - not bypassed; archive used) and live gartner.com (403; archive used).
- Gartner Oct 2020 "Top Strategic Technology Trends for 2021" release (archive 429).
