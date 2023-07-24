type AccountsChangedListener = (eventName: "accountsChanged", callback: (accounts: string[]) => void) => void

type ChainChangedListener = (eventName: "chainChanged", callback: (chain: string) => void) => void

/**
 * EIP-1193: Ethereum Provider JavaScript API
 * https://eips.ethereum.org/EIPS/eip-1193
 */

export type RequestOptions = {
  method: string
  params?: Record<string, unknown>[]
}

export interface EIP1139Provider {
  request: <T>({ method, params }: RequestOptions) => Promise<T>
  on: ChainChangedListener & AccountsChangedListener
  removeListener: AccountsChangedListener & ChainChangedListener
}

export function isEIP1139Provider(provider: unknown): provider is EIP1139Provider {
  if (!provider || typeof provider !== "object") return false
  const request = "request" in provider && provider.request
  const on = "on" in provider && provider.on
  const removeListener = "removeListener" in provider && provider.removeListener
  return !!(request && on && removeListener)
}
