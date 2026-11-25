// Small hand-rolled icon set (no icon font / CDN dependency).
const ICONS = {
  grid: '<rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/>',
  users:
    '<circle cx="7" cy="6.5" r="3"/><path d="M1.5 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke-width="1.6"/><circle cx="15" cy="7" r="2.3" fill="none" stroke-width="1.6"/><path d="M13.3 10.5c2.3.3 4 2 4 4.3" fill="none" stroke-width="1.6" stroke-linecap="round"/>',
  id: '<rect x="1.5" y="3.5" width="17" height="13" rx="2" fill="none" stroke-width="1.6"/><circle cx="6.5" cy="9.5" r="2" fill="none" stroke-width="1.5"/><path d="M3.3 14c.4-1.8 1.8-2.8 3.2-2.8s2.8 1 3.2 2.8" fill="none" stroke-width="1.5"/><path d="M12 8.5h4M12 11.5h4" stroke-width="1.5" stroke-linecap="round"/>',
  chart:
    '<path d="M2 17V9M7 17V3M12 17v-6M17 17V7" stroke-width="2" stroke-linecap="round" fill="none"/>',
  building:
    '<rect x="3" y="2" width="9" height="16" rx="1" fill="none" stroke-width="1.6"/><rect x="12" y="7" width="5" height="11" rx="1" fill="none" stroke-width="1.6"/><path d="M5.5 5.5h1M5.5 8.5h1M5.5 11.5h1M5.5 14.5h1M8.5 5.5h1M8.5 8.5h1M8.5 11.5h1M8.5 14.5h1" stroke-width="1.3" stroke-linecap="round"/>',
  badge:
    '<circle cx="10" cy="7.5" r="5" fill="none" stroke-width="1.6"/><path d="M7.3 11.8L6 18l4-2 4 2-1.3-6.2" fill="none" stroke-width="1.6" stroke-linejoin="round"/>',
  link: '<path d="M8 11.5L11.5 8" stroke-width="1.6" stroke-linecap="round"/><path d="M10 5.5l1.2-1.2a3 3 0 1 1 4.3 4.3L14 9.8M9 13.5L7.8 14.7a3 3 0 1 1-4.3-4.3L4.8 9.2" fill="none" stroke-width="1.6" stroke-linecap="round"/>',
  home: '<path d="M3 9.5L10 3l7 6.5" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 8.5V17h10V8.5" fill="none" stroke-width="1.6" stroke-linejoin="round"/>',
};

export function iconSvg(name, size = 18) {
  const inner = ICONS[name] ?? ICONS.grid;
  return `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" aria-hidden="true">${inner}</svg>`;
}
