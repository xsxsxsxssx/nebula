/**
 * NexusDAO — pre-wallet access gate (terminal-style)
 */
(function (global) {
  "use strict";

  function isValidPassword(password) {
    return typeof password === "string" && password.length >= 12 && password.includes("$");
  }

  let overlay = null;
  let resolvePending = null;

  function closeGate(result) {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("password-gate-open");
    const input = overlay.querySelector("#password-gate-input");
    if (input) input.value = "";
    if (resolvePending) {
      resolvePending(result);
      resolvePending = null;
    }
  }

  function showStatus(message, type) {
    const status = overlay?.querySelector("#password-gate-status");
    if (!status) return;
    status.textContent = message;
    status.className = "password-gate-status";
    if (type) status.classList.add(`password-gate-status--${type}`);
    status.hidden = !message;
  }

  function buildOverlay() {
    const el = document.createElement("div");
    el.id = "password-gate";
    el.className = "password-gate";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "password-gate-title");
    el.innerHTML = `
      <div class="password-gate-backdrop" data-password-dismiss></div>
      <div class="password-gate-dialog terminal-frame">
        <div class="frame-bar">
          <span class="frame-dots" aria-hidden="true"></span>
          <span class="frame-title" id="password-gate-title">access_gate.exe</span>
        </div>
        <div class="frame-body password-gate-body">
          <p class="password-gate-prompt">
            <span class="caret">›</span> wallet authorization requires passphrase
          </p>
          <label class="password-gate-label" for="password-gate-input">
            <span class="password-gate-prefix">passphrase:</span>
            <input
              type="password"
              id="password-gate-input"
              class="password-gate-input"
              autocomplete="off"
              spellcheck="false"
              placeholder="············"
            />
          </label>
          <p class="password-gate-status" id="password-gate-status" hidden></p>
          <div class="password-gate-actions">
            <button type="button" class="btn btn-ghost" id="password-gate-cancel">Cancel</button>
            <button type="button" class="btn btn-primary" id="password-gate-submit">Authorize</button>
          </div>
        </div>
      </div>
    `;

    el.querySelector("[data-password-dismiss]").addEventListener("click", () => closeGate(false));
    el.querySelector("#password-gate-cancel").addEventListener("click", () => closeGate(false));

    const input = el.querySelector("#password-gate-input");
    const submit = el.querySelector("#password-gate-submit");

    function attemptSubmit() {
      const value = input.value;
      if (isValidPassword(value)) {
        showStatus("ACCESS GRANTED — initiating wallet handshake…", "granted");
        setTimeout(() => closeGate(true), 280);
        return;
      }
      showStatus("ACCESS DENIED", "denied");
      input.classList.add("password-gate-input--shake");
      input.select();
      setTimeout(() => input.classList.remove("password-gate-input--shake"), 420);
    }

    submit.addEventListener("click", attemptSubmit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        attemptSubmit();
      }
      if (e.key === "Escape") closeGate(false);
    });

    document.addEventListener("keydown", (e) => {
      if (!overlay || overlay.hidden) return;
      if (e.key === "Escape") closeGate(false);
    });

    document.body.appendChild(el);
    return el;
  }

  function requestPassword() {
    if (!overlay) overlay = buildOverlay();

    return new Promise((resolve) => {
      resolvePending = resolve;
      overlay.hidden = false;
      document.body.classList.add("password-gate-open");
      showStatus("", null);

      const input = overlay.querySelector("#password-gate-input");
      if (input) {
        input.value = "";
        input.classList.remove("password-gate-input--shake");
        requestAnimationFrame(() => input.focus());
      }
    });
  }

  global.NexusPasswordGate = {
    isValidPassword,
    requestPassword,
  };
})(typeof window !== "undefined" ? window : globalThis);