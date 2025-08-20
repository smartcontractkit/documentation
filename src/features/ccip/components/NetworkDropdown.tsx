/** @jsxImportSource react */
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import styles from "./networkDropdown.module.css"
import button from "@chainlink/design-system/button.module.css"
import { Contract, BrowserProvider, toQuantity } from "ethers"
import { burnMintAbi } from "@features/abi/index.ts"
import { useMetaMaskProvider } from "@hooks/useEIP6963Providers.tsx"
import { SupportedChain } from "@config/index.ts"
import {
  getAllChains,
  getBnMParams,
  getLnMParams,
  isBnMOrLnMRdd,
  isLnM,
  isBnM,
  isBnMOrLnM,
  Version,
} from "@config/data/ccip/index.ts"
import { Toast } from "./Toast.tsx"
import {
  directoryToSupportedChain,
  getTitle,
  getChainIcon,
  getEthereumChainParameter,
  getChainId,
  getChainTypeAndFamily,
} from "@features/utils/index.ts"

enum LoadingState {
  "START",
  "LOADING...",
  "ERROR",
  "END",
}

interface Props {
  userAddress: string
}

interface SwitchNetworkError {
  code: number
  message: string
  stack: string
}

export const NetworkDropdown = ({ userAddress }: Props) => {
  const [activeChain, setActiveChain] = useState<SupportedChain | undefined>(undefined)
  const [isNetworkChangePending, setIsNetworkChangePending] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<LoadingState>(LoadingState.START)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [mintBnMTokenButtonDisabled, setMintBnMTokenButtonDisabled] = useState<boolean>(false)
  const [mintLnMTokenButtonDisabled, setMintLnMTokenButtonDisabled] = useState<boolean>(false)
  const detailsElementRef = useRef<HTMLDetailsElement | null>(null)

  // ✅ Use EIP-6963 to get MetaMask specifically (prevents Phantom conflicts)
  const metaMaskProvider = useMetaMaskProvider()
  const closeDropdown = useCallback(() => {
    if (!detailsElementRef.current) return

    detailsElementRef.current.open = false
  }, [detailsElementRef])

  // Pre-compute filtered and sorted EVM chains once
  const evmChains = useMemo(() => {
    return getAllChains({ mainnetVersion: Version.V1_2_0, testnetVersion: Version.V1_2_0 })
      .map((chainRdd) => ({
        chainRdd,
        supportedChain: directoryToSupportedChain(chainRdd),
      }))
      .filter(({ supportedChain }) => {
        // Only include EVM chains since this is for MetaMask
        try {
          const { chainFamily } = getChainTypeAndFamily(supportedChain)
          return chainFamily === "evm"
        } catch {
          return false
        }
      })
      .filter(({ chainRdd }) => isBnMOrLnMRdd({ chainRdd, version: Version.V1_2_0 }))
      .sort((a, b) => {
        // Sort chains alphabetically by their display title
        const titleA = getTitle(a.supportedChain) || a.chainRdd
        const titleB = getTitle(b.supportedChain) || b.chainRdd
        return titleA.localeCompare(titleB)
      })
  }, [])

  const supportedChains = evmChains.map(({ supportedChain }) => supportedChain)

  const supportedChainFromHexChainId = (chainHexId: string) => {
    const supportedChain = supportedChains.find((supportedChain) => {
      const chainId = getChainId(supportedChain)
      if (!chainId) throw Error(`No chainId found for supported chain ${supportedChain}`)
      return toQuantity(chainId) === chainHexId
    })

    return supportedChain
  }

  useEffect(() => {
    const handleChainChanged = (chainHexId: string) => {
      setActiveChain(supportedChainFromHexChainId(chainHexId))
      setIsLoading(LoadingState.START)
    }
    const refElement = detailsElementRef?.current

    const getCurrentChain = async () => {
      if (!metaMaskProvider) return undefined

      const chainHexId = (await metaMaskProvider.request({
        method: "eth_chainId",
        params: [],
      })) as string
      metaMaskProvider.on("chainChanged", handleChainChanged)
      const currentChain = supportedChainFromHexChainId(chainHexId)
      return currentChain
    }

    const onClick = (event: MouseEvent) => {
      if (!refElement) return

      const relatedTarget = event.target as HTMLElement | null
      if (refElement?.contains(relatedTarget)) return

      closeDropdown()
    }

    getCurrentChain().then((chain) => {
      setActiveChain(chain)
    })

    document.body.addEventListener("mouseup", onClick)

    // ✅ Cleanup both click and chain change listeners
    return () => {
      document.body.removeEventListener("mouseup", onClick)
      metaMaskProvider?.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [metaMaskProvider])

  // ✅  Call isConnected() as function, not property
  const isMMConnected = (() => {
    try {
      return metaMaskProvider?.isConnected?.() ?? false
    } catch {
      return false
    }
  })()
  const dropdownDisabled = !isMMConnected || isNetworkChangePending

  // ✅  Simplified error guard - don't require stack property
  const isSwitchNetworkError = (e: unknown): e is { code: number; message?: string } => {
    return !!(e && typeof e === "object" && "code" in e)
  }

  const handleNetworkChange = async (chain: SupportedChain) => {
    const chainId = getChainId(chain)
    if (!chainId) throw Error(`chainId not found for ${chain}`)
    const chainHexId = toQuantity(chainId)

    // ✅ MetaMask provider already available from hook

    // ✅  Use isConnected() function
    if (!metaMaskProvider || !metaMaskProvider.isConnected?.()) {
      return
    }

    setIsNetworkChangePending(true)

    try {
      await metaMaskProvider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: chainHexId,
          },
        ],
      })
    } catch (switchError: unknown) {
      if (isSwitchNetworkError(switchError) && switchError.code === 4902) {
        // Network not found, add it
        const params = getEthereumChainParameter(chainHexId)
        await metaMaskProvider.request({
          method: "wallet_addEthereumChain",
          params: [params],
        })
      } else {
        console.error("Network switch failed:", switchError)
        throw switchError
      }
    } finally {
      // ✅  Always clear pending flag
      setIsNetworkChangePending(false)
      localStorage.setItem("isNetworkChangePending", "false")
    }

    setActiveChain(chain)
    setIsLoading(LoadingState.START)
    closeDropdown()
  }

  // ✅  Improved validation with clearer messages
  const validateEthereumApi = (ethereum: any) => {
    if (!ethereum?.request) {
      throw new Error("No EIP-1193 provider available.")
    }
    if (!ethereum?.isMetaMask) {
      throw new Error("MetaMask provider not detected.")
    }
  }

  const addBnMAssetToWallet = async () => {
    if (!activeChain) return

    const params = getBnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return

    if (!metaMaskProvider) {
      return
    }

    validateEthereumApi(metaMaskProvider)
    const success = await metaMaskProvider.request({
      method: "wallet_watchAsset",
      params,
    })

    if (!success) {
      throw new Error(
        `Something went wrong. ${params.options.symbol} of address ${params.options.address} not added to the wallet`
      )
    }
  }

  const addLnMAssetToWallet = async () => {
    if (!activeChain) return
    const params = getLnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return

    if (!metaMaskProvider) {
      return
    }

    validateEthereumApi(metaMaskProvider)
    const success = await metaMaskProvider.request({
      method: "wallet_watchAsset",
      params,
    })

    if (!success) {
      throw new Error(
        `Something went wrong. ${params.options.symbol} of address ${params.options.address} not added to the wallet`
      )
    }
  }

  const mintBnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintBnMTokenButtonDisabled(true)
    if (!activeChain) return

    const params = getBnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return
    const { address: ccipBNMContractAddress } = params.options

    // ✅ Use MetaMask provider for minting
    if (!metaMaskProvider) {
      setMintBnMTokenButtonDisabled(false)
      return
    }
    const provider = new BrowserProvider(metaMaskProvider)
    const signer = await provider.getSigner()
    const mintTokensContract = new Contract(ccipBNMContractAddress, burnMintAbi, signer)
    try {
      const res = await mintTokensContract.drip(userAddress)
      if (!res) {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Something went wrong ! Check your wallet.")
        setIsLoading(LoadingState.ERROR)
        setShowToast(true)
        return
      }
      await res.wait()
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Transaction request denied.")
        setIsLoading(LoadingState.ERROR)
      } else {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Transaction failed to be included in the block. Check your wallet and try again.")
        setIsLoading(LoadingState.ERROR)
      }
      setShowToast(true)
      return
    }
    setMintBnMTokenButtonDisabled(false)
    setToastMessage("1 CCIP-BnM has been sent to your wallet !")
    setIsLoading(LoadingState.END)
    setShowToast(true)

    window.dataLayer.push({
      event: "docs_product_interaction",
      product: "CCIP",
      action: "ccip_token_minted",
      extraInfo1: "BnM",
      extraInfo2: activeChain, // chainId
    })
  }

  const mintLnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintLnMTokenButtonDisabled(true)
    if (!activeChain) return

    const params = getLnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return
    const { address: ccipLNMContractAddress } = params.options

    // ✅ Use MetaMask provider for LnM minting
    if (!metaMaskProvider) {
      setMintLnMTokenButtonDisabled(false)
      return
    }
    const provider = new BrowserProvider(metaMaskProvider)
    const signer = await provider.getSigner()
    const mintTokensContract = new Contract(ccipLNMContractAddress, burnMintAbi, signer)
    try {
      const res = await mintTokensContract.drip(userAddress)
      if (!res) {
        setMintLnMTokenButtonDisabled(false)
        setToastMessage("Something went wrong ! Check your wallet.")
        setIsLoading(LoadingState.ERROR)
        setShowToast(true)
        return
      }
      await res.wait()
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMintLnMTokenButtonDisabled(false)
        setToastMessage("Transaction request denied.")
        setIsLoading(LoadingState.ERROR)
      } else {
        setMintLnMTokenButtonDisabled(false)
        setToastMessage("Transaction failed to be included in the block. Check your wallet and try again.")
        setIsLoading(LoadingState.ERROR)
      }
      setShowToast(true)
      return
    }
    setMintLnMTokenButtonDisabled(false)
    setToastMessage("1 CCIP-LnM has been sent to your wallet !")
    setIsLoading(LoadingState.END)
    setShowToast(true)

    window.dataLayer.push({
      event: "docs_product_interaction",
      product: "CCIP",
      action: "ccip_token_minted",
      extraInfo1: "LnM",
      extraInfo2: activeChain, // chainId
    })
  }

  const closeToast = () => {
    setShowToast(false)
  }
  return (
    <div>
      <details
        data-testid="network-selector"
        ref={detailsElementRef}
        // This is so the component can't be focusable/opened from keyboard when it's disabled.
        tabIndex={dropdownDisabled ? -1 : undefined}
        className={[styles["network-selector-container"], ...(dropdownDisabled ? [styles.disabled] : [])].join(" ")}
      >
        <summary className={styles["network-selector-summary"]}>
          <div className={styles["network-selector"]}>
            {isNetworkChangePending ? (
              <>
                <img
                  src={
                    activeChain === undefined
                      ? "https://smartcontract.imgix.net/icons/alert.svg"
                      : getChainIcon(activeChain)
                  }
                  style={{ marginRight: "var(--space-2x)" }}
                />
                <span
                  style={{
                    color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                  }}
                >
                  Switching networks...
                </span>
              </>
            ) : (
              <>
                <img
                  src={
                    activeChain === undefined
                      ? "https://smartcontract.imgix.net/icons/alert.svg"
                      : getChainIcon(activeChain)
                  }
                  style={{ marginRight: "var(--space-2x)", minHeight: "1.2em", minWidth: "1.2em" }}
                />
                <span
                  style={{
                    color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                  }}
                >
                  {activeChain ? getTitle(activeChain) : "Unknown network"}
                </span>
              </>
            )}
            <img src="https://smartcontract.imgix.net/icons/Caret2.svg" />
          </div>
        </summary>
        <div className={styles["dropdown-container"]}>
          {activeChain ? (
            <ul style={{ listStyle: "none" }}>
              {evmChains.map(({ chainRdd, supportedChain }) => {
                const supportedChainTitle = getTitle(supportedChain)
                const activeChainTitle = getTitle(activeChain)
                return (
                  <li
                    className={supportedChainTitle === activeChainTitle ? styles["selected-option"] : styles.option}
                    key={supportedChainTitle}
                  >
                    <button onClick={() => handleNetworkChange(supportedChain)} className="text-200">
                      <span>
                        <img src={getChainIcon(supportedChain)} style={{ minHeight: "1em", minWidth: "1em" }} />
                        {supportedChainTitle}
                      </span>
                      {supportedChainTitle === activeChainTitle && (
                        <img src="https://smartcontract.imgix.net/icons/check_circle_bold.svg" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div
              style={{
                backgroundColor: "var(--red-100)",
                padding: "var(--space-4x)",
              }}
            >
              <p
                className="paragraph-100"
                style={{
                  margin: 0,
                  padding: 0,
                  color: "var(--color-text-info)",
                  display: "flex",
                  alignItems: "flex-start",
                  userSelect: "none",
                }}
              >
                <img
                  style={{
                    width: "var(--space-4x)",
                    height: "var(--space-4x)",
                    marginRight: "var(--space-2x)",
                  }}
                  src="https://smartcontract.imgix.net/icons/alert.svg"
                />
                Your wallet is connected to an unsupported network.
              </p>
            </div>
          )}
        </div>
      </details>
      {activeChain !== undefined ? (
        isBnMOrLnM({ chain: activeChain, version: Version.V1_2_0 }) ? (
          <>
            <div className="add-asset-button-container">
              {activeChain && isBnM({ chain: activeChain, version: Version.V1_2_0 }) && (
                <div className="add-to-wallet-button">
                  <button
                    className={button.secondary}
                    style={{ margin: "1em" }}
                    onClick={async () => {
                      await addBnMAssetToWallet()
                    }}
                  >
                    Add CCIP-BnM to wallet
                  </button>
                  <button className={button.primary} onClick={mintBnMTokens} disabled={mintBnMTokenButtonDisabled}>
                    {mintBnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-BnM Token"}
                  </button>
                </div>
              )}
              {activeChain && isLnM({ chain: activeChain, version: Version.V1_2_0 }).supported && (
                <div className="add-to-wallet-button">
                  <hr />
                  <button
                    className={button.secondary}
                    style={{ margin: "1em" }}
                    onClick={async () => {
                      await addLnMAssetToWallet()
                    }}
                  >
                    Add CCIP-LnM to wallet
                  </button>
                  {isLnM({ chain: activeChain, version: Version.V1_2_0 }).supportedChainForLock === activeChain ? (
                    <button className={button.primary} onClick={mintLnMTokens} disabled={mintLnMTokenButtonDisabled}>
                      {mintLnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-LnM Token"}
                    </button>
                  ) : null}
                </div>
              )}
            </div>
            {isLoading === LoadingState.ERROR && showToast && <Toast message={toastMessage} onClose={closeToast} />}
            {isLoading === LoadingState.END && showToast && <Toast message={toastMessage} onClose={closeToast} />}
          </>
        ) : (
          <p>
            While CCIP does support this network, there are no test tokens available for it. Select a different network
            network from the dropdown menu.
          </p>
        )
      ) : (
        <>
          <p>Chainlink CCIP does not support this network. Switch your wallet to a supported network. </p>
          <ul style={{ marginTop: "1.5rem" }}>
            {evmChains.map(({ chainRdd, supportedChain }) => {
              const supportedChainTitle = getTitle(supportedChain)
              const chainIcon = getChainIcon(supportedChain)
              return (
                <li
                  key={supportedChain}
                  style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", width: "9.673rem" }}>
                    <img
                      style={{
                        width: "var(--space-4x)",
                        height: "var(--space-4x)",
                        marginRight: "var(--space-3x)",
                      }}
                      src={chainIcon}
                      alt="chain icon"
                    />
                    {supportedChainTitle}
                  </div>
                  <button
                    className={button.secondary}
                    onClick={async () => {
                      await handleNetworkChange(supportedChain)
                    }}
                  >
                    Switch to Network
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
