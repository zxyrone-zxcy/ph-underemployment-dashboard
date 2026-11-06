// Drill-down panel: All periods -> year -> month. Selecting a node re-scopes the trend chart and the breakdown.
import { h } from '../ui.js';
import { state, setScope, toggleYear } from '../state.js';
import { ALL_TIME, series, scopeIdx, mean, monthsIn, persons } from '../data.js';

const avgFor = (model, sc) => mean(scopeIdx(model, sc).map((i) => series(model, 'Both sexes', '15-24')[i] + series(model, 'Both sexes', '25-34')[i]));
const isSel = (sc) => state.scope.year === sc.year && state.scope.month === sc.month;

export function renderTimeTree(host, model) {
  const root = h('div', { class: 'tree-node tree-root' + (isSel(ALL_TIME) ? ' selected' : ''), role: 'button', tabindex: 0, onclick: () => setScope({ ...ALL_TIME }) },
    'All periods', h('span', { class: 'tree-node-value' }, `${model.months.length} mo`));
  root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); root.click(); } });
  const years = model.years.map((y) => {
    const open = state.expanded.has(y);
    const sc = { year: y, month: null };
    const node = h('div', { class: 'tree-node' + (isSel(sc) ? ' selected' : ''), role: 'button', tabindex: 0, onclick: () => setScope(sc) },
      h('span', { class: 'tree-bullet', 'aria-hidden': 'true' }, '●'), String(y), h('span', { class: 'tree-node-value' }, `${monthsIn(model, y).length} mo`));
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); } });
    const toggle = h('button', { class: 'tree-toggle', type: 'button', 'aria-expanded': String(open), 'aria-label': `${open ? 'Collapse' : 'Expand'} ${y}`, onclick: () => toggleYear(y) }, open ? '▾' : '▸');
    const parts = [h('div', { class: 'tree-year-row' }, node, toggle)];
    if (open) {
      parts.push(h('div', { class: 'tree-months' }, monthsIn(model, y).map((mo) =>
        h('button', { type: 'button', class: 'tree-month' + (isSel({ year: y, month: mo.m }) ? ' selected' : ''), 'aria-pressed': String(isSel({ year: y, month: mo.m })), onclick: () => setScope({ year: y, month: mo.m }) }, mo.name.slice(0, 3)))));
    }
    return parts;
  });
  host.replaceChildren(root, ...years.flat());
}
