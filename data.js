/**
 * NexusCo portfolio & resources
 */
(function (global) {
  "use strict";

  const ENQUIRE_URL = "https://x.com/AlekPavicevic";

  const INVESTMENTS = [
    {
      id: "eigenlayer",
      name: "EigenLayer",
      sector: "Restaking",
      daoCommitted: 42_000_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q1",
      consortium: "dao5",
      round: "Series B",
    },
    {
      id: "celestia",
      name: "Celestia",
      sector: "Modular DA",
      daoCommitted: 36_500_000,
      currency: "USD",
      status: "Active",
      vintage: "2023-Q4",
      consortium: "dao5",
      round: "Strategic",
    },
    {
      id: "berachain",
      name: "Berachain",
      sector: "L1",
      daoCommitted: 31_250_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q2",
      consortium: "NexusCo",
      round: "Series A",
    },
    {
      id: "monad",
      name: "Monad",
      sector: "L1",
      daoCommitted: 27_800_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q3",
      consortium: "dao5",
      round: "Strategic",
    },
    {
      id: "scroll",
      name: "Scroll",
      sector: "L2",
      daoCommitted: 21_400_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q1",
      consortium: "aligned DAO",
      round: "Series B",
    },
    {
      id: "espresso",
      name: "Espresso Systems",
      sector: "Sequencing",
      daoCommitted: 17_600_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q4",
      consortium: "dao5",
      round: "Strategic",
    },
    {
      id: "avail",
      name: "Avail",
      sector: "Data availability",
      daoCommitted: 14_200_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q2",
      consortium: "NexusCo",
      round: "Seed+",
    },
    {
      id: "initia",
      name: "Initia",
      sector: "Interwoven stack",
      daoCommitted: 12_750_000,
      currency: "USD",
      status: "Deploying",
      vintage: "2025-Q1",
      consortium: "dao5",
      round: "Series A",
    },
    {
      id: "wormhole",
      name: "Wormhole",
      sector: "Interoperability",
      daoCommitted: 24_300_000,
      currency: "USD",
      status: "Active",
      vintage: "2023-Q4",
      consortium: "dao5",
      round: "Strategic",
    },
    {
      id: "kamino",
      name: "Kamino Finance",
      sector: "DeFi",
      daoCommitted: 19_100_000,
      currency: "USD",
      status: "Active",
      vintage: "2024-Q3",
      consortium: "NexusCo",
      round: "Strategic",
    },
  ];

  const CONSORTIUM_BOOK_USD = INVESTMENTS.reduce((s, i) => s + i.daoCommitted, 0);
  const CONSORTIUM_SINCE = "2023 Q4";
  const CONSORTIUM_NOTE =
    "Aggregate consortium participation across NexusCo, dao5, and aligned cryptocurrency DAOs. Figures represent committed capital by vintage.";

  const RESOURCES = [
    { id: "lpa", title: "Limited Partnership Agreement", category: "Agreement", updated: "2024-01-12", format: "PDF" },
    { id: "charter", title: "DAO Conversion Charter (Draft)", category: "Agreement", updated: "2025-03-08", format: "PDF" },
    { id: "whitepaper", title: "NexusCo Protocol Whitepaper", category: "Whitepaper", updated: "2024-06-20", format: "PDF" },
    { id: "memo-q4", title: "Investment Memo — 2023 Q4 Deployment", category: "Investment", updated: "2023-12-01", format: "PDF" },
    { id: "memo-infra", title: "Infrastructure Sleeve Overview", category: "Investment", updated: "2024-09-15", format: "PDF" },
    { id: "risk", title: "Risk & Disclosure Schedule", category: "Compliance", updated: "2024-02-28", format: "PDF" },
    { id: "governance", title: "Governance Framework — NXS", category: "Governance", updated: "2025-01-10", format: "PDF" },
  ];

  /** Obscure CryptoPunk token IDs — not associated with public figures */
  const MEMBERS = [
    {
      id: "aleksa-pavicevic",
      name: "Aleksa Pavicevic",
      role: "Founding Principal",
      location: "Montenegro",
      since: "2023 Q4",
      xHandle: "AlekPavicevic",
      xUrl: ENQUIRE_URL,
      focus: "Allocation, member review, consortium coordination",
      bio: "Founding principal. Oversees mandate execution and principal introductions. Correspondence via X only.",
      tags: ["Principals", "Governance"],
      avatar: "https://cryptopunks.app/cryptopunks/punk6845.webp",
      avatarType: "CryptoPunk #6845",
    },
    {
      id: "elena-vukovic",
      name: "Elena Vuković",
      role: "Governance Lead",
      location: "Belgrade",
      since: "2024 Q1",
      focus: "NXS charter, conversion mechanics",
      bio: "Governance and protocol conversion. Committee member.",
      tags: ["Governance"],
      avatar: "https://cryptopunks.app/cryptopunks/punk9123.webp",
      avatarType: "CryptoPunk #9123",
    },
    {
      id: "marcus-chen",
      name: "Marcus Chen",
      role: "Research Principal",
      location: "Singapore",
      since: "2024 Q2",
      focus: "Infrastructure & DeFi diligence",
      bio: "Investment memo review and sleeve analysis.",
      tags: ["Research"],
      avatar: "https://cryptopunks.app/cryptopunks/punk4455.webp",
      avatarType: "CryptoPunk #4455",
    },
    {
      id: "sofia-antonelli",
      name: "Sofia Antonelli",
      role: "Operations & Treasury",
      location: "Milan",
      since: "2023 Q4",
      focus: "Treasury reporting, reconciliations",
      bio: "Cross-DAO treasury telemetry and member reporting.",
      tags: ["Operations"],
      avatar: "https://cryptopunks.app/cryptopunks/punk7731.webp",
      avatarType: "CryptoPunk #7731",
    },
    {
      id: "james-holt",
      name: "James Holt",
      role: "Member Relations",
      location: "London",
      since: "2025 Q1",
      focus: "Referral review",
      bio: "Closed referral graph. No public intake.",
      tags: ["Membership"],
      avatar: "https://cryptopunks.app/cryptopunks/punk3388.webp",
      avatarType: "CryptoPunk #3388",
    },
  ];

  function isNewMember(address) {
    if (!address || typeof NexusWallet === "undefined") return true;
    return NexusWallet.isNewMember(address);
  }

  function contributionForWallet(address, investmentId, daoCommitted) {
    if (!address || isNewMember(address)) {
      return { amount: 0, sharePct: 0 };
    }
    const seed = hashString(`${address.toLowerCase()}:${investmentId}`);
    const ratio = 0.0008 + (seed % 500) / 200000;
    const amount = Math.round(daoCommitted * ratio);
    const sharePct = daoCommitted ? (amount / daoCommitted) * 100 : 0;
    return { amount, sharePct };
  }

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function formatUsd(n) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function formatPct(n) {
    if (n === 0) return "0.00%";
    if (n < 0.01 && n > 0) return "<0.01%";
    return `${n.toFixed(2)}%`;
  }

  function portfolioForWallet(address) {
    const rows = INVESTMENTS.map((inv) => {
      const { amount, sharePct } = contributionForWallet(
        address,
        inv.id,
        inv.daoCommitted
      );
      return { ...inv, yourContribution: amount, yourSharePct: sharePct };
    });

    const totalYours = rows.reduce((s, r) => s + r.yourContribution, 0);

    return {
      rows,
      totalDao: CONSORTIUM_BOOK_USD,
      totalYours,
      yourShareOfDao: CONSORTIUM_BOOK_USD
        ? (totalYours / CONSORTIUM_BOOK_USD) * 100
        : 0,
      consortiumSince: CONSORTIUM_SINCE,
      consortiumNote: CONSORTIUM_NOTE,
      isNewMember: isNewMember(address),
    };
  }

  const SORT_KEYS = {
    name: { type: "string", get: (r) => r.name },
    sector: { type: "string", get: (r) => r.sector },
    daoCommitted: { type: "number", get: (r) => r.daoCommitted },
    yourContribution: { type: "number", get: (r) => r.yourContribution },
    yourSharePct: { type: "number", get: (r) => r.yourSharePct },
    status: { type: "string", get: (r) => r.status },
    vintage: { type: "string", get: (r) => r.vintage },
  };

  function sortRows(rows, key, direction) {
    const spec = SORT_KEYS[key];
    if (!spec) return rows.slice();
    const mult = direction === "desc" ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const av = spec.get(a);
      const bv = spec.get(b);
      if (spec.type === "number") return (av - bv) * mult;
      return String(av).localeCompare(String(bv), undefined, {
        sensitivity: "base",
        numeric: true,
      }) * mult;
    });
  }

  global.NexusData = {
    INVESTMENTS,
    RESOURCES,
    MEMBERS,
    ENQUIRE_URL,
    CONSORTIUM_BOOK_USD,
    CONSORTIUM_SINCE,
    CONSORTIUM_NOTE,
    portfolioForWallet,
    contributionForWallet,
    isNewMember,
    formatUsd,
    formatPct,
    sortRows,
    SORT_KEYS,
  };
})(typeof window !== "undefined" ? window : globalThis);