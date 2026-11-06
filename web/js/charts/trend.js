// Plan chart 3 (Q2, Q3): both-sexes trend for 15–24 vs 25–34. Re-scoped by the time tree.
import { series, scopeIdx, scopeLabel, MONTHS, persons } from '../data.js';
import { colors } from '../ui.js';
import { drawLine } from './lineBase.js';

export function renderTrend(model, scope) {
  const c = colors();
  document.getElementById('trendScopeLabel').textContent = scopeLabel(scope);
  // A single month would be one point, so show that calendar month across the years instead.
  const idx = scope.month != null && scope.year != null ? scopeIdx(model, { year: null, month: scope.month }) : scopeIdx(model, scope);
  const byYear = scope.month != null && scope.year != null;
  const labels = idx.map((i) => (byYear ? String(model.months[i].year) : model.months[i].label));
  drawLine('chartTrend', {
    labels,
    yTitle: 'Thousand persons',
    xTicks: idx.length > 14 ? 8 : 14,
    datasets: [
      { label: 'Ages 15–24', data: idx.map((i) => series(model, 'Both sexes', '15-24')[i]), color: c.y1524 },
      { label: 'Ages 25–34', data: idx.map((i) => series(model, 'Both sexes', '25-34')[i]), color: c.y2534 },
    ],
    tooltipTitle: (items) => (byYear ? `${MONTHS[scope.month - 1]} ${labels[items[0].dataIndex]}` : model.months[idx[items[0].dataIndex]].label),
    tooltipLabel: (ctx) => `${ctx.dataset.label}: ${persons(ctx.parsed.y)} persons`,
  });
}
