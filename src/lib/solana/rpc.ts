import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  type Rpc,
  type SolanaRpcApi,
  type RpcSubscriptions,
  type SolanaRpcSubscriptionsApi,
} from "@solana/kit"
import type { SvmConfig } from "./config.ts"

export const prerender = false

/**
 * SVM Transaction Context with real Kit RPC clients
 */
export interface SvmTxContext {
  rpc: Rpc<SolanaRpcApi>
  rpcSubscriptions?: RpcSubscriptions<SolanaRpcSubscriptionsApi>
  commitment: "processed" | "confirmed" | "finalized"
}

/**
 * Create RPC clients from configuration using Kit
 */
export function createSvmRpcClients(config: SvmConfig): SvmTxContext {
  const rpc = createSolanaRpc(config.rpcUrl)

  const rpcSubscriptions = config.wsUrl ? createSolanaRpcSubscriptions(config.wsUrl) : undefined

  return {
    rpc,
    rpcSubscriptions,
    commitment: config.commitment,
  }
}
