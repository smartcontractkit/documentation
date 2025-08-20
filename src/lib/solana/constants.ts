import { address } from "@solana/addresses"
import { SYSTEM_PROGRAM_ADDRESS } from "@solana-program/system"
import { TOKEN_PROGRAM_ADDRESS, ASSOCIATED_TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022"
import { COMPUTE_BUDGET_PROGRAM_ADDRESS } from "@solana-program/compute-budget"

export const prerender = false

/**
 * Official Solana program addresses imported from SDK
 * Using canonical sources to ensure correctness
 */
export const PROGRAM_IDS = {
  SYSTEM: SYSTEM_PROGRAM_ADDRESS,
  TOKEN: TOKEN_PROGRAM_ADDRESS,
  TOKEN_2022: TOKEN_2022_PROGRAM_ADDRESS,
  ASSOCIATED_TOKEN: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  COMPUTE_BUDGET: COMPUTE_BUDGET_PROGRAM_ADDRESS,
} as const

export type TokenProgramId = typeof PROGRAM_IDS.TOKEN | typeof PROGRAM_IDS.TOKEN_2022

/**
 * PDA seeds for faucet operations (stable contract interface)
 */
export const FAUCET_SEEDS = {
  SETTINGS: new Uint8Array(Buffer.from("settings")),
  SIGNER: new Uint8Array(Buffer.from("signer")),
  MINT: new Uint8Array(Buffer.from("mint")),
  USER: new Uint8Array(Buffer.from("user")),
  OPERATOR: new Uint8Array(Buffer.from("operator")),
} as const

/**
 * Anchor discriminator for 'drip' instruction
 * Generated from: anchor idl parse | jq '.instructions[] | select(.name == "drip") | .discriminator'
 */
export const DRIP_DISCRIMINATOR = new Uint8Array([215, 250, 141, 179, 116, 10, 187, 192] as const)

/**
 * CCIP-BnM token mint addresses for devnet
 * From: https://docs.chain.link/ccip/test-tokens
 */
export const BNM_MINT_ADDRESSES = {
  SOLANA_DEVNET: address("3PjyGzj1jGVgHSKS4VR1Hr1memm63PmN8L9rtPDKwzZ6"),
} as const

/**
 * Compute budget constants
 */
export const COMPUTE_BUDGET = {
  DRIP_INSTRUCTION_COMPUTE_UNITS: 200_000, // Conservative estimate
  PRIORITY_FEE_MICRO_LAMPORTS: 1_000, // 1 micro lamport per CU
} as const
