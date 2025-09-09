import { MetaMaskInpageProvider } from "@metamask/providers"
import { BrowserProvider, ethers, toQuantity } from "ethers"
import LinkToken from "@chainlink/contracts/abi/v0.8/LinkToken.json" with { type: "json" }
import chains from "./reference/chains.json" with { type: "json" }
import linkNameSymbol from "./reference/linkNameSymbol.json" with { type: "json" }
import buttonStyles from "@chainlink/design-system/button.module.css"

const chainlinkLogo = "https://docs.chain.link/images/logo.png"

// EIP-6963 types
interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: MetaMaskInpageProvider
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider"
  detail: EIP6963ProviderDetail
}

interface ExtendedEthereumProvider extends MetaMaskInpageProvider {
  isPhantom?: boolean
  isRabby?: boolean
}

const separator = "_"
const addressPattern = "0x[0-9a-fA-F]{40}"
const hexStringPattern = "(0x|0X)[a-fA-F0-9]+"
// Test to follow this pattern: chainId_address (e.g.: 1_0x514910771af9ca656af840dff83e8264ecf986ca)
const pattern = new RegExp(`^[0-9]+${separator}${addressPattern}$`)
const linkToken = {
  name: "ChainLink Token",
  symbol: "LINK",
  decimals: 18,
}
const addToWalletText = "Add to wallet"
const switchToNetworkText = "Switch network and add to wallet"
const initChainChangeEventName = "InitChainChange"

/**
 * Converts a number to HexString (a string which has a 0x prefix followed by any number of nibbles (i.e. case-insensitive hexadecimal characters, 0-9 and a-f).)
 */
const toHex = toQuantity

/**
 * Check that the format of ethereum address is valid
 * @param address Ethereum address
 * @returns boolean true if format is valid. False otherwise
 */
const isAddressFormatValid = (address: string): boolean => {
  const pattern = new RegExp(`^${addressPattern}$`)
  return pattern.test(address)
}

/**
 * Check that the format of a chainId is hexString
 * (a string which has a 0x prefix followed by any number of nibbles (i.e. case-insensitive hexadecimal characters, 0-9 and a-f).))
 * @param chainId
 * @returns boolean: true if chainId is hexString. False otherwise
 */
const isChainIdFormatValid = (chainId: string): boolean => {
  const pattern = new RegExp(`^${hexStringPattern}$`)
  return pattern.test(chainId)
}

interface AddToWalletParameters {
  type: string
  address: string
  symbol: string
  decimals: number
  image?: string
}

interface AddEthereumChainParameter {
  chainId: string
  blockExplorerUrls?: string[]
  chainName?: string
  iconUrls?: string[]
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls?: string[]
}

interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

interface ChainChangeEvent extends CustomEvent {
  detail: {
    chainId: string | number
  }
}

interface HTMLTokenElement extends HTMLElement {
  id: string
}

const defaultWalletParameters: AddToWalletParameters = {
  type: "ERC20",
  address: "",
  symbol: linkToken.symbol,
  decimals: linkToken.decimals,
  image: chainlinkLogo,
}

/**
 * Detect MetaMask specifically using EIP-6963
 * @returns Promise<MetaMaskInpageProvider | null>
 */
const detectMetaMaskViaEIP6963 = (): Promise<MetaMaskInpageProvider | null> => {
  return new Promise((resolve) => {
    let resolved = false

    const handleAnnouncement = (event: Event) => {
      const providerEvent = event as EIP6963AnnounceProviderEvent
      const { info, provider } = providerEvent.detail

      // Check for MetaMask specifically by RDNS
      if (info.rdns === "io.metamask" || info.rdns === "io.metamask.flask") {
        if (!resolved) {
          resolved = true
          window.removeEventListener("eip6963:announceProvider", handleAnnouncement)
          resolve(provider)
        }
      }
    }

    // Listen for provider announcements
    window.addEventListener("eip6963:announceProvider", handleAnnouncement)

    // Request providers to announce themselves
    window.dispatchEvent(new Event("eip6963:requestProvider"))

    // Timeout after 3 seconds if no MetaMask found
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        window.removeEventListener("eip6963:announceProvider", handleAnnouncement)

        // Fallback: Check if window.ethereum is actually MetaMask
        // This is less reliable but provides backward compatibility
        const ethereum = (window as { ethereum?: MetaMaskInpageProvider }).ethereum
        const extendedEthereum = ethereum as ExtendedEthereumProvider
        if (ethereum?.isMetaMask && !extendedEthereum.isPhantom && !extendedEthereum.isRabby) {
          console.warn("Using fallback MetaMask detection. Please update MetaMask for better compatibility.")
          resolve(ethereum)
        } else {
          resolve(null)
        }
      }
    }, 3000)
  })
}

