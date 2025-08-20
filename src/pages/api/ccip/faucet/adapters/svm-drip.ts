import { randomUUID } from "node:crypto"
import { logger } from "@api/ccip/logger.ts"
import { ensureSolAddress } from "@lib/solana/address.ts"
import { executeDrip, validateDripParams, type DripParams, type DripResult } from "@lib/solana/drip-flow.ts"
import { isChainConfigured, type ConfigOverrides } from "@lib/solana/config-resolver.ts"
import { FaucetError, logError } from "@lib/solana/errors.ts"
import type { FaucetChainConfig } from "@api/ccip/types/faucet.ts"

export const prerender = false

/**
 * SVM Drip Adapter
 * Handles actual token dripping for Solana chains following Kit-native patterns
 */
export class SvmDripAdapter {
  private readonly requestId: string

  constructor() {
    this.requestId = randomUUID()
  }

  /**
   * Execute a drip operation for SVM chains
   */
  async executeDrip(
    chainConfig: FaucetChainConfig,
    params: {
      token: string
      receiver: string
      amount?: string
    }
  ): Promise<DripResult> {
    const startTime = Date.now()

    logger.info({
      message: "Starting SVM drip execution",
      requestId: this.requestId,
      chainName: chainConfig.chainName,
      tokenPrefix: params.token.slice(0, 8),
      receiverPrefix: params.receiver.slice(0, 8),
      step: "drip_init",
    })

    try {
      // 1. Validate addresses using Kit
      ensureSolAddress(params.token)
      ensureSolAddress(params.receiver)

      // 2. Validate addresses using drip flow utilities
      const dripParams: DripParams = {
        mintAddress: params.token,
        receiverAddress: params.receiver,
        requestId: this.requestId,
      }
      validateDripParams(dripParams)

      // 3. Resolve configuration from env + chainConfig
      const configOverrides: ConfigOverrides = {
        faucetProgram: chainConfig.faucetAddress,
      }

      // Note: We could add RPC URL overrides here if needed
      // configOverrides.rpcUrl = chainConfig.rpcUrl

      logger.debug({
        message: "Resolving configuration",
        requestId: this.requestId,
        chainName: chainConfig.chainName,
        hasFaucetAddress: !!chainConfig.faucetAddress,
        step: "config_resolution",
      })

      // 4. Execute the drip using Kit-native flow with resolved config
      const result = await executeDrip(dripParams, chainConfig.chainName, configOverrides)

      const executionTime = Date.now() - startTime

      logger.info({
        message: "SVM drip executed successfully",
        requestId: this.requestId,
        chainName: chainConfig.chainName,
        signature: result.signature.slice(0, 8),
        receiverAta: result.receiverAta.slice(0, 8),
        executionTimeMs: executionTime,
        step: "drip_success",
      })

      return result
    } catch (error) {
      // Log error with adapter context
      logError(error, {
        requestId: this.requestId,
        operation: "SvmDripAdapter.executeDrip",
        chainName: chainConfig.chainName,
        mintPrefix: params.token.slice(0, 8),
        receiverPrefix: params.receiver.slice(0, 8),
      })

      // Re-throw structured error or wrap unknown errors
      if (error instanceof FaucetError) {
        throw error
      } else {
        throw new FaucetError(
          `SVM drip execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          "ADAPTER_ERROR",
          500,
          this.requestId
        )
      }
    }
  }

  /**
   * Check if drip is available for the given chain
   */
  isDripAvailable(chainConfig: FaucetChainConfig): boolean {
    return !!(
      chainConfig.enabled &&
      chainConfig.family === "svm" &&
      chainConfig.faucetAddress &&
      isChainConfigured(chainConfig.chainName)
    )
  }

  /**
   * Get remaining cooldown time for a receiver (placeholder)
   */
  async getCooldownRemaining(chainConfig: FaucetChainConfig, receiver: string): Promise<number> {
    // TODO: Implement cooldown tracking
    // This would check the last drip time for the receiver
    // and return remaining cooldown seconds

    logger.debug({
      message: "Checking cooldown for receiver",
      requestId: this.requestId,
      chainName: chainConfig.chainName,
      receiverPrefix: receiver.slice(0, 8),
      step: "cooldown_check",
    })

    return 0 // No cooldown for now
  }

  /**
   * Get the request ID for this adapter instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
