/**
 * Program Derived Address (PDA) models and utilities
 */

import { getAddressEncoder, getProgramDerivedAddress, type Address } from "@solana/kit"
import { AddressError } from "@lib/solana/core/errors/base.ts"
import { createSolanaLogger } from "@lib/logging/index.js"
import { ensureSolAddress } from "@lib/solana/core/address/validator.ts"

/**
 * PDA derivation result
 */
export interface PdaResult {
  address: Address
  bump: number
}

/**
 * PDA seed type - can be string, Uint8Array, or Address
 */
export type PdaSeed = string | Uint8Array | Address

/**
 * Derive PDA with seeds using @solana/kit recommended pattern
 */
export async function derivePda(seeds: PdaSeed[], programId: Address): Promise<PdaResult> {
  const logger = createSolanaLogger({ operation: "pda-derivation" })

  try {
    // Log input parameters for debugging (full addresses, not prefixes)
    const seedDebugInfo = seeds.map((seed, index) => ({
      index,
      type: seed instanceof Uint8Array ? "Uint8Array" : typeof seed,
      length: seed instanceof Uint8Array ? seed.length : String(seed).length,
      value: seed instanceof Uint8Array ? `[${seed.length} bytes]` : String(seed),
    }))

    logger.debug({
      message: "PDA derivation input",
      programId: programId.toString(),
      seedCount: seeds.length,
      seeds: seedDebugInfo,
    })

    // Follow @solana/kit recommended pattern: [SEED, getAddressEncoder().encode(addressSeed)]
    const encodedSeeds = seeds.map((seed, index) => {
      if (seed instanceof Uint8Array) {
        logger.debug({
          message: "Seed encoding: Using Uint8Array directly",
          seedIndex: index,
          seedLength: seed.length,
          type: "Uint8Array",
        })
        return seed
      }

      if (typeof seed === "string") {
        // Try to validate as a Solana address first
        try {
          const validAddress = ensureSolAddress(seed)
          // It's a valid Solana address - encode to 32 bytes
          const encoded = getAddressEncoder().encode(validAddress)
          logger.debug({
            message: "Seed encoding: Encoded address to 32 bytes",
            seedIndex: index,
            addressValue: seed,
            addressLength: seed.length,
            encodedLength: encoded.length,
            type: "Address",
          })
          return encoded
        } catch {
          // Not a valid address - treat as regular string seed
          // Check that string seeds don't exceed 32 bytes
          if (seed.length > 32) {
            throw new Error(`String seed at index ${index} exceeds 32 bytes: ${seed.length} bytes`)
          }
          logger.debug({
            message: "Seed encoding: Using string seed",
            seedIndex: index,
            seedValue: seed,
            seedLength: seed.length,
            type: "string",
          })
          return seed
        }
      }

      // For Address objects, encode using getAddressEncoder
      const encoded = getAddressEncoder().encode(seed)
      logger.debug({
        message: "Seed encoding: Encoded Address object to 32 bytes",
        seedIndex: index,
        addressValue: String(seed),
        encodedLength: encoded.length,
        type: "Address",
      })
      return encoded
    })

    // Use @solana/kit getProgramDerivedAddress with encoded seeds
    const [derivedAddress, bump] = await getProgramDerivedAddress({
      programAddress: programId,
      seeds: encodedSeeds,
    })

    logger.debug({
      message: "PDA derivation successful",
      programId: programId.toString(),
      derivedAddress: derivedAddress.toString(),
      bump,
      seedCount: encodedSeeds.length,
    })

    return {
      address: derivedAddress,
      bump,
    }
  } catch (error) {
    logger.error({
      message: "PDA derivation failed",
      programId: programId.toString(),
      seedCount: seeds.length,
      seeds: seeds.map((seed, i) => ({
        index: i,
        type: seed instanceof Uint8Array ? "Uint8Array" : typeof seed,
        value: seed instanceof Uint8Array ? `[${seed.length} bytes]` : String(seed),
      })),
      error: error instanceof Error ? error.message : "Unknown error",
    })

    throw new AddressError(`Failed to derive PDA: ${error instanceof Error ? error.message : "Unknown error"}`, {
      programId: programId.toString(),
      seedCount: seeds.length,
    })
  }
}

/**
 * Common PDA seed builders - CORRECTED to match faucet program implementation
 */
export const PDA_SEEDS = {
  /**
   * Create user state seed: ["user", mint, receiver]
   */
  userState: (mintAddress: Address, receiverAddress: Address): PdaSeed[] => ["user", mintAddress, receiverAddress],

  /**
   * Create mint config seed: ["mint", mint]
   */
  mintConfig: (mintAddress: Address): PdaSeed[] => ["mint", mintAddress],

  /**
   * Create operator entry seed: ["operator", operator]
   */
  operatorEntry: (operatorAddress: Address): PdaSeed[] => ["operator", operatorAddress],

  /**
   * Create faucet settings seed: ["settings"]
   */
  settings: (): PdaSeed[] => ["settings"],

  /**
   * Create faucet signer seed: ["signer"]
   */
  signer: (): PdaSeed[] => ["signer"],
}
