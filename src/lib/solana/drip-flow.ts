import type { Address } from "@solana/addresses"
import { randomUUID } from "node:crypto"
import { logger } from "@api/ccip/logger.ts"
import { ensureSolAddress } from "./address.ts"
import { loadSolanaDevnetConfig } from "./config.ts"
import { resolveConfig, type ConfigOverrides } from "./config-resolver.ts"
import { createSvmRpcClients } from "./rpc.ts"
import { createSvmSigner } from "./signers.ts"
import { SvmTransactionManager } from "./transaction-manager.ts"
import { detectTokenProgram } from "./token-program-detection.ts"
import { deriveFaucetPdas } from "./pda-helpers.ts"
import { deriveFaucetAtas, accountExists, getCreateAtaInstruction } from "./ata-helpers.ts"
import { getDripInstruction, validateDripAccounts, type DripInstructionAccounts } from "./faucet-instruction.ts"
import { calculatePriorityFee, type ComputeBudgetConfig } from "./compute-budget.ts"
import { mapProgramError, logError } from "./errors.ts"
import type { TokenProgramId } from "./constants.ts"
import type { Instruction } from "@solana/instructions"

export const prerender = false

/**
 * Result of a successful drip operation
 */
export interface DripResult {
  signature: string
  receiverAta: Address
  tokenProgram: TokenProgramId
}

/**
 * Parameters for drip execution
 */
export interface DripParams {
  mintAddress: string
  receiverAddress: string
  requestId?: string
}

/**
 * Complete drip flow orchestration following Kit-native patterns
 * Implements all feedback from temp/faucet.md methodically
 */
export async function executeDrip(
  params: DripParams,
  chainName?: string,
  configOverrides?: ConfigOverrides
): Promise<DripResult> {
  const startTime = Date.now()
  const requestId = params.requestId || randomUUID()

  try {
    logger.info({
      message: "Starting BnM drip execution",
      requestId,
      mintPrefix: params.mintAddress.slice(0, 8),
      receiverPrefix: params.receiverAddress.slice(0, 8),
      step: "drip_start",
    })

    // 1. Load configuration with optional overrides
    const config = chainName && configOverrides ? resolveConfig(chainName, configOverrides) : loadSolanaDevnetConfig()
    logger.debug({
      message: "Configuration loaded",
      requestId,
      rpcUrl: config.rpcUrl,
      hasWsUrl: !!config.wsUrl,
      commitment: config.commitment,
      step: "config_loaded",
    })

    // 2. Validate addresses using Kit's address() function
    const mint = ensureSolAddress(params.mintAddress)
    const receiver = ensureSolAddress(params.receiverAddress)

    // 3. Create RPC clients using Kit
    const txContext = createSvmRpcClients(config)
    logger.debug({
      message: "RPC clients created",
      requestId,
      hasSubscriptions: !!txContext.rpcSubscriptions,
      step: "rpc_created",
    })

    // 4. Create signer (payer = operator)
    const payer = await createSvmSigner(config.payerPrivateKey)
    logger.debug({
      message: "Signer created",
      requestId,
      payerAddress: payer.address.slice(0, 8),
      step: "signer_created",
    })

    // 5. Detect token program by reading mint account owner
    const tokenProgram = await detectTokenProgram(txContext.rpc, mint, requestId, config.commitment)

    // 6. Derive all PDAs for faucet operations
    const pdas = await deriveFaucetPdas(
      config.faucetProgram,
      mint,
      receiver,
      payer.address // operator = payer
    )

    logger.debug({
      message: "Faucet PDAs derived",
      requestId,
      settingsAddress: pdas.settings[0].slice(0, 8),
      signerAddress: pdas.signer[0].slice(0, 8),
      step: "pdas_derived",
    })

    // 7. Derive ATAs for receiver and faucet vault
    const atas = await deriveFaucetAtas({
      receiverAddress: receiver,
      faucetSignerAddress: pdas.signer[0],
      mint,
      tokenProgram,
      requestId,
    })

    // 8. Build drip instruction accounts
    const instructionAccounts: DripInstructionAccounts = {
      payer: payer.address,
      relayer: payer.address, // payer = operator
      settings: pdas.settings[0],
      signerPda: pdas.signer[0],
      mint,
      mintConfig: pdas.mintConfig[0],
      faucetVault: atas.faucetVault,
      receiver,
      receiverAta: atas.receiverAta,
      userState: pdas.userState[0],
      operatorEntry: pdas.operatorEntry[0],
      tokenProgram,
    }

    // Validate all accounts are provided
    validateDripAccounts(instructionAccounts)

    // 9. Check if ATAs exist and create instructions if needed
    const setupInstructions: Instruction[] = []

    // Check receiver ATA
    const receiverAtaExists = await accountExists(txContext.rpc, atas.receiverAta, config.commitment)
    if (!receiverAtaExists) {
      logger.debug({
        message: "Receiver ATA doesn't exist, adding creation instruction",
        requestId,
        receiverAta: atas.receiverAta.slice(0, 8),
        step: "ata_create_receiver",
      })
      const createReceiverAtaIx = await getCreateAtaInstruction({
        payer,
        owner: receiver,
        mint,
        tokenProgram,
      })
      setupInstructions.push(createReceiverAtaIx)
    }

    // Check faucet vault ATA
    const faucetVaultExists = await accountExists(txContext.rpc, atas.faucetVault, config.commitment)
    if (!faucetVaultExists) {
      logger.debug({
        message: "Faucet vault ATA doesn't exist, adding creation instruction",
        requestId,
        faucetVault: atas.faucetVault.slice(0, 8),
        step: "ata_create_vault",
      })
      const createFaucetVaultIx = await getCreateAtaInstruction({
        payer,
        owner: pdas.signer[0],
        mint,
        tokenProgram,
      })
      setupInstructions.push(createFaucetVaultIx)
    }

    // 10. Build the drip instruction
    const dripInstruction = getDripInstruction(config.faucetProgram, instructionAccounts)
    logger.debug({
      message: "Drip instruction built",
      requestId,
      programId: config.faucetProgram.slice(0, 8),
      accountCount: dripInstruction.accounts?.length || 0,
      setupInstructionCount: setupInstructions.length,
      step: "instruction_built",
    })

    // 11. Combine setup and drip instructions
    const allInstructions = [...setupInstructions, dripInstruction]

    // 12. Execute transaction using Kit transaction manager with compute budget
    const txManager = new SvmTransactionManager(txContext)

    // Add compute budget for transaction optimization
    const computeBudget: ComputeBudgetConfig = {
      computeUnitLimit: 200_000, // Conservative limit for faucet drip
      computeUnitPrice: calculatePriorityFee(200_000, "low"), // Low priority for cost efficiency
    }

    logger.debug({
      message: "Executing transaction with compute budget",
      requestId,
      computeUnitLimit: computeBudget.computeUnitLimit,
      computeUnitPrice: computeBudget.computeUnitPrice?.toString(),
      step: "tx_execution_start",
    })

    const signature = await txManager.sendInstructions(payer, allInstructions, requestId, computeBudget)

    const executionTime = Date.now() - startTime

    logger.info({
      message: "Drip execution completed successfully",
      requestId,
      signature: signature.slice(0, 8),
      receiverAta: atas.receiverAta.slice(0, 8),
      tokenProgram,
      executionTimeMs: executionTime,
      step: "drip_success",
    })

    return {
      signature,
      receiverAta: atas.receiverAta,
      tokenProgram,
    }
  } catch (error) {
    // Log error with context
    logError(error, {
      requestId,
      operation: "executeDrip",
      chainName,
      mintPrefix: params.mintAddress?.slice(0, 8),
      receiverPrefix: params.receiverAddress?.slice(0, 8),
    })

    // Map to structured error and re-throw
    throw mapProgramError(error, requestId)
  }
}

