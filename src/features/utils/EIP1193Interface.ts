/**
 * EIP-1193: Ethereum Provider JavaScript API
 * https://eips.ethereum.org/EIPS/eip-1193
 *
 * Comprehensive interface supporting all standard wallet events and methods
 */

export type RequestOptions = {
  method: string
  params?: unknown[] | Record<string, unknown> | unknown
}

/**
 * Wallet event handlers for all standard events
 */
interface WalletEventHandlers {
  // EIP-1193 standard events
  (eventName: "accountsChanged", handler: (accounts: string[]) => void): void
  (eventName: "chainChanged", handler: (chainId: string) => void): void

  // Connection events (MetaMask and other wallets)
  (eventName: "connect", handler: (connectInfo: { chainId: string }) => void): void
  (eventName: "disconnect", handler: (error: { code?: number; message?: string }) => void): void

  // Generic event handler for extensibility
  (eventName: string, handler: (...args: unknown[]) => void): void
}

export interface EIP1193Provider {
  request: <T = unknown>(args: RequestOptions) => Promise<T>
  on: WalletEventHandlers
  removeListener: WalletEventHandlers
  isMetaMask?: boolean
  isConnected?: () => boolean
  providers?: EIP1193Provider[]
}

export function isEIP1193Provider(provider: unknown): provider is EIP1193Provider {
  if (!provider || typeof provider !== "object") return false
  const request = "request" in provider && provider.request
  const on = "on" in provider && provider.on
  const removeListener = "removeListener" in provider && provider.removeListener
  return !!(request && on && removeListener)
}
