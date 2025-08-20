// Export Solana utilities for CCIP features
export { isValidSolAddress, ensureSolAddress, validateSolAddresses } from "./address.ts"

// Export drip flow utilities
export {
  executeDrip,
  validateDripParams,
  estimateDripComputeUnits,
  type DripResult,
  type DripParams,
} from "./drip-flow.ts"

// Export RPC context
export { type SvmTxContext } from "./rpc.ts"

// Export wallet layer for dApp integration
export * from "./wallet/index.ts"
