import { fetchSheet } from "../csv.js";
import { SHEET_NAMES } from "../config.js";
import { createDataTable } from "../render/table.js";
import { renderLoading, renderError } from "../render/states.js";
import { linkButton } from "../render/badges.js";
import { escapeHtml } from "../utils.js";

const LINK_COLUMNS = new Set(["LinkedIn", "Github", "Leetcode", "Portfolio"]);
const FILTERABLE = ["Year of enrollment", "Semester", "Course"];

export async function renderMasterDataPage(mount) {
  renderLoading(mount, "Loading student master data...");
  try {
    const { headers, rows } = await fetchSheet(SHEET_NAMES.masterData);

    if (rows.length === 0) {
      mount.innerHTML = `<div class="state"><p>No students found in Master Data Student.</p></div>`;
      return;
    }

    const columns = headers.map((h) => {
      if (LINK_COLUMNS.has(h)) {
        return { key: h, label: h, render: (row) => linkButton(row[h], h), className: "col-link" };
      }
      if (h === "SAP ID") {
        return { key: h, label: h, className: "col-numeric", render: (row) => escapeHtml(row[h]) };
      }
      return { key: h, label: h };
    });

    const filters = FILTERABLE.filter((f) => headers.includes(f)).map((f) => ({
      key: f,
      label: f,
      type: "select",
      getValue: (row) => row[f],
    }));

    createDataTable({
      mount,
      columns,
      rows,
      searchKeys: ["SAP ID", "Name", "Email", "Batch", "Course"],
      pageSize: 50,
      emptyMessage: "No students match this filter.",
      filters,
      getRowKey: (row) => row["SAP ID"],
    });
  } catch (err) {
    renderError(mount, err, () => renderMasterDataPage(mount));
  }
}
