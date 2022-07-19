export const SITE = {
  title: "Documentation",
  description: "Your website description.",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true",
    alt:
      "astro logo on a starry expanse of space," +
      " with a purple saturn-like planet floating in the right foreground",
  },
  twitter: "astrodotbuild",
};

export const KNOWN_LANGUAGES = {
  English: "en",
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/blob/main/docs/`;

// Uncomment this to add an "Join our Community" button to every page of documentation.
export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "XXXXXXXXXX",
  appId: "XXXXXXXXXX",
  apiKey: "XXXXXXXXXX",
};

export const SIDEBAR = {
  en: [
    { text: "", header: true },
    { text: "Section Header", header: true },
    { text: "Introduction", link: "en/introduction" },
    { text: "Page 2", link: "en/page-2" },
    { text: "Page 3", link: "en/page-3" },

    { text: "Another Section", header: true },
    { text: "Page 4", link: "en/page-4" },
  ],
  gettingStarted: [
    {
      text: "Getting Started",
      header: true,
    },
    {
      text: "Overview",
      link: "docs/conceptual-overview/",
    },
    {
      text: "Deploy Your First Contract",
      link: "docs/deploy-your-first-contract/",
    },
    {
      text: "Consuming Data Feeds",
      link: "docs/consuming-data-feeds/",
    },
    {
      text: "Get Random Numbers",
      link: "docs/intermediates-tutorial/",
    },
    {
      text: "API Calls",
      link: "docs/advanced-tutorial/",
    },
    {
      text: "Resources",
      header: true,
    },
    {
      text: "Videos and Tutorials",
      link: "docs/other-tutorials/",
    },
    {
      text: "Next Steps",
      header: true,
    },
    {
      text: "Chainlink Architecture",
      link: "docs/architecture-overview/",
    },
    {
      text: "Data Feeds",
      link: "docs/using-chainlink-reference-contracts/",
    },
    {
      text: "Chainlink VRF",
      link: "docs/chainlink-vrf/",
    },
    {
      text: "Chainlink Keepers",
      link: "docs/chainlink-keepers/introduction/",
    },
    {
      text: "Connect to Public API Data",
      link: "docs/request-and-receive-data/",
    },
    {
      text: "Run a Chainlink Node",
      link: "chainlink-nodes/",
    },
  ],
  ethereum: [
    {
      section: "Overview",
    },
    {
      text: "Chainlink Architecture",
      link: "docs/architecture-overview/",
      children: [
        {
          text: "Basic Request Model",
          link: "docs/architecture-request-model/",
        },
        {
          text: "Decentralized Data Model",
          link: "docs/architecture-decentralized-model/",
        },
        {
          text: "Off-Chain Reporting",
          link: "docs/off-chain-reporting/",
        },
      ],
    },
  ],
};

export const MENU = {
  en: [
    { text: "Getting Started", link: "/docs/conceptual-overview/" },
    { text: "EVM Chains", link: "/en/page-2" },
    { text: "Solana", link: "/en/page-3" },
    { text: "Node Operators", link: "/en/page-2" },
  ],
};
