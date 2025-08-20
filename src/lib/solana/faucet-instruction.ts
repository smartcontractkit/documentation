import type { Address } from "@solana/addresses"
import type { Instruction, AccountMeta } from "@solana/instructions"
import { AccountRole } from "@solana/instructions"
import { DRIP_DISCRIMINATOR, PROGRAM_IDS, type TokenProgramId } from "./constants.ts"

export const prerender = false

/**
 * Accounts required for the drip instruction
 * Order must match the faucet program's Anchor IDL exactly
 */
export interface DripInstructionAccounts {
  payer: Address
  relayer: Address
  settings: Address
  signerPda: Address
  mint: Address
  mintConfig: Address
  faucetVault: Address
  receiver: Address
  receiverAta: Address
  userState: Address
  operatorEntry: Address
  tokenProgram: TokenProgramId
}

/**
 * Build the drip instruction using Anchor-style format
 * 8-byte discriminator + no instruction args (as per faucet program)
 */
export function getDripInstruction(faucetProgram: Address, accounts: DripInstructionAccounts): Instruction {
  // Build accounts array with proper roles matching IDL
  const accountMetas: AccountMeta[] = [
    {
      address: accounts.payer,
      role: AccountRole.WRITABLE_SIGNER,
    },
    {
      address: accounts.relayer,
      role: AccountRole.READONLY_SIGNER,
    },
    {
      address: accounts.settings,
      role: AccountRole.WRITABLE,
    },
    {
      address: accounts.signerPda,
      role: AccountRole.READONLY,
    },
    {
      address: accounts.mint,
      role: AccountRole.READONLY,
    },
    {
      address: accounts.mintConfig,
      role: AccountRole.READONLY,
    },
    {
      address: accounts.faucetVault,
      role: AccountRole.WRITABLE,
    },
    {
      address: accounts.receiver,
      role: AccountRole.WRITABLE,
    },
    {
      address: accounts.receiverAta,
      role: AccountRole.WRITABLE,
    },
    {
      address: accounts.userState,
      role: AccountRole.WRITABLE,
    },
    {
      address: accounts.operatorEntry,
      role: AccountRole.READONLY,
    },
    {
      address: accounts.tokenProgram,
      role: AccountRole.READONLY,
    },
    {
      address: PROGRAM_IDS.ASSOCIATED_TOKEN,
      role: AccountRole.READONLY,
    },
    {
      address: PROGRAM_IDS.SYSTEM,
      role: AccountRole.READONLY,
    },
  ]

  // Anchor-style instruction: discriminator only, no args
  const data = DRIP_DISCRIMINATOR

  return {
    programAddress: faucetProgram,
    accounts: accountMetas,
    data,
  }
}

/**
 * Validate that all required accounts are provided
 */
export function validateDripAccounts(accounts: DripInstructionAccounts): void {
  const requiredFields: Array<keyof DripInstructionAccounts> = [
    "payer",
    "relayer",
    "settings",
    "signerPda",
    "mint",
    "mintConfig",
    "faucetVault",
    "receiver",
    "receiverAta",
    "userState",
    "operatorEntry",
    "tokenProgram",
  ]

  for (const field of requiredFields) {
    if (!accounts[field]) {
      throw new Error(`Missing required account: ${field}`)
    }
  }

  // Ensure payer = operator (as per requirement)
  if (accounts.payer !== accounts.relayer) {
    throw new Error("Payer must equal relayer (operator) as per faucet requirements")
  }
}
