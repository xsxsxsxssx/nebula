/**
 * NexusCo investment dashboard
 */
(function () {
  "use strict";

  const account = NexusWallet.requireAuth("index.html");
  if (!account) return;

  if (typeof NexusHeader !== "undefined") {
    NexusHeader.init({ active: "dashboard" });
  }

  const {
    formatUsd,
    formatPct,
    portfolioForWallet,
    sortRows,
    RESOURCES,
    CONSORTIUM_SINCE,
    CONSORTIUM_NOTE,
    ENQUIRE_URL,
  } = NexusData;

  const tbody = document.getElementById("invest-tbody");
  const statDao = document.getElementById("stat-dao-total");
  const statDaoMeta = document.getElementById("stat-dao-meta");
  const statYours = document.getElementById("stat-your-total");
  const statShare = document.getElementById("stat-your-share");
  const consortiumNote = document.getElementById("consortium-note");
  const memberNotice = document.getElementById("member-notice");
  const resourceList = document.getElementById("resource-list");
  const sortButtons = document.querySelectorAll(".sort-btn");

  const portfolio = portfolioForWallet(account.address);
  let sortKey = "daoCommitted";
  let sortDir = "desc";

  statDao.textContent = formatUsd(portfolio.totalDao);
  statDaoMeta.textContent = `since ${CONSORTIUM_SINCE}`;
  statYours.textContent = formatUsd(portfolio.totalYours);
  statShare.textContent = formatPct(portfolio.yourShareOfDao);

  if (consortiumNote) consortiumNote.textContent = CONSORTIUM_NOTE;

  if (memberNotice && portfolio.isNewMember) {
    memberNotice.hidden = false;
    memberNotice.innerHTML =
      'New connection. Personal allocations are <span class="accent-lavender">$0</span> until recorded. Use <strong>Contact to Enquire</strong> to reach principals regarding participation.';
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function slug(s) {
    return s.toLowerCase().replace(/\s+/g, "-");
  }

  function renderTable() {
    const rows = sortRows(portfolio.rows, sortKey, sortDir);

    tbody.innerHTML = rows
      .map(
        (row) => `
      <tr>
        <td>
          <span class="cell-primary">${escapeHtml(row.name)}</span>
          <span class="cell-meta muted">${escapeHtml(row.vintage)} · ${escapeHtml(row.round || "")} · ${escapeHtml(row.consortium || "")}</span>
        </td>
        <td>${escapeHtml(row.sector)}</td>
        <td class="accent-cyan-soft">${formatUsd(row.daoCommitted)}</td>
        <td class="cell-highlight">${formatUsd(row.yourContribution)}</td>
        <td>${formatPct(row.yourSharePct)}</td>
        <td><span class="status-pill status-pill--${slug(row.status)}">${escapeHtml(row.status)}</span></td>
        <td>
          <a href="${escapeHtml(ENQUIRE_URL)}" class="btn btn-enquire" target="_blank" rel="noopener noreferrer">Contact to Enquire</a>
        </td>
      </tr>
    `
      )
      .join("");
  }

  function updateSortUI() {
    sortButtons.forEach((btn) => {
      const key = btn.dataset.sort;
      const active = key === sortKey;
      const aria = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
      btn.setAttribute("aria-sort", aria);
      btn.classList.toggle("sort-btn--active", active);
      const icon = btn.querySelector(".sort-icon");
      if (icon) icon.textContent = active ? (sortDir === "asc" ? "↑" : "↓") : "↕";
    });
  }

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.sort;
      if (sortKey === key) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDir =
          key === "daoCommitted" || key === "yourContribution" || key === "yourSharePct"
            ? "desc"
            : "asc";
      }
      updateSortUI();
      renderTable();
    });
  });

  function renderResources() {
    if (!resourceList) return;
    resourceList.innerHTML = RESOURCES.map(
      (doc) => `
      <li class="resource-item">
        <div class="resource-meta">
          <span class="resource-category accent-lavender">${escapeHtml(doc.category)}</span>
          <span class="resource-date muted">${escapeHtml(doc.updated)} · ${escapeHtml(doc.format)}</span>
        </div>
        <span class="resource-title">${escapeHtml(doc.title)}</span>
        <button type="button" class="resource-dl btn btn-ghost" disabled>Request access</button>
      </li>
    `
    ).join("");
  }

  updateSortUI();
  renderTable();
  renderResources();

  if (typeof NexusNav !== "undefined") {
    NexusNav.scrollToHash();
    window.addEventListener("hashchange", () => NexusNav.scrollToHash());
  }
})();