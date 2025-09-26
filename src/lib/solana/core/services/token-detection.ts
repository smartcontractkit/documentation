/**
 * Token program detection service
 * Provides dynamic onchain token program detection capabilities
 */

import { address } from "@solana/kit"
import type { Address, Rpc, SolanaRpcApi } from "@solana/kit"
import type { TokenProgramId } from "../types.ts"
import { PROGRAM_IDS } from "../constants/program-ids.ts"
import { ValidationError } from "../errors/base.ts"

/**
 * Detect which token program owns a mint account by querying the blockchain
 */
export async function detectTokenProgram(rpc: Rpc<SolanaRpcApi>, mintAddress: Address): Promise<TokenProgramId> {
  try {
    const accountResponse = await rpc.getAccountInfo(mintAddress).send()

    if (!accountResponse?.value?.owner) {
      throw new ValidationError(`Mint account not found: ${mintAddress}`, {
        mintAddress: mintAddress.toString(),
        operation: "detectTokenProgram",
      })
    }

    const accountInfo = accountResponse.value
    const owner = address(accountInfo.owner)

    if (owner === PROGRAM_IDS.TOKEN) {
      return PROGRAM_IDS.TOKEN
    }

    if (owner === PROGRAM_IDS.TOKEN_2022) {
      return PROGRAM_IDS.TOKEN_2022
    }

    throw new ValidationError(`Unknown token program owner: ${owner}`, {
      mintAddress: mintAddress.toString(),
      owner: owner.toString(),
      operation: "detectTokenProgram",
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }

    throw new ValidationError(`Failed to detect token program for ${mintAddress}`, {
      mintAddress: mintAddress.toString(),
      operation: "detectTokenProgram",
      originalError: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
