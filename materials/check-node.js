// Node twin of materials/elec_reference.py: runs the real browser engine (assets/elec-live.js)
// on the same sample and prints the same JSON. Usage: node materials/check-node.js [--json]
const path = require("path"), fs = require("fs");
const eng = require(path.join(__dirname, "..", "assets", "elec-live.js"));
const s = JSON.parse(fs.readFileSync(path.join(__dirname, "elec-sample.json"), "utf8"));
const d = eng.prepare(s);
const out = {};
for (const dly of [1, eng.DAY, eng.WEEK]) {
  for (const p of eng.PRESETS) {
    const r = eng.simulate(d, Object.assign({}, p.cfg, { delay: dly }));
    out[p.id + "@" + dly] = { buckets: r.buckets.map(b => b.correct), correct: r.correct, n: r.n, retrains: r.retrains };
    if (!process.argv.includes("--json")) console.log(`delay ${String(dly).padStart(3)}  ${p.id.padEnd(10)} ${(100 * r.correct / r.n).toFixed(2)}%  correct ${r.correct}/${r.n}  retrains ${r.retrains}`);
  }
}
const sorted = {}; Object.keys(out).sort().forEach(k => sorted[k] = out[k]);
if (process.argv.includes("--json")) console.log(JSON.stringify(sorted));
else { const m = eng.majority(d); console.log(`always DOWN ${(100 * m.correct / m.n).toFixed(2)}% vicOn row ${d.vicOn}`); }
