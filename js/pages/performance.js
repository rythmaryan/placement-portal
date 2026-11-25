import { fetchSheet } from "../csv.js";
import { SHEET_NAMES, IDENTITY_COLUMNS } from "../config.js";
import { createDataTable } from "../render/table.js";
import { renderLoading, renderError } from "../render/states.js";
import { escapeHtml } from "../utils.js";

export async function renderPerformancePage(mount) {
  renderLoading(mount, "Loading student performance data...");
  try {
    const { headers, rows } = await fetchSheet(SHEET_NAMES.performance);

    if (rows.length === 0) {
      mount.innerHTML = `<div class="state"><p>No records found in Student Performance.</p></div>`;
      return;
    }

    // Columns are rendered generically from whatever headers the sheet has
    // right now, so new metric columns (e.g. AMCAT_2_*) show up automatically.
    const columns = headers.map((h) => {
      const isMetric = !IDENTITY_COLUMNS.includes(h);
      return {
        key: h,
        label: h.replace(/_/g, " "),
        className: isMetric ? "col-numeric" : undefined,
        render: (row) => escapeHtml(row[h] || (isMetric ? "–" : "")),
      };
    });

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
    renderError(mount, err, () => renderPerformancePage(mount));
  }
}
