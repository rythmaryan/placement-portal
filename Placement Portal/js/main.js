import { initRouter, APP_ROUTES } from "./router.js";
import { iconSvg } from "./render/icons.js";

// Fill in icon placeholders declared in the static HTML.
document.querySelectorAll("[data-icon]").forEach((node) => {
  node.innerHTML = iconSvg(node.getAttribute("data-icon"));
});
document.getElementById("sidebar-home-icon").innerHTML = iconSvg("home");

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar--open");
});
document.getElementById("app-content").addEventListener("click", () => {
  sidebar.classList.remove("sidebar--open");
});

const pageTitleEl = document.getElementById("app-page-title");

initRouter({
  landingEl: document.getElementById("landing"),
  appShellEl: document.getElementById("app-shell"),
  appContentEl: document.getElementById("app-content"),
  sidebarNavEl: document.getElementById("sidebar-nav"),
  onNavigate(path) {
    sidebar.classList.remove("sidebar--open");
    if (!path) return;
    const route = APP_ROUTES.find((r) => r.path === path);
    pageTitleEl.textContent = route?.label ?? "";
  },
});
