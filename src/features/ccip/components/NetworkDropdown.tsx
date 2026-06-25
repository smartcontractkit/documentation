/** @jsxImportSource react */
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import styles from "./networkDropdown.module.css"
import button from "@chainlink/design-system/button.module.css"
import walletStyles from "./WalletConnection.module.css"
import { Contract, BrowserProvider, toQuantity } from "ethers"
import { burnMintAbi } from "@features/abi/index.ts"
import { useNetworkChangeStorage } from "@hooks/useLocalStorage.ts"
import { SupportedChain } from "@config/index.ts"
import { EIP1193Provider } from "../../utils/EIP1193Interface.ts"
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
  provider: EIP1193Provider
}

function getProviderErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message?: unknown }).message ?? "")
  return "Unknown error"
}

function getProviderErrorCode(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "code" in error)
    return (error as { code?: unknown }).code as number | string
  return undefined
}

function isUserRejectedRequest(error: unknown): boolean {
  const code = getProviderErrorCode(error)
  if (code === 4001 || code === "4001") return true
  const message = getProviderErrorMessage(error).toLowerCase()
  return message.includes("user rejected") || message.includes("rejected the request")
}

function isUnknownChainError(error: unknown): boolean {
  const code = getProviderErrorCode(error)
  if (code === 4902 || code === "4902") return true
  const message = getProviderErrorMessage(error).toLowerCase()
  return (
    message.includes("unrecognized chain") ||
    message.includes("unknown chain") ||
    message.includes("chain is not added") ||
    message.includes("not been added") ||
    message.includes("does not exist") ||
    message.includes("unknown network")
  )
}

function isAlreadyAddedNetworkError(error: unknown): boolean {
  const message = getProviderErrorMessage(error).toLowerCase()
  return (
    (message.includes("already") && message.includes("added")) ||
    (message.includes("already") && message.includes("exists")) ||
    message.includes("already exists")
  )
}

const EXCLUDED_CHAIN_RDDS = new Set<string>([
  "dogeos-testnet-chikyu",
  "doge-os-chikyu-testnet",
  "ethereum-testnet-hoodi-morph",
  "adi-testnet",
  "ronin-testnet-saigon",
])

