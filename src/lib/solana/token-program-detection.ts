import { address, type Address } from "@solana/addresses"
import type { Rpc, SolanaRpcApi } from "@solana/kit"
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022"
import { type TokenProgramId } from "./constants.ts"
import { logger } from "@api/ccip/logger.ts"

export const prerender = false

/**
 * Detect token program (Token vs Token-2022) by reading mint account owner
 * As specified in the feedback: compare owner against SDK constants
 */
export async function detectTokenProgram(
  rpc: Rpc<SolanaRpcApi>,
  mint: Address,
  requestId?: string,
  commitment?: "processed" | "confirmed" | "finalized"
): Promise<TokenProgramId> {
  try {
    logger.debug({
      message: "Detecting token program for mint",
      requestId,
      mint: mint.slice(0, 8),
      step: "token_program_detection",
    })

    const { value: accountInfo } = await rpc
      .getAccountInfo(mint, {
        commitment: commitment || "confirmed",
      })
      .send()

    if (!accountInfo) {
      throw new Error(`Mint account not found: ${mint}`)
    }

    // Normalize owner to Address type for consistent comparison
    const owner = address(accountInfo.owner)

    // Compare against SDK constants directly
    if (owner === TOKEN_PROGRAM_ADDRESS) {
      logger.debug({
        message: "Detected Token Program (original)",
        requestId,
        mint: mint.slice(0, 8),
        owner,
        step: "token_program_detected",
      })
      return TOKEN_PROGRAM_ADDRESS
    }

    if (owner === TOKEN_2022_PROGRAM_ADDRESS) {
      logger.debug({
        message: "Detected Token-2022 Program",
        requestId,
        mint: mint.slice(0, 8),
        owner,
        step: "token_program_detected",
      })
      return TOKEN_2022_PROGRAM_ADDRESS
    }

    throw new Error(
      `Unknown token program owner: ${owner}. Expected ${TOKEN_PROGRAM_ADDRESS} or ${TOKEN_2022_PROGRAM_ADDRESS}`
    )
  } catch (error) {
    logger.error({
      message: "Failed to detect token program",
      requestId,
      mint: mint.slice(0, 8),
      error: error instanceof Error ? error.message : "Unknown error",
      step: "token_program_detection_error",
    })
    throw error
  }
}

/**
 * Check if a token program ID is valid
 */
export function isValidTokenProgram(programId: Address): programId is TokenProgramId {
  return programId === TOKEN_PROGRAM_ADDRESS || programId === TOKEN_2022_PROGRAM_ADDRESS
}
