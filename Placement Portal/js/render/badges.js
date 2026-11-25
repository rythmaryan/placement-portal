import { escapeHtml } from "../utils.js";
import { STATUS_META } from "../config.js";

export function teamTag(label, colorVar) {
  return `<span class="tag" style="--tag-color: var(${colorVar})">${escapeHtml(label)}</span>`;
}

export function statusBadge(status) {
  if (!status) return `<span class="status-badge status-badge--empty">&ndash;</span>`;
  const meta = STATUS_META[status];
  if (!meta) {
    return `<span class="status-badge" style="--status-color: var(--status-muted)">${escapeHtml(status)}</span>`;
  }
  return `<span class="status-badge" style="--status-color: var(${meta.colorVar})"><span class="status-badge__icon" aria-hidden="true">${meta.icon}</span>${escapeHtml(
    status
  )}</span>`;
}

export function linkButton(url, label) {
  const href = (url ?? "").trim();
  if (!href) return `<span class="link-btn link-btn--disabled">${escapeHtml(label)}</span>`;
  const safeHref = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return `<a class="link-btn" href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
    label
  )}</a>`;
}
