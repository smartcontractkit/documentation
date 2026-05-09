import { createSolanaRpc } from "@solana/kit"
import type { IRpcContext } from "./types.ts"

/**
 * Creates an RPC context for Solana operations using Kit
 * Provides both regular RPC and subscription capabilities
 */
export function createRpcContext(config: {
  url: string
  commitment: "processed" | "confirmed" | "finalized"
}): IRpcContext {
  const rpc = createSolanaRpc(config.url)

  // For now, subscriptions are optional
  const rpcSubscriptions = undefined

  return {
    rpc,
    rpcSubscriptions,
    commitment: config.commitment,
  }
}
