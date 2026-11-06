// Data-driven insights: every sentence is computed from the loaded data (nothing hand-written about the numbers).
import { h } from '../ui.js';
import { AGES, series, seasonal, mean, pearson, persons, MONTHS } from '../data.js';

export function renderInsights(host, model) {
  const n = model.months.length;
  const items = [];

  // 1. gender (Q1)
  const g = AGES.map((a) => {
    const m = series(model, 'Male', a), f = series(model, 'Female', a);
    return { a, higher: m.filter((v, i) => v > f[i]).length, gap: mean(m.map((v, i) => v - f[i])) };
  });
  items.push(h('div', { class: 'insight' }, h('b', null, 'Gender gap. '),
    g.map((x, i) => [i ? ' ' : '', `Ages ${x.a.replace('-', '–')}: male counts exceed female in ${x.higher} of ${n} months, by an average of ${persons(x.gap)} persons.`])));

  // 2. age volume (Q2)
  const a1 = mean(series(model, 'Both sexes', '15-24')), a2 = mean(series(model, 'Both sexes', '25-34'));
  const [big, small, bigV, smallV] = a2 >= a1 ? ['25–34', '15–24', a2, a1] : ['15–24', '25–34', a1, a2];
  items.push(h('div', { class: 'insight' }, h('b', null, 'Age volume. '),
    `The ${big} cohort averages ${persons(bigV)} underemployed persons a month versus ${persons(smallV)} for ${small}, about ${(bigV / smallV).toFixed(2)} times as many.`));

  // 3. trend (Q3): average of each calendar year's months, first vs last complete year
  const full = model.years.filter((y) => model.months.filter((x) => x.year === y).length === 12);
  const yrAvg = (y, age) => mean(model.months.filter((x) => x.year === y).map((x) => series(model, 'Both sexes', age)[x.i]));
  const y0 = full[0], y1 = full.at(-1);
  items.push(h('div', { class: 'insight' }, h('b', null, 'Trend. '),
    AGES.map((a, i) => { const d = yrAvg(y1, a) / yrAvg(y0, a) - 1; return [i ? ' ' : '', `Ages ${a.replace('-', '–')}: the monthly average moved from ${persons(yrAvg(y0, a))} in ${y0} to ${persons(yrAvg(y1, a))} in ${y1} (${d >= 0 ? '+' : '−'}${Math.abs(d * 100).toFixed(1)}%).`]; })));

  // 4. seasonality (Q4)
  const top = (age) => [...seasonal(model, 'Both sexes', age)].sort((p, q) => q.avg - p.avg).slice(0, 2).map((x) => x.name);
  items.push(h('div', { class: 'insight' }, h('b', null, 'Seasonality. '),
    `The two highest calendar-month averages are ${top('15-24').join(' and ')} for ages 15–24 and ${top('25-34').join(' and ')} for ages 25–34. Months are averaged over 5–6 years, so treat these as tendencies, not guarantees.`));

  // 5. correlation (Q5)
  const r = (a, b) => pearson(series(model, ...a), series(model, ...b));
  const rM = r(['Male', '15-24'], ['Female', '15-24']), rA = r(['Male', '25-34'], ['Female', '25-34']), rC = r(['Both sexes', '15-24'], ['Both sexes', '25-34']);
  items.push(h('div', { class: 'insight' }, h('b', null, 'Correlation. '),
    `Male and female counts move together: r = ${rM.toFixed(2)} for ages 15–24 and ${rA.toFixed(2)} for 25–34. The two cohorts (both sexes) correlate at r = ${rC.toFixed(2)}. This describes association only, not cause.`));

  host.replaceChildren(...items);
}
