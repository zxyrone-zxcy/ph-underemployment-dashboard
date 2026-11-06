// Tiny store: the selected time scope (from the drill-down tree) and which years are expanded.
import { ALL_TIME } from './data.js';

export const state = { scope: { ...ALL_TIME }, expanded: new Set() };

const listeners = new Set();
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export function update(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}
export const setScope = (scope) => update({ scope });
export function toggleYear(y) {
  const expanded = new Set(state.expanded);
  expanded.has(y) ? expanded.delete(y) : expanded.add(y);
  update({ expanded });
}
