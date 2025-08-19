import { LogLevel, structuredLog } from "../ccip/utils.ts"
import { resolveFaucetChain } from "../ccip/faucet/chain-resolver.ts"
import { FaucetAdapterFactory } from "../ccip/faucet/adapters/index.ts"
import { ChallengeParams, ChallengeResponse, VerifyRequest, VerifyResponse } from "../ccip/types/faucet.ts"

/**
 * Service class for handling faucet operations
 * Following the existing ChainDataService pattern
 */
export class FaucetService {
  private readonly requestId: string

  constructor() {
    this.requestId = crypto.randomUUID()
    structuredLog(LogLevel.DEBUG, {
      message: "FaucetService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Generates a challenge for signature verification
   */
  async generateChallenge(chainName: string, params: ChallengeParams): Promise<ChallengeResponse> {
    structuredLog(LogLevel.INFO, {
      message: "Generating faucet challenge",
      requestId: this.requestId,
      chainName,
      tokenPrefix: params.token.slice(0, 8),
      receiverPrefix: params.receiver.slice(0, 8),
    })

    // Resolve chain configuration
    const chainConfig = resolveFaucetChain(chainName)
    if (!chainConfig || !chainConfig.enabled) {
      throw new Error(`Chain ${chainName} is not supported for faucet operations`)
    }

    structuredLog(LogLevel.DEBUG, {
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
      structuredLog(LogLevel.WARN, {
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
      structuredLog(LogLevel.WARN, {
        message: "Token not allowed",
        requestId: this.requestId,
        chainName,
        tokenPrefix: params.token.slice(0, 8),
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

    structuredLog(LogLevel.INFO, {
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
    structuredLog(LogLevel.INFO, {
      message: "Verifying faucet signature",
      requestId: this.requestId,
      chainName,
      tokenPrefix: request.token.slice(0, 8),
      receiverPrefix: request.receiver.slice(0, 8),
    })

    // Resolve chain configuration
    const chainConfig = resolveFaucetChain(chainName)
    if (!chainConfig || !chainConfig.enabled) {
      throw new Error(`Chain ${chainName} is not supported for faucet operations`)
    }

    structuredLog(LogLevel.DEBUG, {
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

    const result = adapter.verifySignature({
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
      structuredLog(LogLevel.INFO, {
        message: "Signature verification successful",
        requestId: this.requestId,
        chainName,
        family: chainConfig.family,
        receiverPrefix: request.receiver.slice(0, 8),
        verificationTimeMs: verificationTime,
      })

      // TODO: In future versions, integrate with actual faucet here
      structuredLog(LogLevel.INFO, {
        message: "Signature flow validated - ready for faucet integration",
        requestId: this.requestId,
        nextStep: "integrate_with_faucet_contract",
      })

      return { status: "ok" }
    } else {
      structuredLog(LogLevel.WARN, {
        message: "Signature verification failed",
        requestId: this.requestId,
        chainName,
        errorCode: result.code,
        errorMessage: result.message,
        family: chainConfig.family,
        receiverPrefix: request.receiver.slice(0, 8),
        verificationTimeMs: verificationTime,
      })

      throw new Error(`Verification failed: ${result.message}`)
    }
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
