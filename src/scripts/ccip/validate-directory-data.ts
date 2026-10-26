/**
 * @file validate-directory-data.ts
 * @description CCIP Directory Data Integrity Validator
 *
 * Ensures every network key referenced in the CCIP reference data files
 * (chains.json, lanes.json, tokens.json, verifiers.json, decom.json) is
 * mapped in `directoryToSupportedChain` and resolvable to a configured
 * SupportedChain in chains.json / chain-to-technology.json.
 *
 * Why this exists:
 *   The render layer (e.g. VerifiersTable, ChainTable, Search) calls
 *   `directoryToSupportedChain(networkKey)` for every network it encounters.
 *   That function throws `Error("Chain not found <key>")` for unmapped chains,
 *   which crashes SSR and fails the Vercel build with a confusing
 *   "Browser APIs are not available on the server" message.
 *
 *   This script fails fast, early, with an actionable message — at pre-commit
 *   and at the start of the build pipeline — so a directory refresh that
 *   introduces a new chain cannot ship without also wiring that chain into
 *   the directory identifiers.
 *
 * Run via:
 *   npm run validate:ccip-data
 *
 * @version 1.0.0
 */

import fs from "fs"
import path from "path"
import { directoryToSupportedChain } from "~/features/utils/index.ts"

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DATA_ROOT = path.resolve(process.cwd(), "src/config/data/ccip/v1_2_0")

const ENVIRONMENTS = ["mainnet", "testnet"] as const
type Environment = (typeof ENVIRONMENTS)[number]

/** Files that contain network keys, and how to extract them. */
const FILE_SPEC: Record<string, { extract: (data: any) => string[]; description: string }> = {
  chains: {
    description: "top-level source networks",
    extract: (data) => Object.keys(data ?? {}),
  },
  lanes: {
    description: "source networks (top-level) and destination networks (nested)",
    extract: (data) => {
      const keys = new Set<string>()
      for (const [source, destMap] of Object.entries(data ?? {})) {
        keys.add(source)
        for (const dest of Object.keys(destMap as object)) {
          keys.add(dest)
        }
      }
      return [...keys]
    },
  },
  tokens: {
    description: "networks where each token is deployed (nested under tokens)",
    extract: (data) => {
      const keys = new Set<string>()
      for (const tokenMap of Object.values(data ?? {})) {
        for (const network of Object.keys(tokenMap as object)) {
          keys.add(network)
        }
      }
      return [...keys]
    },
  },
  verifiers: {
    description: "networks that have verifiers (top-level)",
    extract: (data) => Object.keys(data ?? {}),
  },
  decom: {
    description: "decommissioned networks (top-level)",
    extract: (data) => Object.keys(data ?? {}),
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Violation {
  environment: Environment
  file: string
  network: string
  reason: "unmapped" | "unresolvable"
  detail: string
}

function readJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

/** Returns true if `networkKey` has a case in directoryToSupportedChain. */
function isMapped(networkKey: string): boolean {
  try {
    directoryToSupportedChain(networkKey)
    return true
  } catch {
    return false
  }
}

/**
 * Returns true if the resolved SupportedChain actually exists in
 * chain-to-technology.json (i.e. the mapping points at a real chain, not a
 * dangling case). Catches mappings that were added to the switch but never
 * wired into the chain config.
 */
function isResolvable(networkKey: string, chainToTechnology: Record<string, string>): boolean {
  try {
    const supportedChain = directoryToSupportedChain(networkKey)
    return supportedChain in chainToTechnology
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const chainToTechnology = readJson(path.resolve(process.cwd(), "src/config/data/chain-to-technology.json"))

  const violations: Violation[] = []
  const checkedFiles: string[] = []

  for (const environment of ENVIRONMENTS) {
    const envDir = path.join(DATA_ROOT, environment)
    if (!fs.existsSync(envDir)) {
      // Skip silently — an environment dir may not exist in some checkouts.
      continue
    }

    for (const [fileBase, spec] of Object.entries(FILE_SPEC)) {
      const filePath = path.join(envDir, `${fileBase}.json`)
      if (!fs.existsSync(filePath)) continue

      checkedFiles.push(path.relative(process.cwd(), filePath))

      let networks: string[]
      try {
        networks = spec.extract(readJson(filePath))
      } catch (err) {
        console.error(`✖ Failed to parse ${filePath}: ${(err as Error).message}`)
        process.exit(1)
      }

      for (const network of networks) {
        if (!isMapped(network)) {
          violations.push({
            environment,
            file: `${fileBase}.json`,
            network,
            reason: "unmapped",
            detail: `No case for "${network}" in directoryToSupportedChain (src/features/utils/index.ts).`,
          })
          continue
        }
        if (!isResolvable(network, chainToTechnology)) {
          violations.push({
            environment,
            file: `${fileBase}.json`,
            network,
            reason: "unresolvable",
            detail: `"${network}" maps to a SupportedChain that is missing from chain-to-technology.json / chains.json / types.ts.`,
          })
        }
      }
    }
  }

  // ---- Report -----------------------------------------------------------
  if (violations.length === 0) {
    console.log(
      `✓ CCIP directory data is consistent. Checked ${checkedFiles.length} file(s) across ${ENVIRONMENTS.length} environment(s).`
    )
    return
  }

  console.error(`✖ CCIP directory data has ${violations.length} unresolved network reference(s).\n`)
  console.error("Every network key in chains.json / lanes.json / tokens.json / verifiers.json / decom.json")
  console.error("must have a case in directoryToSupportedChain AND be wired into:")
  console.error("  - src/config/data/chains.json")
  console.error("  - src/config/data/chain-to-technology.json")
  console.error("  - src/config/types.ts\n")

  // Group by environment + file for readable output.
  const grouped = new Map<string, Violation[]>()
  for (const v of violations) {
    const key = `${v.environment}/${v.file}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(v)
  }

  for (const [key, group] of grouped) {
    console.error(`  ${key}:`)
    for (const v of group) {
      console.error(`    • ${v.network} [${v.reason}]`)
      console.error(`      ${v.detail}`)
    }
  }

  console.error("\nFix the mappings above before committing / deploying. Do NOT silence this")
  console.error("error in the render layer — an unmapped chain means the directory is out of sync.\n")

  process.exit(1)
}

main()
