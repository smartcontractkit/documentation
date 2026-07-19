import { ZeroAddress } from "ethers"
import { getVerifier } from "@config/data/ccip/data.ts"
import { fallbackVerifierIconUrl } from "~/features/utils/index.ts"
import type { Environment } from "~/config/data/ccip/types.ts"
import type { LaneVerifiers, VerifierSet } from "~/lib/ccip/types/index.ts"

/**
 * One row of the verifiers sub-table: a single verifier identity, with its
 * address on the source and/or destination chain. Source and destination pools
 * configure CCVs independently, so a verifier may appear on only one side.
 */
export interface LaneVerifierRow {
  /** Join key: verifier id when known, else the lowercased address. */
  key: string
  name: string
  logo: string
  type: string | null
  /** Verifier address on the source chain, or null if not required outbound. */
  sourceAddress: string | null
  /** Verifier address on the destination chain, or null if not required inbound. */
  destinationAddress: string | null
  /** True when the verifier is only required at or above the threshold amount. */
  aboveThresholdOnly: boolean
}

interface ResolvedVerifier {
  joinKey: string
  address: string
  name: string
  logo: string
  type: string | null
  aboveThresholdOnly: boolean
}

/**
 * Resolves one side's verifier set (belowThreshold + aboveThreshold) into verifier
 * entries, filtering out the zero address. Unknown addresses (not in verifiers.json)
 * fall back to a generic name/icon so real on-chain verifiers are never dropped.
 * Returns [] when the set is null (downstream error) or empty (not configured).
 */
function resolveSide(set: VerifierSet | null, networkId: string, environment: Environment): ResolvedVerifier[] {
  if (!set || !set.belowThreshold || !set.aboveThreshold) return []

  const below = new Set(set.belowThreshold.map((a) => a.toLowerCase()))
  const resolved: ResolvedVerifier[] = []
  for (const address of set.aboveThreshold) {
    if (!address || address.toLowerCase() === ZeroAddress.toLowerCase()) continue
    const meta = getVerifier({ networkId, address, environment })
    resolved.push({
      joinKey: meta?.id ?? address.toLowerCase(),
      address,
      name: meta?.name ?? "Unknown verifier",
      logo: meta?.logo ?? fallbackVerifierIconUrl,
      type: meta?.type ?? null,
      aboveThresholdOnly: !below.has(address.toLowerCase()),
    })
  }
  return resolved
}

/**
 * Builds the joined verifier rows for a lane. Source verifiers are resolved on the
 * source chain, destination verifiers on the destination chain, then merged by
 * verifier identity so a verifier that appears on both sides is one row with both
 * addresses.
 */
export function buildLaneVerifierRows(
  verifiers: LaneVerifiers | null | undefined,
  sourceNetworkId: string,
  destNetworkId: string,
  environment: Environment
): LaneVerifierRow[] {
  if (!verifiers) return []

  const rows = new Map<string, LaneVerifierRow>()

  for (const v of resolveSide(verifiers.source, sourceNetworkId, environment)) {
    rows.set(v.joinKey, {
      key: v.joinKey,
      name: v.name,
      logo: v.logo,
      type: v.type,
      sourceAddress: v.address,
      destinationAddress: null,
      aboveThresholdOnly: v.aboveThresholdOnly,
    })
  }

  for (const v of resolveSide(verifiers.destination, destNetworkId, environment)) {
    const existing = rows.get(v.joinKey)
    if (existing) {
      existing.destinationAddress = v.address
      // A verifier is "always required" if either side requires it below the threshold.
      existing.aboveThresholdOnly = existing.aboveThresholdOnly && v.aboveThresholdOnly
    } else {
      rows.set(v.joinKey, {
        key: v.joinKey,
        name: v.name,
        logo: v.logo,
        type: v.type,
        sourceAddress: null,
        destinationAddress: v.address,
        aboveThresholdOnly: v.aboveThresholdOnly,
      })
    }
  }

  return [...rows.values()]
}
