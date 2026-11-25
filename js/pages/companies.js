import { fetchSheet } from "../csv.js";
import { SHEET_NAMES } from "../config.js";
import { createDataTable } from "../render/table.js";
import { renderLoading, renderError } from "../render/states.js";
import { escapeHtml } from "../utils.js";

export async function renderCompaniesPage(mount) {
  renderLoading(mount, "Loading upcoming companies...");
  try {
    const { headers, rows } = await fetchSheet(SHEET_NAMES.companies, { identityIndex: 0 });

    if (rows.length === 0) {
      mount.innerHTML = `<div class="state"><p>No upcoming companies have been added to the sheet yet.</p></div>`;
      return;
    }

    const numericLike = new Set(["Number of selected"]);
    const columns = headers.map((h) => ({
      key: h,
      label: h,
      className: numericLike.has(h) ? "col-numeric" : undefined,
      render: (row) => escapeHtml(row[h]),
    }));

    createDataTable({
      mount,
      columns,
      rows,
      searchKeys: ["Company Name", "Role"],
      pageSize: 25,
      emptyMessage: "No companies match this search.",
      filters: [],
    });
  } catch (err) {
    renderError(mount, err, () => renderCompaniesPage(mount));
  }
}
