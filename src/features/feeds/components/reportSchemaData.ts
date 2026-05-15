// Field definitions sourced from the internal ABI definitions.
// All schemas use feedId (camelCase) uniformly.
// Updating this file automatically updates both the inline feed table expander
// and the schema reference docs pages (via SchemaFieldsTable.astro).

export interface SchemaField {
  field: string
  type: string
  description: string
  /** Optional docs link rendered alongside the description (e.g. "Learn more") */
  link?: { label: string; href: string }
}

export interface SchemaDefinition {
  label: string
  shortLabel: string
  url: string
  fields: SchemaField[]
}

// Fields present in every report schema
const COMMON_FIELDS: SchemaField[] = [
  { field: "feedId", type: "bytes32", description: "Unique identifier for the Data Streams feed" },
  { field: "validFromTimestamp", type: "uint32", description: "Earliest timestamp when the price is valid (seconds)" },
  {
    field: "observationsTimestamp",
    type: "uint32",
    description: "Latest timestamp when the price is valid (seconds)",
  },
  { field: "nativeFee", type: "uint192", description: "Cost to verify report onchain (native token)" },
  { field: "linkFee", type: "uint192", description: "Cost to verify report onchain (LINK)" },
  { field: "expiresAt", type: "uint32", description: "Expiration date of the report (seconds)" },
]

export const REPORT_SCHEMA_DEFINITIONS: Record<string, SchemaDefinition> = {
  "v3-crypto": {
    label: "Report Schema v3 (Crypto Advanced)",
    shortLabel: "v3 (Crypto)",
    url: "/data-streams/reference/report-schema-v3",
    fields: [
      ...COMMON_FIELDS,
      { field: "price", type: "int192", description: "DON consensus median price" },
      { field: "bid", type: "int192", description: "Simulated buy impact price at X% liquidity depth" },
      { field: "ask", type: "int192", description: "Simulated sell impact price at X% liquidity depth" },
    ],
  },
  "v3-dex": {
    label: "Report Schema v3 (Crypto DEX)",
    shortLabel: "v3 (DEX)",
    url: "/data-streams/reference/report-schema-v3-dex",
    fields: [
      ...COMMON_FIELDS,
      {
        field: "price",
        type: "int192",
        description: "DON consensus median DEX state price",
        link: { label: "DEX State Price", href: "/data-streams/concepts/dex-state-price-streams" },
      },
      { field: "bid", type: "int192", description: "N/A — equals price" },
      { field: "ask", type: "int192", description: "N/A — equals price" },
    ],
  },
  v7: {
    label: "Report Schema v7 (Redemption Rates)",
    shortLabel: "v7",
    url: "/data-streams/reference/report-schema-v7",
    fields: [
      ...COMMON_FIELDS,
      { field: "exchangeRate", type: "int192", description: "DON's consensus median exchange rate" },
    ],
  },
  v8: {
    label: "Report Schema v8 (RWA Standard)",
    shortLabel: "v8",
    url: "/data-streams/reference/report-schema-v8",
    fields: [
      ...COMMON_FIELDS,
      {
        field: "lastUpdateTimestamp",
        type: "uint64",
        description: "Timestamp of the last valid price update (nanoseconds)",
      },
      { field: "midPrice", type: "int192", description: "DON's consensus median price" },
      {
        field: "marketStatus",
        type: "uint32",
        description: "Market status: 0 (Unknown), 1 (Closed), 2 (Open)",
        link: { label: "Market hours", href: "/data-streams/market-hours" },
      },
    ],
  },
  v9: {
    label: "Report Schema v9 (SmartData)",
    shortLabel: "v9",
    url: "/data-streams/reference/report-schema-v9",
    fields: [
      ...COMMON_FIELDS,
      {
        field: "navPerShare",
        type: "int192",
        description: "DON consensus NAV Per Share value as reported by the Fund Manager",
      },
      { field: "navDate", type: "uint64", description: "Timestamp for the NAV Report publication date (nanoseconds)" },
      { field: "aum", type: "int192", description: "DON consensus total USD value of Assets Under Management" },
      {
        field: "ripcord",
        type: "uint32",
        description: "Data provider pause status: 0 (normal), 1 (paused — do not consume data)",
      },
    ],
  },
  v10: {
    label: "Report Schema v10 (Tokenized Asset)",
    shortLabel: "v10",
    url: "/data-streams/reference/report-schema-v10",
    fields: [
      ...COMMON_FIELDS,
      {
        field: "lastUpdateTimestamp",
        type: "uint64",
        description: "Timestamp of the last valid price update (nanoseconds)",
      },
      { field: "price", type: "int192", description: "Last traded price from the real-world equity market" },
      {
        field: "marketStatus",
        type: "uint32",
        description: "Market status: 0 (Unknown), 1 (Closed), 2 (Open)",
        link: { label: "Market hours", href: "/data-streams/market-hours" },
      },
      {
        field: "currentMultiplier",
        type: "int192",
        description: "Currently applied multiplier accounting for past corporate actions",
      },
      {
        field: "newMultiplier",
        type: "int192",
        description: "Multiplier to be applied at activationDateTime (0 if none scheduled)",
      },
      {
        field: "activationDateTime",
        type: "uint32",
        description: "When the next corporate action takes effect, in seconds (0 if none scheduled)",
      },
      {
        field: "tokenizedPrice",
        type: "int192",
        description: "Aggregated price across centralized exchanges where the tokenized asset trades",
      },
    ],
  },
  v12: {
    label: "Report Schema v12 (SmartData)",
    shortLabel: "v12",
    url: "/data-streams/reference/report-schema-v12",
    fields: [
      ...COMMON_FIELDS,
      {
        field: "navPerShare",
        type: "int192",
        description: "DON consensus NAV Per Share value as reported by the Fund Manager",
      },
      { field: "nextNavPerShare", type: "int192", description: "Next projected NAV Per Share value" },
      { field: "navDate", type: "uint64", description: "Timestamp for the NAV Report publication date (nanoseconds)" },
      {
        field: "ripcord",
        type: "uint32",
        description: "Data provider pause status: 0 (normal), 1 (paused — do not consume data)",
      },
    ],
  },
  v11: {
    label: "Report Schema v11 (RWA Advanced)",
    shortLabel: "v11",
    url: "/data-streams/reference/report-schema-v11",
    fields: [
      ...COMMON_FIELDS,
      { field: "mid", type: "int192", description: "DON consensus mid-price" },
      {
        field: "lastSeenTimestampNs",
        type: "uint64",
        description: "Timestamp of the last update for the mid price only (nanoseconds)",
      },
      { field: "bid", type: "int192", description: "Median bid price" },
      { field: "bidVolume", type: "int192", description: "Volume at bid price" },
      { field: "ask", type: "int192", description: "Median ask price" },
      { field: "askVolume", type: "int192", description: "Volume at ask price" },
      { field: "lastTradedPrice", type: "int192", description: "Last traded price" },
      {
        field: "marketStatus",
        type: "uint32",
        description: "Market status. Values vary by stream type — see full schema documentation for details.",
        link: { label: "Market hours", href: "/data-streams/market-hours" },
      },
    ],
  },
}
