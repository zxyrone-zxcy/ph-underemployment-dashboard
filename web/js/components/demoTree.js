// Demographic breakdown for the selected period: total -> age cohort -> sex.
// Values are the average monthly headcount over the scope (a single month is just that month).
import { h } from '../ui.js';
import { AGES, AGE_LABEL, series, scopeIdx, scopeLabel, mean, persons } from '../data.js';

export function renderDemoTree(host, model, scope) {
  document.getElementById('demoScopeLabel').textContent = scopeLabel(scope);
  const idx = scopeIdx(model, scope);
  if (!idx.length) { host.replaceChildren(h('p', { class: 'dtree-empty' }, 'No data for this period.')); return; }
  const avg = (sex, age) => mean(idx.map((i) => series(model, sex, age)[i]));
  const ageTotals = AGES.map((a) => ({ age: a, v: avg('Both sexes', a) }));
  const total = ageTotals.reduce((s, x) => s + x.v, 0);

  const row = (name, v, of, color, cls = '') =>
    h('div', { class: 'dtree-row ' + cls },
      h('div', { class: 'dtree-bar' }, h('div', { class: 'dtree-fill', style: { width: (of ? (v / of) * 100 : 0) + '%', background: color } })),
      h('i', { class: 'dtree-swatch', style: { background: color } }), h('span', { class: 'dtree-name' }, name),
      h('span', { class: 'dtree-pct' }, of ? ((v / of) * 100).toFixed(1) + '%' : ''), h('span', { class: 'dtree-value' }, persons(v)));

  const avgNote = idx.length > 1 ? 'Average monthly headcount (persons).' : 'Headcount for the month (persons).';
  const nodes = [h('p', { class: 'hint dtree-empty' }, avgNote), row('Total underemployed, ages 15–34', total, total, 'var(--text-primary)', 'level-total')];
  for (const { age, v } of ageTotals) {
    const color = age === '15-24' ? 'var(--series-y1524)' : 'var(--series-y2534)';
    nodes.push(h('div', { class: 'dtree-indent' },
      row(AGE_LABEL[age], v, total, color, 'level-total'),
      h('div', { class: 'dtree-indent' }, row('Male', avg('Male', age), v, 'var(--series-male)'), row('Female', avg('Female', age), v, 'var(--series-female)'))));
  }
  host.replaceChildren(...nodes);
}
