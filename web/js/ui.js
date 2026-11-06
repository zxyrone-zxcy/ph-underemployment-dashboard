// Small DOM helpers. All text goes in via text nodes (data is untrusted), never innerHTML.
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [key, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (key.startsWith('on') && typeof v === 'function') el.addEventListener(key.slice(2), v);
    else if (key === 'style' && typeof v === 'object') for (const [p, val] of Object.entries(v)) el.style.setProperty(p, val);
    else el.setAttribute(key, v === true ? '' : String(v));
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}

/* Theme colours come from the CSS variables, so charts follow light/dark. */
export const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const colors = () => ({
  male: css('--series-male'), female: css('--series-female'), y1524: css('--series-y1524'), y2534: css('--series-y2534'),
  text: css('--text-primary'), text2: css('--text-secondary'), muted: css('--text-muted'), grid: css('--grid-line'), axis: css('--axis-line'),
  surface: css('--surface-1'), seq100: css('--seq-100'), seq700: css('--seq-700'),
});
