/**
 * Transaction builder service
 * Pure domain logic for building transactions using Kit pipeline
 */

import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  pipe,
  type TransactionSigner,
  Blockhash,
  Address,
  Instruction,
} from "@solana/kit"
import type { TransactionConfig, SimulationOptions } from "../models/transaction.ts"
import {
  buildComputeBudgetInstructions,
  validateComputeBudgetConfig,
  serializeComputeBudgetConfig,
} from "../models/compute-budget.ts"
import { ValidationError } from "../../../core/errors/base.ts"
import type { Logger } from "@lib/logging/index.ts"

/**
 * Transaction builder for creating Solana transactions using Kit pipeline
 */
export class TransactionBuilder {
  /**
   * Build a complete transaction message from configuration using Kit pipeline
   */
  static async buildTransactionMessage(
    config: TransactionConfig,
    latestBlockhash: { blockhash: Blockhash; lastValidBlockHeight: bigint },
    feePayer: TransactionSigner
  ) {
    // Validate configuration
    this.validateConfig(config)

    // Prepare compute budget instructions if provided
    const computeBudgetInstructions = config.computeBudget ? buildComputeBudgetInstructions(config.computeBudget) : []

    // Combine all instructions (compute budget first, then main instructions)
    const allInstructions = [...computeBudgetInstructions, ...config.instructions]

    // Build transaction message using Kit's canonical pipeline
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(allInstructions, tx)
    )

