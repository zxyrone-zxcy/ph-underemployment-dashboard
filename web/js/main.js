// Entry point: load the cleaned data, then render every view. Chart.js comes from the CDN <script> in index.html.
import { loadModel } from './data.js';
import { state, subscribe } from './state.js';
import { renderTimeTree } from './components/timeTree.js';
import { renderDemoTree } from './components/demoTree.js';
import { renderHeatmap } from './components/heatmap.js';
import { renderGender } from './charts/gender.js';
import { renderTrend } from './charts/trend.js';
import { renderSeasonal } from './charts/seasonal.js';
import { initTimeline, redrawTimeline } from './charts/timeline.js';

const $ = (id) => document.getElementById(id);
const root = document.documentElement;
const status = $('status');
const fail = (msg) => { status.classList.add('err'); status.textContent = msg; };

let model;
try {
  const res = await fetch('data/underemployment_tidy.json');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  model = loadModel(await res.json());
} catch (err) {
  fail(`Could not load data/underemployment_tidy.json (${err.message}). Serve the web folder over http (for example with Live Server) instead of opening the file directly.`);
  throw err;
}
status.remove();

function drawCharts() {
  try {
    renderGender(model);
    renderTrend(model, state.scope);
    renderSeasonal(model);
    redrawTimeline();
  } catch (err) { fail(err.message); }
}
function drawScoped() {
  renderTimeTree($('timeTree'), model);
  renderDemoTree($('demoTree'), model, state.scope);
  try { renderTrend(model, state.scope); } catch (err) { fail(err.message); }
}

try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch {}
const dark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
const rerender = () => { drawCharts(); renderHeatmap($('heatmapTable'), model); };
$('themeToggle').addEventListener('click', () => {
  root.dataset.theme = dark() ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  rerender();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!root.dataset.theme) rerender(); });

try { initTimeline(model); } catch (err) { fail(err.message); }
renderHeatmap($('heatmapTable'), model);
renderGender(model);
renderSeasonal(model);
subscribe(drawScoped);
drawScoped();

/* fade sections in as they scroll into view */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
