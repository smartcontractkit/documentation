import { logger } from "@lib/logging/index.js"
import { resolveFaucetChain } from "~/lib/ccip/faucet/chain-resolver.ts"
import { FaucetAdapterFactory } from "~/lib/ccip/faucet/adapters/index.ts"
import { ChallengeParams, ChallengeResponse, VerifyRequest, VerifyResponse } from "~/lib/ccip/types/faucet.ts"

export const prerender = false

/**
 * Service class for handling faucet operations
 * Following the existing ChainDataService pattern
 */
export class FaucetService {
  private readonly requestId: string

  constructor() {
    this.requestId = crypto.randomUUID()
    logger.debug({
      message: "FaucetService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Generates a challenge for signature verification
   */
  async generateChallenge(chainName: string, params: ChallengeParams): Promise<ChallengeResponse> {
    logger.info({
      message: "Generating faucet challenge",
      requestId: this.requestId,
      chainName,
      tokenAddress: params.token,
      receiverAddress: params.receiver,
    })

    // Resolve chain configuration
    const chainConfig = resolveFaucetChain(chainName)
    if (!chainConfig || !chainConfig.enabled) {
      throw new Error(`Chain ${chainName} is not supported for faucet operations`)
    }

    logger.debug({
      message: "Chain configuration resolved",
      requestId: this.requestId,
      chainName,
      family: chainConfig.family,
      enabled: chainConfig.enabled,
    })

    // Get family adapter
    const adapter = FaucetAdapterFactory.getAdapter(chainConfig.family)

    // Validate addresses
    try {
      adapter.validateAddresses({
        token: params.token,
        receiver: params.receiver,
      })
    } catch (error) {
      logger.warn({
        message: "Address validation failed",
        requestId: this.requestId,
        chainName,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw new Error(`Invalid address: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Validate token allowlist
    try {
      adapter.validateTokenAllowed(params.token, chainConfig.allowedTokens)
    } catch (error) {
      logger.warn({
        message: "Token not allowed",
        requestId: this.requestId,
        chainName,
        tokenAddress: params.token,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw new Error(`Token not allowed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Generate challenge
    const challenge = adapter.buildChallenge({
      chainConfig,
      token: params.token,
      receiver: params.receiver,
      host: params.host,
      ttlSec: params.ttlSec,
      kid: params.kid,
    })

    logger.info({
      message: "Challenge generated successfully",
      requestId: this.requestId,
      chainName,
      family: chainConfig.family,
      expiresAt: challenge.exp,
      challengeLength: challenge.challenge.length,
    })

    return {
      family: chainConfig.family,
      challenge: challenge.challenge,
      exp: challenge.exp,
    }
  }

  /**
   * Verifies a signed challenge
   */
  async verifySignature(chainName: string, request: VerifyRequest, host: string): Promise<VerifyResponse> {
    logger.info({
      message: "Verifying faucet signature",
      requestId: this.requestId,
      chainName,
      tokenAddress: request.token,
      receiverAddress: request.receiver,
    })

    // Resolve chain configuration
    const chainConfig = resolveFaucetChain(chainName)
    if (!chainConfig || !chainConfig.enabled) {
      throw new Error(`Chain ${chainName} is not supported for faucet operations`)
    }

    logger.debug({
      message: "Chain resolved for verification",
      requestId: this.requestId,
      chainName,
      family: chainConfig.family,
      selector: chainConfig.selector,
    })

    // Get family adapter
    const adapter = FaucetAdapterFactory.getAdapter(chainConfig.family)

    // Perform signature verification
    const verificationStart = Date.now()

    const result = await adapter.verifySignature({
      chainConfig,
      challenge: request.challenge,
      signature: request.receiver_signature,
      receiver: request.receiver,
      token: request.token,
      host,
      requestId: this.requestId,
    })

    const verificationTime = Date.now() - verificationStart

    if (result === "ok") {
      logger.info({
        message: "Signature verification successful",
        requestId: this.requestId,
        chainName,
        family: chainConfig.family,
        receiverAddress: request.receiver,
        verificationTimeMs: verificationTime,
      })

      // TODO: In future versions, integrate with actual faucet here
      logger.info({
        message: "Signature flow validated - ready for faucet integration",
        requestId: this.requestId,
        nextStep: "integrate_with_faucet_contract",
      })

      return { status: "ok" }
    } else {
      logger.warn({
        message: "Signature verification failed",
        requestId: this.requestId,
        chainName,
        errorCode: result.code,
        errorMessage: result.message,
        family: chainConfig.family,
        receiverAddress: request.receiver,
        verificationTimeMs: verificationTime,
      })

      // Return structured error instead of throwing
      return {
        status: "error" as const,
        code: result.code,
        message: result.message,
      }
    }
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
