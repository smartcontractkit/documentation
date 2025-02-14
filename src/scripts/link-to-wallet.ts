import { MetaMaskInpageProvider } from "@metamask/providers"
import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumberish, BrowserProvider, ethers, toQuantity } from "ethers"
import LinkToken from "@chainlink/contracts/abi/v0.8/LinkToken.json" assert { type: "json" }
import chains from "./reference/chains.json" assert { type: "json" }
import linkNameSymbol from "./reference/linkNameSymbol.json" assert { type: "json" }
import buttonStyles from "@chainlink/design-system/button.module.css"

const chainlinkLogo = "https://docs.chain.link/images/logo.png"

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
  console.debug("[addAssetToWallet] Starting to add asset:", parameters)
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
  console.debug("[addAssetToWallet] Request result:", success)

  if (success) {
    console.debug(`[addAssetToWallet] Successfully added ${parameters.symbol} (${parameters.address})`)
    console.log(`${parameters.symbol} of address ${parameters.address} successfully added to the wallet`)
  } else {
    console.debug(`[addAssetToWallet] Failed to add ${parameters.symbol} (${parameters.address})`)
    throw new Error(
      `Something went wrong. ${parameters.symbol} of address ${parameters.address} not added to the wallet`
    )
  }
}

/**
 * Call this function to make the wallet switch to the desired chain
 * @param chainId designed chain in HexString
 * @param ethereum ethereum inpage provider (e.g.: provider loaded by Metamask)
 */
const switchToChain = async (chainId: string, ethereum: MetaMaskInpageProvider) => {
  console.debug("[switchToChain] Attempting to switch to chain:", chainId)
  if (!isChainIdFormatValid(chainId)) {
    console.debug("[switchToChain] Invalid chainId format:", chainId)
    throw new Error(`chainId '${chainId}' must be hexString`)
  }

  // First verify the chain exists in our reference data
  const chain = chains.find((c) => toHex(c.chainId) === chainId)
  if (!chain) {
    console.debug("[switchToChain] Chain not found in reference data:", chainId)
    throw new Error(`Chain with chainId '${chainId}' not found in reference data`)
  }
  console.debug("[switchToChain] Found chain configuration:", chain)

  validateEthereumApi(ethereum)
  try {
    console.debug("[switchToChain] Sending wallet_switchEthereumChain request")
    const result = await ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
      .catch((error) => {
        console.debug("[switchToChain] Request failed with error:", error)
        throw error
      })

    console.debug(`[switchToChain] Switch chain request result:`, result)

    // Verify the chain was actually switched
    const newChainId = (await ethereum.request({ method: "eth_chainId" })) as string
    console.debug("[switchToChain] New chain ID after switch:", newChainId)

    if (toHex(parseInt(newChainId)) !== chainId) {
      console.debug("[switchToChain] Chain switch verification failed", {
        expected: chainId,
        actual: newChainId,
      })
      throw new Error("Chain switch failed - network did not change")
    }

    console.log(`Successfully switched to chain ${chainId} in metamask`)
    return result
  } catch (error) {
    console.debug("[switchToChain] Switch chain request failed:", {
      error,
      code: (error as ProviderRpcError)?.code,
      message: (error as ProviderRpcError)?.message,
      data: (error as ProviderRpcError)?.data,
    })
    throw error
  }
}

/**
 * Call this function to add a new chain to the wallet. Should only be called if the chain doesn't exist already in the wallet
 * @param chainId designed chain in HexString
 * @param ethereum ethereum in page provider (e.g.: provider loaded by Metamask)
 */
const addChainToWallet = async (chainId: string, ethereum: MetaMaskInpageProvider) => {
  console.debug("[addChainToWallet] Starting to add chain:", chainId)
  if (!isChainIdFormatValid(chainId)) {
    console.debug("[addChainToWallet] Invalid chainId format:", chainId)
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
  console.debug("[addChainToWallet] Found chain configuration:", chain)

  if (!chain || !chain.chainId) {
    console.debug("[addChainToWallet] Chain not found in reference data:", chainId)
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
  console.debug("[addChainToWallet] Prepared chain parameters:", params)

  try {
    console.debug("[addChainToWallet] Requesting accounts")
    const [signerAddress] = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[]
    console.debug("[addChainToWallet] Got signer address:", signerAddress)

    console.debug("[addChainToWallet] Sending wallet_addEthereumChain request")
    const result = await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params, signerAddress],
    })
    console.debug("[addChainToWallet] Add chain request result:", result)
    console.log(`Chain ${chainId} of params ${JSON.stringify(params)} successfully added to wallet`)
    return result
  } catch (error) {
    console.debug("[addChainToWallet] Add chain request failed:", error)
    throw error
  }
}

/**
 * Functions which validates the format of Link address and interface with the contract to make sure
 * its metadata (e.g.: symbol) is valid
 * @param address
 * @param provider
 */
