/**
 * Solana program addresses from official SDK packages
 */

import { SYSTEM_PROGRAM_ADDRESS } from "@solana-program/system"
import { TOKEN_PROGRAM_ADDRESS, ASSOCIATED_TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022"
import { COMPUTE_BUDGET_PROGRAM_ADDRESS } from "@solana-program/compute-budget"

/**
 * Core Solana program IDs from official packages
 */
export const PROGRAM_IDS = {
  SYSTEM: SYSTEM_PROGRAM_ADDRESS,
  TOKEN: TOKEN_PROGRAM_ADDRESS,
  TOKEN_2022: TOKEN_2022_PROGRAM_ADDRESS,
  ASSOCIATED_TOKEN: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  COMPUTE_BUDGET: COMPUTE_BUDGET_PROGRAM_ADDRESS,
} as const

/**
 * Token program IDs as union type for type safety
 */
export type TokenProgramId = typeof PROGRAM_IDS.TOKEN | typeof PROGRAM_IDS.TOKEN_2022