    return message
  }

  /**
   * Build and sign a complete transaction
   */
  static async buildAndSignTransaction(
    config: TransactionConfig,
    latestBlockhash: { blockhash: Blockhash; lastValidBlockHeight: bigint },
    feePayer: TransactionSigner,
    logger?: Logger
  ) {
    // Build the message
    const message = await this.buildTransactionMessage(config, latestBlockhash, feePayer)

    // Debug logging for signing process with serializable data
    logger?.debug({
      message: "Signing transaction with embedded signers using @solana/kit",
      requestId: config.requestId,
      feePayerAddress: feePayer.address.toString(),
      instructionCount: config.instructions.length,
      computeBudget: config.computeBudget ? serializeComputeBudgetConfig(config.computeBudget) : undefined,
      step: "tx_signing_start",
    })

    // Sign the transaction message using Kit's automatic signer detection
    // signTransactionMessageWithSigners extracts all signers from instruction accounts
    // and fee payer, then signs with all required signatures
    const signedTransaction = await signTransactionMessageWithSigners(message)

    return signedTransaction
  }

  /**
   * Validate transaction configuration
   */
  private static validateConfig(config: TransactionConfig): void {
    if (!config.feePayer) {
      throw new ValidationError("Fee payer is required", {
        operation: "buildTransaction",
        requestId: config.requestId,
      })
    }

    if (!config.feePayer.address) {
      throw new ValidationError("Fee payer must have a valid address", {
        operation: "buildTransaction",
        requestId: config.requestId,
      })
    }

    if (!config.instructions || config.instructions.length === 0) {
      throw new ValidationError("At least one instruction is required", {
        operation: "buildTransaction",
        requestId: config.requestId,
      })
    }

    // Validate compute budget if provided
    if (config.computeBudget) {
      try {
        validateComputeBudgetConfig(config.computeBudget)
      } catch (error) {
        throw new ValidationError(
          `Invalid compute budget: ${error instanceof Error ? error.message : "Unknown error"}`,
          {
            operation: "buildTransaction",
            requestId: config.requestId,
          }
        )
      }
    }
  }

  /**
   * Calculate total instructions count including compute budget
   */
  static getTotalInstructionCount(config: TransactionConfig): number {
    const computeBudgetCount = config.computeBudget ? buildComputeBudgetInstructions(config.computeBudget).length : 0
    return computeBudgetCount + config.instructions.length
  }

  /**
   * Estimate transaction size in bytes
   */
  static estimateTransactionSize(config: TransactionConfig): number {
    // Rough estimate based on instruction count and typical sizes
    const baseSize = 64 // Base transaction overhead
    const instructionCount = this.getTotalInstructionCount(config)
    const avgInstructionSize = 32 // Average instruction size
    const signatureSize = 64 // Each signature is 64 bytes

    return baseSize + instructionCount * avgInstructionSize + signatureSize
  }

  /**
   * Build transaction optimized for simulation (no actual signing required)
   */
  static async buildForSimulation(
    config: TransactionConfig,
    latestBlockhash: { blockhash: Blockhash; lastValidBlockHeight: bigint },
    feePayer: TransactionSigner,
    logger?: Logger
  ) {
    // For simulation, we still need a signed transaction but signatures don't need to be valid
    // The RPC will skip signature verification when sigVerify: false is set
    return this.buildAndSignTransaction(config, latestBlockhash, feePayer, logger)
  }

  /**
   * Extract all account addresses that will be accessed by the transaction
   */
  static extractAccountMetadata(config: TransactionConfig): {
    allAccounts: Address[]
    writableAccounts: Address[]
    readonlyAccounts: Address[]
    signers: Address[]
  } {
    const allAccounts = new Set<Address>()
    const writableAccounts = new Set<Address>()
    const readonlyAccounts = new Set<Address>()
    const signers = new Set<Address>()

    // Add fee payer as both signer and writable
    allAccounts.add(config.feePayer.address)
    writableAccounts.add(config.feePayer.address)
    signers.add(config.feePayer.address)

    // Process all instructions
    const allInstructions = config.computeBudget
      ? [...buildComputeBudgetInstructions(config.computeBudget), ...config.instructions]
      : [...config.instructions]

    for (const instruction of allInstructions) {
      // Add program address as readonly
      allAccounts.add(instruction.programAddress)
      readonlyAccounts.add(instruction.programAddress)

      // Process instruction accounts
      for (const account of instruction.accounts || []) {
        let address: Address
        let isWritable = false
        let isSigner = false

        // Handle modern AccountMeta format only
        if ("address" in account && "role" in account) {
          address = account.address
          // Handle AccountRole enum values
          if (Array.isArray(account.role)) {
            isWritable = Boolean(account.role.includes("writable"))
            isSigner = Boolean(account.role.includes("signer"))
          } else if (account.role) {
            // Handle single AccountRole enum values
            const roleStr = account.role.toString().toLowerCase()
            isWritable = roleStr.includes("writable")
            isSigner = roleStr.includes("signer")
          }
        } else {
          continue
        }

        allAccounts.add(address)

        if (isWritable) {
          writableAccounts.add(address)
        } else {
          readonlyAccounts.add(address)
        }

        if (isSigner) {
          signers.add(address)
        }
      }
    }

    return {
      allAccounts: Array.from(allAccounts),
      writableAccounts: Array.from(writableAccounts),
      readonlyAccounts: Array.from(readonlyAccounts),
      signers: Array.from(signers),
    }
  }

  /**
   * Create simulation options based on transaction config
   */
  static createSimulationOptions(config: TransactionConfig, includeAllAccounts = false): SimulationOptions {
    const accountMetadata = this.extractAccountMetadata(config)

    return {
      requestId: config.requestId,
      computeBudget: config.computeBudget,
      accountInspection: includeAllAccounts
        ? {
            addresses: accountMetadata.allAccounts,
            includeData: true,
            encoding: "base64",
          }
        : undefined,
      includeAllAccounts,
      replaceRecentBlockhash: true,
      skipSigVerify: true,
    }
  }

  /**
   * Optimize instruction ordering for better simulation results
   */
  static optimizeInstructionOrder(instructions: readonly Instruction[]): Instruction[] {
    // Create a copy to avoid mutating the original
    const optimized = [...instructions]

    // Simple optimization: put compute budget instructions first (if any)
    // This is already handled in buildTransactionMessage, but could be extended
    // for other instruction ordering optimizations

    return optimized
  }

  /**
   * Validate transaction for simulation compatibility
   */
  static validateForSimulation(config: TransactionConfig): void {
    this.validateConfig(config)

    // Additional simulation-specific validations
    const metadata = this.extractAccountMetadata(config)

    // Check if we're within reasonable account limits for simulation
    if (metadata.allAccounts.length > 64) {
      throw new ValidationError(`Too many accounts for simulation: ${metadata.allAccounts.length} (max 64)`, {
        operation: "validateForSimulation",
        requestId: config.requestId,
        accountCount: metadata.allAccounts.length,
      })
    }

    // Ensure we have at least the fee payer
    if (metadata.signers.length === 0) {
      throw new ValidationError("Transaction must have at least one signer", {
        operation: "validateForSimulation",
        requestId: config.requestId,
      })
    }
  }
}
