/** @jsxImportSource react */
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import styles from "./networkDropdown.module.css"
import button from "@chainlink/design-system/button.module.css"
import walletStyles from "./WalletConnection.module.css"
import { Contract, BrowserProvider, toQuantity } from "ethers"
import { burnMintAbi } from "@features/abi/index.ts"
import { useMetaMaskProvider } from "@hooks/useEIP6963Providers.tsx"
import { useNetworkChangeStorage } from "@hooks/useLocalStorage.ts"
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
import { ErrorBoundary } from "../../../components/ErrorBoundary.tsx"

enum LoadingState {
  "START",
  "LOADING...",
  "ERROR",
  "END",
}

interface Props {
  userAddress: string
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
  const { setNetworkChangePending } = useNetworkChangeStorage()
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

      const chainHexId = await metaMaskProvider.request<string>({
        method: "eth_chainId",
        params: [],
      })
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
      setNetworkChangePending(false)
    }

    setActiveChain(chain)
    setIsLoading(LoadingState.START)
    closeDropdown()
  }

  // ✅  Wallet-agnostic EIP-1193 provider validation
  const validateEIP1193Provider = (provider: unknown) => {
    if (!provider || typeof provider !== "object" || !("request" in provider)) {
      throw new Error("No EIP-1193 provider available.")
    }
    // EIP-6963 providers are pre-validated by the hook
    // No need for wallet-specific checks
  }

  const addBnMAssetToWallet = async () => {
    if (!activeChain) return

    const params = getBnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return

    if (!metaMaskProvider) {
      return
    }

    validateEIP1193Provider(metaMaskProvider)
    const success = await metaMaskProvider.request<boolean>({
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

    validateEIP1193Provider(metaMaskProvider)
    const success = await metaMaskProvider.request<boolean>({
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
    <ErrorBoundary>
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
            <ul style={{ listStyle: "none" }}>
              {evmChains.map(({ supportedChain }) => {
                const supportedChainTitle = getTitle(supportedChain)
                const activeChainTitle = activeChain ? getTitle(activeChain) : null
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
          </div>
        </details>
        {activeChain !== undefined ? (
          isBnMOrLnM({ chain: activeChain, version: Version.V1_2_0 }) ? (
            <div className={walletStyles.connectedContainer}>
              {/* Enhanced Connection Status with Address - All info in one box */}
              <div className={walletStyles.connectionStatus}>
                <div className={walletStyles.statusWithNetwork}>
                  <div>
                    <span>Connected to MetaMask on {getTitle(activeChain)}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      fontFamily: "monospace",
                      marginTop: "var(--space-1x)",
                      cursor: "pointer",
                      opacity: 0.9,
                    }}
                    onClick={() => navigator.clipboard.writeText(userAddress)}
                    title="Click to copy address"
                  >
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className={walletStyles.actionSection}>
                {/* Primary Actions - Mint Tokens */}
                {activeChain && isBnM({ chain: activeChain, version: Version.V1_2_0 }) && (
                  <div className={walletStyles.primaryAction}>
                    <div className={walletStyles.actionTooltip} data-tooltip="Get free CCIP-BnM tokens for testing">
                      <button
                        className={`${button.primary} ${walletStyles.connectButton} ${mintBnMTokenButtonDisabled ? walletStyles.loadingState : ""}`}
                        onClick={mintBnMTokens}
                        disabled={mintBnMTokenButtonDisabled}
                        aria-label="Mint 1 CCIP-BnM test token to your wallet"
                      >
                        {mintBnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-BnM Token"}
                      </button>
                    </div>
                  </div>
                )}

                {activeChain &&
                  isLnM({ chain: activeChain, version: Version.V1_2_0 }).supported &&
                  isLnM({ chain: activeChain, version: Version.V1_2_0 }).supportedChainForLock === activeChain && (
                    <>
                      {activeChain && isBnM({ chain: activeChain, version: Version.V1_2_0 }) && (
                        <div className={walletStyles.tokenDivider}></div>
                      )}
                      <div className={walletStyles.primaryAction}>
                        <div className={walletStyles.actionTooltip} data-tooltip="Get free CCIP-LnM tokens for testing">
                          <button
                            className={`${button.primary} ${walletStyles.connectButton} ${mintLnMTokenButtonDisabled ? walletStyles.loadingState : ""}`}
                            onClick={mintLnMTokens}
                            disabled={mintLnMTokenButtonDisabled}
                            aria-label="Mint 1 CCIP-LnM test token to your wallet"
                          >
                            {mintLnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-LnM Token"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                {/* Secondary Actions - Progressive Disclosure */}
                <div className={walletStyles.secondaryActions}>
                  {activeChain && isBnM({ chain: activeChain, version: Version.V1_2_0 }) && (
                    <div className={walletStyles.actionTooltip} data-tooltip="Add token to MetaMask for easy tracking">
                      <button
                        className={`${button.secondary} ${walletStyles.secondaryAction}`}
                        onClick={async () => {
                          await addBnMAssetToWallet()
                        }}
                        aria-label="Add CCIP-BnM token to your wallet"
                      >
                        Add CCIP-BnM to wallet
                      </button>
                    </div>
                  )}

                  {activeChain && isLnM({ chain: activeChain, version: Version.V1_2_0 }).supported && (
                    <div className={walletStyles.actionTooltip} data-tooltip="Add token to MetaMask for easy tracking">
                      <button
                        className={`${button.secondary} ${walletStyles.secondaryAction}`}
                        onClick={async () => {
                          await addLnMAssetToWallet()
                        }}
                        aria-label="Add CCIP-LnM token to your wallet"
                      >
                        Add CCIP-LnM to wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isLoading === LoadingState.ERROR && showToast && <Toast message={toastMessage} onClose={closeToast} />}
              {isLoading === LoadingState.END && showToast && <Toast message={toastMessage} onClose={closeToast} />}
            </div>
          ) : (
            <p>
              While CCIP does support this network, there are no test tokens available for it. Select a different
              network network from the dropdown menu.
            </p>
          )
        ) : (
          <div className={styles.unknownNetworkWarning} role="alert" aria-live="polite">
            <div className={`paragraph-100 ${styles.warningContent}`}>
              <img
                className={styles.warningIcon}
                src="https://smartcontract.imgix.net/icons/alert.svg"
                alt=""
                aria-hidden="true"
              />
              <div className={styles.warningText}>
                <div>Please switch to a supported network</div>
                <div className={styles.warningInstruction}>
                  Click &quot;Unknown network&quot; above to select a different network.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
