/** @jsxImportSource preact */
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import styles from "./networkDropdown.module.css"
import button from "@chainlink/design-system/button.module.css"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { ethers, Contract, utils } from "ethers"
import { burnMintAbi } from "@features/abi"
import { SupportedChain } from "@config"
import {
  getAllChains,
  getBnMParams,
  getLnMParams,
  isBnMOrLnMRdd,
  isLnM,
  isBnM,
  isBnMOrLnM,
  Version,
} from "@config/data/ccip"
import { Toast } from "./Toast"
import {
  directoryToSupportedChain,
  getTitle,
  getChainIcon,
  getEthereumChainParameter,
  getChainId,
} from "@features/utils"

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
  const closeDropdown = useCallback(() => {
    if (!detailsElementRef.current) return

    detailsElementRef.current.open = false
  }, [detailsElementRef])

  const supportedChains = getAllChains({ mainnetVersion: Version.V1_2_0, testnetVersion: Version.V1_2_0 }).map(
    (element) => directoryToSupportedChain(element)
  )

  const supportedChainFromHexChainId = (chainHexId: string) => {
    const supportedChain = supportedChains.find((supportedChain) => {
      const chainId = getChainId(supportedChain)
      if (!chainId) throw Error(`No chainId found for supported chain ${supportedChain}`)
      return utils.hexValue(chainId) === chainHexId
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
      const chainHexId = await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      })
      window.ethereum.on("chainChanged", handleChainChanged)
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
    return () => {
      document.body.removeEventListener("mouseup", onClick)
    }
  }, [activeChain])
  const dropdownDisabled = !window.ethereum.isConnected || isNetworkChangePending

  const isSwitchNetworkError = (error: unknown): error is SwitchNetworkError => {
    if (!error || typeof error !== "object") return false
    const isCode = "code" in error && error.code
    const isMessage = "message" in error && error.message
    const isStack = "stack" in error && error.stack
    return !!(isCode && isMessage && isStack)
  }

  const handleNetworkChange = async (chain: SupportedChain) => {
    const chainId = getChainId(chain)
    if (!chainId) throw Error(`chainId not found for ${chain}`)
    const chainHexId = utils.hexValue(chainId)
    if (!window.ethereum.isConnected) return
    setIsNetworkChangePending(true)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: chainHexId,
          },
        ],
      })
    } catch (switchError: unknown) {
      if (isSwitchNetworkError(switchError) && switchError.code === 4902) {
        const params = getEthereumChainParameter(chainHexId)
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [params],
        })
      } else {
        Promise.reject(switchError)
      }
    }

    setIsNetworkChangePending(false)
    localStorage.setItem("isNetworkChangePending", "false")
    setActiveChain(chain)
    setIsLoading(LoadingState.START)
    closeDropdown()
  }

  const validateEthereumApi = (ethereum: MetaMaskInpageProvider) => {
    if (!ethereum || !ethereum.isMetaMask) {
      throw new Error(`Something went wrong. Add to wallet is called while an ethereum object not detected.`)
    }
  }

  const addBnMAssetToWallet = async () => {
    if (!activeChain) return

    const params = getBnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return
    validateEthereumApi(window.ethereum)
    const success = await window.ethereum.request({
      method: "wallet_watchAsset",
      params,
    })

    if (success) {
      console.log(`${params.options.symbol} of address ${params.options.address} successfully added to the wallet`)
    } else {
      throw new Error(
        `Something went wrong. ${params.options.symbol} of address ${params.options.address} not added to the wallet`
      )
    }
  }

  const addLnMAssetToWallet = async () => {
    if (!activeChain) return
    const params = getLnMParams({ supportedChain: activeChain, version: Version.V1_2_0 })
    if (!params) return
    validateEthereumApi(window.ethereum)
    const success = await window.ethereum.request({
      method: "wallet_watchAsset",
      params,
    })

    if (success) {
      console.log(`${params.options.symbol} of address ${params.options.address} successfully added to the wallet`)
    } else {
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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const mintTokensContract = new Contract(ccipLNMContractAddress, burnMintAbi, signer)
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
              {getAllChains({ mainnetVersion: Version.V1_2_0, testnetVersion: Version.V1_2_0 }).map((chainRdd) => {
                if (isBnMOrLnMRdd({ chainRdd, version: Version.V1_2_0 })) {
                  const supportedChain = directoryToSupportedChain(chainRdd)
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
                } else {
                  return undefined
                }
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
                <div class="add-to-wallet-button">
                  <button
                    className={button.secondary}
                    style="margin: 1em;"
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
                <div class="add-to-wallet-button">
                  <hr />
                  <button
                    className={button.secondary}
                    style="margin: 1em;"
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
            {getAllChains({ mainnetVersion: Version.V1_2_0, testnetVersion: Version.V1_2_0 }).map((chainRdd) => {
              if (isBnMOrLnMRdd({ chainRdd, version: Version.V1_2_0 })) {
                const supportedChain = directoryToSupportedChain(chainRdd)
                const supportedChainTitle = getTitle(supportedChain)
                const chainIcon = getChainIcon(supportedChain)
                return (
                  <li style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
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
              } else {
                return undefined
              }
            })}
          </ul>
        </>
      )}
    </div>
  )
}
