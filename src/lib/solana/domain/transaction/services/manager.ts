/**
 * Transaction manager service
 * Handles sending and confirming transactions using Kit
 */

import {
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  getBase64EncodedWireTransaction,
  isSolanaError,
  assertIsTransactionWithBlockhashLifetime,
  type TransactionSigner,
  type Signature,
  type Instruction,
  type Address,
  type AccountInfoBase,
  type AccountInfoWithBase64EncodedData,
} from "@solana/kit"
import { assertIsTransactionWithinSizeLimit, assertIsSendableTransaction } from "@solana/kit"
import type { IRpcContext } from "../../../infrastructure/rpc/types.ts"
import type { Logger } from "@lib/logging/index.js"
import { TransactionBuilder } from "./builder.ts"
import type { ComputeBudgetConfig } from "../models/compute-budget.ts"
import type {
  SimulationOptions,
  SimulationResult,
  SimulationAccountInfo,
  ValidationResult,
  FeeEstimationResult,
  AccountChange,
} from "../models/transaction.ts"
import { SolanaError, SimulationError } from "../../../core/errors/base.ts"

/**
 * Transaction manager using the canonical Kit pipeline
 * Migrated from legacy SvmTransactionManager
 */
export class TransactionManager {
  constructor(
    private rpcContext: IRpcContext,
    private logger?: Logger
  ) {
    // Store dependencies for transaction operations
    this.rpcContext = rpcContext
    this.logger = logger
  }

