import { fetchSheet } from "../csv.js";
import { SHEET_NAMES, IDENTITY_COLUMNS, STATUS_ORDER, STATUS_META, normalizeStatus } from "../config.js";
import { renderLoading, renderError } from "../render/states.js";
import { renderBarChart } from "../render/barChart.js";
import { parseNumber, escapeHtml } from "../utils.js";

export async function renderDashboardPage(mount) {
  renderLoading(mount, "Crunching the numbers...");
  try {
    const [performance, companyWise] = await Promise.all([
      fetchSheet(SHEET_NAMES.performance),
      fetchSheet(SHEET_NAMES.companyWise),
    ]);

    const totalEligible = performance.rows.filter((r) => parseNumber(r["Active Backlogs"]) === 0).length;

    const companyColumns = companyWise.headers.filter((h) => !IDENTITY_COLUMNS.includes(h));
    const statusCounts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
    let totalPlaced = 0;
    let studentsOver3OA = 0;
    let studentsOver3Interview = 0;

    for (const row of companyWise.rows) {
      let oaCount = 0;
      let interviewCount = 0;
      let placed = false;
      for (const col of companyColumns) {
        const status = normalizeStatus(row[col]);
        if (!status) continue;
        if (statusCounts[status] != null) statusCounts[status] += 1;
        if (status === "OA Not Cleared") oaCount += 1;
        if (status === "Interview Not Cleared") interviewCount += 1;
        if (status === "Selected") placed = true;
      }
      if (placed) totalPlaced += 1;
      if (oaCount > 3) studentsOver3OA += 1;
      if (interviewCount > 3) studentsOver3Interview += 1;
    }

    const tiles = [
      {
        label: "Total eligible students",
        value: totalEligible,
        sub: "0 active backlogs · Student Performance",
        accent: "--upes-blue",
      },
      {
        label: "Total placed",
        value: totalPlaced,
        sub: "Selected in at least one company",
        accent: "--status-good",
      },
      {
        label: "Students with > 3 OAs given",
        value: studentsOver3OA,
        sub: '"OA Not Cleared" in 4+ companies',
        accent: "--status-warning",
      },
      {
        label: "Students with > 3 interviews given",
        value: studentsOver3Interview,
        sub: '"Interview Not Cleared" in 4+ companies',
        accent: "--status-serious",
      },
    ];

    mount.innerHTML = `
      <div class="dashboard">
        <div class="kpi-grid">
          ${tiles
            .map(
              (t) => `
            <div class="kpi-card" style="--kpi-accent: var(${t.accent})">
              <span class="kpi-card__label">${escapeHtml(t.label)}</span>
              <span class="kpi-card__value">${t.value.toLocaleString()}</span>
              <span class="kpi-card__sub">${escapeHtml(t.sub)}</span>
            </div>`
            )
            .join("")}
        </div>
        <div class="panel" id="status-breakdown"></div>
      </div>`;

    const breakdownMount = mount.querySelector("#status-breakdown");
    const bars = STATUS_ORDER.map((s) => ({
      label: s,
      value: statusCounts[s],
      colorVar: STATUS_META[s].colorVar,
      icon: STATUS_META[s].icon,
    }));
    const totalAttempts = bars.reduce((a, b) => a + b.value, 0);
    if (totalAttempts === 0) {
      breakdownMount.innerHTML = `<p class="state__note">No company-wise placement outcomes recorded yet.</p>`;
    } else {
      renderBarChart(breakdownMount, {
        title: "Placement outcomes across all companies",
        bars,
      });
    }
  } catch (err) {
    renderError(mount, err, () => renderDashboardPage(mount));
  }
}
