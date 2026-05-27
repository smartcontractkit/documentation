/** @jsxImportSource react */
import button from "@chainlink/design-system/button.module.css"
import walletStyles from "./WalletConnection.module.css"

import { useEffect, useMemo, useRef, useState } from "react"
import { NetworkDropdown } from "./NetworkDropdown.tsx"
import { useWalletSelector } from "@hooks/useEIP6963Providers.tsx"
import { useWalletConnectionStorage } from "@hooks/useLocalStorage.ts"
import { EIP1193Provider } from "../../utils/EIP1193Interface.ts"
import { Toast } from "./Toast.tsx"
import { WalletErrorBoundary } from "../../../components/ErrorBoundary.tsx"
import { WalletSetupGate } from "./WalletSetupGate.tsx"
import "./container.css"

interface ConnectInfo {
  chainId: string
}

interface DisconnectError {
  code?: number
  message?: string
}

function getProviderErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  if (error && typeof error === "object" && "message" in error) return String((error as { message?: unknown }).message ?? "")
  return "Unknown error"
}

function getProviderErrorCode(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "code" in error) return (error as { code?: unknown }).code as number | string
  return undefined
}

export const MintTokenButton = () => {
  // ✅ SSR Guard: Return loading state during server-side rendering
  if (typeof window === "undefined") {
    return (
      <div className="mint-component">
        <p>Loading wallet interface...</p>
      </div>
    )
  }

  const [userAddress, setUserAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [walletCheckCount, setWalletCheckCount] = useState<number>(0)

  const { walletOptions } = useWalletSelector()
  const [selectedWalletUuid, setSelectedWalletUuid] = useState<string | null>(null)
  const { saveConnectionState } = useWalletConnectionStorage()
  const providerSessionIdRef = useRef(0)

  const evmWalletOptions = useMemo(() => {
    // Temporarily exclude Phantom from the EVM faucet wallet picker.
    return walletOptions.filter((w) => !w.isPhantom)
  }, [walletOptions])

  useEffect(() => {
    if (!selectedWalletUuid) return
    if (evmWalletOptions.some((w) => w.uuid === selectedWalletUuid)) return
    setSelectedWalletUuid(null)
  }, [evmWalletOptions, selectedWalletUuid])

  const selectedWallet = useMemo(() => {
    if (evmWalletOptions.length === 0) return null
    return selectedWalletUuid ? evmWalletOptions.find((w) => w.uuid === selectedWalletUuid) ?? null : null
  }, [evmWalletOptions, selectedWalletUuid])

  const selectedProvider = selectedWallet?.provider ?? null

  useEffect(() => {
    // Any time the selected provider changes (or is cleared), invalidate in-flight async work.
    providerSessionIdRef.current += 1
    const sessionId = providerSessionIdRef.current

    if (!selectedProvider) {
      setIsWalletConnected(false)
      setUserAddress("")
      return
    }

    // Listen to events on the selected EIP-1193 provider
    const handleAccountsChanged = (accounts: string[]) => {
      const nextAddress = accounts && accounts.length > 0 ? accounts[0] : ""
      setIsWalletConnected(nextAddress !== "")
      setUserAddress(nextAddress)
    }

    const handleConnect = (connectInfo: ConnectInfo) => {
      console.log("🔗 Wallet connected:", connectInfo)
    }

    const handleDisconnect = (error: DisconnectError) => {
      console.log("🔌 Wallet disconnected:", error)
      setIsWalletConnected(false)
      setUserAddress("")
    }

    selectedProvider.on("accountsChanged", handleAccountsChanged)
    selectedProvider.on("connect", handleConnect)
    selectedProvider.on("disconnect", handleDisconnect)

    const getAccount = async () => {
      try {
        const accounts = await selectedProvider.request<string[]>({
          method: "eth_accounts",
        })

        if (providerSessionIdRef.current !== sessionId) return

        if (accounts && accounts.length > 0) {
          setUserAddress(accounts[0])
          setIsWalletConnected(true)
          const chainHexId = await selectedProvider.request<string>({ method: "eth_chainId" })
          if (providerSessionIdRef.current !== sessionId) return
          saveConnectionState(accounts[0], chainHexId)
        } else {
          setIsWalletConnected(false)
          setUserAddress("")
        }
      } catch (error) {
        if (providerSessionIdRef.current !== sessionId) return
        setIsWalletConnected(false)
        setUserAddress("")
      }
    }
    getAccount()

    // ✅ Cleanup all event listeners
    return () => {
      selectedProvider.removeListener?.("accountsChanged", handleAccountsChanged)
      selectedProvider.removeListener?.("connect", handleConnect)
      selectedProvider.removeListener?.("disconnect", handleDisconnect)
    }
  }, [saveConnectionState, selectedProvider])

  // Add wallet detection refresh effect
  useEffect(() => {
    if (walletCheckCount > 0) {
      // Trigger EIP-6963 provider discovery again
      window.dispatchEvent(new Event("eip6963:requestProvider"))
    }
  }, [walletCheckCount])

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const closeToast = () => {
    setShowToast(false)
  }

  const validateEthApi = (provider: EIP1193Provider) => {
    if (!provider || !provider.request) {
      throw new Error(`Something went wrong. Connect wallet is called while a provider object is not detected.`)
    }
  }

  const connectToWallet = async () => {
    if (!selectedProvider) {
      showToastMessage("No injected EVM wallet found. Please install a browser wallet extension to continue.")
      return
    }

    // Invalidate any in-flight eth_accounts read so it can't overwrite a successful connect.
    providerSessionIdRef.current += 1
    const sessionId = providerSessionIdRef.current

    try {
      validateEthApi(selectedProvider)
      const addressList = await selectedProvider.request<string[]>({
        method: "eth_requestAccounts",
      })
      const currentChainId = await selectedProvider.request<string>({ method: "eth_chainId" })

      if (providerSessionIdRef.current !== sessionId) return

      const address = addressList && addressList.length > 0 ? addressList[0] : ""
      if (!address) {
        showToastMessage("No accounts returned by wallet. Please check your wallet and try again.")
        return
      }

      setUserAddress(address)
      setIsWalletConnected(true)
      saveConnectionState(address, currentChainId)
    } catch (error) {
      if (providerSessionIdRef.current !== sessionId) return
      const code = getProviderErrorCode(error)
      if (code === 4001 || code === "4001") {
        showToastMessage("Connection request rejected in wallet.")
        return
      }
      showToastMessage(`Something went wrong: ${getProviderErrorMessage(error)}`)
    }
  }

  return (
    <WalletErrorBoundary>
      <WalletSetupGate
        hasWallet={evmWalletOptions.length > 0}
        walletName="Injected EVM wallet"
        suggestedWallets={["Rabby", "MetaMask"]}
        installLinks={[
          {
            name: "Rabby",
            url: "https://rabby.io/",
            description: "Browser extension",
          },
          {
            name: "MetaMask",
            url: "https://metamask.io/download/",
            description: "Browser extension",
          },
        ]}
        onRefresh={() => {
          // Trigger wallet re-detection
          setWalletCheckCount((prev) => prev + 1)
          // Fallback to reload after a short delay
          setTimeout(() => window.location.reload(), 100)
        }}
      >
        <div className="mint-component">
          {evmWalletOptions.length > 0 && (
            <div className={walletStyles.walletPickerContainer}>
              <p className={walletStyles.walletPickerLabel}>Select a wallet:</p>
              <div className={walletStyles.walletPickerOptions} role="group" aria-label="Select a wallet">
                {evmWalletOptions.map((wallet) => {
                  const isSelected = wallet.uuid === selectedWallet?.uuid
                  return (
                    <button
                      key={wallet.uuid}
                      type="button"
                      className={`${button.secondary} ${walletStyles.walletOptionButton} ${
                        isSelected ? walletStyles.walletOptionButtonSelected : ""
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedWalletUuid(wallet.uuid)
                      }}
                    >
                      {wallet.icon && (
                        <img src={wallet.icon} alt="" className={walletStyles.walletOptionIcon} aria-hidden="true" />
                      )}
                      <span>{wallet.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {!isWalletConnected && (
            <div className={walletStyles.connectionContainer}>
              <p className={walletStyles.connectionMessage}>Connect your browser wallet to get started:</p>
              <div className={walletStyles.buttonWrapper}>
                <button
                  className={`${button.primary} ${walletStyles.connectButton}`}
                  onClick={connectToWallet}
                  disabled={!selectedProvider}
                  aria-label="Connect wallet to mint CCIP test tokens"
                >
                  <img
                    src="https://smartcontract.imgix.net/icons/wallet_filled.svg?auto=compress%2Cformat"
                    alt=""
                    className={walletStyles.walletIcon}
                  />
                  Connect Wallet{selectedWallet?.name ? ` (${selectedWallet.name})` : ""}
                </button>
              </div>
            </div>
          )}
          {userAddress && selectedProvider && <NetworkDropdown userAddress={userAddress} provider={selectedProvider} />}
          {showToast && <Toast message={toastMessage} onClose={closeToast} />}
        </div>
      </WalletSetupGate>
    </WalletErrorBoundary>
  )
}
