/**
 * NexusDAO — nebula portal, home header, hash navigation
 */
(function () {
  "use strict";

  const canvas = document.getElementById("portal-canvas");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const isHome = document.body.classList.contains("page-home");

  function updateHeroMeta(account) {
    const heroMeta = document.getElementById("hero-meta");
    const accessActions = document.getElementById("access-actions");
    if (!heroMeta || typeof NexusWallet === "undefined") return;

    if (account?.address) {
      heroMeta.innerHTML = `
        <span class="meta-line"><span class="caret">›</span> authenticated</span>
        <span class="meta-line muted"><a href="dashboard.html" class="inline-link accent-cyan">dashboard</a> · <a href="members.html" class="inline-link accent-lavender">members</a></span>
      `;
      if (accessActions) accessActions.hidden = true;
    } else {
      heroMeta.innerHTML = `
        <span class="meta-line"><span class="caret">›</span> observer</span>
        <span class="meta-line muted">authenticated access required</span>
      `;
      if (accessActions) accessActions.hidden = false;
    }
  }

  if (typeof NexusHeader !== "undefined" && isHome) {
    NexusHeader.init({
      active: window.location.hash?.slice(1) || "home",
      redirectOnConnect: "dashboard.html",
      onDisconnect: () => updateHeroMeta(null),
    });
  }

  if (isHome && typeof NexusWallet !== "undefined") {
    NexusWallet.on(updateHeroMeta);
    NexusWallet.restoreSession().then(updateHeroMeta);

    const accessConnect = document.getElementById("access-connect");
    const walletConnect = document.getElementById("wallet-connect");
    if (accessConnect && walletConnect) {
      accessConnect.addEventListener("click", () => walletConnect.click());
    }
  }

  if (isHome && typeof NexusNav !== "undefined") {
    NexusNav.bindHashNavigation();

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (typeof NexusHeader !== "undefined") {
            NexusHeader.setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* Nebula starfield + dust */
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let dust = [];
    let animationId = null;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w * 0.5;
      cy = h * 0.4;
      const count = Math.min(160, Math.floor((w * h) / 10000));
      stars = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * Math.max(w, h) * 0.55,
        size: 0.35 + Math.random() * 1.4,
        speed: 0.00006 + Math.random() * 0.00012,
        opacity: 0.06 + Math.random() * 0.2,
        tint: Math.random() > 0.5 ? "lavender" : "cyan",
      }));
      dust = Array.from({ length: 24 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 40 + Math.random() * 120,
        dx: (Math.random() - 0.5) * 0.08,
        dy: (Math.random() - 0.5) * 0.05,
        hue: Math.random() > 0.5 ? [122, 107, 158] : [61, 138, 138],
        alpha: 0.012 + Math.random() * 0.02,
      }));
    }

    function drawNebulaWash() {
      const g = ctx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, Math.max(w, h) * 0.75);
      g.addColorStop(0, "rgba(155, 130, 190, 0.09)");
      g.addColorStop(0.25, "rgba(100, 160, 190, 0.06)");
      g.addColorStop(0.55, "rgba(180, 140, 200, 0.03)");
      g.addColorStop(1, "rgba(10, 10, 12, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const d of dust) {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < -d.r) d.x = w + d.r;
        if (d.x > w + d.r) d.x = -d.r;
        if (d.y < -d.r) d.y = h + d.r;
        if (d.y > h + d.r) d.y = -d.r;

        const dg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        const [r, gCol, b] = d.hue;
        dg.addColorStop(0, `rgba(${r},${gCol},${b},${d.alpha * 2})`);
        dg.addColorStop(1, `rgba(${r},${gCol},${b},0)`);
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawNebulaWash();

      ctx.strokeStyle = "rgba(122, 107, 158, 0.05)";
      ctx.lineWidth = 1;
      for (let r = 100; r < Math.max(w, h); r += 120) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.36, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const star of stars) {
        star.angle += star.speed;
        const x = cx + Math.cos(star.angle) * star.radius;
        const y = cy + Math.sin(star.angle) * star.radius * 0.34;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;

        const color =
          star.tint === "lavender"
            ? `rgba(122, 107, 158, ${star.opacity})`
            : `rgba(61, 138, 138, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw();
    });
  }
})();