/**
 * Validate that the in page ethereum provider is loaded
 * @param ethereum : InPageProvider
 */
const validateEthereumApi = (ethereum: MetaMaskInpageProvider) => {
  if (!ethereum || !ethereum.isMetaMask) {
    throw new Error(`Something went wrong. Add to wallet is called while an ethereum object not detected.`)
  }
}

/**
 *  Add asset (e.g.: Link token) to wallet
 * @param ethereum inpage provider (e.g.: provider loaded by Metamask)
 * @param parameters
 */
const addAssetToWallet = async (ethereum: MetaMaskInpageProvider, parameters: AddToWalletParameters) => {
  validateEthereumApi(ethereum)
  const success = await ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: parameters.type,
      options: {
        address: parameters.address,
        symbol: parameters.symbol,
        decimals: parameters.decimals,
        image: parameters.image,
      },
    },
  })

  if (success) {
    console.log(`${parameters.symbol} of address ${parameters.address} successfully added to the wallet`)
  } else {
    throw new Error(
      `Something went wrong. ${parameters.symbol} of address ${parameters.address} not added to the wallet`
    )
  }
}

/**
 * Call this function to make the wallet switch to the desired chain
 * @param chainId designed chain in HexString
 * @param ethereum inpage provider (e.g.: provider loaded by Metamask)
 */
const switchToChain = async (chainId: string, ethereum: MetaMaskInpageProvider) => {
  if (!isChainIdFormatValid(chainId)) {
    throw new Error(`chainId '${chainId}' must be hexString`)
  }

  // First verify the chain exists in our reference data
  const chain = chains.find((c) => toHex(c.chainId) === chainId)
  if (!chain) {
    throw new Error(`Chain with chainId '${chainId}' not found in reference data`)
  }

  validateEthereumApi(ethereum)
  const result = await ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    })
    .catch((error) => {
      throw error
    })

  // Verify the chain was actually switched
  const newChainId = (await ethereum.request({ method: "eth_chainId" })) as string

  if (toHex(parseInt(newChainId)) !== chainId) {
    throw new Error("Chain switch failed - network did not change")
  }

  console.log(`Successfully switched to chain ${chainId} in metamask`)
  return result
}

/**
 * Call this function to add a new chain to the wallet. Should only be called if the chain doesn't exist already in the wallet
 * @param chainId designed chain in HexString
 * @param ethereum in page provider (e.g.: provider loaded by Metamask)
 */
const addChainToWallet = async (chainId: string, ethereum: MetaMaskInpageProvider) => {
  if (!isChainIdFormatValid(chainId)) {
    throw new Error(`chainId '${chainId}' must be hexString`)
  }
  validateEthereumApi(ethereum)

  interface Chain {
    chainId: number
    name: string
    nativeCurrency?: {
      name: string
      symbol: string
      decimals: number
    }
    explorers?: Array<{ url: string }>
    infoURL: string
    rpc: string[]
  }

  const chain = chains.find((c: Chain) => toHex(c.chainId) === chainId)

  if (!chain || !chain.chainId) {
    throw new Error(`Chain with chainId '${chainId}' not found in reference data`)
  }

  const params: AddEthereumChainParameter = {
    chainId,
    chainName: chain.name,
    nativeCurrency: chain?.nativeCurrency,
    blockExplorerUrls:
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? chain.explorers.map((explorer: { url: string }) => explorer.url)
        : [chain.infoURL],
    rpcUrls: chain.rpc,
  }

  const [signerAddress] = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[]

  const result = await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [params, signerAddress],
  })
  console.log(`Chain ${chainId} of params ${JSON.stringify(params)} successfully added to wallet`)
  return result
}

