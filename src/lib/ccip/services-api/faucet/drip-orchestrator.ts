/**
 * Solana BnM token faucet orchestrator service
 * Implements core business logic for token distribution operations using clean architecture principles
 * Coordinates transaction building, simulation, execution, and error handling workflows
 */

import { randomUUID } from "node:crypto"
import { createSolanaLogger } from "@lib/logging/index.js"
import type { Logger } from "@lib/logging/index.js"
import { ensureSolAddress, address } from "@lib/solana/index.js"
import { BNM_MINT_ADDRESSES } from "@lib/solana/core/constants/index.ts"
import { derivePda, PDA_SEEDS } from "@lib/solana/domain/account/models/pda.ts"
import { ATA_UTILS } from "@lib/solana/domain/account/models/ata.ts"
import { getDripInstruction, validateDripAccounts } from "@lib/solana/domain/instructions/faucet.ts"
import { TransactionManager } from "@lib/solana/domain/transaction/services/manager.ts"
import { detectTokenProgram, getBackendSigner } from "@lib/solana/core/services/index.ts"
import { NetworkComputeBudgetService, TransactionComplexity } from "@lib/solana/core/services/network-compute-budget.ts"
import type { IRpcContext } from "@lib/solana/infrastructure/rpc/types.ts"
import type { FaucetChainConfig } from "~/lib/ccip/types/faucet.ts"
import type { Address } from "@solana/kit"
import { directoryToSupportedChain } from "@features/utils/index.ts"

export const prerender = false

/**
 * Drip execution parameters
 */
export interface DripParams {
  mintAddress: string
  receiverAddress: string
  requestId?: string
}

/**
 * Drip execution result
 */
export interface DripResult {
  signature: string
  receiverAta: string
  tokenProgram: string
}

/**
 * Primary orchestrator for Solana BnM token faucet operations
 * Encapsulates domain logic for secure token distribution with dependency injection architecture
 * Coordinates network-aware compute budget calculation and transaction execution workflows
 */
export class DripOrchestrator {
  private readonly logger: Logger
  private readonly requestId: string
  private readonly rpcContext: IRpcContext
  private readonly computeBudgetService: NetworkComputeBudgetService

  constructor(rpcContext: IRpcContext, chainConfig?: FaucetChainConfig, requestId?: string) {
    this.requestId = requestId || randomUUID()
    this.rpcContext = rpcContext
    // Create domain-specific logger with context
    this.logger = createSolanaLogger({
      requestId: this.requestId,
      operation: "drip",
      chainName: chainConfig?.chainName,
    })
    // Configure network-aware compute budget calculation service for dynamic fee optimization
    this.computeBudgetService = new NetworkComputeBudgetService(rpcContext, this.logger)
  }

  /**
   * Executes complete BnM token distribution workflow with simulation-before-execution validation
   * Coordinates account preparation, transaction building, network-aware compute budget calculation,
   * transaction simulation, and final execution with comprehensive error handling
   *
   * @param params - Drip execution parameters including mint and receiver addresses
   * @param chainConfig - Chain-specific configuration for faucet operations
   * @returns Transaction execution result with signature and account information
   * @throws Error when validation, simulation, or execution fails
   */
  async executeDrip(params: DripParams, chainConfig: FaucetChainConfig): Promise<DripResult> {
    const startTime = Date.now()
    const requestId = params.requestId || this.requestId

    try {
      this.logger.info({
        message: "Starting BnM drip execution",
        requestId,
        mintAddress: params.mintAddress,
        receiverAddress: params.receiverAddress,
        step: "drip_start",
      })

      // Validate address format compliance using canonical Solana address validation
      const mint = ensureSolAddress(params.mintAddress)
      const receiver = ensureSolAddress(params.receiverAddress)

      // Execute complete transaction workflow with network-aware optimization

      const result = await this.performDripExecution({
        mint,
        receiver,
        chainConfig,
        requestId,
      })

      const executionTime = Date.now() - startTime

      this.logger.info({
        message: "Drip execution completed successfully",
        requestId,
        signature: result.signature,
        receiverAta: result.receiverAta,
        tokenProgram: result.tokenProgram,
        executionTimeMs: executionTime,
        step: "drip_success",
      })

      return result
    } catch (error) {
      const executionTime = Date.now() - startTime

      this.logger.error({
        message: "Drip execution failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTimeMs: executionTime,
        step: "drip_error",
      })

      throw error
    }
  }

