import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit"
import { getBase64EncodedWireTransaction } from "@solana/transactions"
import type { TransactionSigner, MessageSigner } from "@solana/kit"
import type { Instruction } from "@solana/instructions"
import { logger } from "@api/ccip/logger.ts"
import type { SvmTxContext } from "./rpc.ts"
import { buildComputeBudgetInstructions, DEFAULT_COMPUTE_BUDGET, type ComputeBudgetConfig } from "./compute-budget.ts"
import { mapProgramError } from "./errors.ts"

/**
 * Type for transaction signatures from Kit
 * Inferred directly from Kit's helper to stay in sync
 */
type Signature = ReturnType<typeof getSignatureFromTransaction>

export const prerender = false

/**
 * Transaction Manager using the canonical Kit pipeline
 * Follows the exact pattern from Solana documentation and feedback
 */
export class SvmTransactionManager {
  constructor(private ctx: SvmTxContext) {} // eslint-disable-line no-useless-constructor

  /**
   * Send instructions using Kit's canonical transaction pipeline
   */
  async sendInstructions(
    feePayer: TransactionSigner & MessageSigner,
    instructions: readonly Instruction[],
    requestId?: string,
    computeBudget?: ComputeBudgetConfig
  ): Promise<Signature> {
    const startTime = Date.now()
    let signature: Signature | undefined

    try {
      logger.debug({
        message: "Starting Kit transaction pipeline",
        requestId,
        instructionCount: instructions.length,
        step: "tx_building",
      })

      // 1. Get latest blockhash with commitment and context
      const { value: latestBlockhash, context } = await this.ctx.rpc
        .getLatestBlockhash({ commitment: this.ctx.commitment })
        .send()

      // 2. Prepare compute budget instructions
      const budgetConfig = computeBudget || DEFAULT_COMPUTE_BUDGET
      const computeBudgetInstructions = buildComputeBudgetInstructions(budgetConfig, requestId)

      // 3. Combine compute budget instructions with main instructions
      const allInstructions = [...computeBudgetInstructions, ...instructions]

      logger.debug({
        message: "Instructions prepared with compute budget",
        requestId,
        computeBudgetInstructions: computeBudgetInstructions.length,
        mainInstructions: instructions.length,
        totalInstructions: allInstructions.length,
        step: "tx_instructions_prepared",
      })

      // 4. Build transaction message using Kit's pipeline
      const message = await pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(allInstructions, tx)
      )

      logger.debug({
        message: "Transaction message built, signing",
        requestId,
        step: "tx_signing",
      })

      // 5. Sign the transaction message (let TypeScript infer the proper lifetime generics)
      const signedTransaction = await signTransactionMessageWithSigners(message)
      signature = getSignatureFromTransaction(signedTransaction)

      logger.debug({
        message: "Transaction signed, sending and confirming",
        requestId,
        signature: signature.slice(0, 8),
        step: "tx_sending",
      })

      // 6. Send and confirm - branch on subscriptions to avoid union type error
      if (this.ctx.rpcSubscriptions) {
        // With subscriptions: use the factory (strongly typed)
        const sendAndConfirm = sendAndConfirmTransactionFactory({
          rpc: this.ctx.rpc,
          rpcSubscriptions: this.ctx.rpcSubscriptions,
        })

        try {
          await sendAndConfirm(signedTransaction, {
            commitment: this.ctx.commitment,
            minContextSlot: context.slot, // Race-free confirmation
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)

          // Retry once on blockhash not found (common on congested clusters)
          if (errorMessage.includes("blockhash not found")) {
            logger.debug({
              message: "Blockhash expired, retrying with fresh blockhash",
              requestId,
              step: "tx_retry_blockhash",
            })

            // Re-fetch blockhash and rebuild transaction
            const { value: freshBlockhash, context: freshContext } = await this.ctx.rpc
              .getLatestBlockhash({ commitment: this.ctx.commitment })
              .send()

            const retryMessage = await pipe(
              createTransactionMessage({ version: 0 }),
              (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
              (tx) => setTransactionMessageLifetimeUsingBlockhash(freshBlockhash, tx),
              (tx) => appendTransactionMessageInstructions(allInstructions, tx)
            )

            const retrySignedTransaction = await signTransactionMessageWithSigners(retryMessage)
            signature = getSignatureFromTransaction(retrySignedTransaction)

            await sendAndConfirm(retrySignedTransaction, {
              commitment: this.ctx.commitment,
              minContextSlot: freshContext.slot,
            })
          } else {
            throw error
          }
        }
      } else {
        // Without subscriptions: manual send + poll
        const wireTx = getBase64EncodedWireTransaction(signedTransaction)
        await this.ctx.rpc.sendTransaction(wireTx).send()

        // Poll signature status until desired commitment
        const target = this.ctx.commitment
        let confirmed = false
        for (let i = 0; i < 60; i++) {
          try {
            const { value } = await this.ctx.rpc.getSignatureStatuses([signature]).send()
            const st = value[0]
            if (st?.err) {
              throw new Error(`Transaction failed: ${JSON.stringify(st.err)}`)
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
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        if (!confirmed) {
          throw new Error(`Transaction not confirmed within timeout: ${signature}`)
        }
      }

      const executionTime = Date.now() - startTime

      logger.info({
        message: "Transaction confirmed successfully",
        requestId,
        signature: signature.slice(0, 8),
        executionTimeMs: executionTime,
        step: "tx_confirmed",
      })

      return signature
    } catch (error) {
      const executionTime = Date.now() - startTime

      logger.error({
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
          const { value } = await this.ctx.rpc.getSignatureStatuses([signature]).send()
          slot = value[0]?.slot ? Number(value[0].slot) : undefined
        } catch {
          // Ignore errors when fetching slot for error context
        }
        throw mapProgramError(error, requestId, signature, slot)
      }

      throw error
    }
  }

  /**
   * Simulate transaction to estimate compute units
   */
  async simulateTransaction(
    feePayer: TransactionSigner & MessageSigner,
    instructions: readonly Instruction[],
    requestId?: string,
    computeBudget?: ComputeBudgetConfig
  ): Promise<{ computeUnitsConsumed: number; logs?: string[] }> {
    try {
      logger.debug({
        message: "Simulating transaction for compute units estimation",
        requestId,
        instructionCount: instructions.length,
        step: "tx_simulation",
      })

      const { value: latestBlockhash } = await this.ctx.rpc
        .getLatestBlockhash({ commitment: this.ctx.commitment })
        .send()

      // Prepare compute budget instructions if provided
      const budgetConfig = computeBudget || DEFAULT_COMPUTE_BUDGET
      const computeBudgetInstructions = buildComputeBudgetInstructions(budgetConfig, requestId)
      const allInstructions = [...computeBudgetInstructions, ...instructions]

      const message = await pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(allInstructions, tx)
      )

      const signedTransaction = await signTransactionMessageWithSigners(message)

      // Simulate the transaction (RPC expects base64 wire transaction)
      const wireTx = getBase64EncodedWireTransaction(signedTransaction)
      const simulation = await this.ctx.rpc
        .simulateTransaction(wireTx, {
          commitment: this.ctx.commitment,
          replaceRecentBlockhash: true,
          sigVerify: false,
          encoding: "base64",
        })
        .send()

      if (simulation.value.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`)
      }

      const computeUnitsConsumed = Number(simulation.value.unitsConsumed || 0)

      logger.debug({
        message: "Transaction simulation completed",
        requestId,
        computeUnitsConsumed,
        step: "tx_simulation_complete",
      })

      return {
        computeUnitsConsumed,
        logs: simulation.value.logs ?? undefined,
      }
    } catch (error) {
      logger.error({
        message: "Transaction simulation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "tx_simulation_error",
      })

      throw error
    }
  }
}