/**
 * Functions which validates the format of Link address and interface with the contract to make sure
 * its metadata (e.g.: symbol) is valid
 * @param address
 * @param provider
 */
const validateLinkAddress = async (address: string, provider: BrowserProvider) => {
  if (!isAddressFormatValid(address)) {
    throw new Error(`Something went wrong. format of address '${address}' not correct`)
  }

  const linkContract = new ethers.Contract(address, LinkToken, provider)
  let name = ""
  let symbol = ""
  let decimals = 0
  let retries = 3

  while (retries > 0) {
    try {
      const initialNetwork = await provider.getNetwork()
      const initialChainId = initialNetwork.chainId

      // Fetch contract metadata
      ;[name, symbol, decimals] = await Promise.all([
        linkContract.name(),
        linkContract.symbol(),
        linkContract.decimals(),
      ])

      // Verify network hasn't changed
      const currentNetwork = await provider.getNetwork()
      if (currentNetwork.chainId !== initialChainId) {
        throw new Error(`Network changed during operation: ${initialChainId} => ${currentNetwork.chainId}`)
      }

      break // If we get here, all operations succeeded
    } catch (error) {
      retries--
      if (retries === 0) {
        throw new Error(`Error occurred while trying to fetch linkContract metadata: ${error}`)
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000))
      continue
    }
  }

  const network = await provider.getNetwork()
  const chainIdStr = network.chainId.toString()

  let chainId: keyof typeof linkNameSymbol
  if (Object.keys(linkNameSymbol).includes(chainIdStr)) {
    chainId = chainIdStr as keyof typeof linkNameSymbol
  } else {
    throw new Error(`Error chain ${chainIdStr} not found in reference data`)
  }

  const linkAttributes = linkNameSymbol[chainId]

  if (!linkAttributes || !linkAttributes.name || !linkAttributes.symbol) {
    throw new Error(`Error linkContract attributes. data ${linkAttributes} for chain ${chainId} corrupted`)
  }

  if (name !== linkAttributes.name) {
    throw new Error(`Error linkContract name. '${name}' !== '${linkAttributes.name}'`)
  }
  if (symbol !== linkAttributes.symbol) {
    throw new Error(`Error linkContract symbol. '${symbol}' !== '${linkAttributes.symbol}'`)
  }
  if (linkToken.decimals !== Number(decimals)) {
    throw new Error(`Error linkContract decimals. '${linkToken.decimals}' !== '${decimals}'`)
  }
}

/**
 * Safely handles wallet errors with proper typing and logging
 * @param error The error to handle
 * @param context Context message for the error
 * @returns void
 */
const handleWalletError = (error: unknown, context: string): void => {
  // Provide more specific error messages for common issues
  if (error && typeof error === "object" && "code" in error) {
    const err = error as ProviderRpcError
    switch (err.code) {
      case 4001:
        console.log(`${context}: User rejected the request`)
        break
      case 4902:
        console.log(`${context}: Unrecognized chain. Please add it to MetaMask.`)
        break
      case -32002:
        console.log(`${context}: Request already pending. Please check MetaMask.`)
        break
      case -32603:
        console.log(`${context}: Internal error. Please try again.`)
        break
      default:
        console.error(`${context}: Error code ${err.code} - ${err.message}`)
    }
  } else {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error(`${context}:`, errorMessage)
  }
}

/**
 * Manages chain switching and addition with proper error handling
 * @param targetChainId The chain ID to switch to
 * @param ethereum The MetaMask provider
 * @returns Promise<boolean> True if successful
 */