  /**
   * Validates drip operation parameters including address format and token authorization
   * Ensures operational requirements are met before transaction execution
   *
   * @param params - Drip parameters to validate
   * @param chainConfig - Optional chain configuration for enhanced validation
   * @throws Error when validation requirements are not satisfied
   */
  validateDripParams(params: DripParams, chainConfig?: FaucetChainConfig): void {
    if (!params.mintAddress || typeof params.mintAddress !== "string") {
      throw new Error("Invalid mint address")
    }

    if (!params.receiverAddress || typeof params.receiverAddress !== "string") {
      throw new Error("Invalid receiver address")
    }

    // Enforce canonical Solana address format validation
    ensureSolAddress(params.mintAddress)
    ensureSolAddress(params.receiverAddress)

    // Verify token authorization against supported BnM token configuration
    if (chainConfig) {
      this.validateBnMToken(params.mintAddress, chainConfig.chainName)
    }
  }

  /**
   * Enforces BnM token authorization using centralized configuration resolver
   * Validates token address against chain-specific BnM token registry
   * Prevents unauthorized token distribution through faucet operations
   *
   * @param tokenAddress - Token address to validate
   * @param chainName - Target chain name for token resolution
   * @throws Error when token is not authorized or configuration is invalid
   */
  private validateBnMToken(tokenAddress: string, chainName: string): void {
    // Resolve chain name to standardized SupportedChain using existing utility
    let supportedChain
    try {
      supportedChain = directoryToSupportedChain(chainName)
    } catch {
      throw new Error(`Chain ${chainName} does not support BnM token faucet`)
    }

    // Retrieve authorized BnM token address from configuration registry
    const expectedBnMAddress = BNM_MINT_ADDRESSES[supportedChain]
    if (!expectedBnMAddress) {
      throw new Error(`BnM token not available for chain: ${chainName}`)
    }

    // Enforce token address compliance with authorized BnM configuration
    const providedAddress = ensureSolAddress(tokenAddress)
    if (providedAddress !== expectedBnMAddress) {
      throw new Error(`Invalid token address. Expected BnM token: ${expectedBnMAddress}, got: ${tokenAddress}`)
    }

    this.logger.debug({
      message: "BnM token validation successful",
      requestId: this.requestId,
      chainName,
      tokenAddress,
      step: "token_validation",
    })
  }

  /**
   * Estimate compute units for drip transaction using network-aware calculation
   * Provides more accurate estimates than legacy hardcoded values
   */
  async estimateDripComputeUnits(params: DripParams, chainConfig: FaucetChainConfig): Promise<number> {
    const requestId = params.requestId || this.requestId

    try {
      this.logger.debug({
        message: "Estimating compute units using network-aware calculation",
        requestId,
        step: "compute_estimation",
      })

      // Validate addresses first
      const mint = ensureSolAddress(params.mintAddress)
      const receiver = ensureSolAddress(params.receiverAddress)

      // Use shared account preparation logic
      const accountPreparation = await this.prepareDripAccounts({
        mint,
        receiver,
        chainConfig,
        requestId,
      })

      // Get backend signer for instruction building
      const backendSigner = await getBackendSigner(chainConfig.chainName)

      const dripInstruction = getDripInstruction(
        accountPreparation.faucetProgramAddress,
        accountPreparation.dripAccounts,
        backendSigner
      )

      // Simulate using TransactionManager with conservative budget
      const transactionManager = new TransactionManager(this.rpcContext, this.logger)
      const simulationBudget = await this.computeBudgetService.calculateOptimalBudget({
        baseComputeUnits: 200_000,
        transactionComplexity: TransactionComplexity.STANDARD,
        requiresFastConfirmation: false,
        requestId,
      })

      const computeEstimate = await transactionManager.simulateTransaction(
        await getBackendSigner(chainConfig.chainName),
        [dripInstruction],
        {
          requestId,
          computeBudget: simulationBudget,
        }
      )

      this.logger.info({
        message: "Compute units estimated via network-aware simulation",
        requestId,
        simulatedComputeUnits: computeEstimate.computeUnitsConsumed,
        budgetComputeUnits: simulationBudget.computeUnitLimit,
        step: "compute_estimation_complete",
      })

      return computeEstimate.computeUnitsConsumed
    } catch (error) {
      this.logger.error({
        message: "Network-aware compute estimation failed, using fallback",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "compute_estimation_error",
      })

      // Use network service fallback estimate
      const fallbackBudget = await this.computeBudgetService.calculateOptimalBudget({
        baseComputeUnits: 180_000,
        transactionComplexity: TransactionComplexity.STANDARD,
        requiresFastConfirmation: false,
        requestId,
      })

      const fallbackEstimate = fallbackBudget.computeUnitLimit || 200_000

      this.logger.warn({
        message: "Using network service fallback estimate",
        requestId,
        fallbackEstimate,
        step: "compute_estimation_fallback",
      })

      return fallbackEstimate
    }
  }

