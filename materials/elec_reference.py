"""Python reference for the retrain-policy bench (session 4).

Reads materials/elec-sample.json (the same bytes the browser loads from assets/elec-sample.js)
and replays the stream under each policy with the SAME arithmetic as assets/elec-live.js:
integer prefix sums of X'X and X'y (exact in float64), ridge solve by Gaussian elimination with
partial pivoting in a fixed loop order, linear score > 0 means UP. Alarm tests use integer counts.
Node and this script must print identical correct-counts and retrain-counts for every preset.

Usage: python3 materials/elec_reference.py [--json]
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DAY, WEEK = 16, 112          # rows per day and per week in the 1.5-hour sample
T0 = 4 * WEEK                # first model trained on the first four weeks
LAM = 65025                  # ridge penalty, 255^2 in the integer feature units
D = 9                        # features: bias, 5 inputs, sin, cos, weekend


def load():
    s = json.load(open(os.path.join(HERE, "elec-sample.json")))
    n = s["n"]
    cols = [[int(h[i:i + 2], 16) for i in range(0, 2 * n, 2)]
            for h in (s["hex"][k] for k in ("nswprice", "nswdemand", "vicprice", "vicdemand", "transfer"))]
    y = [int(c) for c in s["labels"]]
    X = []
    for i in range(n):
        orig = i * s["step"]
        p = (orig % 48) // s["step"]
        dow = ((orig // 48) + s["first_day_of_week"] - 1) % 7 + 1
        X.append([255, cols[0][i], cols[1][i], cols[2][i], cols[3][i], cols[4][i],
                  s["period_sin"][p], s["period_cos"][p], 255 if dow >= 6 else 0])
    return X, y


def prefix(X, y):
    n = len(X)
    P = [[0] * (D * D) for _ in range(n + 1)]
    B = [[0] * D for _ in range(n + 1)]
    for i in range(n):
        x, pp, pb, s = X[i], P[i], B[i], (1 if y[i] == 1 else -1)
        np_, nb = P[i + 1], B[i + 1]
        for a in range(D):
            nb[a] = pb[a] + x[a] * s
            for b in range(D):
                np_[a * D + b] = pp[a * D + b] + x[a] * x[b]
    return P, B


def fit(P, B, lo, hi):
    A = [[float(P[hi][a * D + b] - P[lo][a * D + b]) + (LAM if a == b else 0) for b in range(D)] for a in range(D)]
    v = [float(B[hi][a] - B[lo][a]) for a in range(D)]
    for k in range(D):
        piv = k
        for r in range(k + 1, D):
            if abs(A[r][k]) > abs(A[piv][k]):
                piv = r
        if piv != k:
            A[k], A[piv] = A[piv], A[k]
            v[k], v[piv] = v[piv], v[k]
        for r in range(k + 1, D):
            f = A[r][k] / A[k][k]
            for c in range(k, D):
                A[r][c] -= f * A[k][c]
            v[r] -= f * v[k]
    w = [0.0] * D
    for i in range(D - 1, -1, -1):
        s = v[i]
        for j in range(i + 1, D):
            s -= A[i][j] * w[j]
        w[i] = s / A[i][i]
    return w


def simulate(X, y, P, B, cfg):
    n = len(y)
    pol, dly = cfg["policy"], cfg.get("delay", DAY)
    K, W = cfg.get("interval", WEEK), cfg.get("window", 0)
    theta, M = cfg.get("drop", 10), cfg.get("alarmWindow", 4 * WEEK)
    w = fit(P, B, 0, T0) if pol != "none" else None
    C = [0] * (n + 1)          # prefix count of correct predictions
    retr, last, base = 0, T0, None
    retrain_at = []
    for t in range(T0, n):
        hi = t - dly + 1       # labels known for rows [0, hi)
        if pol == "schedule" and t > T0 and (t - T0) % K == 0:
            w = fit(P, B, 0 if W == 0 else max(0, hi - W), hi); retr += 1; retrain_at.append(t)
        elif pol == "alarm":
            lo = max(last, hi - M)
            if hi - lo >= M:
                cur = C[hi] - C[lo]
                if base is None:
                    base = cur
                elif cur * 100 < base * 100 - theta * M:
                    w = fit(P, B, 0 if W == 0 else max(0, hi - W), hi); retr += 1; retrain_at.append(t)
                    last, base = t, None
        if pol == "none":
            pred = y[t - dly]
        else:
            s, x = 0.0, X[t]
            for j in range(D):
                s += x[j] * w[j]
            pred = 1 if s > 0 else 0
        C[t + 1] = C[t] + (1 if pred == y[t] else 0)
    for t in range(T0):
        C[t + 1] = 0
    correct = C[n] - C[T0]
    buckets = []
    for b in range(T0, n, 4 * WEEK):
        e = min(n, b + 4 * WEEK)
        buckets.append(C[e] - C[b])
    return {"correct": correct, "n": n - T0, "retrains": retr, "buckets": buckets, "retrainAt": retrain_at}


PRESETS = [
    ("none", "No model: repeat the last known label", {"policy": "none"}),
    ("never", "Never retrain", {"policy": "never"}),
    ("quarterly", "Retrain every 13 weeks, all history", {"policy": "schedule", "interval": 13 * WEEK, "window": 0}),
    ("monthly", "Retrain every 4 weeks, all history", {"policy": "schedule", "interval": 4 * WEEK, "window": 0}),
    ("weekly", "Retrain every week, all history", {"policy": "schedule", "interval": WEEK, "window": 0}),
    ("alarm", "Retrain when 4-week accuracy drops 10 points", {"policy": "alarm", "drop": 10, "alarmWindow": 4 * WEEK, "window": 0}),
    ("recent", "Retrain every week, last 4 weeks only", {"policy": "schedule", "interval": WEEK, "window": 4 * WEEK}),
    ("twitchy", "Retrain every step on the last 12 hours", {"policy": "schedule", "interval": 1, "window": 8}),
]
DELAYS = [1, DAY, WEEK]

if __name__ == "__main__":
    X, y = load()
    P, B = prefix(X, y)
    out = {}
    for dly in DELAYS:
        for key, name, cfg in PRESETS:
            c = dict(cfg, delay=dly)
            r = simulate(X, y, P, B, c)
            out["%s@%d" % (key, dly)] = {"correct": r["correct"], "n": r["n"], "retrains": r["retrains"], "buckets": r["buckets"]}
            if "--json" not in sys.argv:
                print("delay %3d  %-10s %6.2f%%  correct %5d/%d  retrains %5d  %s" % (
                    dly, key, 100 * r["correct"] / r["n"], r["correct"], r["n"], r["retrains"], name))
    maj = sum(1 for t in range(T0, len(y)) if y[t] == 0)
    if "--json" in sys.argv:
        print(json.dumps(out, sort_keys=True))
    else:
        print("always DOWN (majority) %.2f%% (%d/%d)" % (100 * maj / (len(y) - T0), maj, len(y) - T0))
