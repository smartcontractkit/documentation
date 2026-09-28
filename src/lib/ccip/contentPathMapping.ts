/**
 * CCIP content-dir ⇄ canonical-URL mapping.
 *
 * Latest CCIP content lives on disk under `src/content/ccip/<LATEST_CCIP_CONTENT_DIR>/` (e.g. `v2/`)
 * but is served at canonical, unversioned URLs (`/ccip/...`). Older versions keep a URL prefix
 * (e.g. `v1` → `/ccip/v1/...`) and live under the matching on-disk dir.
 *
 * This module is the SINGLE source of truth for that transformation. Do not hardcode "v2"
 * anywhere else — import these helpers instead so a future version bump is a config-only change.
 */
import { CCIP_VERSION_CONFIGS, LATEST_CCIP_CONTENT_DIR } from "~/config/ccipVersions.js"

/** All on-disk version dir prefixes, e.g. ["v2", "v1"]. */
const CONTENT_DIR_PREFIXES = Object.values(CCIP_VERSION_CONFIGS).map((c) => c.contentDirPrefix)

/** Trim leading/trailing slashes. */
const strip = (s: string): string => s.replace(/^\/+/, "").replace(/\/+$/, "")

/**
 * Content collection `entry.id` → canonical ccip-relative URL path. Strips ONLY the latest
 * content dir; older-version prefixes (e.g. `v1`) are preserved so they keep their URL prefix.
 *   "v2/concepts/overview" → "concepts/overview" | "v2" → "" | "v1/x" → "v1/x" | "concepts/x" → "concepts/x"
 */
export function toCanonicalCcipId(entryId: string): string {
  const id = strip(entryId)
  if (id === LATEST_CCIP_CONTENT_DIR) return ""
  if (id.startsWith(LATEST_CCIP_CONTENT_DIR + "/")) return id.slice(LATEST_CCIP_CONTENT_DIR.length + 1)
  return id
}

/**
 * Canonical ccip-relative path → on-disk content `entry.id`. Inserts the latest content dir unless
 * an older-version `urlPrefix` is present (those map to their own content dir, which equals their prefix).
 *   "" → "v2" | "concepts/x" → "v2/concepts/x" | "evm/.." → "v2/evm/.." | "v1/x" → "v1/x"
 */
export function toContentEntryId(canonicalRel: string): string {
  const rel = strip(canonicalRel)
  for (const cfg of Object.values(CCIP_VERSION_CONFIGS)) {
    if (!cfg.urlPrefix) continue
    if (rel === cfg.urlPrefix) return cfg.contentDirPrefix
    if (rel.startsWith(cfg.urlPrefix + "/")) return `${cfg.contentDirPrefix}/${rel.slice(cfg.urlPrefix.length + 1)}`
  }
  return rel ? `${LATEST_CCIP_CONTENT_DIR}/${rel}` : LATEST_CCIP_CONTENT_DIR
}

/**
 * Content `entry.id` → canonical-relative path with ANY version dir prefix removed (for layout matching).
 *   "v2/evm/.." → "evm/.." | "v1/evm/.." → "evm/.." | "concepts/x" → "concepts/x"
 */
export function stripAnyCcipVersionPrefix(entryId: string): string {
  const id = strip(entryId)
  for (const p of CONTENT_DIR_PREFIXES) {
    if (id === p) return ""
    if (id.startsWith(p + "/")) return id.slice(p.length + 1)
  }
  return id
}

/**
 * URL/slug shape → strip the latest content dir segment sitting right after `ccip/`. Leaves
 * older-version segments (e.g. `ccip/v1/...`) untouched. Handles leading-slash and prefix-less shapes.
 *   "/ccip/v2/x" → "/ccip/x" | "ccip/v2/x" → "ccip/x" | "/ccip/v2" → "/ccip" | "ccip/v1/x" → unchanged
 */
export function canonicalizeCcipUrlPath(p: string): string {
  const dir = LATEST_CCIP_CONTENT_DIR
  return p.replace(new RegExp(`(^|/)ccip/${dir}/`), "$1ccip/").replace(new RegExp(`(^|/)ccip/${dir}$`), "$1ccip")
}
