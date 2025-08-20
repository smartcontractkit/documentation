import type { Address } from "@solana/addresses"
import { findAssociatedTokenPda, getCreateAssociatedTokenInstructionAsync } from "@solana-program/token"
import type { TokenProgramId } from "./constants.ts"
import { logger } from "@api/ccip/logger.ts"
import type { Rpc, SolanaRpcApi, TransactionSigner } from "@solana/kit"
import type { Instruction } from "@solana/instructions"

export const prerender = false

/**
 * Find Associated Token Account (ATA) address using SDK helper
 * Works with both Token and Token-2022 programs
 */
export async function findAta(params: {
  owner: Address
  mint: Address
  tokenProgram: TokenProgramId
}): Promise<[Address, number]> {
  // Use official SDK helper for ATA derivation
  const [ataAddress, bump] = await findAssociatedTokenPda({
    owner: params.owner,
    mint: params.mint,
    tokenProgram: params.tokenProgram,
  })
  return [ataAddress, bump]
}

/**
 * Create ATA instruction if account doesn't exist
 */
export async function getCreateAtaInstruction(params: {
  payer: TransactionSigner
  owner: Address
  mint: Address
  tokenProgram: TokenProgramId
}): Promise<Instruction> {
  return await getCreateAssociatedTokenInstructionAsync({
    payer: params.payer, // Kit API expects the signer object
    owner: params.owner,
    mint: params.mint,
    tokenProgram: params.tokenProgram,
  })
}

/**
 * Check if an account exists
 */
export async function accountExists(
  rpc: Rpc<SolanaRpcApi>,
  acct: Address,
  commitment?: "processed" | "confirmed" | "finalized"
): Promise<boolean> {
  try {
    const { value } = await rpc.getAccountInfo(acct, { commitment }).send()
    return value !== null
  } catch {
    return false
  }
}

/**
 * Derive multiple ATAs for faucet operations
 */
export async function deriveFaucetAtas(params: {
  receiverAddress: Address
  faucetSignerAddress: Address
  mint: Address
  tokenProgram: TokenProgramId
  requestId?: string
}) {
  logger.debug({
    message: "Deriving faucet ATAs",
    requestId: params.requestId,
    receiverPrefix: params.receiverAddress.slice(0, 8),
    signerPrefix: params.faucetSignerAddress.slice(0, 8),
    mint: params.mint.slice(0, 8),
    tokenProgram: params.tokenProgram,
    step: "ata_derivation",
  })

  const [receiverAta, receiverBump] = await findAta({
    owner: params.receiverAddress,
    mint: params.mint,
    tokenProgram: params.tokenProgram,
  })

  const [faucetVault, faucetBump] = await findAta({
    owner: params.faucetSignerAddress,
    mint: params.mint,
    tokenProgram: params.tokenProgram,
  })

  logger.debug({
    message: "Faucet ATAs derived",
    requestId: params.requestId,
    receiverAta: receiverAta.slice(0, 8),
    faucetVault: faucetVault.slice(0, 8),
    step: "ata_derivation_complete",
  })

  return {
    receiverAta,
    receiverBump,
    faucetVault,
    faucetBump,
  }
}
