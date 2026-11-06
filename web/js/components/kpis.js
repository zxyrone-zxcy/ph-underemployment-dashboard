// Summary KPI cards (plan section 3): latest month vs the series average, and the latest gender gap.
import { h } from '../ui.js';
import { AGES, AGE_LABEL, series, mean, persons, signed, k } from '../data.js';

const card = (label, value, detail, good) =>
  h('div', { class: 'kpi' }, h('div', { class: 'label' }, label), h('div', { class: 'value' }, value), h('div', { class: 'detail' + (good ? ' good' : '') }, detail));

export function renderKpis(host, model) {
  const last = model.months.at(-1);
  const cards = [];
  for (const age of AGES) {
    const s = series(model, 'Both sexes', age);
    const base = mean(s);
    const diff = (s[last.i] - base) * 1000;
    cards.push(card(`${AGE_LABEL[age]}, ${last.label}`, [persons(s[last.i]), ' ', h('small', null, 'persons')],
      `${diff < 0 ? 'Below' : 'Above'} the series average (${persons(base)}) by ${Math.abs(Math.round(diff)).toLocaleString('en-US')}`, diff < 0));
  }
  for (const age of AGES) {
    const male = series(model, 'Male', age), female = series(model, 'Female', age);
    const gap = male[last.i] - female[last.i];
    const avgGap = mean(male.map((v, i) => v - female[i]));
    cards.push(card(`Gender gap ${age.replace('-', '–')}, ${last.label}`, [signed(gap * 1000, 0), ' ', h('small', null, 'male − female')],
      `Average gap over ${model.months.length} months: ${signed(avgGap * 1000, 0)}`));
  }
  host.replaceChildren(...cards);
}
