# PH Youth Underemployment Dashboard

Monthly underemployment of ages 15-24 and 25-34 by sex, Jan 2021 to Aug 2026
(Philippine Statistics Authority, Labor Force Survey via OpenStat; values in thousands of persons).

## Structure
- `data/psa_underemployment_2021_2026_thousands.csv` - original PSA download (reference, never edited)
- `notebooks/clean_data.ipynb` - raw csv -> tidy JSON (drops the 5 `Annual` rows, keeps 68 months)
- `web/` - the dashboard (static site; deploy this folder only)
- `web/data/underemployment_tidy.json` - cleaned data the dashboard loads

## Run locally
Browsers block `fetch()` on file:// pages, so serve the folder (VS Code Live Server works well):

    cd web
    python -m http.server 8000

Chart.js 4.4.1 is loaded from the cdnjs `<script>` tag in `index.html`, so you need an internet connection the first time.
