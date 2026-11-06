// Plan chart 4 (Q4): average per calendar month across every year in the data.
import { seasonal, persons } from '../data.js';
import { colors } from '../ui.js';
import { drawLine } from './lineBase.js';

export function renderSeasonal(model) {
  const c = colors();
  const a = seasonal(model, 'Both sexes', '15-24'), b = seasonal(model, 'Both sexes', '25-34');
  const maxN = Math.max(...a.map((x) => x.n));
  const labels = a.map((x) => x.name.slice(0, 3) + (x.n < maxN ? '*' : ''));
  drawLine('chartSeasonal', {
    labels,
    yTitle: 'Average, thousand persons',
    xTicks: 12,
    datasets: [
      { label: 'Ages 15–24', data: a.map((x) => x.avg), color: c.y1524 },
      { label: 'Ages 25–34', data: b.map((x) => x.avg), color: c.y2534 },
    ],
    tooltipTitle: (items) => { const x = a[items[0].dataIndex]; return `${x.name}: average of ${x.n} years (${x.from}–${x.to})`; },
    tooltipLabel: (ctx) => `${ctx.dataset.label}: ${persons(ctx.parsed.y)} persons`,
  });
}
