/**
 * Faucet State Service
 * Handles fetching user state and faucet settings for rate limit calculations
 * Following clean architecture patterns from the existing codebase
 */

import type { Address } from "@solana/kit"
import { createSolanaLogger } from "@lib/logging/index.js"
import type { Logger } from "@lib/logging/index.js"
import { derivePda, PDA_SEEDS } from "../account/models/pda.ts"
import { VALIDATION_LIMITS } from "../../core/constants/time.ts"
import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import {
  fetchEncodedAccount,
  assertAccountExists,
  getStructCodec,
  getU64Codec,
  getI64Codec,
  getU8Codec,
  getBooleanCodec,
  getOptionCodec,
  getAddressCodec,
} from "@solana/kit"

/**
 * Codec definitions for BnM faucet program account structures
 * Based on the actual IDL structure
 */
const userStateCodec = getStructCodec([
  ["mint", getAddressCodec()],
  ["receiver", getAddressCodec()],
  ["lastDripTs", getI64Codec()],
  ["dripCount", getU64Codec()],
  ["totalDripped", getU64Codec()],
  ["bump", getU8Codec()],
])

const settingsCodec = getStructCodec([
  ["admin", getAddressCodec()],
  ["pendingAdmin", getOptionCodec(getAddressCodec())],
  ["dripIntervalSeconds", getU64Codec()],
  ["signerBump", getU8Codec()],
  ["emergencyPaused", getBooleanCodec()],
  ["totalDrips", getU64Codec()],
])

/**
 * User state account structure from the BnM faucet program
 */
export interface UserState {
  mint: Address
  receiver: Address
  lastDripTs: bigint
  dripCount: bigint
  totalDripped: bigint
  bump: number
}

/**
 * Faucet settings account structure from the BnM faucet program
 */
export interface FaucetSettings {
  admin: Address
  pendingAdmin: Address | null
  dripIntervalSeconds: bigint
  signerBump: number
  emergencyPaused: boolean
  totalDrips: bigint
}

/**
 * Rate limit timing information
 */
export interface RateLimitInfo {
  remainingSeconds: number
  nextAvailable: Date
  displayTime: string
  lastDripTime: Date
  canDrip: boolean
}

/**
 * Faucet State Service
 * Provides methods to fetch and analyze faucet state for rate limiting
 */
export class FaucetStateService {
  private readonly logger: Logger
  private readonly rpc: IRpcContext
  private readonly faucetProgram: Address

  constructor(rpc: IRpcContext, faucetProgram: Address, requestId?: string) {
    this.rpc = rpc
    this.faucetProgram = faucetProgram
    this.logger = createSolanaLogger({
      operation: "faucet-state-service",
      requestId: requestId || "unknown",
    })
  }

  /**
   * Fetch user state account for rate limit checking
   */
  async getUserState(mint: Address, receiver: Address): Promise<UserState | null> {
    try {
      this.logger.debug({
        message: "Fetching user state",
        mint: mint.toString(),
        receiver: receiver.toString(),
      })

      // Derive the user state PDA using existing patterns
      const { address: userStatePda } = await derivePda(PDA_SEEDS.userState(mint, receiver), this.faucetProgram)

      // Fetch the account using @solana/kit (handles base64 automatically)
      const account = await fetchEncodedAccount(this.rpc.rpc, userStatePda, {
        commitment: this.rpc.commitment,
      })

      if (!account.exists) {
        this.logger.debug({
          message: "User state account does not exist",
          userStatePda: userStatePda.toString(),
          mint: mint.toString(),
          receiver: receiver.toString(),
        })
        return null
      }

      // Use assertAccountExists for better TypeScript support
      assertAccountExists(account)
      const accountData = account.data

      try {
        // Skip 8-byte discriminator and decode with codec
        const userStateData = accountData.slice(8)

        this.logger.debug({
          message: "Account structure analysis",
          accountDataLength: accountData.length,
          discriminator: Array.from(accountData.slice(0, 8))
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          expectedStructure:
            "8 bytes discriminator + 32 bytes mint + 32 bytes receiver + 8 bytes lastDripTs + 8 bytes dripCount + 8 bytes totalDripped + 1 byte bump = 97 bytes total",
          step: "account_structure_analysis",
        })

        this.logger.debug({
          message: "User state account data before deserialization",
          accountDataLength: accountData.length,
          userStateDataLength: userStateData.length,
          fullAccountData: Array.from(accountData)
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          step: "pre_deserialization",
        })

        // Try different discriminator assumptions
        this.logger.debug({
          message: "Testing different discriminator assumptions",
          with8ByteSkip: Array.from(accountData.slice(8, 24))
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          with0ByteSkip: Array.from(accountData.slice(0, 16))
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          with4ByteSkip: Array.from(accountData.slice(4, 20))
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          step: "discriminator_analysis",
        })

        const decodedUserState = userStateCodec.decode(userStateData)

        this.logger.debug({
          message: "Raw decoded user state from codec",
          decoded: {
            lastDripTs: decodedUserState.lastDripTs.toString(),
            dripCount: decodedUserState.dripCount.toString(),
            totalDripped: decodedUserState.totalDripped.toString(),
            bump: decodedUserState.bump,
          },
          step: "post_codec_decode",
        })

        const userState = this.validateUserState(decodedUserState)

        this.logger.debug({
          message: "User state fetched successfully after validation",
          validated: {
            lastDripTs: userState.lastDripTs.toString(),
            dripCount: userState.dripCount.toString(),
            totalDripped: userState.totalDripped.toString(),
            bump: userState.bump,
          },
          step: "post_validation",
        })

        return userState
      } catch (error) {
        // If codec deserialization fails, return safe defaults
        this.logger.error({
          message: "Failed to deserialize user state account data with codecs",
          error: error instanceof Error ? error.message : "Unknown error",
          userStatePda: userStatePda.toString(),
          step: "user_state_deserialization_error",
        })
        return {
          mint,
          receiver,
          lastDripTs: BigInt(0),
          dripCount: BigInt(0),
          totalDripped: BigInt(0),
          bump: 255,
        }
      }
    } catch (error) {
      this.logger.error({
        message: "Failed to fetch user state - PDA read error",
        error: error instanceof Error ? error.message : "Unknown error",
        mint: mint.toString(),
        receiver: receiver.toString(),
        faucetProgram: this.faucetProgram.toString(),
        step: "user_state_fetch_error",
      })
      // Return empty address constant instead of hardcoding
      return null
    }
  }

