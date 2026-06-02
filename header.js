/**
 * Unified site header — compact nav, member menu, smart routing
 */
(function (global) {
  "use strict";

  const PUBLIC_NAV = [
    { href: "index.html#home", label: "Home", key: "home" },
    { href: "index.html#record", label: "Record", key: "record" },
    { href: "index.html#about", label: "About", key: "about" },
    { href: "index.html#invest", label: "Strategy", key: "invest" },
    { href: "index.html#governance", label: "Token", key: "governance" },
    { href: "index.html#documentation", label: "Access", key: "documentation" },
  ];

  const MEMBER_MENU = [
    { href: "dashboard.html", label: "Dashboard", key: "dashboard" },
    { href: "members.html", label: "Members", key: "members" },
    { href: "dashboard.html#resources", label: "Resources", key: "resources" },
  ];

  function renderHeader(activeKey) {
    const publicLinks = PUBLIC_NAV.map(
      (item) =>
        `<a href="${item.href}" class="nav-link nav-link--public" data-nav="${item.key}">${item.label}</a>`
    ).join("");

    const memberItems = MEMBER_MENU.map(
      (item) =>
        `<a href="${item.href}" class="nav-dropdown__link" data-nav="${item.key}" role="menuitem">${item.label}</a>`
    ).join("");

    return `
      <div class="header-inner">
        <a href="index.html#home" class="header-logo accent-lavender-soft">NexusCo</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
          Menu
        </button>
        <div class="header-nav-group" id="primary-nav">
          <nav class="nav nav--public" aria-label="Site">
            ${publicLinks}
          </nav>
          <div class="nav-member" id="nav-member" hidden>
            <button type="button" class="nav-dropdown__trigger" id="member-menu-trigger" aria-expanded="false" aria-haspopup="true">
              Member <span class="nav-dropdown__caret" aria-hidden="true">▾</span>
            </button>
            <div class="nav-dropdown__panel" id="member-menu-panel" role="menu" hidden>
              ${memberItems}
            </div>
          </div>
        </div>
        <div class="wallet-panel" id="wallet-panel">
          <p class="wallet-error" id="wallet-error" hidden></p>
          <button type="button" class="btn btn-primary" id="wallet-connect" data-label="Connect">Connect</button>
          <div class="wallet-connected" id="wallet-connected" hidden>
            <span class="wallet-badge" id="wallet-address" title="Connected wallet"></span>
            <button type="button" class="btn btn-ghost btn-compact" id="wallet-disconnect">Out</button>
          </div>
        </div>
      </div>
    `;
  }

  function setActiveNav(activeKey) {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const key = el.getAttribute("data-nav");
      el.classList.toggle("active", key === activeKey);
    });
  }

  function setMemberNavVisible(visible) {
    const memberWrap = document.getElementById("nav-member");
    const accessLink = document.querySelector('[data-nav="documentation"].nav-link--public');

    if (memberWrap) memberWrap.hidden = !visible;

    if (accessLink) {
      if (visible) {
        accessLink.hidden = true;
      } else {
        accessLink.hidden = false;
        accessLink.href = "index.html#documentation";
        accessLink.textContent = "Access";
      }
    }
  }

  function bindMemberDropdown() {
    const trigger = document.getElementById("member-menu-trigger");
    const panel = document.getElementById("member-menu-panel");
    if (!trigger || !panel) return;

    function close() {
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });

    document.addEventListener("click", close);
    panel.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function bindMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const group = document.getElementById("primary-nav");
    if (!toggle || !group) return;

    toggle.addEventListener("click", () => {
      const open = group.classList.toggle("header-nav-group--open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    group.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        group.classList.remove("header-nav-group--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function init(options = {}) {
    const { active = "home", redirectOnConnect = null, onDisconnect = null } = options;
    const header = document.getElementById("site-header");
    if (!header) return;

    header.className = "site-header site-header--spread";
    header.innerHTML = renderHeader(active);
    setActiveNav(active);
    bindMemberDropdown();
    bindMobileNav();

    if (typeof NexusWallet === "undefined") return;

    NexusWallet.mountWalletUI({
      redirectOnConnect,
      onDisconnect: () => {
        setMemberNavVisible(false);
        if (onDisconnect) onDisconnect();
        const path = window.location.pathname.replace(/\\/g, "/");
        const onHome =
          path.endsWith("/") ||
          path.endsWith("index.html") ||
          path.endsWith("/NexusCo") ||
          !path.includes(".html");
        if (!onHome) window.location.href = "index.html";
      },
    });

    function sync(account) {
      setMemberNavVisible(Boolean(account?.address));
    }

    NexusWallet.on(sync);
    NexusWallet.restoreSession().then(sync);
  }

  global.NexusHeader = {
    init,
    setActiveNav,
    setMemberNavVisible,
    PUBLIC_NAV,
    MEMBER_MENU,
  };
})(typeof window !== "undefined" ? window : globalThis);