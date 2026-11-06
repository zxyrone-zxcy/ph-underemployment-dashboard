// Data model + statistics. Input: rows from data/underemployment_tidy.json
// (one row per month x sex x age cohort, values in thousands of persons; Annual rows already removed).

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const AGES = ['15-24', '25-34'];
export const AGE_LABEL = { '15-24': 'Ages 15–24', '25-34': 'Ages 25–34' };
export const SEXES = ['Both sexes', 'Male', 'Female'];
export const SERIES = [
  { key: 'Both sexes|15-24', label: 'Both sexes 15–24' }, { key: 'Both sexes|25-34', label: 'Both sexes 25–34' },
  { key: 'Male|15-24', label: 'Male 15–24' }, { key: 'Male|25-34', label: 'Male 25–34' },
  { key: 'Female|15-24', label: 'Female 15–24' }, { key: 'Female|25-34', label: 'Female 25–34' },
];

export function loadModel(rows) {
  const months = [];
  const seen = new Map();
  for (const r of rows) {
    const id = r.year * 100 + r.month_num;
    if (!seen.has(id)) seen.set(id, { id, year: r.year, m: r.month_num, name: r.month });
  }
  months.push(...[...seen.values()].sort((a, b) => a.id - b.id));
  months.forEach((x, i) => { x.i = i; x.label = `${x.name.slice(0, 3)} ${x.year}`; });
  const idx = new Map(months.map((x) => [x.id, x.i]));
  const values = new Map();
  for (const r of rows) {
    const k = `${r.sex}|${r.age}`;
    if (!values.has(k)) values.set(k, new Array(months.length).fill(null));
    values.get(k)[idx.get(r.year * 100 + r.month_num)] = r.thousands;
  }
  const years = [...new Set(months.map((x) => x.year))];
  return { months, values, years };
}

export const series = (m, sex, age) => m.values.get(`${sex}|${age}`);

/* ---------- scope (the time tree selection) ---------- */
// scope = { year: null | number, month: null | 1..12 }
export const ALL_TIME = { year: null, month: null };
export function scopeIdx(m, sc) {
  return m.months.filter((x) => (sc.year == null || x.year === sc.year) && (sc.month == null || x.m === sc.month)).map((x) => x.i);
}
export function scopeLabel(sc) {
  if (sc.year == null && sc.month == null) return 'All periods, Jan 2021 – Aug 2026';
  if (sc.month == null) return String(sc.year);
  return `${MONTHS[sc.month - 1]} ${sc.year}`;
}
export const monthsIn = (m, year) => m.months.filter((x) => x.year === year);

/* ---------- statistics ---------- */
export const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
export function median(a) {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export function stdev(a) {            // sample standard deviation (n - 1)
  if (a.length < 2) return null;
  const mu = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - mu) ** 2, 0) / (a.length - 1));
}
export function pearson(x, y) {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return sxy / Math.sqrt(sxx * syy);
}

/* Average per calendar month across every year in the data. */
export function seasonal(m, sex, age) {
  return MONTHS.map((name, k) => {
    const pts = m.months.filter((x) => x.m === k + 1);
    const vals = pts.map((x) => series(m, sex, age)[x.i]);
    return { m: k + 1, name, n: pts.length, from: pts[0].year, to: pts.at(-1).year, avg: mean(vals) };
  });
}

/* ---------- formatting ---------- */
export const persons = (thousands, dp = 0) => (thousands == null ? '–' : Math.round(thousands * 1000).toLocaleString('en-US', { maximumFractionDigits: dp }));
export const k = (v, dp = 1) => (v == null ? '–' : v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
export const signed = (v, dp = 1) => (v == null ? '–' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
