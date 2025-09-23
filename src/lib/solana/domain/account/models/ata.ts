/**
 * Associated Token Account (ATA) models and utilities
 */

import { type Address } from "@solana/kit"
import type { TokenProgramId } from "@lib/solana/core/constants/index.ts"
import { AddressError } from "../../../core/errors/base.ts"

/**
 * ATA derivation parameters
 */
export interface AtaParams {
  owner: Address
  mint: Address
  tokenProgram: TokenProgramId
}

/**
 * ATA derivation result
 */
export interface AtaResult {
  address: Address
  bump: number
}

/**
 * Derive Associated Token Account address using real Solana SDK
 */
export async function deriveAta(params: AtaParams): Promise<AtaResult> {
  try {
    // Import real ATA derivation from SDK
    const { findAssociatedTokenPda } = await import("@solana-program/token")

    // Use the official SDK function for ATA derivation
    const [ataAddress, bump] = await findAssociatedTokenPda({
      owner: params.owner,
      mint: params.mint,
      tokenProgram: params.tokenProgram,
    })

    return {
      address: ataAddress,
      bump,
    }
  } catch (error) {
    throw new AddressError(`Failed to derive ATA: ${error instanceof Error ? error.message : "Unknown error"}`, {
      owner: params.owner.toString(),
      mint: params.mint.toString(),
      tokenProgram: params.tokenProgram.toString(),
    })
  }
}

/**
 * Common ATA utilities
 */
export const ATA_UTILS = {
  /**
   * Derive ATAs for common faucet scenarios
   */
  deriveFaucetAtas: async (params: {
    receiverAddress: Address
    faucetSignerAddress: Address
    mint: Address
    tokenProgram: TokenProgramId
  }) => {
    const [receiverAtaResult, faucetVaultResult] = await Promise.all([
      deriveAta({
        owner: params.receiverAddress,
        mint: params.mint,
        tokenProgram: params.tokenProgram,
      }),
      deriveAta({
        owner: params.faucetSignerAddress,
        mint: params.mint,
        tokenProgram: params.tokenProgram,
      }),
    ])

    return {
      receiverAta: receiverAtaResult.address,
      faucetVault: faucetVaultResult.address,
    }
  },
}
