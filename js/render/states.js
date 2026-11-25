export function renderLoading(mount, label = "Loading data from the sheet...") {
  mount.innerHTML = `
    <div class="state state--loading">
      <div class="spinner" aria-hidden="true"></div>
      <p>${label}</p>
    </div>`;
}

export function renderError(mount, error, onRetry) {
  mount.innerHTML = `
    <div class="state state--error">
      <p><strong>Couldn't load this data.</strong></p>
      <p class="state__detail"></p>
      <button class="btn btn--secondary" type="button" data-retry>Retry</button>
    </div>`;
  mount.querySelector(".state__detail").textContent = error?.message ?? String(error);
  mount.querySelector("[data-retry]").addEventListener("click", onRetry);
}
