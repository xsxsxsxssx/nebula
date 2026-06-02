/**
 * NexusCo wallet connection & member account registry (local)
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "nexusco_wallet";
  const REGISTRY_KEY = "nexusco_accounts";

  let provider = null;
  let listeners = [];

  function getStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setStored(account) {
    if (account) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    notify();
  }

  function getRegistry() {
    try {
      const raw = localStorage.getItem(REGISTRY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function registerAccount(address, chainId) {
    const registry = getRegistry();
    const lower = address.toLowerCase();
    const existing = registry.find((a) => a.address === lower);
    if (existing) {
      existing.lastSeen = Date.now();
      existing.chainId = chainId;
    } else {
      registry.push({
        address: lower,
        createdAt: Date.now(),
        lastSeen: Date.now(),
        chainId,
        isNewMember: true,
      });
    }
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    return !existing;
  }

  function isNewMember(address) {
    if (!address) return true;
    const entry = getRegistry().find(
      (a) => a.address === address.toLowerCase()
    );
    if (!entry) return true;
    return entry.isNewMember !== false;
  }

  function shortenAddress(addr) {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  }

  function getInjectedProvider() {
    if (typeof window === "undefined") return null;
    const eth = window.ethereum;
    if (!eth) return null;
    if (Array.isArray(eth.providers)) {
      return eth.providers.find((p) => p.isMetaMask) || eth.providers[0];
    }
    return eth;
  }

  function on(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }

  function notify() {
    const account = getStored();
    listeners.forEach((fn) => fn(account));
  }

  async function connect() {
    provider = getInjectedProvider();
    if (!provider) {
      throw new Error(
        "No wallet detected. Install MetaMask or another Web3 wallet extension."
      );
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });

    if (!accounts?.length) {
      throw new Error("Connection was cancelled.");
    }

    const chainId = await provider.request({ method: "eth_chainId" });
    const address = accounts[0];
    const account = {
      address,
      chainId,
      connectedAt: Date.now(),
    };

    registerAccount(address, chainId);
    setStored(account);

    if (!provider._nexusBound) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider._nexusBound = true;
    }

    return account;
  }

  function handleAccountsChanged(accounts) {
    if (!accounts?.length) {
      disconnect();
      return;
    }
    const prev = getStored();
    const account = {
      address: accounts[0],
      chainId: prev?.chainId,
      connectedAt: prev?.connectedAt || Date.now(),
    };
    registerAccount(account.address, account.chainId);
    setStored(account);
  }

  function handleChainChanged(chainId) {
    const prev = getStored();
    if (!prev) return;
    setStored({ ...prev, chainId });
    window.location.reload();
  }

  function disconnect() {
    setStored(null);
  }

  function isConnected() {
    return Boolean(getStored()?.address);
  }

  async function restoreSession() {
    const stored = getStored();
    if (!stored?.address) return null;

    provider = getInjectedProvider();
    if (!provider) return stored;

    try {
      const accounts = await provider.request({ method: "eth_accounts" });
      if (!accounts?.length) {
        disconnect();
        return null;
      }
      if (accounts[0].toLowerCase() !== stored.address.toLowerCase()) {
        const account = {
          address: accounts[0],
          chainId: stored.chainId,
          connectedAt: stored.connectedAt,
        };
        setStored(account);
        return account;
      }

      if (!provider._nexusBound) {
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider._nexusBound = true;
      }

      return stored;
    } catch {
      return stored;
    }
  }

  function mountWalletUI(options = {}) {
    const {
      connectBtnId = "wallet-connect",
      connectedId = "wallet-connected",
      addressId = "wallet-address",
      dashboardLinkId = "wallet-dashboard",
      disconnectBtnId = "wallet-disconnect",
      errorId = "wallet-error",
      redirectOnConnect = null,
    } = options;

    const connectBtn = document.getElementById(connectBtnId);
    const connectedEl = document.getElementById(connectedId);
    const addressEl = document.getElementById(addressId);
    const dashboardLink = document.getElementById(dashboardLinkId);
    const disconnectBtn = document.getElementById(disconnectBtnId);
    const errorEl = document.getElementById(errorId);

    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg || "";
      errorEl.hidden = !msg;
    }

    function render(account) {
      const connected = Boolean(account?.address);

      if (connectBtn) {
        connectBtn.hidden = connected;
        connectBtn.disabled = false;
      }
      if (connectedEl) connectedEl.hidden = !connected;
      if (addressEl) addressEl.textContent = shortenAddress(account?.address);
      if (dashboardLink) dashboardLink.hidden = !connected;

      showError("");
    }

    async function handleConnect() {
      if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.textContent = "Connecting…";
      }
      showError("");

      try {
        await connect();
        if (redirectOnConnect) {
          window.location.href = redirectOnConnect;
          return;
        }
      } catch (err) {
        showError(err.message || "Could not connect wallet.");
      } finally {
        if (connectBtn) {
          connectBtn.disabled = false;
          connectBtn.textContent = connectBtn.dataset.label || "Connect";
        }
        render(getStored());
      }
    }

    if (connectBtn) connectBtn.addEventListener("click", handleConnect);
    if (disconnectBtn) {
      disconnectBtn.addEventListener("click", () => {
        disconnect();
        if (options.onDisconnect) options.onDisconnect();
      });
    }

    on(render);
    restoreSession().then(render);
  }

  function requireAuth(redirectTo = "index.html") {
    const account = getStored();
    if (!account?.address) {
      window.location.href = redirectTo;
      return null;
    }
    return account;
  }

  global.NexusWallet = {
    connect,
    disconnect,
    isConnected,
    getStored,
    restoreSession,
    shortenAddress,
    registerAccount,
    getRegistry,
    isNewMember,
    on,
    mountWalletUI,
    requireAuth,
  };
})(typeof window !== "undefined" ? window : globalThis);