  /**
   * Fetch faucet settings for drip interval information
   */
  async getSettings(): Promise<FaucetSettings> {
    try {
      this.logger.debug({
        message: "Fetching faucet settings",
      })

      // Derive the settings PDA using existing patterns
      const { address: settingsPda } = await derivePda(PDA_SEEDS.settings(), this.faucetProgram)

      // Fetch the account using @solana/kit (handles base64 automatically)
      const account = await fetchEncodedAccount(this.rpc.rpc, settingsPda, {
        commitment: this.rpc.commitment,
      })

      if (!account.exists) {
        this.logger.error({
          message: "Faucet settings account does not exist - PDA read error",
          settingsPda: settingsPda.toString(),
          faucetProgram: this.faucetProgram.toString(),
          step: "settings_account_missing",
        })
        throw new Error("Faucet settings account does not exist")
      }

      // Use assertAccountExists for better TypeScript support
      assertAccountExists(account)

      try {
        // Skip 8-byte discriminator and decode with codec
        const settingsData = account.data.slice(8)

        this.logger.debug({
          message: "Settings account data before deserialization",
          accountDataLength: account.data.length,
          settingsDataLength: settingsData.length,
          fullAccountData: Array.from(account.data)
            .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
            .join(" "),
          step: "settings_pre_deserialization",
        })

        const decodedSettings = settingsCodec.decode(settingsData)

        this.logger.debug({
          message: "Raw decoded settings from codec",
          decoded: {
            admin: decodedSettings.admin.toString(),
            dripIntervalSeconds: decodedSettings.dripIntervalSeconds.toString(),
            emergencyPaused: decodedSettings.emergencyPaused,
            totalDrips: decodedSettings.totalDrips.toString(),
          },
          step: "settings_post_codec_decode",
        })

        const settings = this.validateSettings(decodedSettings)

        this.logger.debug({
          message: "Faucet settings fetched successfully after validation",
          validated: {
            admin: settings.admin.toString(),
            dripIntervalSeconds: settings.dripIntervalSeconds.toString(),
            emergencyPaused: settings.emergencyPaused,
            totalDrips: settings.totalDrips.toString(),
          },
          step: "settings_post_validation",
        })

        return settings
      } catch (error) {
        this.logger.error({
          message: "Failed to deserialize faucet settings with codecs",
          error: error instanceof Error ? error.message : "Unknown error",
          settingsPda: settingsPda.toString(),
          step: "settings_deserialization_error",
        })
        throw error
      }
    } catch (error) {
      this.logger.error({
        message: "Failed to fetch faucet settings - PDA read error",
        error: error instanceof Error ? error.message : "Unknown error",
        faucetProgram: this.faucetProgram.toString(),
        step: "settings_fetch_error",
      })
      throw error
    }
  }