const validateLinkAddress = async (address: string, provider: BrowserProvider) => {
  console.debug("[validateLinkAddress] Starting validation for address:", address)
  if (!isAddressFormatValid(address)) {
    console.debug("[validateLinkAddress] Invalid address format:", address)
    throw new Error(`Something went wrong. format of address '${address}' not correct`)
  }

  console.debug("[validateLinkAddress] Creating contract instance")
  const linkContract = new ethers.Contract(address, LinkToken, provider)
  let name: string, symbol: string, decimals: BigNumberish
  try {
    console.debug("[validateLinkAddress] Fetching contract metadata")
    name = await linkContract.name()
    symbol = await linkContract.symbol()
    decimals = await linkContract.decimals()
    console.debug("[validateLinkAddress] Contract metadata:", { name, symbol, decimals })
  } catch (error) {
    console.debug("[validateLinkAddress] Failed to fetch contract metadata:", error)
    throw new Error(`Error occurred while trying to fetch linkContract metadata  ${error}`)
  }

  console.debug("[validateLinkAddress] Getting network details")
  const network = await provider.getNetwork()
  const chainIdStr = network.chainId.toString()
  console.debug("[validateLinkAddress] Current chainId:", chainIdStr)

  let chainId: keyof typeof linkNameSymbol
  if (Object.keys(linkNameSymbol).includes(chainIdStr)) {
    chainId = chainIdStr as keyof typeof linkNameSymbol
  } else {
    console.debug("[validateLinkAddress] Chain not found in reference data:", chainIdStr)
    throw new Error(`Error chain ${chainIdStr} not found in reference data`)
  }

  const linkAttributes = linkNameSymbol[chainId]
  console.debug("[validateLinkAddress] Link attributes for chain:", linkAttributes)

  if (!linkAttributes || !linkAttributes.name || !linkAttributes.symbol) {
    console.debug("[validateLinkAddress] Invalid link attributes:", linkAttributes)
    throw new Error(`Error linkContract attributes. data ${linkAttributes} for chain ${chainId} corrupted`)
  }

  // Validate contract details
  console.debug("[validateLinkAddress] Validating contract details", {
    expected: linkAttributes,
    actual: { name, symbol, decimals },
  })

  if (name !== linkAttributes.name) {
    console.debug("[validateLinkAddress] Name mismatch:", { expected: linkAttributes.name, actual: name })
    throw new Error(`Error linkContract name. '${name}' !== '${linkAttributes.name}'`)
  }
  if (symbol !== linkAttributes.symbol) {
    console.debug("[validateLinkAddress] Symbol mismatch:", { expected: linkAttributes.symbol, actual: symbol })
    throw new Error(`Error linkContract symbol. '${symbol}' !== '${linkAttributes.symbol}'`)
  }
  if (linkToken.decimals !== Number(decimals)) {
    throw new Error(`Error linkContract decimals. '${linkToken.decimals}' !== '${decimals}'`)
  }
  console.debug("[validateLinkAddress] Validation successful")
}

/**
 * Safely handles wallet errors with proper typing and logging
 * @param error The error to handle
 * @param context Context message for the error
 * @returns void
 */
const handleWalletError = (error: unknown, context: string): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error"
  console.debug(`[handleWalletError] ${context}:`, { error, errorMessage })
  console.error(`${context}:`, errorMessage)
  // Could be extended to show user-friendly notifications
}

/**
 * Manages chain switching and addition with proper error handling
 * @param targetChainId The chain ID to switch to
 * @param ethereum The MetaMask provider
 * @param provider The ethers provider
 * @returns Promise<boolean> True if successful
 */
