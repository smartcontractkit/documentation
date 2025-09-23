/**
 * RPC-related types and interfaces
 */

import type { Rpc, RpcSubscriptions, SolanaRpcApi, SolanaRpcSubscriptionsApi } from "@solana/kit"

/**
 * RPC context for transaction operations
 * Compatible with legacy SvmTxContext
 */
export interface IRpcContext {
  rpc: Rpc<SolanaRpcApi>
  rpcSubscriptions?: RpcSubscriptions<SolanaRpcSubscriptionsApi>
  commitment: "processed" | "confirmed" | "finalized"
}
