import { renderTeamPage } from "./pages/team.js";
import { renderMasterDataPage } from "./pages/masterData.js";
import { renderPerformancePage } from "./pages/performance.js";
import { renderCompaniesPage } from "./pages/companies.js";
import { renderPlacedPage } from "./pages/placed.js";
import { renderDashboardPage } from "./pages/dashboard.js";
import { iconSvg } from "./render/icons.js";

export const APP_ROUTES = [
  { path: "dashboard", label: "Dashboard", icon: "grid", render: renderDashboardPage },
  { path: "team", label: "Placement Team", icon: "users", render: renderTeamPage },
  { path: "master", label: "Student Master Data", icon: "id", render: renderMasterDataPage },
  { path: "performance", label: "Student Performance", icon: "chart", render: renderPerformancePage },
  { path: "companies", label: "Upcoming Companies", icon: "building", render: renderCompaniesPage },
  { path: "placed", label: "Placed Student Data", icon: "badge", render: renderPlacedPage },
];

const DEFAULT_APP_PATH = "dashboard";

export function initRouter({ landingEl, appShellEl, appContentEl, sidebarNavEl, onNavigate }) {
  function buildSidebar(activePath) {
    sidebarNavEl.innerHTML = APP_ROUTES.map(
      (r) => `
      <a href="#/app/${r.path}" class="sidebar__link${r.path === activePath ? " sidebar__link--active" : ""}" data-path="${r.path}">
        <span class="sidebar__icon">${iconSvg(r.icon)}</span>
        <span>${r.label}</span>
      </a>`
    ).join("");
  }

  let currentPath = null;

  async function handleHashChange() {
    const hash = window.location.hash || "";
    const appMatch = hash.match(/^#\/app(?:\/([a-z]+))?/);

    if (!appMatch) {
      landingEl.hidden = false;
      appShellEl.hidden = true;
      document.title = "UPES Placement Portal — Everything under one roof";
      window.scrollTo({ top: 0 });
      onNavigate?.(null);
      return;
    }

    const requestedPath = appMatch[1];
    const route = APP_ROUTES.find((r) => r.path === requestedPath) ?? APP_ROUTES.find((r) => r.path === DEFAULT_APP_PATH);

    if (requestedPath !== route.path) {
      window.location.hash = `#/app/${route.path}`;
      return;
    }

    landingEl.hidden = true;
    appShellEl.hidden = false;
    document.title = `${route.label} — UPES Placement Portal`;
    buildSidebar(route.path);
    onNavigate?.(route.path);

    if (currentPath !== route.path) {
      currentPath = route.path;
      appContentEl.scrollTo?.({ top: 0 });
      await route.render(appContentEl);
    }
  }

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

export function goToApp(path = DEFAULT_APP_PATH) {
  window.location.hash = `#/app/${path}`;
}

export function goHome() {
  window.location.hash = "#/";
}