  /**
   * Calculate remaining wait time for rate limit
   */
  calculateRemainingTime(userState: UserState, settings: FaucetSettings): RateLimitInfo {
    const now = Math.floor(Date.now() / 1000)
    const lastDripTime = Number(userState.lastDripTs)
    const dripInterval = Number(settings.dripIntervalSeconds)

    const elapsed = now - lastDripTime
    const remaining = Math.max(0, dripInterval - elapsed)
    const canDrip = remaining === 0

    const lastDripDate = new Date(lastDripTime * 1000)
    const nextAvailable = new Date((lastDripTime + dripInterval) * 1000)

    // Debug logging for rate limit calculation
    this.logger.debug({
      message: "Rate limit calculation details",
      calculation: {
        currentTimestamp: now,
        lastDripTimestamp: lastDripTime,
        dripIntervalSeconds: dripInterval,
        elapsedSeconds: elapsed,
        remainingSeconds: remaining,
        canDrip,
        lastDripDate: lastDripDate.toISOString(),
        nextAvailable: nextAvailable.toISOString(),
        displayTime: this.formatTime(remaining),
      },
      rawUserState: {
        lastDripTs: userState.lastDripTs.toString(),
        dripCount: userState.dripCount.toString(),
        totalDripped: userState.totalDripped.toString(),
        bump: userState.bump,
      },
      rawSettings: {
        dripIntervalSeconds: settings.dripIntervalSeconds.toString(),
        emergencyPaused: settings.emergencyPaused,
        totalDrips: settings.totalDrips.toString(),
      },
      step: "rate_limit_calculation",
    })

    return {
      remainingSeconds: remaining,
      nextAvailable,
      displayTime: this.formatTime(remaining),
      lastDripTime: lastDripDate,
      canDrip,
    }
  }

  /**
   * Format remaining time as human-readable string
   */
  private formatTime(seconds: number): string {
    if (seconds === 0) return "now"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const parts: string[] = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (remainingSeconds > 0 && hours === 0) parts.push(`${remainingSeconds}s`)

    return parts.join(" ")
  }

  /**
   * Validate and sanitize user state data from codec deserialization
   */
  private validateUserState(userState: ReturnType<typeof userStateCodec.decode>): UserState {
    // Validate timestamp is reasonable (within last 10 years and not in future)
    const now = Math.floor(Date.now() / 1000)
    const tenYearsAgo = now - VALIDATION_LIMITS.TEN_YEARS_AGO_OFFSET
    const lastDripSeconds = Number(userState.lastDripTs)

    if (lastDripSeconds < tenYearsAgo || lastDripSeconds > now + VALIDATION_LIMITS.FUTURE_TOLERANCE) {
      // Invalid timestamp, return safe defaults indicating user can drip
      this.logger.warn({
        message: "Invalid timestamp in user state, using safe defaults",
        lastDripTs: userState.lastDripTs.toString(),
        lastDripSeconds,
        now,
        tenYearsAgo,
        step: "invalid_timestamp_fallback",
      })
      return {
        mint: userState.mint,
        receiver: userState.receiver,
        lastDripTs: BigInt(0),
        dripCount: BigInt(0),
        totalDripped: BigInt(0),
        bump: 255,
      }
    }

    return userState
  }

  /**
   * Validate and sanitize settings data from codec deserialization
   */
  private validateSettings(settings: ReturnType<typeof settingsCodec.decode>): FaucetSettings {
    // Validate drip interval is reasonable (between 1 minute and 30 days)
    const intervalSeconds = Number(settings.dripIntervalSeconds)
    const validInterval =
      intervalSeconds >= VALIDATION_LIMITS.MIN_DRIP_INTERVAL && intervalSeconds <= VALIDATION_LIMITS.MAX_DRIP_INTERVAL

    if (!validInterval) {
      this.logger.warn({
        message: "Invalid drip interval in settings, using default",
        dripIntervalSeconds: settings.dripIntervalSeconds.toString(),
        intervalSeconds,
        minAllowed: VALIDATION_LIMITS.MIN_DRIP_INTERVAL,
        maxAllowed: VALIDATION_LIMITS.MAX_DRIP_INTERVAL,
        defaultUsed: VALIDATION_LIMITS.DEFAULT_DRIP_INTERVAL,
        step: "invalid_interval_fallback",
      })
    }

    const pendingAdmin = settings.pendingAdmin?.__option === "Some" ? settings.pendingAdmin.value : null
    const dripIntervalSeconds = validInterval
      ? settings.dripIntervalSeconds
      : BigInt(VALIDATION_LIMITS.DEFAULT_DRIP_INTERVAL)

    return {
      admin: settings.admin,
      pendingAdmin,
      dripIntervalSeconds,
      signerBump: settings.signerBump,
      emergencyPaused: settings.emergencyPaused,
      totalDrips: settings.totalDrips,
    }
  }
}
