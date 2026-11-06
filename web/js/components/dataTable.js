// Full monthly dataset (68 rows) + CSV download.
import { h } from '../ui.js';
import { SERIES, k } from '../data.js';

export function renderDataTable(table, link, model) {
  table.replaceChildren(
    h('thead', null, h('tr', null, ['Month', ...SERIES.map((s) => s.label)].map((t) => h('th', { scope: 'col' }, t)))),
    h('tbody', null, model.months.map((mo) => h('tr', null, h('td', null, mo.label), SERIES.map((s) => h('td', null, k(model.values.get(s.key)[mo.i], 3)))))));
  const lines = [['Year', 'Month', ...SERIES.map((s) => s.label + ' (thousands)')].join(',')];
  for (const mo of model.months) lines.push([mo.year, mo.name, ...SERIES.map((s) => model.values.get(s.key)[mo.i])].join(','));
  link.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
}