/**
 * Validates drip parameters
 */
export function validateDripParams(params: DripParams): void {
  if (!params.mintAddress || typeof params.mintAddress !== "string") {
    throw new Error("Invalid mint address")
  }

  if (!params.receiverAddress || typeof params.receiverAddress !== "string") {
    throw new Error("Invalid receiver address")
  }

  // Validate addresses using Kit's address() function
  ensureSolAddress(params.mintAddress)
  ensureSolAddress(params.receiverAddress)
}

/**
 * Estimate compute units for drip transaction
 */
export async function estimateDripComputeUnits(params: DripParams): Promise<number> {
  const requestId = params.requestId || randomUUID()

  try {
    logger.debug({
      message: "Estimating compute units for drip",
      requestId,
      step: "compute_estimation",
    })

    const config = loadSolanaDevnetConfig()
    const txContext = createSvmRpcClients(config)
    const payer = await createSvmSigner(config.payerPrivateKey)

    const mint = ensureSolAddress(params.mintAddress)
    const receiver = ensureSolAddress(params.receiverAddress)
    const tokenProgram = await detectTokenProgram(txContext.rpc, mint, requestId, config.commitment)

    const pdas = await deriveFaucetPdas(config.faucetProgram, mint, receiver, payer.address)
    const atas = await deriveFaucetAtas({
      receiverAddress: receiver,
      faucetSignerAddress: pdas.signer[0],
      mint,
      tokenProgram,
      requestId,
    })

    const instructionAccounts: DripInstructionAccounts = {
      payer: payer.address,
      relayer: payer.address,
      settings: pdas.settings[0],
      signerPda: pdas.signer[0],
      mint,
      mintConfig: pdas.mintConfig[0],
      faucetVault: atas.faucetVault,
      receiver,
      receiverAta: atas.receiverAta,
      userState: pdas.userState[0],
      operatorEntry: pdas.operatorEntry[0],
      tokenProgram,
    }

    const dripInstruction = getDripInstruction(config.faucetProgram, instructionAccounts)
    const txManager = new SvmTransactionManager(txContext)

    // Use minimal compute budget for simulation
    const simulationBudget: ComputeBudgetConfig = {
      computeUnitLimit: 200_000,
      computeUnitPrice: 1n, // Minimal price for simulation
    }

    const { computeUnitsConsumed } = await txManager.simulateTransaction(
      payer,
      [dripInstruction],
      requestId,
      simulationBudget
    )

    logger.debug({
      message: "Compute units estimated",
      requestId,
      computeUnitsConsumed,
      step: "compute_estimation_complete",
    })

    return computeUnitsConsumed
  } catch (error) {
    logError(error, {
      requestId,
      operation: "estimateDripComputeUnits",
    })

    throw mapProgramError(error, requestId)
  }
}
