/**
 * Chain Configuration Service
 * Centralized service for resolving chain configurations with proper dependency injection
 * This ensures API layer never directly accesses environment variables
 */

import { getSolanaDevnetConfig } from "@lib/core/config/index.ts"
import { createRpcContext } from "@lib/solana/infrastructure/rpc/solana-rpc.ts"
import type { IRpcContext } from "@lib/solana/infrastructure/rpc/types.ts"
import type { FaucetChainConfig } from "@api/ccip/types/faucet.ts"

export const prerender = false

/**
 * Chain configuration with RPC context
 * Combines business config with infrastructure dependencies
 */
export interface ChainConfigWithRpc {
  config: FaucetChainConfig
  rpcContext: IRpcContext
}

/**
 * Centralized Chain Configuration Service
 * Handles configuration resolution and RPC context creation
 * Following clean architecture principles with proper dependency injection
 */
export class ChainConfigurationService {
  /**
   * Create RPC context for a given chain configuration
   * This centralizes RPC context creation logic
   */
  static createRpcContextForChain(chainConfig: FaucetChainConfig): IRpcContext {
    return createRpcContext({
      url: chainConfig.rpcUrl,
      commitment: "confirmed",
    })
  }

  /**
   * Get complete chain configuration with RPC context
   * This is the preferred method for API endpoints that need both config and RPC access
   */
  static async getChainConfigWithRpc(chainConfig: FaucetChainConfig): Promise<ChainConfigWithRpc> {
    const rpcContext = this.createRpcContextForChain(chainConfig)

    return {
      config: chainConfig,
      rpcContext,
    }
  }

  /**
   * Validate chain configuration is complete and usable
   */
  static validateChainConfig(chainConfig: FaucetChainConfig): void {
    if (!chainConfig.rpcUrl) {
      throw new Error(`Missing RPC URL for chain: ${chainConfig.chainName}`)
    }

    if (!chainConfig.faucetAddress) {
      throw new Error(`Missing faucet address for chain: ${chainConfig.chainName}`)
    }

    if (!chainConfig.allowedTokens.length) {
      throw new Error(`No allowed tokens configured for chain: ${chainConfig.chainName}`)
    }

    if (!chainConfig.enabled) {
      throw new Error(`Chain is not enabled: ${chainConfig.chainName}`)
    }
  }

  /**
   * Get Solana devnet configuration directly from core library
   * This provides a clean API for accessing core library configuration
   */
  static getSolanaDevnetConfiguration(): {
    rpcUrl: string
    faucetProgram: string
    payerKey: string
  } {
    return getSolanaDevnetConfig()
  }

  /**
   * Check if a chain name is supported by the configuration system
   */
  static isSupportedChain(chainName: string): boolean {
    switch (chainName) {
      case "solana-devnet":
        return true
      default:
        return false
    }
  }

  /**
   * Get default commitment level for RPC operations
   * This centralizes RPC configuration decisions
   */
  static getDefaultCommitment(): "processed" | "confirmed" | "finalized" {
    return "confirmed"
  }
}
