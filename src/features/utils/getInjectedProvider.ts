import { EIP1139Provider, isEIP1139Provider } from "./EIP1139Interface"

interface MetamaskExternalProvider extends EIP1139Provider {
  isMetaMask: true
}

export interface InjectedProvider {
  isMetamask?: boolean
  isCoinbaseWallet?: boolean
}

type ProviderMatcher = (provider: InjectedProvider) => boolean

interface FetchAccountResponse {
  address: string
  chainId: number
}

const isMetamaskExternalProvider = (provider: unknown): provider is MetamaskExternalProvider => {
  return isEIP1139Provider(provider) && (provider as MetamaskExternalProvider).isMetaMask
}

const getMatchingProvider = (matcher: ProviderMatcher) => {
  if (!window.ethereum) return undefined

  const matchingProvider = window.ethereum.providers?.find(matcher)
  if (matchingProvider) return matchingProvider

  const windowEthereumMatches = matcher(window.ethereum)
  if (windowEthereumMatches) return window.ethereum

  return undefined
}

export function getInjectedProvider(matcher: ProviderMatcher, timeout = 3000): Promise<InjectedProvider | undefined> {
  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(undefined), timeout))

  const matchingProviderPromise = new Promise((resolve) => {
    const providerHandler = () => {
      const matchingProvider = getMatchingProvider(matcher)
      if (matchingProvider) {
        window.removeEventListener("ethereum#initialized", providerHandler)
        resolve(matchingProvider)
      }
    }

    // wait for ethereum event before trying to get a matching provider
    window.addEventListener("ethereum#initialized", providerHandler)

    // if there's already an injected provider, check if that one matches
    if (window.ethereum) {
      providerHandler()
    }
  })

  return Promise.race([
    timeoutPromise as Promise<InjectedProvider | undefined>,
    matchingProviderPromise as Promise<InjectedProvider | undefined>,
  ])
}

const fetchAccount = async (
  provider: MetamaskExternalProvider
): Promise<{ address: string; chainId: number } | null> => {
  const [[address], chainId] = await Promise.all([
    provider.request<string[]>({ method: "eth_accounts" }),
    provider.request<string>({ method: "eth_chainId" }),
  ])

  return address && chainId
    ? {
        address,
        chainId: parseInt(chainId, 16),
      }
    : null
}

export const checkConnection = async () => {
  if (isMetamaskExternalProvider(window.ethereum)) {
    const accountData: FetchAccountResponse | null = await fetchAccount(window.ethereum)
    return accountData
  }
  return undefined
}