const handleChainSwitch = async (targetChainId: string, ethereum: MetaMaskInpageProvider): Promise<boolean> => {
  const currentChainId = (await ethereum.request({ method: "eth_chainId" })) as string
  const formattedCurrentChainId = toHex(parseInt(currentChainId))

  if (formattedCurrentChainId === targetChainId) {
    return true
  }

  try {
    await switchToChain(targetChainId, ethereum)
    // Wait for network change to settle
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Verify we're on the correct network
    const newChainId = (await ethereum.request({ method: "eth_chainId" })) as string
    const formattedNewChainId = toHex(parseInt(newChainId))
    if (formattedNewChainId !== targetChainId) {
      throw new Error(`Network switch verification failed. Expected ${targetChainId}, got ${formattedNewChainId}`)
    }

    return true
  } catch (switchError) {
    if ((switchError as ProviderRpcError)?.code === 4902) {
      try {
        await addChainToWallet(targetChainId, ethereum)
        await switchToChain(targetChainId, ethereum)
        // Wait for network change to settle
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Verify we're on the correct network
        const newChainId = (await ethereum.request({ method: "eth_chainId" })) as string
        const formattedNewChainId = toHex(parseInt(newChainId))
        if (formattedNewChainId !== targetChainId) {
          throw new Error(`Network switch verification failed. Expected ${targetChainId}, got ${formattedNewChainId}`)
        }

        return true
      } catch (error) {
        handleWalletError(error, `Failed to add chain ${targetChainId}`)
        return false
      }
    }

    if ((switchError as ProviderRpcError)?.code === 4001) {
      handleWalletError(switchError, `User rejected the request to switch to chain ${targetChainId}`)
      return false
    }

    handleWalletError(switchError, `Failed to switch to chain ${targetChainId}`)
    return false
  }
}

/**
 * Validates and adds a token to the wallet
 * @param address Token address
 * @param provider Ethers provider
 * @param ethereum MetaMask provider
 * @param parameters Token parameters
 * @returns Promise<boolean> True if successful
 */
const validateAndAddToken = async (
  address: string,
  provider: BrowserProvider,
  ethereum: MetaMaskInpageProvider,
  parameters: AddToWalletParameters
): Promise<boolean> => {
  try {
    // Validate the LINK token contract
    console.log(`Validating LINK token at address ${address}...`)
    await validateLinkAddress(address, provider)

    // Add to wallet
    console.log(`Adding LINK token to MetaMask...`)
    await addAssetToWallet(ethereum, parameters)

    console.log(`Successfully added LINK token (${address}) to MetaMask`)
    return true
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const err = error as ProviderRpcError
      if (err.code === 4001) {
        console.log("User declined to add the token to MetaMask")
        return false
      }
    }
    handleWalletError(error, "Failed to add LINK token")
    return false
  }
}

