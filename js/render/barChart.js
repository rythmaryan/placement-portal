import { escapeHtml } from "../utils.js";

/**
 * Simple horizontal bar list. Each bar carries its own text label, so color
 * never has to carry identity alone (dataviz skill: status colors ship with
 * an icon + label, never color-alone).
 * bars: [{ label, value, colorVar, icon? }]
 */
export function renderBarChart(mount, { bars, title }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  mount.innerHTML = `
    <div class="bar-chart">
      ${title ? `<h3 class="bar-chart__title">${escapeHtml(title)}</h3>` : ""}
      ${bars
        .map((b) => {
          const pct = Math.max(2, Math.round((b.value / max) * 100));
          return `
            <div class="bar-row">
              <span class="bar-row__label">${b.icon ? `<span class="bar-row__icon" style="color: var(${b.colorVar})">${b.icon}</span>` : ""}${escapeHtml(
            b.label
          )}</span>
              <span class="bar-row__track">
                <span class="bar-row__fill" style="width:${pct}%; background: var(${b.colorVar})"></span>
              </span>
              <span class="bar-row__value">${b.value.toLocaleString()}</span>
            </div>`;
        })
        .join("")}
    </div>`;
}
