import { fetchSheet } from "../csv.js";
import { SHEET_NAMES, IDENTITY_COLUMNS, normalizeStatus } from "../config.js";
import { createDataTable } from "../render/table.js";
import { renderLoading, renderError } from "../render/states.js";
import { statusBadge } from "../render/badges.js";

export async function renderPlacedPage(mount) {
  renderLoading(mount, "Loading placement status by company...");
  try {
    const { headers, rows } = await fetchSheet(SHEET_NAMES.companyWise);

    if (rows.length === 0) {
      mount.innerHTML = `<div class="state"><p>No placement data found in Company vise student.</p></div>`;
      return;
    }

    const companyColumns = headers.filter((h) => !IDENTITY_COLUMNS.includes(h));

    if (companyColumns.length === 0) {
      mount.innerHTML = `<div class="state"><p>No company columns have been added to the sheet yet.</p></div>`;
      return;
    }

    const columns = [
      { key: "SAP ID", label: "SAP ID", className: "col-numeric" },
      { key: "Name", label: "Name" },
      { key: "Batch", label: "Batch" },
      ...companyColumns.map((h) => ({
        key: h,
        label: h,
        className: "col-status",
        render: (row) => statusBadge(normalizeStatus(row[h])),
      })),
    ];

    const filters = headers.includes("Batch")
      ? [{ key: "Batch", label: "Batch", type: "select", getValue: (row) => row["Batch"] }]
      : [];

    createDataTable({
      mount,
      columns,
      rows,
      searchKeys: ["SAP ID", "Name", "Email", "Batch"],
      pageSize: 50,
      emptyMessage: "No students match this filter.",
      filters,
      getRowKey: (row) => row["SAP ID"],
    });
  } catch (err) {
    renderError(mount, err, () => renderPlacedPage(mount));
  }
}
