import { randomUUID } from "node:crypto"
import { createSolanaLogger } from "@lib/logging/index.js"
import type { Logger } from "@lib/logging/index.js"
import { ensureSolAddress } from "@lib/solana/index.js"
import { ChainConfigurationService } from "~/lib/ccip/services-api/chain-config.ts"
import { DripOrchestrator, type DripParams, type DripResult } from "~/lib/ccip/services-api/faucet/drip-orchestrator.ts"
import type { FaucetChainConfig } from "~/lib/ccip/types/faucet.ts"

export const prerender = false

/**
 * SVM Drip Adapter
 * Handles actual token dripping for Solana chains following Kit-native patterns
 */
export class SvmDripAdapter {
  private readonly requestId: string
  private readonly logger: Logger

  constructor() {
    this.requestId = randomUUID()
    this.logger = createSolanaLogger({
      requestId: this.requestId,
      operation: "svm-drip-adapter",
    })
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

    this.logger.info({
      message: "Starting SVM drip execution",
      chainName: chainConfig.chainName,
      tokenAddress: params.token,
      receiverAddress: params.receiver,
      step: "drip_init",
    })

    try {
      // 1. Validate addresses using Kit
      ensureSolAddress(params.token)
      ensureSolAddress(params.receiver)

      // 2. Prepare drip parameters
      const dripParams: DripParams = {
        mintAddress: params.token,
        receiverAddress: params.receiver,
        requestId: this.requestId,
      }
      // 3. Validate and create RPC context using centralized service (clean architecture)
      ChainConfigurationService.validateChainConfig(chainConfig)
      const rpcContext = ChainConfigurationService.createRpcContextForChain(chainConfig)

      // 4. Execute the drip using dependency injection
      const orchestrator = new DripOrchestrator(rpcContext, chainConfig, this.requestId)
      orchestrator.validateDripParams(dripParams, chainConfig)

      this.logger.debug({
        message: "Executing drip with orchestrator",
        chainName: chainConfig.chainName,
        step: "drip_execution",
      })

      const result = await orchestrator.executeDrip(dripParams, chainConfig)

      const executionTime = Date.now() - startTime

      this.logger.info({
        message: "SVM drip executed successfully",
        chainName: chainConfig.chainName,
        signature: result.signature,
        receiverAta: result.receiverAta,
        executionTimeMs: executionTime,
        step: "drip_success",
      })

      return result
    } catch (error) {
      // Log error with adapter context
      this.logger.error({
        message: "SVM drip adapter execution failed",
        operation: "SvmDripAdapter.executeDrip",
        chainName: chainConfig.chainName,
        mintAddress: params.token,
        receiverAddress: params.receiver,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      throw error
    }
  }

  /**
   * Check if drip is available for the given chain
   */
  isDripAvailable(chainConfig: FaucetChainConfig): boolean {
    return !!(chainConfig.enabled && chainConfig.family === "solana" && chainConfig.faucetAddress)
  }

  /**
   * Get the request ID for this adapter instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
