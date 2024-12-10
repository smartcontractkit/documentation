export const CCIP_VERSIONS = {
  LATEST: "v1.5.1",
  ALL: ["v1.5.1", "v1.5.0"] as const,
} as const

export type CCIPVersion = (typeof CCIP_VERSIONS.ALL)[number]
