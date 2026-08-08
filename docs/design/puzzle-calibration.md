# Puzzle Calibration (first pass)

> Draft for ticket **#4** (Puzzle types & difficulty ramp). 5 bands × 3 topics. Each band lasts **6 days** (30-day ramp), then the game plateaus at A-level. Question templates are illustrative — the engine generates instances from these templates.

## Bands & ramp

| Band | Days (of 30) | Curriculum level |
|---|---|---|
| Primary | 1–6 | KS1–KS2 |
| KS3 | 7–12 | lower secondary |
| GCSE | 13–18 | GCSE |
| AS | 19–24 | A-level year 1 |
| A-level | 25–30 | A-level year 2 |

After day 30, difficulty stays at A-level (plateau).

## Templates per topic × band

### Arithmetic

| Band | Example templates |
|---|---|
| Primary | single-digit +/−; times tables (≤12); simple division (÷2, ÷5, ÷10) |
| KS3 | multi-digit ×/÷; fractions (add/subtract like denominators); decimals; percentages of a number; powers (squares/cubes) |
| GCSE | standard form; surds (simplify √); ratio; compound interest; negative/fractional indices |
| AS | logarithms (evaluate log); exponentials; arithmetic with surds/indices |
| A-level | complex numbers (modulus/argument); numerical methods (rounding/error bounds) |

### Algebra

| Band | Example templates |
|---|---|
| Primary | missing-number (`3 + ? = 8`); simple patterns |
| KS3 | solve linear (`x + 3 = 10`, `2x − 4 = 6`); simplify expressions; expand single brackets |
| GCSE | solve quadratics (factorise); simultaneous equations; inequalities; rearrange formulae |
| AS | solve with logs/exponentials; partial fractions; binomial expansion (n small) |
| A-level | quadratics with complex roots; matrices (solve systems); proof by induction (structure) |

### Sequences

| Band | Example templates |
|---|---|
| Primary | count on by a constant (`2, 4, 6, 8, …`); next term |
| KS3 | arithmetic sequences; find nth term of linear sequence |
| GCSE | quadratic sequences; geometric sequences; nth term of quadratic |
| AS | arithmetic/geometric series; sum to n terms; convergence of geometric |
| A-level | recurrence relations; series convergence tests; Maclaurin series (first terms) |

## Notes

- **Answer checking** is per-template (exact numeric, or expression equivalence for algebra).
- **Feedback** (warm-cold) is per-template: numeric questions get "too high/low"; algebra/sequence questions get a hint (e.g. "check your factorising").
- This is a **first pass** — the exact templates and their difficulty weights are tuning knobs to refine during testing.
