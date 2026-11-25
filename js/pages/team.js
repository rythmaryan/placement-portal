import { fetchSheet } from "../csv.js";
import { TEAM_SHEETS } from "../config.js";
import { createDataTable } from "../render/table.js";
import { renderLoading, renderError } from "../render/states.js";
import { teamTag } from "../render/badges.js";

export async function renderTeamPage(mount) {
  renderLoading(mount, "Loading placement team rosters...");
  try {
    const results = await Promise.all(
      TEAM_SHEETS.map((t) => fetchSheet(t.sheet).then((data) => ({ team: t, data })))
    );

    const colorByTeam = Object.fromEntries(TEAM_SHEETS.map((t) => [t.label, t.colorVar]));
    const rows = [];
    for (const { team, data } of results) {
      for (const r of data.rows) {
        if (!r.Name && !r.Email) continue;
        rows.push({ ...r, Team: team.label });
      }
    }

    if (rows.length === 0) {
      mount.innerHTML = `<div class="state"><p>No team members have been added to the sheet yet.</p></div>`;
      return;
    }

    const columns = [
      { key: "Name", label: "Name" },
      { key: "Email", label: "Email" },
      { key: "Contact Number", label: "Contact Number" },
      { key: "Position", label: "Position" },
      { key: "Seating", label: "Seating" },
      {
        key: "Team",
        label: "Team",
        render: (row) => teamTag(row.Team, colorByTeam[row.Team]),
      },
    ];

    createDataTable({
      mount,
      columns,
      rows,
      searchKeys: ["Name", "Email", "Position", "Seating", "Contact Number"],
      pageSize: 50,
      emptyMessage: "No team members match this filter.",
      filters: [
        {
          key: "team",
          label: "Team",
          type: "chips",
          getValue: (row) => row.Team,
          options: TEAM_SHEETS.map((t) => t.label),
          colorFor: (opt) => colorByTeam[opt],
        },
      ],
    });
  } catch (err) {
    renderError(mount, err, () => renderTeamPage(mount));
  }
}