export const NetworkDropdown = ({ userAddress, provider }: Props) => {
  const [walletChain, setWalletChain] = useState<SupportedChain | undefined>(undefined)
  const [selectedChain, setSelectedChain] = useState<SupportedChain>("ETHEREUM_SEPOLIA")
  const [walletNetworkStatus, setWalletNetworkStatus] = useState<"unknown" | "missing" | "present">("unknown")
  const [isNetworkChangePending, setIsNetworkChangePending] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<LoadingState>(LoadingState.START)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [mintBnMTokenButtonDisabled, setMintBnMTokenButtonDisabled] = useState<boolean>(false)
  const [mintLnMTokenButtonDisabled, setMintLnMTokenButtonDisabled] = useState<boolean>(false)
  const detailsElementRef = useRef<HTMLDetailsElement | null>(null)

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
      .filter(({ chainRdd }) => !EXCLUDED_CHAIN_RDDS.has(chainRdd))
      .filter(({ supportedChain }) => {
        // Only include EVM chains since this is an EVM wallet flow
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

  const supportedChains = useMemo(() => evmChains.map(({ supportedChain }) => supportedChain), [evmChains])

  useEffect(() => {
    if (supportedChains.length === 0) return
    if (supportedChains.includes(selectedChain)) return
    const fallback = supportedChains.includes("ETHEREUM_SEPOLIA") ? "ETHEREUM_SEPOLIA" : supportedChains[0]
    setSelectedChain(fallback)
  }, [selectedChain, supportedChains])

  useEffect(() => {
    setWalletNetworkStatus("unknown")
  }, [selectedChain])

  useEffect(() => {
    if (walletChain === selectedChain) {
      setWalletNetworkStatus("present")
    }
  }, [selectedChain, walletChain])

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
      setWalletChain(supportedChainFromHexChainId(chainHexId))
      setIsLoading(LoadingState.START)
    }
    const refElement = detailsElementRef?.current

    const getCurrentChain = async () => {
      if (!provider) return undefined

      const chainHexId = await provider.request<string>({
        method: "eth_chainId",
        params: [],
      })
      provider.on("chainChanged", handleChainChanged)
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
      setWalletChain(chain)
    })

    document.body.addEventListener("mouseup", onClick)

    // ✅ Cleanup both click and chain change listeners
    return () => {
      document.body.removeEventListener("mouseup", onClick)
      provider?.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [provider])

  const isProviderConnected = (() => {
    try {
      return provider?.isConnected?.() ?? true
    } catch {
      return true
    }
  })()
  const dropdownDisabled = !isProviderConnected || isNetworkChangePending

  // ✅  Simplified error guard - don't require stack property
  const isSwitchNetworkError = (e: unknown): e is { code: number; message?: string } => {
    return !!(e && typeof e === "object" && "code" in e)
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const switchToSelectedChain = async () => {
    const chainId = getChainId(selectedChain)
    if (!chainId) {
      showToastMessage("chainId not found for selected network.")
      return
    }
    const chainHexId = toQuantity(chainId)

    setIsNetworkChangePending(true)
    setNetworkChangePending(true)

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHexId }],
      })
      setWalletNetworkStatus("present")
    } catch (switchError: unknown) {
      if (isUserRejectedRequest(switchError)) {
        showToastMessage("Network switch request rejected in wallet.")
        return
      }
      if (isUnknownChainError(switchError) || (isSwitchNetworkError(switchError) && switchError.code === 4902)) {
        setWalletNetworkStatus("missing")
        showToastMessage("This network isn't added to your wallet yet. Click Add network.")
        return
      }
      showToastMessage(`Network switch failed: ${getProviderErrorMessage(switchError)}`)
      return
    } finally {
      setIsNetworkChangePending(false)
      setNetworkChangePending(false)
    }
  }

  const addSelectedChain = async () => {
    const chainId = getChainId(selectedChain)
    if (!chainId) {
      showToastMessage("chainId not found for selected network.")
      return
    }
    const chainHexId = toQuantity(chainId)

    setIsNetworkChangePending(true)
    setNetworkChangePending(true)

    try {
      const params = getEthereumChainParameter(chainHexId)
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [params],
      })
      setWalletNetworkStatus("present")
      showToastMessage("Network added. Now click Switch network to continue.")
    } catch (addError: unknown) {
      if (isUserRejectedRequest(addError)) {
        showToastMessage("Add network request rejected in wallet.")
        return
      }
      if (isAlreadyAddedNetworkError(addError)) {
        setWalletNetworkStatus("present")
        showToastMessage("Network already exists in your wallet. Now click Switch network to continue.")
        return
      }
      showToastMessage(`Failed to add network: ${getProviderErrorMessage(addError)}`)
      return
    } finally {
      setIsNetworkChangePending(false)
      setNetworkChangePending(false)
    }
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
    if (walletChain !== selectedChain) return

    const params = getBnMParams({ supportedChain: selectedChain, version: Version.V1_2_0 })
    if (!params) return

    try {
      validateEIP1193Provider(provider)
      const success = await provider.request<boolean>({
        method: "wallet_watchAsset",
        params,
      })

      if (!success) {
        showToastMessage(`Couldn't add ${params.options.symbol} to your wallet.`)
      } else {
        showToastMessage(`${params.options.symbol} added to wallet.`)
      }
    } catch (error) {
      showToastMessage(`Failed to add token to wallet: ${getProviderErrorMessage(error)}`)
    }
  }

  const addLnMAssetToWallet = async () => {
    if (walletChain !== selectedChain) return
    const params = getLnMParams({ supportedChain: selectedChain, version: Version.V1_2_0 })
    if (!params) return

    try {
      validateEIP1193Provider(provider)
      const success = await provider.request<boolean>({
        method: "wallet_watchAsset",
        params,
      })

      if (!success) {
        showToastMessage(`Couldn't add ${params.options.symbol} to your wallet.`)
      } else {
        showToastMessage(`${params.options.symbol} added to wallet.`)
      }
    } catch (error) {
      showToastMessage(`Failed to add token to wallet: ${getProviderErrorMessage(error)}`)
    }
  }

  const mintBnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintBnMTokenButtonDisabled(true)
    if (walletChain !== selectedChain) return

    const params = getBnMParams({ supportedChain: selectedChain, version: Version.V1_2_0 })
    if (!params) return
    const { address: ccipBNMContractAddress } = params.options

    const ethersProvider = new BrowserProvider(provider)
    const signer = await ethersProvider.getSigner()
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
      extraInfo2: selectedChain, // chainId
    })
  }

  const mintLnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintLnMTokenButtonDisabled(true)
    if (walletChain !== selectedChain) return

    const params = getLnMParams({ supportedChain: selectedChain, version: Version.V1_2_0 })
    if (!params) return
    const { address: ccipLNMContractAddress } = params.options

    const ethersProvider = new BrowserProvider(provider)
    const signer = await ethersProvider.getSigner()
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
      extraInfo2: selectedChain, // chainId
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
                      selectedChain === undefined
                        ? "https://smartcontract.imgix.net/icons/alert.svg"
                        : getChainIcon(selectedChain)
                    }
                    style={{ marginRight: "var(--space-2x)" }}
                  />
                  <span
                    style={{
                      color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                    }}
                  >
                    Confirm in wallet...
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={
                      selectedChain === undefined
                        ? "https://smartcontract.imgix.net/icons/alert.svg"
                        : getChainIcon(selectedChain)
                    }
                    style={{ marginRight: "var(--space-2x)", minHeight: "1.2em", minWidth: "1.2em" }}
                  />
                  <span
                    style={{
                      color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                    }}
                  >
                    {selectedChain ? getTitle(selectedChain) : "Unknown network"}
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
                const selectedChainTitle = selectedChain ? getTitle(selectedChain) : null
                return (
                  <li
                    className={supportedChainTitle === selectedChainTitle ? styles["selected-option"] : styles.option}
                    key={supportedChainTitle}
                  >
                    <button
                      onClick={() => {
                        setSelectedChain(supportedChain)
                        setWalletNetworkStatus("unknown")
                        closeDropdown()
                      }}
                      className="text-200"
                    >
                      <span>
                        <img src={getChainIcon(supportedChain)} style={{ minHeight: "1em", minWidth: "1em" }} />
                        {supportedChainTitle}
                      </span>
                      {supportedChainTitle === selectedChainTitle && (
                        <img src="https://smartcontract.imgix.net/icons/check_circle_bold.svg" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </details>
        {walletChain === selectedChain ? (
          isBnMOrLnM({ chain: selectedChain, version: Version.V1_2_0 }) ? (
            <div className={walletStyles.connectedContainer}>
              {/* Enhanced Connection Status with Address - All info in one box */}
              <div className={walletStyles.connectionStatus}>
                <div className={walletStyles.statusWithNetwork}>
                  <div>
                    <span>Connected to wallet on {getTitle(selectedChain)}</span>
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
                {isBnM({ chain: selectedChain, version: Version.V1_2_0 }) && (
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

                {isLnM({ chain: selectedChain, version: Version.V1_2_0 }).supported &&
                  isLnM({ chain: selectedChain, version: Version.V1_2_0 }).supportedChainForLock === selectedChain && (
                    <>
                      {isBnM({ chain: selectedChain, version: Version.V1_2_0 }) && (
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
                  {isBnM({ chain: selectedChain, version: Version.V1_2_0 }) && (
                    <div className={walletStyles.actionTooltip} data-tooltip="Add token to wallet for easy tracking">
                      <button
                        className={`${button.secondary} ${walletStyles.secondaryAction}`}
                        onClick={async () => {
                          await addBnMAssetToWallet()
                        }}
                        aria-label="Add CCIP-BnM token to wallet"
                      >
                        Add CCIP-BnM to wallet
                      </button>
                    </div>
                  )}

                  {isLnM({ chain: selectedChain, version: Version.V1_2_0 }).supported && (
                    <div className={walletStyles.actionTooltip} data-tooltip="Add token to wallet for easy tracking">
                      <button
                        className={`${button.secondary} ${walletStyles.secondaryAction}`}
                        onClick={async () => {
                          await addLnMAssetToWallet()
                        }}
                        aria-label="Add CCIP-LnM token to wallet"
                      >
                        Add CCIP-LnM to wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {showToast && <Toast message={toastMessage} onClose={closeToast} />}
            </div>
          ) : (
            <p>
              While CCIP does support this network, there are no test tokens available for it. Select a different
              network network from the dropdown menu.
            </p>
          )
        ) : (
          <>
            <div className={styles.unknownNetworkWarning} role="alert" aria-live="polite">
              <div className={`paragraph-100 ${styles.warningContent}`}>
                <img
                  className={styles.warningIcon}
                  src="https://smartcontract.imgix.net/icons/alert.svg"
                  alt=""
                  aria-hidden="true"
                />
                <div className={styles.warningText}>
                  <div>
                    {walletChain ? "Please switch to the correct network" : "Please switch to a supported network"}
                  </div>
                  <div className={styles.warningInstruction}>
                    Click the network dropdown above to select a different network.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.networkCtas}>
              <button
                type="button"
                className={`${button.primary} ${walletStyles.connectButton}`}
                onClick={switchToSelectedChain}
                disabled={isNetworkChangePending || walletNetworkStatus === "missing"}
                aria-label={`Switch wallet network to ${getTitle(selectedChain)}`}
              >
                Switch to {getTitle(selectedChain)}
              </button>
              {walletNetworkStatus !== "present" && (
                <button
                  type="button"
                  className={`${button.secondary} ${walletStyles.secondaryAction}`}
                  onClick={addSelectedChain}
                  disabled={isNetworkChangePending}
                  aria-label={`Add ${getTitle(selectedChain)} network to wallet`}
                  title="Add this network to your wallet (if needed)."
                >
                  Add {getTitle(selectedChain)}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
