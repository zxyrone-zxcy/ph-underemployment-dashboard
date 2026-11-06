// Shared Chart.js (global from the CDN script) setup so every line chart looks the same.
import { colors } from '../ui.js';

const live = new Map();   // canvas id -> Chart instance

export function drawLine(canvasId, { labels, datasets, yTitle, tooltipLabel, tooltipTitle, tooltipAfter, xTicks = 8 }) {
  const Chart = window.Chart;
  if (!Chart) throw new Error('Chart.js did not load (check your internet connection)');
  live.get(canvasId)?.destroy();
  const c = colors();
  const chart = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((d) => ({
        borderWidth: 2, pointRadius: labels.length <= 14 ? 3 : 0, pointHoverRadius: 5, tension: 0.15, spanGaps: false,
        pointBackgroundColor: d.color, ...d,
        borderColor: d.color,
      })),
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 1100, easing: 'easeOutCubic' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'start', labels: { color: c.text2, usePointStyle: true, pointStyle: 'line', boxWidth: 28 } },
        tooltip: { callbacks: { title: tooltipTitle, label: tooltipLabel, afterBody: tooltipAfter } },
      },
      scales: {
        x: { grid: { display: false }, border: { color: c.axis }, ticks: { color: c.muted, maxTicksLimit: xTicks, maxRotation: 0 } },
        y: { beginAtZero: true, grid: { color: c.grid }, border: { display: false }, ticks: { color: c.muted }, title: { display: !!yTitle, text: yTitle, color: c.muted } },
      },
    },
  });
  live.set(canvasId, chart);
  return chart;
}