const handleChainSwitch = async (
  targetChainId: string,
  ethereum: MetaMaskInpageProvider,
  provider: BrowserProvider
): Promise<boolean> => {
  console.debug("[handleChainSwitch] Starting chain switch to:", targetChainId)

  // First check if we're already on the target chain
  const currentChainId = (await ethereum.request({ method: "eth_chainId" })) as string
  const formattedCurrentChainId = toHex(parseInt(currentChainId))
  console.debug("[handleChainSwitch] Current chain:", formattedCurrentChainId, "Target chain:", targetChainId)

  if (formattedCurrentChainId === targetChainId) {
    console.debug("[handleChainSwitch] Already on target chain")
    return true
  }

  try {
    await switchToChain(targetChainId, ethereum)
    console.debug("[handleChainSwitch] Chain switch successful")
    return true
  } catch (switchError) {
    console.debug("[handleChainSwitch] Switch failed, error:", {
      error: switchError,
      code: (switchError as ProviderRpcError)?.code,
      message: (switchError as ProviderRpcError)?.message,
      data: (switchError as ProviderRpcError)?.data,
    })

    // Check if the chain needs to be added first
    if ((switchError as ProviderRpcError)?.code === 4902) {
      console.debug("[handleChainSwitch] Chain not added, attempting to add chain")
      try {
        await addChainToWallet(targetChainId, ethereum)
        console.debug("[handleChainSwitch] Chain added successfully, attempting to switch again")
        // After adding the chain, try switching again
        await switchToChain(targetChainId, ethereum)
        console.debug("[handleChainSwitch] Second switch attempt successful")
        return true
      } catch (error) {
        console.debug("[handleChainSwitch] Add chain failed:", {
          error,
          code: (error as ProviderRpcError)?.code,
          message: (error as ProviderRpcError)?.message,
          data: (error as ProviderRpcError)?.data,
        })
        handleWalletError(error, `Failed to add chain ${targetChainId}`)
        return false
      }
    }

    // Handle user rejection (code 4001) separately
    if ((switchError as ProviderRpcError)?.code === 4001) {
      console.debug("[handleChainSwitch] User rejected the request")
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
  console.debug("[validateAndAddToken] Starting token validation and addition:", { address, parameters })
  try {
    await validateLinkAddress(address, provider)
    console.debug("[validateAndAddToken] Address validated, adding to wallet")
    await addAssetToWallet(ethereum, parameters)
    console.debug("[validateAndAddToken] Token successfully added")
    return true
  } catch (error) {
    handleWalletError(error, "Failed to validate/add token")
    return false
  }
}

const handleWalletTokenManagement = async () => {
  console.debug("[handleWalletTokenManagement] Starting wallet token management")
  try {
    const ethereum = (await detectEthereumProvider()) as MetaMaskInpageProvider
    console.debug("[handleWalletTokenManagement] Provider detected:", !!ethereum)
    if (!ethereum?.isMetaMask) {
      throw new Error("MetaMask not detected")
    }

    const provider = new BrowserProvider(ethereum)
    console.debug("[handleWalletTokenManagement] BrowserProvider created")

    let detectedChainId = (await ethereum.request({
      method: "eth_chainId",
    })) as string | null
    console.debug("[handleWalletTokenManagement] Detected chain ID:", detectedChainId)

    if (!detectedChainId) {
      throw new Error("Failed to detect current chain ID")
    }

    detectedChainId = toHex(parseInt(detectedChainId))
    console.debug("[handleWalletTokenManagement] Formatted chain ID:", detectedChainId)
    if (!isChainIdFormatValid(detectedChainId)) {
      throw new Error(`Invalid detected chain ID format: ${detectedChainId}`)
    }

    let chainFromSwitch: string
    window.addEventListener(initChainChangeEventName, (evt: ChainChangeEvent) => {
      chainFromSwitch = toHex(parseInt(evt.detail.chainId.toString()))
      console.debug("[handleWalletTokenManagement] Chain change event:", { chainFromSwitch })
      if (!isChainIdFormatValid(chainFromSwitch)) {
        handleWalletError(new Error(`Invalid chain ID format: ${chainFromSwitch}`), "Chain change event")
      }
    })

    ethereum.on("chainChanged", (chainId: string) => {
      console.debug("[handleWalletTokenManagement] Chain changed:", {
        chainId,
        detectedChainId,
        chainFromSwitch,
      })
      if (chainId !== detectedChainId && chainFromSwitch !== chainId) {
        console.debug("[handleWalletTokenManagement] Reloading page due to chain change")
        window.location.reload()
      }
    })

    const tokenAddressElements = Array.from(document.getElementsByClassName("erc-token-address")) as HTMLTokenElement[]
    console.debug("[handleWalletTokenManagement] Found token elements:", tokenAddressElements.length)

    for (const element of tokenAddressElements) {
      const id = element.id
      console.debug("[handleWalletTokenManagement] Processing element:", { id })
      if (!pattern.test(id)) {
        console.error(`Invalid element id format: ${id || "empty"}. Expected format: chainId_address`)
        continue
      }

      try {
        let [chainId, address] = id.split(separator)
        chainId = toHex(parseInt(chainId))
        console.debug("[handleWalletTokenManagement] Parsed element data:", { chainId, address })
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

        if (chainId === detectedChainId) {
          console.debug("[handleWalletTokenManagement] Same chain, adding direct add button")
          button.innerText = addToWalletText
          button.onclick = async () => {
            await validateAndAddToken(address, provider, ethereum, parameters)
          }
        } else {
          console.debug("[handleWalletTokenManagement] Different chain, adding switch chain button")
          button.innerText = switchToNetworkText
          button.title = `Switch to network ${chainId} before adding the Link token`
          button.onclick = async () => {
            console.debug("[handleWalletTokenManagement] Switch chain button clicked:", { chainId })
            window.dispatchEvent(
              new CustomEvent(initChainChangeEventName, {
                detail: { chainId },
              })
            )

            const switchSuccess = await handleChainSwitch(chainId, ethereum, provider)
            console.debug("[handleWalletTokenManagement] Chain switch result:", switchSuccess)
            if (switchSuccess) {
              const addSuccess = await validateAndAddToken(address, provider, ethereum, parameters)
              console.debug("[handleWalletTokenManagement] Token addition result:", addSuccess)
              if (addSuccess) {
                console.debug("[handleWalletTokenManagement] Reloading page after successful operations")
                window.location.reload()
              }
            }
          }
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
