/**
 * NexusCo portfolio & resources (illustrative — wire to on-chain / API in production)
 */
(function (global) {
  "use strict";

  /** Low nine-figure consortium book (DAO5-class peers, 2023 Q4 onward) */
  const CONSORTIUM_BOOK_USD = 312_400_000;
  const CONSORTIUM_SINCE = "2023 Q4";
  const CONSORTIUM_NOTE =
    "Capital deployed across NexusCo, dao5, and aligned cryptocurrency DAO participation.";

  const INVESTMENTS = [
    {
      id: "helix",
      name: "Helix Protocol",
      sector: "Infrastructure",
      daoCommitted: 68_200_000,
      currency: "USDC",
      status: "Active",
      vintage: "2024-Q2",
      consortium: "dao5",
    },
    {
      id: "vaultline",
      name: "Vaultline Finance",
      sector: "DeFi",
      daoCommitted: 54_750_000,
      currency: "USDC",
      status: "Active",
      vintage: "2024-Q3",
      consortium: "NexusCo",
    },
    {
      id: "orbit",
      name: "Orbit Mesh",
      sector: "Connectivity",
      daoCommitted: 41_300_000,
      currency: "USDC",
      status: "Active",
      vintage: "2025-Q1",
      consortium: "dao5",
    },
    {
      id: "sentinel",
      name: "Sentinel Labs",
      sector: "Security",
      daoCommitted: 28_900_000,
      currency: "USDC",
      status: "Deploying",
      vintage: "2025-Q2",
      consortium: "NexusCo",
    },
    {
      id: "aegis",
      name: "Aegis Reserve",
      sector: "Treasury",
      daoCommitted: 62_150_000,
      currency: "USDC",
      status: "Active",
      vintage: "2023-Q4",
      consortium: "dao5",
    },
    {
      id: "meridian",
      name: "Meridian Stack",
      sector: "Infrastructure",
      daoCommitted: 33_100_000,
      currency: "USDC",
      status: "Active",
      vintage: "2024-Q1",
      consortium: "aligned DAO",
    },
    {
      id: "cascade",
      name: "Cascade Liquidity",
      sector: "DeFi",
      daoCommitted: 24_000_000,
      currency: "USDC",
      status: "Active",
      vintage: "2023-Q4",
      consortium: "dao5",
    },
  ];

  const RESOURCES = [
    {
      id: "lpa",
      title: "Limited Partnership Agreement",
      category: "Agreement",
      updated: "2024-01-12",
      format: "PDF",
    },
    {
      id: "charter",
      title: "DAO Conversion Charter (Draft)",
      category: "Agreement",
      updated: "2025-03-08",
      format: "PDF",
    },
    {
      id: "whitepaper",
      title: "NexusCo Protocol Whitepaper",
      category: "Whitepaper",
      updated: "2024-06-20",
      format: "PDF",
    },
    {
      id: "memo-q4",
      title: "Investment Memo — 2023 Q4 Deployment",
      category: "Investment",
      updated: "2023-12-01",
      format: "PDF",
    },
    {
      id: "memo-infra",
      title: "Infrastructure Sleeve Overview",
      category: "Investment",
      updated: "2024-09-15",
      format: "PDF",
    },
    {
      id: "risk",
      title: "Risk & Disclosure Schedule",
      category: "Compliance",
      updated: "2024-02-28",
      format: "PDF",
    },
    {
      id: "governance",
      title: "Governance Framework — NXS",
      category: "Governance",
      updated: "2025-01-10",
      format: "PDF",
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
    const ratio = 0.0012 + (seed % 800) / 100000;
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
      return {
        ...inv,
        yourContribution: amount,
        yourSharePct: sharePct,
      };
    });

    const totalDaoListed = rows.reduce((s, r) => s + r.daoCommitted, 0);
    const totalYours = rows.reduce((s, r) => s + r.yourContribution, 0);
    const newMember = isNewMember(address);

    return {
      rows,
      totalDao: CONSORTIUM_BOOK_USD,
      totalDaoListed,
      totalYours,
      yourShareOfDao: CONSORTIUM_BOOK_USD
        ? (totalYours / CONSORTIUM_BOOK_USD) * 100
        : 0,
      consortiumSince: CONSORTIUM_SINCE,
      consortiumNote: CONSORTIUM_NOTE,
      isNewMember: newMember,
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
      if (spec.type === "number") {
        return (av - bv) * mult;
      }
      return String(av).localeCompare(String(bv), undefined, {
        sensitivity: "base",
        numeric: true,
      }) * mult;
    });
  }

  /**
   * Member directory (filler). Founding principal profile inspired by public
   * details associated with @AlekPavicevic on X — not an official endorsement.
   */
  const MEMBERS = [
    {
      id: "aleksa-pavicevic",
      name: "Aleksa Pavicevic",
      role: "Founding Principal",
      location: "Montenegro",
      since: "2023 Q4",
      xHandle: "AlekPavicevic",
      xUrl: "https://x.com/AlekPavicevic",
      focus: "Capital allocation, member review, consortium strategy",
      bio: "Founding principal at NexusCo. Known in public circuits for high-stakes invitational allocation and disciplined bankroll governance; now channels the same rigor into digital-asset consortium deployment alongside dao5 and aligned DAOs.",
      tags: ["Principals", "dao5", "Governance"],
      initials: "AP",
    },
    {
      id: "elena-vukovic",
      name: "Elena Vuković",
      role: "Governance Lead",
      location: "Belgrade, Serbia",
      since: "2024 Q1",
      focus: "NXS charter, voting procedures, protocol conversion",
      bio: "Oversees DAO conversion mechanics and member attestation. Previously structured governance for European fintech collectives before joining the NexusCo principal committee.",
      tags: ["Governance", "Legal"],
      initials: "EV",
    },
    {
      id: "marcus-chen",
      name: "Marcus Chen",
      role: "Research Principal",
      location: "Singapore",
      since: "2024 Q2",
      focus: "Infrastructure & DeFi sleeves, memo diligence",
      bio: "Leads investment memo review for infrastructure and liquidity protocols. Ex–quant desk, now dedicated to asymmetric network positions within the consortium book.",
      tags: ["Research", "DeFi"],
      initials: "MC",
    },
    {
      id: "sofia-antonelli",
      name: "Sofia Antonelli",
      role: "Operations & Treasury",
      location: "Milan, Italy",
      since: "2023 Q4",
      focus: "Treasury reporting, consortium reconciliations",
      bio: "Maintains cross-DAO treasury telemetry and member-facing portfolio surfaces. Joined at inception to support the 2023 Q4 deployment window.",
      tags: ["Operations", "Treasury"],
      initials: "SA",
    },
    {
      id: "james-holt",
      name: "James Holt",
      role: "Member Relations",
      location: "London, UK",
      since: "2025 Q1",
      focus: "Referral review, onboarding attestations",
      bio: "Manages the closed referral graph and principal introductions. No public intake — coordination occurs member-to-member only.",
      tags: ["Membership"],
      initials: "JH",
    },
  ];

  global.NexusData = {
    INVESTMENTS,
    RESOURCES,
    MEMBERS,
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