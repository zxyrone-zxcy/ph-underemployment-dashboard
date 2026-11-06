# web/

Static dashboard. Open through a local server (see the root README).

## Dashboard views (from the Dashboard Analysis & Design Plan)
- KPI cards: latest month vs series average, latest male-female gap (Q1, Q2)
- Gender comparison: male vs female line charts for 15-24 and 25-34 (Q1)
- Drill-down: time tree (all periods -> year -> month) re-scopes the trend chart and the age/sex breakdown (Q2, Q3)
- Seasonal profile: average per calendar month (Q4); Sep-Dec average 5 years, marked *
- Descriptive statistics and Pearson correlation heatmap (Q5)
- Data-driven insights: sentences computed from the loaded data
- Full monthly table with CSV download; light/dark theme toggle

## Code map
- `js/main.js` - loads data, wires every view and the theme toggle
- `js/data.js` - model, scope helpers, mean/median/sample SD/Pearson, seasonal averages, number formats
- `js/state.js` - selected time scope + expanded years
- `js/ui.js` - DOM helper and theme colours read from CSS variables
- `js/charts/` - `lineBase.js` (shared Chart.js setup), `gender.js`, `trend.js`, `seasonal.js`
- `js/components/` - `kpis`, `timeTree`, `demoTree`, `statsTable`, `heatmap`, `insights`, `dataTable`

## Data notes
- Values are thousands of persons; headline figures are shown in persons (x 1,000).
- Standard deviation is the sample SD (n - 1).
- Correlation shows association only, not cause.
