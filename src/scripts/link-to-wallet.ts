import { MetaMaskInpageProvider } from "@metamask/providers"
import detectEthereumProvider from "@metamask/detect-provider"
import { BrowserProvider, ethers, toQuantity } from "ethers"
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
 * @param ethereum ethereum inpage provider (e.g.: provider loaded by Metamask)
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
 * @param ethereum ethereum in page provider (e.g.: provider loaded by Metamask)
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
  const errorMessage = error instanceof Error ? error.message : "Unknown error"
  console.error(`${context}:`, errorMessage)
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
    await validateLinkAddress(address, provider)
    await addAssetToWallet(ethereum, parameters)
    return true
  } catch (error) {
    handleWalletError(error, "Failed to validate/add token")
    return false
  }
}

const handleWalletTokenManagement = async () => {
  try {
    const ethereum = (await detectEthereumProvider()) as MetaMaskInpageProvider
    if (!ethereum?.isMetaMask) {
      throw new Error("MetaMask not detected")
    }

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

        if (chainId === detectedChainId) {
          button.innerText = addToWalletText
          button.onclick = async () => {
            await validateAndAddToken(address, provider, ethereum, parameters)
          }
        } else {
          button.innerText = switchToNetworkText
          button.title = `Switch to network ${chainId} before adding the Link token`
          button.onclick = async () => {
            window.dispatchEvent(
              new CustomEvent(initChainChangeEventName, {
                detail: { chainId },
              })
            )

            const switchSuccess = await handleChainSwitch(chainId, ethereum)
            if (switchSuccess) {
              // Get a fresh provider after network change
              const updatedProvider = new BrowserProvider(ethereum)
              const addSuccess = await validateAndAddToken(address, updatedProvider, ethereum, parameters)
              if (addSuccess) {
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
