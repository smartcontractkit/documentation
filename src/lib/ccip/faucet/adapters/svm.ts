import { FamilyAdapter, VerifySignatureArgs, FaucetChainConfig } from "~/lib/ccip/types/faucet.ts"
import { ensureSolAddress } from "@lib/solana/core/address/validator.ts"
import { SolanaSignatureService } from "@lib/solana/domain/services/signature-verification.ts"
import { logger } from "@lib/logging/index.js"
import { getFaucetConfig } from "@lib/core/config/index.ts"
import { directoryToSupportedChain, getTitle } from "@features/utils/index.ts"
import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"

export const prerender = false

/**
 * Solana Virtual Machine (SVM) family adapter implementation
 * Provides chain-specific operations for Solana-based networks including
 * address validation, token allowlist verification, and cryptographic signature validation
 */
export class SvmAdapter implements FamilyAdapter {
  /**
   * Validates Solana address format compliance using canonical address validation utilities
   * Ensures addresses conform to base58 encoding standards and proper length requirements
   *
   * @param input - Token and receiver addresses for validation
   * @throws Error when addresses fail validation requirements
   */
  validateAddresses(input: { token: string; receiver: string }): void {
    try {
      ensureSolAddress(input.token)
      ensureSolAddress(input.receiver)
    } catch (error) {
      throw new Error(`Invalid Solana address: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Enforces token allowlist validation for faucet operations
   * Prevents unauthorized token distribution by verifying token inclusion in approved list
   *
   * @param token - Token address to validate against allowlist
   * @param allowedTokens - Array of approved token addresses
   * @throws Error when token is not authorized for faucet operations
   */
  validateTokenAllowed(token: string, allowedTokens: string[]): void {
    if (!allowedTokens.includes(token)) {
      throw new Error(`Token ${token} is not in the allowlist`)
    }
  }

  /**
   * Constructs Sign-In-With-Solana (SIWS) challenge message for cryptographic authentication
   * Integrates chain configuration utilities to provide accurate chain and token information
   * Challenge includes domain binding, token details, and expiration parameters
   *
   * @param args - Challenge construction parameters including chain config and request details
   * @returns Challenge structure with message text and expiration timestamp
   * @throws Error when chain configuration or token information cannot be resolved
   */
  buildChallenge(args: {
    chainConfig: FaucetChainConfig
    token: string
    receiver: string
    host: string
    ttlSec: number
    kid: string
  }): { challenge: string; exp: number } {
    // Convert directory-style chain name to standardized supported chain format
    const supportedChain = directoryToSupportedChain(args.chainConfig.chainName)

    // Resolve human-readable chain display name with validation
    const chainDisplayName = getTitle(supportedChain)
    if (!chainDisplayName) {
      throw new Error(`Chain display name not found for: ${args.chainConfig.chainName}`)
    }

    // Retrieve BnM token metadata with configuration validation
    const bnmParams = getBnMParams({
      supportedChain,
      version: Version.V1_2_0,
    })
    if (!bnmParams?.options?.symbol) {
      throw new Error(`BnM token symbol not found for chain: ${args.chainConfig.chainName}`)
    }
    const tokenSymbol = bnmParams.options.symbol

    const chainId = args.chainConfig.selector.includes("devnet") ? "solana:devnet" : "solana:mainnet"
    const faucetConfig = getFaucetConfig()

    const siws = SolanaSignatureService.generateSIWSChallenge({
      domain: new URL(args.host).host,
      receiver: args.receiver,
      token: args.token,
      host: args.host,
      chainId,
      ttlSec: args.ttlSec,
      kid: args.kid,
      secret: faucetConfig.challengeSecret,
      chainDisplayName,
      tokenSymbol,
    })

    return { challenge: siws.challenge, exp: siws.expiresAt }
  }

  /**
   * Performs comprehensive SIWS signature verification using domain services
   * Executes complete authentication workflow including challenge validation,
   * HMAC verification, and Ed25519 cryptographic signature validation
   *
   * @param args - Signature verification parameters including challenge and signature data
   * @returns Verification result indicating success or specific failure reason
   */
  async verifySignature(args: VerifySignatureArgs): Promise<"ok" | { code: string; message: string }> {
    try {
      const faucetConfig = getFaucetConfig()
      const result = await SolanaSignatureService.verifySIWSSignature({
        challenge: args.challenge,
        signature: args.signature,
        receiver: args.receiver,
        token: args.token,
        host: args.host,
        secret: faucetConfig.challengeSecret,
        requestId: args.requestId,
      })

      if (result.valid) {
        return "ok"
      } else {
        return {
          code: result.error?.code || "invalid_signature",
          message: result.error?.message || "Signature verification failed",
        }
      }
    } catch (error) {
      logger.error({
        message: "Error during signature verification",
        requestId: args.requestId,
        family: "solana",
        error: error instanceof Error ? error.message : "Unknown error",
        step: "verification_error",
      })
      return { code: "server_error", message: "Verification failed" }
    }
  }
}