  /**
   * Executes token distribution transaction with simulation-before-execution validation
   * Implements complete transaction workflow including account preparation, instruction building,
   * network-aware compute budget calculation, transaction simulation, and secure execution
   *
   * @param params - Execution parameters including addresses and configuration
   * @returns Transaction execution result with signature and account details
   * @throws Error when any stage of execution fails
   */
  private async performDripExecution(params: {
    mint: Address
    receiver: Address
    chainConfig: FaucetChainConfig
    requestId: string
  }): Promise<DripResult> {
    const startTime = Date.now()

    try {
      this.logger.debug({
        message: "Starting drip execution with domain services",
        requestId: params.requestId,
        step: "drip_domain_start",
      })

      // Prepare all required program-derived addresses and associated token accounts
      const accountPreparation = await this.prepareDripAccounts({
        mint: params.mint,
        receiver: params.receiver,
        chainConfig: params.chainConfig,
        requestId: params.requestId,
      })

      this.logger.debug({
        message: "Token program detected",
        requestId: params.requestId,
        tokenProgram: accountPreparation.tokenProgram.toString(),
        step: "token_program_detected",
      })

      this.logger.debug({
        message: "PDAs derived successfully",
        requestId: params.requestId,
        pdaCount: 5,
        step: "pdas_derived",
      })

      this.logger.debug({
        message: "ATAs derived successfully",
        requestId: params.requestId,
        receiverAta: accountPreparation.atas.receiverAta.toString(),
        faucetVault: accountPreparation.atas.faucetVault.toString(),
        step: "atas_derived",
      })

      // Validate account structure integrity before instruction construction
      validateDripAccounts(accountPreparation.dripAccounts)

      // Get backend signer for instruction building and transaction execution
      const backendSigner = await getBackendSigner(params.chainConfig.chainName)

      // Construct faucet drip instruction with validated account parameters and embedded signer
      const dripInstruction = getDripInstruction(
        accountPreparation.faucetProgramAddress,
        accountPreparation.dripAccounts,
        backendSigner
      )

      this.logger.debug({
        message: "Drip instruction created with embedded signer",
        requestId: params.requestId,
        accountCount: dripInstruction.accounts?.length ?? 0,
        step: "instruction_created",
      })

      // Log detailed drip instruction for expert validation
      this.logger.debug({
        message: "Drip instruction details for expert validation",
        requestId: params.requestId,
        faucetProgram: accountPreparation.faucetProgramAddress.toString(),
        instruction: {
          programAddress: dripInstruction.programAddress.toString(),
          dataLength: dripInstruction.data?.length || 0,
          dataHex: dripInstruction.data ? Buffer.from(dripInstruction.data).toString("hex") : undefined,
          accounts:
            dripInstruction.accounts?.map((account, index) => ({
              index,
              address: account.address.toString(),
              role: account.role,
              isSigner: "signer" in account,
              accountName:
                [
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
                  "associatedTokenProgram",
                  "systemProgram",
                ][index] || `unknown_${index}`,
            })) || [],
        },
        accountPreparation: {
          mint: params.mint.toString(),
          receiver: params.receiver.toString(),
          receiverAta: accountPreparation.atas.receiverAta.toString(),
          faucetVault: accountPreparation.atas.faucetVault.toString(),
          tokenProgram: accountPreparation.tokenProgram.toString(),
          signerPda: accountPreparation.pdas.signer.address.toString(),
          settings: accountPreparation.pdas.settings.address.toString(),
          mintConfig: accountPreparation.pdas.mintConfig.address.toString(),
          userState: accountPreparation.pdas.userState.address.toString(),
          operatorEntry: accountPreparation.pdas.operatorEntry.address.toString(),
        },
        step: "drip_instruction_details",
      })

      // Execute transaction using TransactionManager with simulation-before-execution validation
      const transactionManager = new TransactionManager(this.rpcContext, this.logger)

      this.logger.debug({
        message: "Backend signer configuration for transaction",
        requestId: params.requestId,
        backendSignerAddress: backendSigner.address.toString(),
        payerAddress: accountPreparation.dripAccounts.payer.toString(),
        relayerAddress: accountPreparation.dripAccounts.relayer.toString(),
        feePayerMatch: backendSigner.address.toString() === accountPreparation.dripAccounts.payer.toString(),
        step: "signer_configuration_debug",
      })

      // Calculate network-optimized compute budget for transaction simulation
      const initialComputeBudget = await this.computeBudgetService.calculateOptimalBudget({
        baseComputeUnits: 200_000, // Conservative estimate for simulation
        transactionComplexity: TransactionComplexity.STANDARD,
        requiresFastConfirmation: false,
        requestId: params.requestId,
      })

      // Execute transaction simulation with conservative compute budget
      const simulationResult = await transactionManager.simulateTransaction(backendSigner, [dripInstruction], {
        requestId: params.requestId,
        computeBudget: initialComputeBudget,
      })

      // Validate simulation results for transaction viability
      if (!simulationResult || simulationResult.computeUnitsConsumed === 0) {
        throw new Error("Transaction simulation failed - invalid transaction structure")
      }

      this.logger.info({
        message: "Transaction simulation successful, calculating optimal execution budget",
        requestId: params.requestId,
        computeUnitsConsumed: simulationResult.computeUnitsConsumed,
        step: "simulation_validated",
      })

      // Optimize compute budget based on simulation results and network conditions
      const executionComputeBudget = await this.computeBudgetService.calculateOptimalBudget({
        baseComputeUnits: simulationResult.computeUnitsConsumed,
        transactionComplexity: TransactionComplexity.STANDARD,
        requiresFastConfirmation: true, // Faucet operations should confirm quickly
        requestId: params.requestId,
      })

      const estimatedCost = this.computeBudgetService.estimateTotalTransactionCost(executionComputeBudget)

      this.logger.info({
        message: "Dynamic compute budget calculated for execution",
        requestId: params.requestId,
        computeUnitLimit: executionComputeBudget.computeUnitLimit,
        computeUnitPrice: executionComputeBudget.computeUnitPrice?.toString(),
        estimatedCostLamports: estimatedCost.toString(),
        step: "execution_budget_calculated",
      })

      // Execute production transaction with network-optimized compute budget
      try {
        const signature = await transactionManager.sendInstructions(
          backendSigner,
          [dripInstruction],
          params.requestId,
          executionComputeBudget
        )

        this.logger.info({
          message: "Transaction executed successfully with dynamic compute budget",
          requestId: params.requestId,
          signature: signature.toString(),
          simulatedComputeUnits: simulationResult.computeUnitsConsumed,
          budgetedComputeUnits: executionComputeBudget.computeUnitLimit,
          computeUnitPrice: executionComputeBudget.computeUnitPrice?.toString(),
          executionTimeMs: Date.now() - startTime,
          step: "transaction_execution_complete",
        })

        return {
          signature: signature.toString(),
          receiverAta: accountPreparation.atas.receiverAta.toString(),
          tokenProgram: accountPreparation.tokenProgram.toString(),
        }
      } catch (executionError) {
        this.logger.error({
          message: "Transaction execution failed despite successful simulation",
          requestId: params.requestId,
          error: executionError instanceof Error ? executionError.message : "Unknown error",
          budgetedComputeUnits: executionComputeBudget.computeUnitLimit,
          computeUnitPrice: executionComputeBudget.computeUnitPrice?.toString(),
          step: "transaction_execution_error",
        })
        throw executionError
      }
    } catch (error) {
      this.logger.error({
        message: "Drip execution failed in domain layer",
        requestId: params.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTimeMs: Date.now() - startTime,
        step: "drip_domain_error",
      })

      throw error
    }
  }

