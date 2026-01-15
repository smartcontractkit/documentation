export type AlgoliaQuery =
  | "ccip"
  | "data-streams"
  | "smart-data"
  | "nodes"
  | "data-feeds"
  | "functions"
  | "automation"
  | "vrf"
  | "general"

export interface ChangelogItem {
  createdOn: string
  "date-of-release": string
  hash: string
  id: string
  lastPublished: string
  lastUpdated: string
  name: string
  networks: string
  slug: string
  "text-description": string
  topic: string
  type: string
  objectID: string
  _highlightResult?: {
    "date-of-release": Record<string, unknown>
    name: Record<string, unknown>
    "text-description": Record<string, unknown>
  }
}
