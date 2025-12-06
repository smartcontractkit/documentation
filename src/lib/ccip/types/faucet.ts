import { ChainFamily, ChainType } from "@config/types.ts"

/**
 * Configuration for a faucet-enabled chain
 */
export interface FaucetChainConfig {
  chainName: string
  selector: string
  family: ChainFamily
  chainType: ChainType
  faucetAddress: string
  rpcUrl: string
  enabled: boolean
  allowedTokens: string[]
  cooldownSeconds?: number
}

/**
 * Parameters for generating a challenge
 */
export interface ChallengeParams {
  token: string
  receiver: string
  host: string
  ttlSec: number
  kid: string
}

/**
 * Challenge response structure
 */
export interface ChallengeResponse {
  family: ChainFamily
  challenge: string
  exp: number
  challenge_hmac?: string // EVM only
}

/**
 * Verification request structure
 */
export interface VerifyRequest {
  token: string
  receiver: string
  challenge: string
  receiver_signature: string
  challenge_hmac?: string // EVM only
}

/**
 * Verification response structure
 */
export interface VerifyResponse {
  status: "ok" | "error"
  code?: string
  message?: string
}

/**
 * Arguments for signature verification
 */
export interface VerifySignatureArgs {
  chainConfig: FaucetChainConfig
  challenge: string
  signature: string
  receiver: string
  token: string
  host: string
  requestId: string
}

/**
 * Family adapter interface for chain-specific operations
 */
export interface FamilyAdapter {
  validateAddresses(input: { token: string; receiver: string }): void
  validateTokenAllowed(token: string, allowedTokens: string[]): void
  buildChallenge(args: {
    chainConfig: FaucetChainConfig
    token: string
    receiver: string
    host: string
    ttlSec: number
    kid: string
  }): { challenge: string; exp: number }
  verifySignature(args: VerifySignatureArgs): Promise<"ok" | { code: string; message: string }>
}

/**
 * Faucet API response types
 */
export interface FaucetApiResponse {
  status: string
  traceId?: string
}

/**
 * Error response structure
 */
export interface FaucetError {
  code: string
  message: string
  traceId?: string
  details?: unknown
}