  /**
   * Prepares complete account structure for faucet drip operations
   * Derives program-derived addresses, associated token accounts, and instruction parameters
   * Provides consistent account preparation for both simulation and execution workflows
   *
   * @param params - Account preparation parameters including addresses and configuration
   * @returns Complete account structure with PDAs, ATAs, and instruction parameters
   * @throws Error when account derivation or token program detection fails
   */
  private async prepareDripAccounts(params: {
    mint: Address
    receiver: Address
    chainConfig: FaucetChainConfig
    requestId: string
  }) {
    // Detect appropriate token program (SPL Token vs Token-2022) for mint compatibility
    const tokenProgram = await detectTokenProgram(this.rpcContext.rpc, params.mint)
    const faucetProgramAddress = address(params.chainConfig.faucetAddress)

    // Get backend signer for accounts that require signing capabilities
    const backendSigner = await getBackendSigner(params.chainConfig.chainName)

    // Generate all program-derived addresses required for faucet instruction
    // CORRECTED: Using proper PDA seeds that match the faucet program implementation
    const [settingsPda, signerPda, mintConfigPda, userStatePda] = await Promise.all([
      derivePda(PDA_SEEDS.settings(), faucetProgramAddress),
      derivePda(PDA_SEEDS.signer(), faucetProgramAddress),
      derivePda(PDA_SEEDS.mintConfig(params.mint), faucetProgramAddress),
      derivePda(PDA_SEEDS.userState(params.mint, params.receiver), faucetProgramAddress),
    ])

    // CORRECTED: operator entry uses the backend signer (operator) address
    const operatorEntryPda = await derivePda(PDA_SEEDS.operatorEntry(backendSigner.address), faucetProgramAddress)

    // Calculate associated token account addresses for token transfer operations
    const { receiverAta, faucetVault } = await ATA_UTILS.deriveFaucetAtas({
      receiverAddress: params.receiver,
      faucetSignerAddress: signerPda.address,
      mint: params.mint,
      tokenProgram,
    })

    this.logger.debug({
      message: "Account preparation completed",
      requestId: params.requestId,
      backendSignerAddress: backendSigner.address.toString(),
      signerPdaAddress: signerPda.address.toString(),
      step: "accounts_prepared",
    })

    // Assemble complete account structure for faucet drip instruction
    // Use backend signer for accounts requiring signature capabilities (payer, relayer)
    const dripAccounts = {
      payer: backendSigner.address,
      relayer: backendSigner.address,
      settings: settingsPda.address,
      signerPda: signerPda.address,
      mint: params.mint,
      mintConfig: mintConfigPda.address,
      faucetVault,
      receiver: params.receiver,
      receiverAta,
      userState: userStatePda.address,
      operatorEntry: operatorEntryPda.address,
      tokenProgram,
    }

    return {
      tokenProgram,
      faucetProgramAddress,
      pdas: {
        settings: settingsPda,
        signer: signerPda,
        mintConfig: mintConfigPda,
        userState: userStatePda,
        operatorEntry: operatorEntryPda,
      },
      atas: {
        receiverAta,
        faucetVault,
      },
      dripAccounts,
    }
  }

  /**
   * Retrieves unique request identifier for transaction tracing and logging
   *
   * @returns Request ID string for correlation across distributed systems
   */
  getRequestId(): string {
    return this.requestId
  }
}
