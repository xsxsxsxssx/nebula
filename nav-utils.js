/**
 * Shared hash scroll & member-route helpers
 */
(function (global) {
  "use strict";

  function scrollToHash(retry = 0) {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    const el = document.getElementById(hash.slice(1));
    if (!el) {
      if (retry < 10) setTimeout(() => scrollToHash(retry + 1), 60);
      return;
    }

    const header = document.getElementById("site-header");
    const offset = (header?.offsetHeight || 56) + 20;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: retry > 0 ? "smooth" : "auto" });
  }

  function routeHomeMemberHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return false;

    const connected =
      typeof NexusWallet !== "undefined" && NexusWallet.isConnected();

    if (!connected) return false;

    const memberRoutes = {
      resources: "dashboard.html#resources",
      dashboard: "dashboard.html",
      members: "members.html",
      documentation: "dashboard.html#resources",
    };

    if (memberRoutes[hash]) {
      window.location.replace(memberRoutes[hash]);
      return true;
    }
    return false;
  }

  function bindHashNavigation() {
    function handle() {
      if (routeHomeMemberHash()) return;
      scrollToHash();
    }

    window.addEventListener("hashchange", handle);
    window.addEventListener("load", handle);
    setTimeout(handle, 150);
  }

  global.NexusNav = { scrollToHash, routeHomeMemberHash, bindHashNavigation };
})(typeof window !== "undefined" ? window : globalThis);