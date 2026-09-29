/* elec-live.js - the retrain-policy bench for learn-ml-production-with-phoebe (session 4)
 *
 * 15,104 real half-hour rows of the Elec2 electricity market (New South Wales, May 1996 to
 * December 1998; OpenML dataset 151, Harries 1999), one row every 1.5 hours, replayed forward in
 * time. One fixed, deliberately simple model predicts UP or DOWN for every row. The only thing
 * that changes between runs is the retrain POLICY: when the model is refitted, on which rows, and
 * how late the true labels arrive.
 *
 * What is REAL: the rows, the labels, every prediction, every accuracy figure, every retrain count.
 * What is SET BY YOU, and labelled so on the widget: the dollar cost of one retrain. Spend is
 * retrains x that number and nothing else.
 *
 * The model: a linear score on nine inputs (a constant, NSW price, NSW demand, Victoria price,
 * Victoria demand, scheduled transfer, sin and cos of the half-hour, a weekend flag), fitted by
 * ridge least squares on +1/-1 labels; score > 0 means UP. Inputs are integers, so the X'X and
 * X'y prefix sums are exact, and the 9x9 solve runs in a fixed loop order. materials/
 * elec_reference.py repeats the arithmetic line for line; both must print the same counts.
 */
(function (root) {
  "use strict";

  var DAY = 16, WEEK = 112, T0 = 4 * WEEK, LAM = 65025, D = 9, BLOCK = 4 * WEEK;

  var PRESETS = [
    { id: "none", label: "No model", note: "Predict whatever the last known label was. Needs no training, no serving stack, no retrains.",
      cfg: { policy: "none" } },
    { id: "never", label: "Never retrain", note: "Train once on the first four weeks, ship, walk away.",
      cfg: { policy: "never" } },
    { id: "quarterly", label: "Every 13 weeks", note: "Scheduled refit on all labelled history, four times a year.",
      cfg: { policy: "schedule", interval: 13 * WEEK, window: 0 } },
    { id: "monthly", label: "Every 4 weeks", note: "Scheduled refit on all labelled history, thirteen times a year.",
      cfg: { policy: "schedule", interval: 4 * WEEK, window: 0 } },
    { id: "weekly", label: "Every week", note: "Scheduled refit on all labelled history, fifty-two times a year.",
      cfg: { policy: "schedule", interval: WEEK, window: 0 } },
    { id: "alarm", label: "On an alarm", note: "Refit on all history only when four-week accuracy on labelled rows falls 10 points below where it started.",
      cfg: { policy: "alarm", drop: 10, alarmWindow: 4 * WEEK, window: 0 } },
    { id: "recent", label: "Weekly, recent only", note: "Refit every week, but only on the last four weeks of labels. Fresh data, less of it.",
      cfg: { policy: "schedule", interval: WEEK, window: 4 * WEEK } },
    { id: "twitchy", label: "Every step, last 12 hours", anti: true, note: "Refit before every single prediction on the last eight labelled rows. Maximum freshness.",
      cfg: { policy: "schedule", interval: 1, window: 8 } }
  ];

  /* ---------- data ---------- */
  function prepare(s) {
    var n = s.n, keys = ["nswprice", "nswdemand", "vicprice", "vicdemand", "transfer"];
    var cols = keys.map(function (k) {
      var h = s.hex[k], a = new Array(n);
      for (var i = 0; i < n; i++) a[i] = parseInt(h.substr(2 * i, 2), 16);
      return a;
    });
    var X = new Array(n), y = new Array(n);
    for (var i = 0; i < n; i++) {
      var orig = i * s.step;
      var p = ((orig % 48) / s.step) | 0;
      var dow = (Math.floor(orig / 48) + s.first_day_of_week - 1) % 7 + 1;
      X[i] = [255, cols[0][i], cols[1][i], cols[2][i], cols[3][i], cols[4][i],
        s.period_sin[p], s.period_cos[p], dow >= 6 ? 255 : 0];
      y[i] = s.labels.charCodeAt(i) === 49 ? 1 : 0;
    }
    var P = new Float64Array((n + 1) * D * D), B = new Float64Array((n + 1) * D);
    for (var r = 0; r < n; r++) {
      var x = X[r], sg = y[r] === 1 ? 1 : -1, o = r * D * D, o2 = (r + 1) * D * D, q = r * D, q2 = (r + 1) * D;
      for (var a = 0; a < D; a++) {
        B[q2 + a] = B[q + a] + x[a] * sg;
        for (var b = 0; b < D; b++) P[o2 + a * D + b] = P[o + a * D + b] + x[a] * x[b];
      }
    }
    var vicOn = -1;
    for (var k = 1; k < n; k++) if (cols[2][k] !== cols[2][k - 1]) { vicOn = k; break; }
    return { n: n, step: s.step, X: X, y: y, P: P, B: B, vicOn: vicOn };
  }

  function fit(d, lo, hi) {
    var A = [], v = [], a, b, k, r, c, i, j;
    for (a = 0; a < D; a++) {
      var row = [];
      for (b = 0; b < D; b++) row.push((d.P[hi * D * D + a * D + b] - d.P[lo * D * D + a * D + b]) + (a === b ? LAM : 0));
      A.push(row);
      v.push(d.B[hi * D + a] - d.B[lo * D + a]);
    }
    for (k = 0; k < D; k++) {
      var piv = k;
      for (r = k + 1; r < D; r++) if (Math.abs(A[r][k]) > Math.abs(A[piv][k])) piv = r;
      if (piv !== k) { var t = A[k]; A[k] = A[piv]; A[piv] = t; var tv = v[k]; v[k] = v[piv]; v[piv] = tv; }
      for (r = k + 1; r < D; r++) {
        var f = A[r][k] / A[k][k];
        for (c = k; c < D; c++) A[r][c] -= f * A[k][c];
        v[r] -= f * v[k];
      }
    }
    var w = new Array(D);
    for (i = D - 1; i >= 0; i--) {
      var s = v[i];
      for (j = i + 1; j < D; j++) s -= A[i][j] * w[j];
      w[i] = s / A[i][i];
    }
    return w;
  }

  /* ---------- the replay, identical to materials/elec_reference.py ---------- */
  function simulate(d, cfg) {
    var n = d.n, pol = cfg.policy;
    var dly = cfg.delay == null ? DAY : cfg.delay;
    var K = cfg.interval == null ? WEEK : cfg.interval;
    var W = cfg.window == null ? 0 : cfg.window;
    var theta = cfg.drop == null ? 10 : cfg.drop;
    var M = cfg.alarmWindow == null ? 4 * WEEK : cfg.alarmWindow;
    var w = pol !== "none" ? fit(d, 0, T0) : null;
    var C = new Int32Array(n + 1);
    var retr = 0, last = T0, base = null, retrainAt = [];
    for (var t = T0; t < n; t++) {
      var hi = t - dly + 1;
      if (pol === "schedule" && t > T0 && (t - T0) % K === 0) {
        w = fit(d, W === 0 ? 0 : Math.max(0, hi - W), hi); retr++; retrainAt.push(t);
      } else if (pol === "alarm") {
        var lo = Math.max(last, hi - M);
        if (hi - lo >= M) {
          var cur = C[hi] - C[lo];
          if (base === null) base = cur;
          else if (cur * 100 < base * 100 - theta * M) {
            w = fit(d, W === 0 ? 0 : Math.max(0, hi - W), hi); retr++; retrainAt.push(t);
            last = t; base = null;
          }
        }
      }
      var pred;
      if (pol === "none") pred = d.y[t - dly];
      else {
        var s = 0, x = d.X[t];
        for (var j = 0; j < D; j++) s += x[j] * w[j];
        pred = s > 0 ? 1 : 0;
      }
      C[t + 1] = C[t] + (pred === d.y[t] ? 1 : 0);
    }
    var buckets = [];
    for (var b0 = T0; b0 < n; b0 += BLOCK) {
      var e = Math.min(n, b0 + BLOCK);
      buckets.push({ start: b0, end: e, correct: C[e] - C[b0] });
    }
    return { correct: C[n] - C[T0], n: n - T0, retrains: retr, buckets: buckets, retrainAt: retrainAt };
  }

  function majority(d) {
    var down = 0;
    for (var t = T0; t < d.n; t++) if (d.y[t] === 0) down++;
    return { correct: down, n: d.n - T0 };
  }

  /* ---------- page widget ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pct(r) { return (100 * r.correct / r.n).toFixed(2) + "%"; }
  function pts(a, b) {
    var v = 100 * a.correct / a.n - 100 * b.correct / b.n;
    return (v >= 0 ? "+" : "") + v.toFixed(2) + " pts";
  }
  function money(x) { return "$" + Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function num(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function metric(label, value, unit, kind) {
    return '<div class="mb-metric"><span class="mb-mlabel">' + esc(label) + "</span>" +
      '<span class="mb-mvalue">' + esc(value) + "</span>" +
      '<span class="mb-munit">' + esc(unit) + "</span>" +
      '<span class="mb-mkind is-' + kind + '">' + (kind === "heuristic" ? "set by you" : kind) + "</span></div>";
  }

  var DELAYS = [[1, "1.5 hours (next row)"], [DAY, "1 day"], [WEEK, "1 week"]];
  var INTERVALS = [[1, "every step"], [DAY, "every day"], [WEEK, "every week"], [4 * WEEK, "every 4 weeks"], [13 * WEEK, "every 13 weeks"]];
  var WINDOWS = [[0, "all labelled history"], [26 * WEEK, "last 26 weeks"], [4 * WEEK, "last 4 weeks"], [WEEK, "last week"], [8, "last 12 hours"]];
  var DROPS = [[0, "any dip at all"], [2, "2 points"], [5, "5 points"], [10, "10 points"], [15, "15 points"]];
  var AWIN = [[DAY, "1 day"], [WEEK, "1 week"], [4 * WEEK, "4 weeks"]];
  var POLICIES = [["none", "no model"], ["never", "never retrain"], ["schedule", "on a schedule"], ["alarm", "on an alarm"]];

  var el, data, state, refs = {};

  function sel(id, opts, val) {
    return '<select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? " selected" : "") + ">" + esc(o[1]) + "</option>";
    }).join("") + "</select>";
  }

  function chart(res, never, none) {
    var W = 880, H = 330, x0 = 70, x1 = 850, y0 = 50, y1 = 250, lo = 40, hi = 90;
    var nb = res.buckets.length;
    function X(i) { return x0 + (x1 - x0) * (i + 0.5) / nb; }
    function Y(a) { return y1 - (y1 - y0) * (Math.max(lo, Math.min(hi, a)) - lo) / (hi - lo); }
    function line(r) {
      return r.buckets.map(function (b, i) {
        return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(100 * b.correct / (b.end - b.start)).toFixed(1);
      }).join(" ");
    }
    function rowX(t) { return x0 + (x1 - x0) * (t - T0) / (data.n - T0); }
    var g = "";
    [40, 50, 60, 70, 80, 90].forEach(function (a) {
      g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + Y(a) + '" y2="' + Y(a) + '" class="rtpc-grid"/>' +
        '<text x="' + (x0 - 8) + '" y="' + (Y(a) + 4) + '" text-anchor="end" class="rtpc-ax">' + a + "%</text>";
    });
    /* year ticks: row t is t / 16 days after 7 May 1996 */
    var start = Date.UTC(1996, 4, 7);
    [[1997, 0], [1998, 0]].forEach(function (ym) {
      var days = (Date.UTC(ym[0], ym[1], 1) - start) / 86400000;
      var t = days * DAY;
      if (t > T0 && t < data.n) {
        var xx = rowX(t).toFixed(1);
        g += '<line x1="' + xx + '" x2="' + xx + '" y1="' + y1 + '" y2="' + (y1 + 6) + '" class="rtpc-tick"/>' +
          '<text x="' + xx + '" y="' + (y1 + 20) + '" text-anchor="middle" class="rtpc-ax">Jan ' + ym[0] + "</text>";
      }
    });
    if (data.vicOn > T0) {
      var vx = rowX(data.vicOn).toFixed(1);
      g += '<line x1="' + vx + '" x2="' + vx + '" y1="' + (y0 - 6) + '" y2="' + y1 + '" class="rtpc-vic"/>' +
        '<text x="' + (+vx + 6) + '" y="' + (y0 - 10) + '" class="rtpc-note">May 1997: Victoria inputs start varying</text>';
    }
    var ticks = "";
    if (res.retrainAt.length > 300) {
      ticks = '<rect x="' + x0 + '" y="' + (y1 + 30) + '" width="' + (x1 - x0) + '" height="10" class="rtpc-band"/>';
    } else {
      res.retrainAt.forEach(function (t) {
        var xx = rowX(t).toFixed(1);
        ticks += '<line x1="' + xx + '" x2="' + xx + '" y1="' + (y1 + 30) + '" y2="' + (y1 + 40) + '" class="rtpc-rt"/>';
      });
    }
    var cap = res.retrainAt.length ? num(res.retrainAt.length) + " retrains, one mark each" : "no retrains";
    if (res.retrainAt.length > 300) cap = num(res.retrainAt.length) + " retrains, too dense to draw one by one";
    return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Accuracy in each four-week block of the replay for the selected policy, against never retraining and against no model, with a mark for every retrain" xmlns="http://www.w3.org/2000/svg">' +
      "<style>.rtpc-grid{stroke:var(--hairline,#F1E3EA);stroke-width:1}.rtpc-tick{stroke:var(--muted,#6A4B5C);stroke-width:1}" +
      ".rtpc-ax{font:600 11px Inter,sans-serif;fill:var(--muted,#6A4B5C)}.rtpc-note{font:600 11px Inter,sans-serif;fill:var(--amber-ink,#6E4000)}" +
      ".rtpc-vic{stroke:var(--amber,#9A5B00);stroke-width:1.5;stroke-dasharray:4 4}.rtpc-cur{fill:none;stroke:var(--indigo,#A23B72);stroke-width:3;stroke-linejoin:round}" +
      ".rtpc-nev{fill:none;stroke:var(--muted,#6A4B5C);stroke-width:1.8;stroke-dasharray:6 4}.rtpc-non{fill:none;stroke:var(--amber,#9A5B00);stroke-width:1.8;stroke-dasharray:2 4}" +
      ".rtpc-rt{stroke:var(--indigo-deep,#6B2049);stroke-width:1.4}.rtpc-band{fill:#FCA5A5}.rtpc-lg{font:600 11px Inter,sans-serif;fill:var(--ink,#2A1621)}</style>" +
      g +
      '<path d="' + line(none) + '" class="rtpc-non"/>' +
      '<path d="' + line(never) + '" class="rtpc-nev"/>' +
      '<path d="' + line(res) + '" class="rtpc-cur"/>' +
      ticks +
      '<text x="' + x0 + '" y="' + (y1 + 58) + '" class="rtpc-ax">Retrains: ' + esc(cap) + "</text>" +
      '<line x1="' + x0 + '" x2="' + (x0 + 26) + '" y1="22" y2="22" class="rtpc-cur"/><text x="' + (x0 + 32) + '" y="26" class="rtpc-lg">selected policy</text>' +
      '<line x1="' + (x0 + 160) + '" x2="' + (x0 + 186) + '" y1="22" y2="22" class="rtpc-nev"/><text x="' + (x0 + 192) + '" y="26" class="rtpc-lg">never retrain</text>' +
      '<line x1="' + (x0 + 310) + '" x2="' + (x0 + 336) + '" y1="22" y2="22" class="rtpc-non"/><text x="' + (x0 + 342) + '" y="26" class="rtpc-lg">no model</text>' +
      '<text x="' + x1 + '" y="26" text-anchor="end" class="rtpc-ax">accuracy per 4-week block</text>' +
      "</svg>";
  }

  function blockDate(t) {
    var ms = Date.UTC(1996, 4, 7) + Math.round(t * data.step / 48) * 86400000;
    var d = new Date(ms);
    return d.getUTCDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  function blockLine(r, never) {
    var worst = 0, best = 0, lead = 0, lag = 0;
    function a(b) { return 100 * b.correct / (b.end - b.start); }
    r.buckets.forEach(function (b, i) {
      if (a(b) < a(r.buckets[worst])) worst = i;
      if (a(b) > a(r.buckets[best])) best = i;
      var g = a(b) - a(never.buckets[i]);
      if (g > a(r.buckets[lead]) - a(never.buckets[lead])) lead = i;
      if (g < a(r.buckets[lag]) - a(never.buckets[lag])) lag = i;
    });
    function f(i) { return a(r.buckets[i]).toFixed(1) + "% (4 weeks from " + blockDate(r.buckets[i].start) + ")"; }
    function g(i) { var v = a(r.buckets[i]) - a(never.buckets[i]); return (v >= 0 ? "+" : "") + v.toFixed(1) + " pts (from " + blockDate(r.buckets[i].start) + ")"; }
    var head = "Worst block " + f(worst) + ". Best block " + f(best) + ".";
    if (state.cfg.policy === "never") return head;
    return head + " Against never retraining, block by block: best " + g(lead) + ", worst " + g(lag) + ".";
  }

  function verdict(r, never, none, cost) {
    var a = r.correct / r.n, an = never.correct / never.n, a0 = none.correct / none.n;
    if (state.cfg.policy === "none") {
      return a >= an ? ["good", "No model at all beats the shipped model by " + pts(r, never) + " at this label delay. Rule 1: launch without ML."]
        : ["ok", "The no-model rule trails never-retrain by " + pts(never, r).replace("+", "") + " here. Labels this late make the last label stale."];
    }
    if (a < a0) return ["bad", "Worse than having no model at all: " + pts(r, none) + " against repeating the last label, for " + money(r.retrains * cost) + " of retraining."];
    if (a < an && r.retrains > 0) return ["bad", "Worse than never retraining (" + pts(r, never) + "), and it cost " + money(r.retrains * cost) + ". Retraining is not automatically improvement."];
    if (r.retrains === 0) return ["ok", "The baseline every policy has to beat: " + pct(r) + " with zero retrains."];
    var gain = 100 * (a - an);
    return ["good", pts(r, never) + " over never retraining, for " + money(r.retrains * cost) + ": " + money(r.retrains * cost / gain) + " per accuracy point."];
  }

  function currentCfg() {
    var c = { policy: refs.pol.value, delay: +refs.delay.value, interval: +refs.int.value, window: +refs.win.value, drop: +refs.drop.value, alarmWindow: +refs.awin.value };
    return c;
  }

  function sameCfg(a, b) {
    var keys = a.policy === "schedule" ? ["interval", "window"] : a.policy === "alarm" ? ["drop", "alarmWindow", "window"] : [];
    if (a.policy !== b.policy) return false;
    for (var i = 0; i < keys.length; i++) if (a[keys[i]] !== (b[keys[i]] == null ? DEFAULT[keys[i]] : b[keys[i]])) return false;
    return true;
  }
  var DEFAULT = { interval: WEEK, window: 0, drop: 10, alarmWindow: 4 * WEEK };

  function run() {
    var cfg = currentCfg(), cost = Math.max(0, +refs.cost.value || 0);
    state.cfg = cfg;
    var match = null;
    PRESETS.forEach(function (p) { if (sameCfg(cfg, p.cfg)) match = p.id; });
    Object.keys(refs.btns).forEach(function (k) {
      refs.btns[k].classList.toggle("is-on", k === match);
      refs.btns[k].querySelector("input").checked = k === match;
    });
    refs.int.disabled = cfg.policy !== "schedule";
    refs.win.disabled = cfg.policy === "none" || cfg.policy === "never";
    refs.drop.disabled = refs.awin.disabled = cfg.policy !== "alarm";
    var r = simulate(data, cfg);
    var never = simulate(data, { policy: "never", delay: cfg.delay });
    var none = simulate(data, { policy: "none", delay: cfg.delay });
    var v = verdict(r, never, none, cost);
    state.last = r;
    refs.readout.innerHTML =
      '<div class="mb-verdict is-' + v[0] + '">' + esc(v[1]) + "</div>" +
      '<div class="mb-metrics">' +
        metric("Accuracy", pct(r), num(r.correct) + " of " + num(r.n) + " rows called right", "measured") +
        metric("Retrain spend", money(r.retrains * cost), num(r.retrains) + " retrains x " + money(cost), "heuristic") +
        metric("Against never retraining", pts(r, never), "never retrain scores " + pct(never), "measured") +
        metric("Against no model", pts(r, none), "last known label scores " + pct(none), "measured") +
      "</div>" +
      '<div class="mb-stage rtp-stage">' + chart(r, never, none) + "</div>" +
      '<p class="mb-hint rtp-blocks">' + esc(blockLine(r, never)) + "</p>";
    ladder(cfg.delay, cost);
  }

  function ladder(dly, cost) {
    var never = simulate(data, { policy: "never", delay: dly });
    var rows = PRESETS.map(function (p) {
      var c = {}; for (var k in p.cfg) c[k] = p.cfg[k]; c.delay = dly;
      var r = simulate(data, c);
      return "<tr" + (p.anti ? ' class="rtp-anti"' : "") + "><th>" + esc(p.label) + "</th><td>" + pct(r) + "</td><td>" + num(r.retrains) +
        "</td><td>" + money(r.retrains * cost) + "</td><td>" + pts(r, never) + "</td></tr>";
    }).join("");
    var maj = majority(data);
    refs.ladder.innerHTML = '<table class="dt-table rtp-ladder"><thead><tr><th>Policy (label delay ' +
      esc(DELAYS.filter(function (x) { return x[0] === dly; })[0][1]) + ")</th><th>Accuracy</th><th>Retrains</th><th>Spend</th><th>vs never</th></tr></thead><tbody>" +
      rows + "</tbody></table>" +
      '<p class="mb-hint">Floor for reference: always predicting DOWN, the more common label, scores ' + pct(maj) + ". " +
      "Every row of this table was just computed in your browser from the " + num(data.n) + " real rows.</p>";
  }

  function setPreset(id) {
    var p = PRESETS.filter(function (x) { return x.id === id; })[0];
    refs.pol.value = p.cfg.policy;
    refs.int.value = p.cfg.interval == null ? DEFAULT.interval : p.cfg.interval;
    refs.win.value = p.cfg.window == null ? DEFAULT.window : p.cfg.window;
    refs.drop.value = p.cfg.drop == null ? DEFAULT.drop : p.cfg.drop;
    refs.awin.value = p.cfg.alarmWindow == null ? DEFAULT.alarmWindow : p.cfg.alarmWindow;
    run();
  }

  function buildUI() {
    var panel = document.createElement("div");
    panel.className = "mb-presets";
    refs.btns = {};
    PRESETS.forEach(function (p) {
      var lab = document.createElement("label");
      lab.className = "mb-preset" + (p.anti ? " is-anti" : "");
      lab.innerHTML = '<input type="radio" name="rtp-p" value="' + p.id + '">' +
        '<span class="mb-pname">' + esc(p.label) + (p.anti ? ' <em class="mb-anti">freshest, and worst</em>' : "") + "</span>" +
        '<span class="mb-pnote">' + esc(p.note) + "</span>";
      panel.appendChild(lab);
      refs.btns[p.id] = lab;
      lab.querySelector("input").addEventListener("change", function () { setPreset(p.id); });
    });
    var ctl = document.createElement("div");
    ctl.className = "rtp-controls";
    ctl.innerHTML =
      '<label>Labels arrive after ' + sel("rtp-delay", DELAYS, DAY) + "</label>" +
      '<label>Cost of one retrain, $ <input id="rtp-cost" type="number" min="0" step="50" value="500"></label>' +
      '<label>Retrain ' + sel("rtp-pol", POLICIES, "never") + "</label>" +
      '<label>Schedule ' + sel("rtp-int", INTERVALS, WEEK) + "</label>" +
      '<label>Refit on ' + sel("rtp-win", WINDOWS, 0) + "</label>" +
      '<label>Alarm when accuracy falls ' + sel("rtp-drop", DROPS, 10) + "</label>" +
      '<label>Alarm watches ' + sel("rtp-awin", AWIN, 4 * WEEK) + "</label>";
    var hint = document.createElement("p");
    hint.className = "mb-hint";
    hint.textContent = "Real rows: " + data.n.toLocaleString("en-US") + " half-hours of the Elec2 NSW electricity market (Harries 1999, OpenML 151), every third row kept in time order, inputs rounded to 256 levels. " +
      "The first model trains on the first four weeks; accuracy is scored on the " + (data.n - T0).toLocaleString("en-US") + " rows after that. " +
      "The model is a fixed linear score on nine inputs, deliberately simple. Set by you: the dollar cost of a retrain. Everything else is computed here, now.";
    refs.readout = document.createElement("div");
    refs.readout.className = "mb-readout";
    refs.ladder = document.createElement("div");
    refs.ladder.className = "dt-tablewrap";
    var lh = document.createElement("h4");
    lh.className = "rtp-lh";
    lh.textContent = "The whole ladder at this label delay";
    el.appendChild(panel); el.appendChild(ctl); el.appendChild(hint); el.appendChild(refs.readout); el.appendChild(lh); el.appendChild(refs.ladder);
    refs.delay = el.querySelector("#rtp-delay"); refs.cost = el.querySelector("#rtp-cost"); refs.pol = el.querySelector("#rtp-pol");
    refs.int = el.querySelector("#rtp-int"); refs.win = el.querySelector("#rtp-win"); refs.drop = el.querySelector("#rtp-drop"); refs.awin = el.querySelector("#rtp-awin");
    [refs.delay, refs.pol, refs.int, refs.win, refs.drop, refs.awin].forEach(function (s) { s.addEventListener("change", run); });
    refs.cost.addEventListener("input", run);
    setPreset("never");
  }

  function init() {
    el = document.getElementById("rtp-bench");
    if (!el || !root.ELEC_SAMPLE) return;
    data = prepare(root.ELEC_SAMPLE);
    state = {};
    buildUI();
    root.ELEC_LIVE = {
      presets: PRESETS.map(function (p) { return p.id; }),
      show: setPreset,
      setDelay: function (d) { refs.delay.value = d; run(); },
      simulate: function (cfg) { return simulate(data, cfg); },
      get last() { return state.last; }
    };
  }

  var api = { PRESETS: PRESETS, DAY: DAY, WEEK: WEEK, T0: T0, prepare: prepare, simulate: simulate, fit: fit, majority: majority };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
