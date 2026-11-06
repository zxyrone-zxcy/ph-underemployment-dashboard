// Plan Q5: mean, median and sample standard deviation for every age x sex group (thousand persons).
import { h } from '../ui.js';
import { SERIES, series, mean, median, stdev, k } from '../data.js';

export function renderStats(host, model) {
  const rows = SERIES.map((s) => {
    const v = model.values.get(s.key);
    return h('tr', null, h('td', null, s.label), h('td', null, String(v.length)), h('td', null, k(mean(v))), h('td', null, k(median(v))), h('td', null, k(stdev(v))), h('td', null, k(Math.min(...v))), h('td', null, k(Math.max(...v))));
  });
  host.replaceChildren(
    h('thead', null, h('tr', null, ['Group', 'n', 'Mean', 'Median', 'Std dev', 'Min', 'Max'].map((t) => h('th', { scope: 'col' }, t)))),
    h('tbody', null, rows));
}