const handleWalletTokenManagement = async () => {
  try {
    // Use EIP-6963 to detect MetaMask specifically
    const ethereum = await detectMetaMaskViaEIP6963()

    if (!ethereum) {
      console.log("MetaMask not found. Wallet features will not be available.")
      console.log("Please install MetaMask to use the 'Add to Wallet' feature.")
      return // Exit gracefully if MetaMask is not found
    }

    console.log("MetaMask detected via EIP-6963")

    // Check if already connected
    let accounts: string[] = []
    try {
      accounts = (await ethereum.request({ method: "eth_accounts" })) as string[]
    } catch (error) {
      console.error("Failed to check MetaMask connection status:", error)
    }

    const isConnected = accounts && accounts.length > 0

    const provider = new BrowserProvider(ethereum)

    let detectedChainId = (await ethereum.request({
      method: "eth_chainId",
    })) as string | null

    if (!detectedChainId) {
      throw new Error("Failed to detect current chain ID")
    }

    detectedChainId = toHex(parseInt(detectedChainId))
    if (!isChainIdFormatValid(detectedChainId)) {
      throw new Error(`Invalid detected chain ID format: ${detectedChainId}`)
    }

    let chainFromSwitch: string
    window.addEventListener(initChainChangeEventName, (evt: ChainChangeEvent) => {
      chainFromSwitch = toHex(parseInt(evt.detail.chainId.toString()))
      if (!isChainIdFormatValid(chainFromSwitch)) {
        handleWalletError(new Error(`Invalid chain ID format: ${chainFromSwitch}`), "Chain change event")
      }
    })

    ethereum.on("chainChanged", (chainId: string) => {
      if (chainId !== detectedChainId && chainFromSwitch !== chainId) {
        window.location.reload()
      }
    })

    const tokenAddressElements = Array.from(document.getElementsByClassName("erc-token-address")) as HTMLTokenElement[]

    for (const element of tokenAddressElements) {
      const id = element.id
      if (!pattern.test(id)) {
        console.error(`Invalid element id format: ${id || "empty"}. Expected format: chainId_address`)
        continue
      }

      try {
        let [chainId, address] = id.split(separator)
        chainId = toHex(parseInt(chainId))
        if (!isChainIdFormatValid(chainId)) {
          throw new Error(`Invalid chain ID format: ${chainId}`)
        }

        const button = document.createElement("button")
        button.className = `${buttonStyles.secondary} linkToWalletBtn`
        button.style.marginLeft = "10px"
        button.style.fontSize = "12px"
        button.style.padding = "4px"

        const parameters: AddToWalletParameters = {
          ...defaultWalletParameters,
          address,
        }

        // Create a function to handle token addition
        const handleAddToken = async () => {
          // First check if connected
          const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[]
          if (!accounts || accounts.length === 0) {
            // Not connected, request connection first
            try {
              button.innerText = "Connecting..."
              button.disabled = true

              await ethereum.request({ method: "eth_requestAccounts" })

              // After connection, proceed with the original action
              button.disabled = false
            } catch (error) {
              button.disabled = false
              if ((error as ProviderRpcError).code === 4001) {
                console.log("User rejected connection request")
                button.innerText = chainId === detectedChainId ? addToWalletText : switchToNetworkText
                return
              }
              console.error("Failed to connect to MetaMask:", error)
              button.innerText = "Connection failed"
              setTimeout(() => {
                button.innerText = chainId === detectedChainId ? addToWalletText : switchToNetworkText
              }, 2000)
              return
            }
          }

          // Now handle the token addition
          if (chainId === detectedChainId) {
            button.innerText = "Adding token..."
            button.disabled = true
            const success = await validateAndAddToken(address, provider, ethereum, parameters)
            button.disabled = false
            if (success) {
              button.innerText = "✓ Added"
              setTimeout(() => {
                button.innerText = addToWalletText
              }, 2000)
            } else {
              button.innerText = "Failed to add"
              setTimeout(() => {
                button.innerText = addToWalletText
              }, 2000)
            }
          } else {
            // Need to switch network first
            window.dispatchEvent(
              new CustomEvent(initChainChangeEventName, {
                detail: { chainId },
              })
            )

            button.innerText = "Switching network..."
            button.disabled = true
            const switchSuccess = await handleChainSwitch(chainId, ethereum)
            button.disabled = false

            if (switchSuccess) {
              // Get a fresh provider after network change
              const updatedProvider = new BrowserProvider(ethereum)
              button.innerText = "Adding token..."
              const addSuccess = await validateAndAddToken(address, updatedProvider, ethereum, parameters)
              if (addSuccess) {
                button.innerText = "✓ Added"
                // Keep the success state visible - no need to reload
              } else {
                button.innerText = "Failed to add"
                setTimeout(() => {
                  button.innerText = switchToNetworkText
                }, 2000)
              }
            } else {
              button.innerText = "Network switch failed"
              setTimeout(() => {
                button.innerText = switchToNetworkText
              }, 2000)
            }
          }
        }

        if (chainId === detectedChainId) {
          button.innerText = isConnected ? addToWalletText : "Connect & Add to Wallet"
          button.onclick = handleAddToken
        } else {
          button.innerText = isConnected ? switchToNetworkText : "Connect, Switch & Add"
          button.title = `Switch to network ${chainId} before adding the Link token`
          button.onclick = handleAddToken
        }

        element.insertAdjacentElement("afterend", button)
      } catch (error) {
        handleWalletError(error, "Failed to process element")
      }
    }
  } catch (e) {
    handleWalletError(e, "Wallet management failed")
  }
}
handleWalletTokenManagement()
