/**
 * @fileoverview CCIP Chain-Specific Tooltip Configuration
 *
 * Centralized configuration for chain-specific tooltips displayed in the CCIP directory.
 * This approach provides:
 * - Type safety with TypeScript
 * - Stable chain ID references (not display names)
 * - Easy content updates without code changes
 * - Scalable for adding new chains
 * - Separation of content from component logic
 *
 * @example
 * ```typescript
 * const tooltipConfig = getChainTooltip(network.chain);
 * if (tooltipConfig) {
 *   return <Tooltip tip={tooltipConfig.content} hoverable={tooltipConfig.hoverable} />
 * }
 * ```
 */

import { type ReactNode } from "react"

/**
 * Configuration for a chain-specific tooltip
 */
export interface ChainTooltipConfig {
  /** The tooltip content (supports JSX for interactive elements) */
  content: ReactNode
  /** Whether the tooltip should be hoverable (for interactive content) */
  hoverable: boolean
  /** Optional custom hide delay for hoverable tooltips */
  hideDelay?: number
}

/**
 * Chain-specific tooltip configurations mapped by stable chain IDs.
 *
 * **Adding a new chain tooltip:**
 * 1. Add the chain ID as a key (use network.chain, not network.name)
 * 2. Provide content and interaction settings
 * 3. Use hoverable=true for content with links
 *
 * **Content Guidelines:**
 * - Keep tooltips concise and actionable
 * - Use JSX for links and formatting
 * - Test on mobile for long content
 */
export const CHAIN_TOOLTIPS: Record<string, ChainTooltipConfig> = {
  "hyperliquid-mainnet": {
    content: (
      <>
        Before using or integrating HyperEVM on CCIP, it is recommended to review{" "}
        <a href="/ccip/service-limits/network-specific-limits">Network-Specific Service Limits</a>.
      </>
    ),
    hoverable: true,
    hideDelay: 300,
  },

  // Example: Add more chains as needed
  // "abstract-mainnet": {
  //   content: (
  //     <>
  //       Abstract requires special configuration. See{" "}
  //       <a href="/ccip/abstract-setup">setup guide</a> for details.
  //     </>
  //   ),
  //   hoverable: true,
  // },

  // "polygon-mainnet": {
  //   content: "Polygon CCIP integration is fully supported with standard configuration.",
  //   hoverable: false,
  // },
} as const

/**
 * Gets the tooltip configuration for a specific chain.
 *
 * @param chainId - The stable chain identifier (e.g., 'hyperliquid-mainnet')
 * @returns Tooltip configuration if exists, null otherwise
 *
 * @example
 * ```typescript
 * const tooltipConfig = getChainTooltip(network.chain);
 * if (tooltipConfig) {
 *   return <Tooltip tip={tooltipConfig.content} hoverable={tooltipConfig.hoverable} />
 * }
 * ```
 */
export function getChainTooltip(chainId: string): ChainTooltipConfig | null {
  return CHAIN_TOOLTIPS[chainId] || null
}

/**
 * Gets all chain IDs that have tooltip configurations.
 * Useful for debugging or administrative purposes.
 *
 * @returns Array of chain IDs with configured tooltips
 */
export function getTooltipEnabledChains(): string[] {
  return Object.keys(CHAIN_TOOLTIPS)
}

/**
 * Type guard to check if a chain has a tooltip configuration.
 *
 * @param chainId - The chain identifier to check
 * @returns True if the chain has a tooltip configuration
 */
export function hasChainTooltip(chainId: string): boolean {
  return chainId in CHAIN_TOOLTIPS
}
