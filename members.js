/**
 * NexusCo members directory (wallet-gated)
 */
(function () {
  "use strict";

  const account = NexusWallet.requireAuth("index.html");
  if (!account) return;

  NexusHeader.init({ active: "members" });

  const grid = document.getElementById("member-grid");
  if (!grid || typeof NexusData === "undefined") return;

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  grid.innerHTML = NexusData.MEMBERS.map((m) => {
    const xBlock = m.xUrl
      ? `<a href="${escapeHtml(m.xUrl)}" class="member-x accent-cyan" target="_blank" rel="noopener noreferrer">@${escapeHtml(m.xHandle || "AlekPavicevic")}</a>`
      : "";

    const tags = (m.tags || [])
      .map((t) => `<span class="member-tag">${escapeHtml(t)}</span>`)
      .join("");

    const avatar = m.avatar
      ? `<img src="${escapeHtml(m.avatar)}" alt="" class="member-avatar-img" width="56" height="56" loading="lazy" referrerpolicy="no-referrer">`
      : `<span class="member-avatar-fallback">${escapeHtml(m.initials || "?")}</span>`;

    return `
      <article class="member-card ${m.id === "aleksa-pavicevic" ? "member-card--founder" : ""}">
        <div class="member-avatar" title="${escapeHtml(m.avatarType || "")}">${avatar}</div>
        <div class="member-body">
          <header class="member-head">
            <h2 class="member-name">${escapeHtml(m.name)}</h2>
            <p class="member-role accent-lavender">${escapeHtml(m.role)}</p>
          </header>
          <p class="member-meta muted">
            ${escapeHtml(m.location)} · since ${escapeHtml(m.since)}
          </p>
          <p class="member-focus"><span class="muted">Focus:</span> ${escapeHtml(m.focus)}</p>
          <p class="member-bio">${escapeHtml(m.bio)}</p>
          ${xBlock}
          <div class="member-tags">${tags}</div>
        </div>
      </article>
    `;
  }).join("");
})();