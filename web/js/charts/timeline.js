// Animated timeline: the series draws itself month by month. Play / pause, scrub, and switch sex.
import { AGES, series, persons } from '../data.js';
import { colors } from '../ui.js';

const SPEED = 130; // ms per month
let chart, raf, last = 0, cur = 0, playing = false, sex = 'Both sexes', model, els;

const cursor = {
  id: 'cursor',
  afterDatasetsDraw(ch) {
    const m = ch.getDatasetMeta(0).data[cur];
    if (!m) return;
    const { ctx, chartArea: a } = ch;
    ctx.save();
    ctx.strokeStyle = colors().axis; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(m.x, a.top); ctx.lineTo(m.x, a.bottom); ctx.stroke();
    ctx.restore();
  },
};

function build() {
  const c = colors();
  chart?.destroy();
  const mk = (age, color) => ({
    label: age.replace('-', '–'), color, data: [], borderColor: color, backgroundColor: color + '22',
    borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 0, tension: 0.25, fill: true,
  });
  chart = new window.Chart(document.getElementById('chartTimeline'), {
    type: 'line',
    data: { labels: model.months.map((x) => x.label), datasets: [mk('15-24', c.y1524), mk('25-34', c.y2534)] },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { grid: { display: false }, border: { color: c.axis }, ticks: { color: c.muted, maxTicksLimit: 8, maxRotation: 0 } },
        y: { beginAtZero: true, suggestedMax: yMax(), grid: { color: c.grid }, border: { display: false }, ticks: { color: c.muted } },
      },
    },
    plugins: [cursor],
  });
  paint();
}

function yMax() {
  let mx = 0;
  for (const s of ['Both sexes', 'Male', 'Female']) for (const a of AGES) mx = Math.max(mx, ...series(model, s, a));
  return Math.ceil(mx / 100) * 100;
}

function paint() {
  const n = model.months.length;
  AGES.forEach((age, k) => {
    const s = series(model, sex, age);
    chart.data.datasets[k].data = s.map((v, i) => (i <= cur ? v : null));
    els.val[k].textContent = persons(s[cur]);
  });
  chart.options.scales.y.suggestedMax = sex === 'Both sexes' ? yMax() : chart.options.scales.y.suggestedMax;
  els.month.textContent = model.months[cur].label;
  els.range.value = cur;
  els.range.style.setProperty('--p', (cur / (n - 1)) * 100 + '%');
  chart.update('none');
}

function tick(t) {
  if (!playing) return;
  if (t - last >= SPEED) {
    last = t;
    if (cur >= model.months.length - 1) { setPlaying(false); return; }
    cur++; paint();
  }
  raf = requestAnimationFrame(tick);
}

function setPlaying(v) {
  playing = v;
  els.play.classList.toggle('on', v);
  els.play.setAttribute('aria-label', v ? 'Pause' : 'Play');
  cancelAnimationFrame(raf);
  if (v) {
    if (cur >= model.months.length - 1) cur = 0;
    last = 0; raf = requestAnimationFrame(tick);
  }
}

export function initTimeline(m) {
  model = m;
  const $ = (id) => document.getElementById(id);
  els = { play: $('tlPlay'), range: $('tlRange'), month: $('tlMonth'), val: [$('tlVal1'), $('tlVal2')] };
  els.range.max = m.months.length - 1;
  els.play.addEventListener('click', () => setPlaying(!playing));
  els.range.addEventListener('input', () => { setPlaying(false); cur = +els.range.value; paint(); });
  document.querySelectorAll('#tlSex button').forEach((b) => b.addEventListener('click', () => {
    sex = b.dataset.sex;
    document.querySelectorAll('#tlSex button').forEach((x) => x.classList.toggle('on', x === b));
    paint();
  }));
  cur = 0; build();
  // autoplay once the chart is on screen
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { setPlaying(true); o.disconnect(); } }, { threshold: 0.5 }).observe($('chartTimeline'));
}

export const redrawTimeline = () => chart && build();
