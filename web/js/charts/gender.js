// Plan chart 2 (Q1): male vs female underemployment within each age cohort, all 68 months.
import { AGES, series, persons, signed } from '../data.js';
import { colors } from '../ui.js';
import { drawLine } from './lineBase.js';

export function renderGender(model) {
  const c = colors();
  const labels = model.months.map((x) => x.label);
  AGES.forEach((age, n) => {
    const male = series(model, 'Male', age), female = series(model, 'Female', age);
    drawLine(n ? 'chartGender2534' : 'chartGender1524', {
      labels,
      yTitle: 'Thousand persons',
      datasets: [{ label: 'Male', data: male, color: c.male }, { label: 'Female', data: female, color: c.female }],
      tooltipTitle: (items) => model.months[items[0].dataIndex].label,
      tooltipLabel: (ctx) => `${ctx.dataset.label}: ${persons(ctx.parsed.y)} persons`,
      tooltipAfter: (items) => `Gap (male − female): ${signed(male[items[0].dataIndex] - female[items[0].dataIndex], 1)} thousand`,
    });
  });
}
