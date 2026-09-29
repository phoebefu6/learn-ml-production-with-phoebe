# ML in Production: The Leader Cut

Six 45-minute sessions on the decisions of taking machine learning to production: scoping and the
baseline to beat, choosing a rollout pattern, the retrain policy and its price, monitoring wired to
actions, and when not to productionize at all. Leader-first, with a "what you would build" card for
practitioners in every session.

- **Live site:** https://phoebefu6.github.io/learn-ml-production-with-phoebe/
- **The bench (session 4):** 15,104 real half-hour rows of the Elec2 electricity market (Harries
  1999, OpenML dataset 151) replayed in the browser under eight retrain policies, scored on accuracy
  and retrain spend. A Python reference matches the browser engine row for row.
- **Sources:** Andrew Ng's Machine Learning in Production (DeepLearning.AI), Sculley et al. 2015
  "Hidden Technical Debt in Machine Learning Systems", Breck et al. 2017 "The ML Test Score",
  Zinkevich "Rules of Machine Learning", Chip Huyen on distribution shift and continual learning,
  Žliobaitė 2013 on the Electricity benchmark.

Static HTML, no build step. Open `index.html`, or serve the folder with `python3 -m http.server`.

by Phoebe Fu
