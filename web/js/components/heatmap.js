// Plan chart 5 (Q5): Pearson correlation matrix of the six series, shaded light -> dark.
// The scale runs 0 to 1; a negative value would be shown at the light end (none occur here, and the number is always printed).
import { h, colors } from '../ui.js';
import { SERIES, pearson } from '../data.js';

const rgb = (hex) => { const n = hex.replace('#', ''); return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)); };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export function renderHeatmap(host, model) {
  const c = colors();
  const lo = rgb(c.seq100), hi = rgb(c.seq700);
  const short = (l) => l.replace('Both sexes', 'Both').replace(' ', ' ');
  const head = h('tr', null, h('th'), SERIES.map((s) => h('th', { scope: 'col' }, short(s.label))));
  const body = SERIES.map((a) => h('tr', null, h('th', { class: 'rowhead', scope: 'row' }, short(a.label)),
    SERIES.map((b) => {
      const r = pearson(model.values.get(a.key), model.values.get(b.key));
      const t = Math.max(0, Math.min(1, r));
      const col = mix(lo, hi, t);
      const lum = (0.299 * col[0] + 0.587 * col[1] + 0.114 * col[2]) / 255;
      return h('td', { style: { background: `rgb(${col.join(',')})`, color: lum < 0.55 ? '#fff' : '#0b0b0b' }, title: `${a.label} vs ${b.label}: r = ${r.toFixed(3)}` }, r.toFixed(2));
    })));
  host.replaceChildren(h('thead', null, head), h('tbody', null, body));
}
