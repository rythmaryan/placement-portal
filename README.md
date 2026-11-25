# UPES Placement Portal

A dependency-free front end (plain HTML/CSS/JS, ES modules) that reads live
from a Google Sheet. No build step, no framework, nothing to `npm install`
except the included zero-dependency dev server.

## Run it

```
node server.js
```

Then open http://localhost:5173. (`npm start` does the same thing.)

A plain static server is required &mdash; opening `index.html` directly via
`file://` will not work, because `fetch()` to Google Sheets needs an http(s)
page origin.

## Data source

Everything is fetched live, client-side, from this sheet (see `js/config.js`):

```
https://docs.google.com/spreadsheets/d/1lJV_gZzVFBGjk73I1JTnWyBgqUqQBhpkxJ1hOwpBvQc
```

Each worksheet is pulled on demand via Google's CSV export endpoint
(`/gviz/tq?tqx=out:csv&sheet=<name>`) and cached in memory for 60s
(`CACHE_TTL_MS` in `js/config.js`). Add rows, add columns, rename a team
member &mdash; refresh the page and it's reflected. No API key or backend
required, since the sheet is shared as "anyone with the link."

Sheets consumed:

| Worksheet | Used by |
|---|---|
| Master Data Student | Student Master Data page |
| Student Performance | Student Performance page + Dashboard eligibility |
| Company vise student | Placed Student Data page + Dashboard |
| Companies | Upcoming Companies page |
| Technical Team / Career Services Team / Edge Team / Placement Committee / SPR | Placement Team page |

**Dynamic columns:** Student Performance and Company vise student render
every header the sheet currently has (beyond `SAP ID/Name/Email/Batch`), so
adding a new AMCAT round or a new "Company N" column shows up automatically
&mdash; no code change needed.

## Project layout

```
index.html            landing page + app shell markup
css/styles.css         all styling (brand, tables, badges, charts)
js/config.js            sheet id, sheet names, team/status color mapping
js/csv.js               CSV parsing + fetch/cache layer
js/router.js            hash router (landing vs. the 6 app sections)
js/render/table.js       generic searchable/filterable/paginated table
js/render/badges.js      team tag + status badge + profile-link button
js/render/barChart.js    status-breakdown bar chart
js/pages/*.js            one module per section
server.js               zero-dependency static file server (dev only)
```

## Notes

- The sheet is publicly readable by its share link, and this app simply
  fetches that same public CSV endpoint from the browser &mdash; there's no
  login. Treat the deployed URL with the same care as the sheet's share link.
- Placement status colors are a fixed progression (worst &rarr; best): Not
  Eligible (muted) &rarr; Resume Not Shortlisted (red) &rarr; OA Not Cleared
  (orange) &rarr; Interview Not Cleared (amber) &rarr; Selected (green).
- Dashboard "Total placed" counts a student once if **any** of their company
  columns says "Selected". ">3 OAs/Interviews given" counts occurrences of
  "OA Not Cleared" / "Interview Not Cleared" per student across all company
  columns.
