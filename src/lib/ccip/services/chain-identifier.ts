import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { ChainConfig } from "@config/data/ccip/types.ts"
import { getSelectorEntry } from "@config/data/ccip/selectors.ts"
import { getChainId, getChainTypeAndFamily, directoryToSupportedChain } from "~/features/utils/index.ts"
import { Environment, NamingConvention } from "~/lib/ccip/types/index.ts"
import { logger } from "@lib/logging/index.js"

/**
 * Result of resolving a chain identifier
 */
export interface ResolvedChain {
  directoryKey: string // Key in chains.json (for internal data lookups)
  selectorName: string // Name in selectors.yml (canonical form)
  inputConvention: NamingConvention // Which convention was used in the input
}

/**
 * Service for handling chain identifier resolution and formatting.
 * Supports bidirectional mapping between directory keys and selector names.
 *
 * This enables the API to:
 * 1. Accept both naming conventions as input
 * 2. Mirror the user's chosen convention in responses
 * 3. Maintain backward compatibility (default to selector names)
 */
export class ChainIdentifierService {
  private directoryToSelector: Map<string, string> = new Map()
  private selectorToDirectory: Map<string, string> = new Map()
  private directoryKeys: Set<string> = new Set()
  private readonly requestId: string

  constructor(
    private readonly environment: Environment,
    private readonly defaultConvention: NamingConvention = "selector"
  ) {
    this.requestId = crypto.randomUUID()
    this.buildMappings()
  }

  /**
   * Build bidirectional mappings between directory keys and selector names
   */
  private buildMappings(): void {
    const { chainsReferenceData } = loadReferenceData({
      environment: this.environment,
      version: Version.V1_2_0,
    })

    for (const [directoryKey] of Object.entries(chainsReferenceData as Record<string, ChainConfig>)) {
      this.directoryKeys.add(directoryKey)

      try {
        // Get chain ID and type to look up the selector entry
        const supportedChain = directoryToSupportedChain(directoryKey)
        const chainId = getChainId(supportedChain)
        const { chainType } = getChainTypeAndFamily(supportedChain)

        if (chainId) {
          const selectorEntry = getSelectorEntry(chainId, chainType)
          if (selectorEntry?.name) {
            const selectorName = selectorEntry.name

            // Only add mapping if names are different
            if (selectorName !== directoryKey) {
              this.directoryToSelector.set(directoryKey, selectorName)
              this.selectorToDirectory.set(selectorName, directoryKey)
            }
          }
        }
      } catch {
        // Skip chains that can't be resolved
        logger.debug({
          message: "Could not resolve chain for mapping",
          requestId: this.requestId,
          directoryKey,
        })
      }
    }

    logger.debug({
      message: "Chain identifier mappings built",
      requestId: this.requestId,
      mappingCount: this.directoryToSelector.size,
      directoryKeyCount: this.directoryKeys.size,
    })
  }

  /**
   * Check if an identifier is a directory key (chains.json key)
   */
  isDirectoryKey(identifier: string): boolean {
    return this.directoryKeys.has(identifier)
  }

  /**
   * Check if an identifier is a selector name (selectors.yml name)
   */
  isSelectorName(identifier: string): boolean {
    // It's a selector name if:
    // 1. It maps to a directory key, OR
    // 2. It's a directory key that has no different selector name (they're the same)
    return this.selectorToDirectory.has(identifier) || this.directoryKeys.has(identifier)
  }

  /**
   * Resolve a chain identifier to both directory key and selector name.
   * Detects which convention was used in the input.
   *
   * @param identifier - Chain identifier (directory key or selector name)
   * @returns Resolved chain info or null if not found
   */
  resolve(identifier: string): ResolvedChain | null {
    // Check if it's a directory key
    if (this.directoryKeys.has(identifier)) {
      const selectorName = this.directoryToSelector.get(identifier) ?? identifier
      return {
        directoryKey: identifier,
        selectorName,
        inputConvention: "directory",
      }
    }

    // Check if it's a selector name that maps to a directory key
    if (this.selectorToDirectory.has(identifier)) {
      const directoryKey = this.selectorToDirectory.get(identifier)!
      return {
        directoryKey,
        selectorName: identifier,
        inputConvention: "selector",
      }
    }

    // Not found
    return null
  }

  /**
   * Format a directory key using the specified naming convention.
   *
   * @param directoryKey - The chains.json key
   * @param convention - Which format to output
   * @returns Formatted identifier
   */
  format(directoryKey: string, convention: NamingConvention): string {
    if (convention === "directory") {
      return directoryKey
    }

    // Return selector name, or directory key if no mapping exists
    return this.directoryToSelector.get(directoryKey) ?? directoryKey
  }

  /**
   * Detect the naming convention from a list of identifiers.
   * Returns the convention of the first resolvable identifier.
   *
   * @param identifiers - List of identifiers to check
   * @returns Detected convention or default
   */
  detectConvention(...identifiers: (string | undefined)[]): NamingConvention {
    for (const identifier of identifiers) {
      if (!identifier) continue

      const resolved = this.resolve(identifier)
      if (resolved) {
        return resolved.inputConvention
      }
    }

    return this.defaultConvention
  }

  /**
   * Get the default naming convention
   */
  getDefaultConvention(): NamingConvention {
    return this.defaultConvention
  }

  /**
   * Get the directory key for a given identifier (either format)
   * This is useful for internal data lookups
   */
  getDirectoryKey(identifier: string): string | null {
    const resolved = this.resolve(identifier)
    return resolved?.directoryKey ?? null
  }

  /**
   * Get the selector name for a given identifier (either format)
   */
  getSelectorName(identifier: string): string | null {
    const resolved = this.resolve(identifier)
    return resolved?.selectorName ?? null
  }
}