  /**
   * Send instructions using Kit's canonical transaction pipeline
   */
  async sendInstructions(
    feePayer: TransactionSigner,
    instructions: readonly Instruction[],
    requestId?: string,
    computeBudget?: ComputeBudgetConfig
  ): Promise<string> {
    const startTime = Date.now()
    let signature: Signature | undefined

    try {
      this.logger?.debug({
        message: "Starting Kit transaction pipeline",
        requestId,
        instructionCount: instructions.length,
        step: "tx_building",
      })

      // 1. Get latest blockhash with commitment and context
      const { value: latestBlockhash, context } = await this.rpcContext.rpc
        .getLatestBlockhash({ commitment: this.rpcContext.commitment })
        .send()

      // 2. Build and sign transaction using TransactionBuilder
      const signedTransaction = await TransactionBuilder.buildAndSignTransaction(
        {
          feePayer,
          instructions: [...instructions],
          computeBudget,
          requestId,
        },
        latestBlockhash,
        feePayer,
        this.logger
      )

      signature = getSignatureFromTransaction(signedTransaction)

      this.logger?.debug({
        message: "Transaction signed, sending and confirming",
        requestId,
        signature: signature.slice(0, 8),
        step: "tx_sending",
      })

      // 3. Send and confirm - branch on subscriptions to avoid union type error
      if (this.rpcContext.rpcSubscriptions) {
        // With subscriptions: use the factory (strongly typed)
        const sendAndConfirm = sendAndConfirmTransactionFactory({
          rpc: this.rpcContext.rpc,
          rpcSubscriptions: this.rpcContext.rpcSubscriptions,
        })

        try {
          assertIsTransactionWithinSizeLimit(signedTransaction)
          assertIsSendableTransaction(signedTransaction)
          assertIsTransactionWithBlockhashLifetime(signedTransaction)
          await sendAndConfirm(signedTransaction, {
            commitment: this.rpcContext.commitment,
            minContextSlot: context.slot, // Race-free confirmation
          })
        } catch (error) {
          // Enhanced error detection - use Kit's isSolanaError for type safety with fallback
          const errorMessage = error instanceof Error ? error.message : String(error)
          const isBlockhashError = isSolanaError(error) && errorMessage.includes("blockhash not found")

          // Retry once on blockhash not found (enhanced with Kit's error detection)
          if (isBlockhashError) {
            this.logger?.debug({
              message: "Blockhash expired, retrying with fresh blockhash",
              requestId,
              step: "tx_retry_blockhash",
            })

            // Re-fetch blockhash and rebuild transaction
            const { value: freshBlockhash, context: freshContext } = await this.rpcContext.rpc
              .getLatestBlockhash({ commitment: this.rpcContext.commitment })
              .send()

            const retrySignedTransaction = await TransactionBuilder.buildAndSignTransaction(
              {
                feePayer,
                instructions: [...instructions],
                computeBudget,
                requestId,
              },
              freshBlockhash,
              feePayer,
              this.logger
            )
            signature = getSignatureFromTransaction(retrySignedTransaction)

            assertIsTransactionWithinSizeLimit(retrySignedTransaction)
            assertIsSendableTransaction(retrySignedTransaction)
            assertIsTransactionWithBlockhashLifetime(retrySignedTransaction)
            await sendAndConfirm(retrySignedTransaction, {
              commitment: this.rpcContext.commitment,
              minContextSlot: freshContext.slot,
            })
          } else {
            throw error
          }
        }
      } else {
        // Without subscriptions: manual send + poll
        const wireTx = getBase64EncodedWireTransaction(signedTransaction)
        await this.rpcContext.rpc
          .sendTransaction(wireTx, {
            encoding: "base64",
            preflightCommitment: this.rpcContext.commitment,
          })
          .send()

        // Poll signature status until desired commitment
        const target = this.rpcContext.commitment
        let confirmed = false
        for (let i = 0; i < 60; i++) {
          try {
            const { value } = await this.rpcContext.rpc.getSignatureStatuses([signature]).send()
            const st = value[0]
            if (st?.err) {
              // Safely serialize the error object, converting any BigInt values to strings
              let errorString: string
              try {
                errorString = JSON.stringify(st.err, (key, value) =>
                  typeof value === "bigint" ? value.toString() : value
                )
              } catch {
                // Fallback if serialization still fails
                errorString = String(st.err)
              }
              throw new Error(`Transaction failed: ${errorString}`)
            }
            const c = st?.confirmationStatus
            if (
              c &&
              (target === "processed" ||
                (target === "confirmed" && (c === "confirmed" || c === "finalized")) ||
                (target === "finalized" && c === "finalized"))
            ) {
              confirmed = true
              break
            }
          } catch (error) {
            // If it's a transaction error, re-throw it
            if (error instanceof Error && error.message.includes("Transaction failed:")) {
              throw error
            }
            // Continue polling for network errors
          }
          await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * (i + 1), 5000)))
        }
        if (!confirmed) {
          throw new Error(`Transaction not confirmed within timeout: ${signature}`)
        }
      }

      const executionTime = Date.now() - startTime

      this.logger?.info({
        message: "Transaction confirmed successfully",
        requestId,
        signature: signature.slice(0, 8),
        executionTimeMs: executionTime,
        step: "tx_confirmed",
      })

      return signature as string
    } catch (error) {
      const executionTime = Date.now() - startTime

      this.logger?.error({
        message: "Transaction failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTimeMs: executionTime,
        step: "tx_error",
      })

      // If we have a signature, try to get slot for richer error context
      if (signature) {
        let slot: number | undefined
        try {
          const { value } = await this.rpcContext.rpc.getSignatureStatuses([signature]).send()
          slot = value[0]?.slot ? Number(value[0].slot) : undefined
        } catch {
          // Ignore errors when fetching slot for error context
        }
        throw new SolanaError(
          `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          "TRANSACTION_ERROR",
          {
            signature: signature as string,
            slot,
            requestId,
          }
        )
      }

      throw error
    }
  }

  /**
   * Enhanced transaction simulation with account inspection and detailed analysis
   */
  async simulateTransaction(
    feePayer: TransactionSigner,
    instructions: readonly Instruction[],
    options: SimulationOptions = {}
  ): Promise<SimulationResult> {
    const {
      requestId,
      computeBudget,
      accountInspection,
      includeAllAccounts = false,
      replaceRecentBlockhash = true,
      skipSigVerify = true,
    } = options

    try {
      this.logger?.debug({
        message: "Starting enhanced transaction simulation",
        requestId,
        instructionCount: instructions.length,
        includeAccounts: includeAllAccounts || Boolean(accountInspection),
        step: "tx_simulation_start",
      })

      // Log detailed transaction structure for expert validation
      this.logger?.debug({
        message: "Transaction instructions for expert validation",
        requestId,
        computeBudget: computeBudget
          ? {
              computeUnitLimit: computeBudget.computeUnitLimit,
              computeUnitPrice: computeBudget.computeUnitPrice?.toString(),
            }
          : undefined,
        instructions: instructions.map((instruction, index) => ({
          index,
          programAddress: instruction.programAddress.toString(),
          dataLength: instruction.data?.length || 0,
          dataHex: instruction.data ? Buffer.from(instruction.data).toString("hex") : undefined,
          accountCount: instruction.accounts?.length || 0,
          accounts:
            instruction.accounts?.map((account, accountIndex) => ({
              index: accountIndex,
              address: account.address.toString(),
              role: account.role,
              isSigner: "signer" in account,
            })) || [],
        })),
        step: "tx_detailed_structure",
      })

      const { value: latestBlockhash } = await this.rpcContext.rpc
        .getLatestBlockhash({ commitment: this.rpcContext.commitment })
        .send()

      // Build and sign transaction for simulation
      const signedTransaction = await TransactionBuilder.buildAndSignTransaction(
        {
          feePayer,
          instructions: [...instructions],
          computeBudget,
          requestId,
        },
        latestBlockhash,
        feePayer,
        this.logger
      )

      // Log final transaction details for expert validation
      this.logger?.debug({
        message: "Final signed transaction for expert validation",
        requestId,
        feePayer: feePayer.address.toString(),
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight.toString(),
        transactionSize: signedTransaction.messageBytes.length,
        step: "tx_final_structure",
      })

      // Simulate the transaction
      // NOTE: simulateTransaction expects base64 encoding, so we keep this as is
      const wireTx = getBase64EncodedWireTransaction(signedTransaction)

      let simulation
      if (replaceRecentBlockhash) {
        // When replacing blockhash, sigVerify must be false
        if (accountInspection?.addresses.length) {
          // Type-safe configuration for replaceRecentBlockhash=true with accounts
          const configWithAccounts = {
            commitment: this.rpcContext.commitment,
            replaceRecentBlockhash: true as const,
            encoding: "base64" as const,
            accounts: {
              addresses: accountInspection.addresses,
              encoding: (accountInspection.encoding || "base64") as "base64" | "base64+zstd" | "jsonParsed",
            },
          } as const

          simulation = await this.rpcContext.rpc.simulateTransaction(wireTx, configWithAccounts).send()
        } else {
          // Type-safe configuration for replaceRecentBlockhash=true without accounts
          const configWithoutAccounts = {
            commitment: this.rpcContext.commitment,
            replaceRecentBlockhash: true as const,
            encoding: "base64" as const,
          } as const

          simulation = await this.rpcContext.rpc.simulateTransaction(wireTx, configWithoutAccounts).send()
        }
      } else {
        // When not replacing blockhash, use sigVerify setting
        if (accountInspection?.addresses.length) {
          // Type-safe configuration for normal simulation with accounts
          const configWithAccounts = {
            commitment: this.rpcContext.commitment,
            sigVerify: !skipSigVerify,
            encoding: "base64" as const,
            accounts: {
              addresses: accountInspection.addresses,
              encoding: (accountInspection.encoding || "base64") as "base64" | "base64+zstd" | "jsonParsed",
            },
          } as const

          simulation = await this.rpcContext.rpc.simulateTransaction(wireTx, configWithAccounts).send()
        } else {
          // Type-safe configuration for normal simulation without accounts
          const configWithoutAccounts = {
            commitment: this.rpcContext.commitment,
            sigVerify: !skipSigVerify,
            encoding: "base64" as const,
          } as const

          simulation = await this.rpcContext.rpc.simulateTransaction(wireTx, configWithoutAccounts).send()
        }
      }

      if (simulation.value.err) {
        // Safely serialize the error object, converting any BigInt values to strings
        let errorString: string
        try {
          errorString = JSON.stringify(simulation.value.err, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        } catch {
          // Fallback if serialization still fails
          errorString = String(simulation.value.err)
        }

        const errorMessage = `Simulation failed: ${errorString}`
        throw new SimulationError(
          errorMessage,
          { requestId, operation: "simulateTransaction" },
          simulation.value.logs || undefined,
          simulation.value.err
        )
      }

      const computeUnitsConsumed = Number(simulation.value.unitsConsumed || 0)

      // Process account data if available
      const processedAccounts = this.processSimulationAccounts(simulation.value.accounts, accountInspection?.addresses)

      // Categorize preflight errors from logs
      const preflightErrors = this.extractPreflightErrors(simulation.value.logs || [])

      // Extract account access patterns
      const accountAccesses = this.extractAccountAccesses(simulation.value.logs || [])

      const result: SimulationResult = {
        computeUnitsConsumed,
        logs: simulation.value.logs || undefined,
        accounts: processedAccounts,
        returnData: simulation.value.returnData
          ? {
              programId: simulation.value.returnData.programId,
              data: Array.isArray(simulation.value.returnData.data)
                ? simulation.value.returnData.data[0]
                : simulation.value.returnData.data,
            }
          : undefined,
        err: simulation.value.err || undefined,
        preflightErrors,
        accountAccesses,
      }

      this.logger?.debug({
        message: "Enhanced simulation completed successfully",
        requestId,
        computeUnitsConsumed,
        accountsInspected: processedAccounts?.length || 0,
        preflightErrorCount: preflightErrors?.length || 0,
        step: "tx_simulation_complete",
      })

      return result
    } catch (error) {
      this.logger?.error({
        message: "Enhanced transaction simulation failed",
        requestId,
        computeBudget: computeBudget
          ? {
              computeUnitLimit: computeBudget.computeUnitLimit,
              computeUnitPrice: computeBudget.computeUnitPrice?.toString(),
            }
          : undefined,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "tx_simulation_error",
      })

      if (error instanceof SimulationError) {
        throw error
      }

      throw new SimulationError(`Simulation error: ${error instanceof Error ? error.message : "Unknown error"}`, {
        requestId,
        operation: "simulateTransaction",
      })
    }
  }

  /**
   * Validate transaction without full simulation - faster preflight checks
   */
  async validateTransaction(
    feePayer: TransactionSigner,
    instructions: readonly Instruction[],
    requestId?: string
  ): Promise<ValidationResult> {
    try {
      this.logger?.debug({
        message: "Starting transaction validation",
        requestId,
        instructionCount: instructions.length,
        step: "tx_validation_start",
      })

      const errors: string[] = []
      const warnings: string[] = []

      // Basic validation
      if (!instructions.length) {
        errors.push("Transaction must contain at least one instruction")
      }

      if (!feePayer.address) {
        errors.push("Fee payer must have a valid address")
      }

      // Extract unique accounts from instructions
      const accountAddresses = new Set<Address>()
      for (const instruction of instructions) {
        for (const account of instruction.accounts || []) {
          if ("address" in account && account.address) {
            accountAddresses.add(account.address)
          } else if ("pubkey" in account && account.pubkey) {
            accountAddresses.add(account.pubkey as Address)
          }
        }
      }

      // Check account existence (basic RPC calls)
      const missingAccounts: Address[] = []
      const invalidAccounts: Address[] = []

      if (accountAddresses.size > 0) {
        try {
          // Check a few critical accounts (limit to avoid RPC spam)
          const accountsToCheck = Array.from(accountAddresses).slice(0, 10)
          const accountInfos = await Promise.allSettled(
            accountsToCheck.map((addr) =>
              this.rpcContext.rpc.getAccountInfo(addr, { commitment: this.rpcContext.commitment }).send()
            )
          )

          accountInfos.forEach((result, index) => {
            const address = accountsToCheck[index]
            if (result.status === "rejected") {
              invalidAccounts.push(address)
            } else if (!result.value.value) {
              missingAccounts.push(address)
            }
          })
        } catch (error) {
          warnings.push(`Could not validate all accounts: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }

      const result: ValidationResult = {
        isValid: errors.length === 0,
        errors,
        warnings,
        accountChecks: {
          missingAccounts,
          invalidAccounts,
        },
      }

      this.logger?.debug({
        message: "Transaction validation completed",
        requestId,
        isValid: result.isValid,
        errorCount: errors.length,
        warningCount: warnings.length,
        step: "tx_validation_complete",
      })

      return result
    } catch (error) {
      this.logger?.error({
        message: "Transaction validation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "tx_validation_error",
      })

      return {
        isValid: false,
        errors: [`Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        warnings: [],
      }
    }
  }

  /**
   * Estimate transaction fee based on compute units and current network conditions
   */
  async estimateTransactionFee(
    feePayer: TransactionSigner,
    instructions: readonly Instruction[],
    computeBudget?: ComputeBudgetConfig,
    requestId?: string
  ): Promise<FeeEstimationResult> {
    try {
      this.logger?.debug({
        message: "Starting transaction fee estimation",
        requestId,
        instructionCount: instructions.length,
        step: "tx_fee_estimation_start",
      })

      // First simulate to get accurate compute units
      const simulation = await this.simulateTransaction(feePayer, instructions, {
        requestId,
        computeBudget,
        replaceRecentBlockhash: true,
        skipSigVerify: true,
      })

      const computeUnits = simulation.computeUnitsConsumed

      // Get current fee structure (base fee is typically 5000 lamports per signature)
      const baseFee = 5000 // Standard transaction base fee

      // Calculate priority fee based on compute budget or use default
      const computeUnitPrice = computeBudget?.computeUnitPrice || 0n
      const priorityFee = computeUnits * Number(computeUnitPrice)

      const totalFee = baseFee + priorityFee

      const result: FeeEstimationResult = {
        baseFee,
        priorityFee,
        totalFee,
        computeUnits,
        computeUnitPrice,
      }

      this.logger?.debug({
        message: "Transaction fee estimation completed",
        requestId,
        totalFee,
        computeUnits,
        step: "tx_fee_estimation_complete",
      })

      return result
    } catch (error) {
      this.logger?.error({
        message: "Transaction fee estimation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "tx_fee_estimation_error",
      })

      throw new SolanaError(
        `Fee estimation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "FEE_ESTIMATION_ERROR",
        { requestId }
      )
    }
  }

  /**
   * Inspect account changes that would occur during transaction execution
   */
  async inspectAccountChanges(
    feePayer: TransactionSigner,
    instructions: readonly Instruction[],
    accountsToInspect: Address[],
    requestId?: string
  ): Promise<AccountChange[]> {
    try {
      this.logger?.debug({
        message: "Starting account change inspection",
        requestId,
        accountCount: accountsToInspect.length,
        step: "tx_account_inspection_start",
      })

      // Get current account states
      const beforeStates = await Promise.allSettled(
        accountsToInspect.map((addr) =>
          this.rpcContext.rpc.getAccountInfo(addr, { commitment: this.rpcContext.commitment }).send()
        )
      )

      // Simulate transaction to get after states
      const simulation = await this.simulateTransaction(feePayer, instructions, {
        requestId,
        accountInspection: {
          addresses: accountsToInspect,
          includeData: true,
          encoding: "base64",
        },
      })

      // Process changes
      const changes: AccountChange[] = []

      for (let i = 0; i < accountsToInspect.length; i++) {
        const address = accountsToInspect[i]

        // Get before state using Kit's assertAccountExists for type safety
        const beforeResult = beforeStates[i]
        let before: SimulationAccountInfo | null = null

        if (beforeResult.status === "fulfilled" && beforeResult.value.value) {
          const accountValue = beforeResult.value.value
          // Enhanced validation - check for required properties
          if (accountValue.owner && accountValue.lamports !== undefined && accountValue.data) {
            before = {
              executable: accountValue.executable,
              owner: accountValue.owner.toString(),
              lamports: Number(accountValue.lamports),
              data: [accountValue.data.toString(), "base64"] as [string, string],
            }
          } else {
            this.logger?.debug({
              message: "Account data incomplete for before state",
              address: address.toString(),
              hasOwner: !!accountValue.owner,
              hasLamports: accountValue.lamports !== undefined,
              hasData: !!accountValue.data,
              step: "before_state_validation_failure",
            })
          }
        }

        // Get after state from simulation
        const after = simulation.accounts?.find((acc) => acc.address === address)?.account || null

        // Calculate changes
        const lamportChange = (after?.lamports || 0) - (before?.lamports || 0)
        const dataChanged = this.hasDataChanged(before, after)

        changes.push({
          address,
          before,
          after,
          lamportChange,
          dataChanged,
        })
      }

      this.logger?.debug({
        message: "Account change inspection completed",
        requestId,
        changesDetected: changes.filter((c) => c.lamportChange !== 0 || c.dataChanged).length,
        step: "tx_account_inspection_complete",
      })

      return changes
    } catch (error) {
      this.logger?.error({
        message: "Account change inspection failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "tx_account_inspection_error",
      })

      throw new SolanaError(
        `Account inspection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "ACCOUNT_INSPECTION_ERROR",
        { requestId }
      )
    }
  }

  /**
   * Process simulation account data into structured format using Kit's assertAccountExists
   */
  private processSimulationAccounts(
    simulationAccounts: Array<(AccountInfoBase & AccountInfoWithBase64EncodedData) | null> | null,
    requestedAddresses?: Address[]
  ): Array<{ address: Address; account: SimulationAccountInfo | null }> | undefined {
    if (!simulationAccounts || !requestedAddresses) {
      return undefined
    }

    return requestedAddresses.map((address, index) => {
      const accountData = simulationAccounts[index]
      if (!accountData) {
        return { address, account: null }
      }

      // Enhanced account validation - check for required properties
      if (!accountData.owner || accountData.lamports === undefined || !accountData.data) {
        this.logger?.debug({
          message: "Account data incomplete during simulation processing",
          address: address.toString(),
          hasOwner: !!accountData.owner,
          hasLamports: accountData.lamports !== undefined,
          hasData: !!accountData.data,
          step: "account_validation_failure",
        })
        return { address, account: null }
      }

      return {
        address,
        account: {
          executable: accountData.executable,
          owner: accountData.owner.toString(),
          lamports: Number(accountData.lamports), // Convert Lamports (bigint) to number
          data: accountData.data as [string, string], // RPC always returns [data, encoding] tuple
        },
      }
    })
  }

  /**
   * Extract preflight errors from simulation logs
   */
  private extractPreflightErrors(logs: string[]): string[] {
    return logs.filter(
      (log) =>
        log.includes("Error") || log.includes("failed") || log.includes("insufficient") || log.includes("invalid")
    )
  }

  /**
   * Extract account access patterns from simulation logs
   * Parses Solana transaction logs to identify which accounts were read from or written to
   */
  private extractAccountAccesses(logs: string[]): { reads: Address[]; writes: Address[] } {
    const reads: Set<Address> = new Set()
    const writes: Set<Address> = new Set()

    for (const log of logs) {
      // Look for program invocation logs that indicate account access
      if (log.includes("Program") && log.includes("invoke")) {
        // Extract program address from logs like "Program 11111111111111111111111111111111 invoke [1]"
        const programMatch = log.match(/Program ([A-Za-z0-9]{32,44}) invoke/)
        if (programMatch) {
          reads.add(programMatch[1] as Address)
        }
      }

      // Look for account data changes (writes)
      if (log.includes("data") && (log.includes("changed") || log.includes("wrote"))) {
        // Extract account addresses from data change logs
        const accountMatch = log.match(/([A-Za-z0-9]{32,44}).*data/)
        if (accountMatch) {
          writes.add(accountMatch[1] as Address)
        }
      }

      // Look for lamport transfers (writes to both source and destination)
      if (log.includes("lamports") && log.includes("transfer")) {
        const transferMatch = log.match(/([A-Za-z0-9]{32,44}).*transfer.*([A-Za-z0-9]{32,44})/)
        if (transferMatch) {
          writes.add(transferMatch[1] as Address) // source
          writes.add(transferMatch[2] as Address) // destination
        }
      }

      // Look for account creation (writes)
      if (log.includes("CreateAccount") || log.includes("create account")) {
        const createMatch = log.match(/([A-Za-z0-9]{32,44})/)
        if (createMatch) {
          writes.add(createMatch[1] as Address)
        }
      }
    }

    return {
      reads: Array.from(reads),
      writes: Array.from(writes),
    }
  }

  /**
   * Check if account data has changed between two states
   */
  private hasDataChanged(before: SimulationAccountInfo | null, after: SimulationAccountInfo | null): boolean {
    if (!before && !after) return false
    if (!before || !after) return true

    // Compare data - both are now [string, string] format
    const beforeData = before.data
    const afterData = after.data

    if (Array.isArray(beforeData) && Array.isArray(afterData)) {
      return beforeData[0] !== afterData[0] // Compare the data content
    }

    return true
  }
}
