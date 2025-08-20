import { getProgramDerivedAddress, type Address } from "@solana/addresses"
import bs58 from "bs58"
import { FAUCET_SEEDS } from "./constants.ts"

export const prerender = false

/**
 * Type for PDA tuple [address, bump]
 */
export type Pda = readonly [Address, number]

/**
 * PDA derivation helpers for faucet program using Kit's getProgramDerivedAddress
 * All seeds match the on-chain program exactly
 */

/**
 * Derive the settings PDA
 * Seed: ["settings"]
 */
export async function findSettingsPda(faucetProgram: Address): Promise<Pda> {
  return await getProgramDerivedAddress({
    programAddress: faucetProgram,
    seeds: [FAUCET_SEEDS.SETTINGS],
  })
}

/**
 * Derive the signer PDA (faucet authority)
 * Seed: ["signer"]
 */
export async function findSignerPda(faucetProgram: Address): Promise<Pda> {
  return await getProgramDerivedAddress({
    programAddress: faucetProgram,
    seeds: [FAUCET_SEEDS.SIGNER],
  })
}

/**
 * Derive the mint config PDA
 * Seed: ["mint", mint_pubkey]
 */
export async function findMintConfigPda(faucetProgram: Address, mint: Address): Promise<Pda> {
  return await getProgramDerivedAddress({
    programAddress: faucetProgram,
    seeds: [FAUCET_SEEDS.MINT, bs58.decode(mint)], // <- bytes
  })
}

/**
 * Derive the user state PDA
 * Seed: ["user", mint_pubkey, user_pubkey]
 */
export async function findUserStatePda(faucetProgram: Address, mint: Address, user: Address): Promise<Pda> {
  return await getProgramDerivedAddress({
    programAddress: faucetProgram,
    seeds: [FAUCET_SEEDS.USER, bs58.decode(mint), bs58.decode(user)], // <- bytes
  })
}

/**
 * Derive the operator entry PDA
 * Seed: ["operator", operator_pubkey]
 */
export async function findOperatorEntryPda(faucetProgram: Address, operator: Address): Promise<Pda> {
  return await getProgramDerivedAddress({
    programAddress: faucetProgram,
    seeds: [FAUCET_SEEDS.OPERATOR, bs58.decode(operator)], // <- bytes
  })
}

/**
 * Derive all faucet PDAs at once
 */
export async function deriveFaucetPdas(faucetProgram: Address, mint: Address, user: Address, operator: Address) {
  const [settings, signer, mintConfig, userState, operatorEntry] = await Promise.all([
    findSettingsPda(faucetProgram),
    findSignerPda(faucetProgram),
    findMintConfigPda(faucetProgram, mint),
    findUserStatePda(faucetProgram, mint, user),
    findOperatorEntryPda(faucetProgram, operator),
  ])

  return {
    settings,
    signer,
    mintConfig,
    userState,
    operatorEntry,
  }
}
