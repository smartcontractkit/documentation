/** @jsxImportSource react */
import button from "@chainlink/design-system/button.module.css"

import { useEffect, useState } from "react"
import { NetworkDropdown } from "./NetworkDropdown.tsx"
import { useMetaMaskProvider } from "@hooks/useEIP6963Providers.tsx"
import { useWalletConnectionStorage } from "@hooks/useLocalStorage.ts"
import { EIP1193Provider } from "../../utils/EIP1193Interface.ts"
import { Toast } from "./Toast.tsx"
import { WalletErrorBoundary } from "../../../components/ErrorBoundary.tsx"
import "./container.css"

interface Caveat {
  type: string
  value: string[]
}

interface RequestPermissions {
  caveats: Caveat[]
  date: number
  id: string
  invoker: string
  parentCapability: string
}

interface ConnectInfo {
  chainId: string
}

interface DisconnectError {
  code?: number
  message?: string
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

  // ✅ Use EIP-6963 to get MetaMask specifically
  const metaMaskProvider = useMetaMaskProvider()
  const { saveConnectionState } = useWalletConnectionStorage()

  useEffect(() => {
    if (!metaMaskProvider) return

    // ✅ Listen to events on the selected MetaMask provider
    const handleAccountsChanged = (accounts: string[]) => {
      console.log("🔄 MetaMask account changed:", {
        previousAddress: userAddress,
        newAccounts: accounts,
        connected: accounts.length > 0,
        newAddress: accounts.length > 0 ? accounts[0] : "disconnected",
      })

      setIsWalletConnected(accounts.length > 0)
      setUserAddress(accounts.length > 0 ? accounts[0] : "")

      if (accounts.length === 0) {
        console.log("🔌 MetaMask disconnected")
      } else if (accounts[0] !== userAddress) {
        console.log("👤 MetaMask account switched:", accounts[0])
      }
    }

    // ✅ Also listen for connection/disconnection events
    const handleConnect = (connectInfo: ConnectInfo) => {
      console.log("🔗 MetaMask connected:", connectInfo)
    }

    const handleDisconnect = (error: DisconnectError) => {
      console.log("🔌 MetaMask disconnected:", error)
      setIsWalletConnected(false)
      setUserAddress("")
    }

    metaMaskProvider.on("accountsChanged", handleAccountsChanged)
    metaMaskProvider.on("connect", handleConnect)
    metaMaskProvider.on("disconnect", handleDisconnect)

    const getAccount = async () => {
      if (!metaMaskProvider) {
        setIsWalletConnected(false)
        setUserAddress("")
        return
      }

      try {
        const accounts = await metaMaskProvider.request<string[]>({
          method: "eth_accounts",
        })

        if (accounts && accounts.length > 0) {
          setUserAddress(accounts[0])
          setIsWalletConnected(true)
          console.log("MetaMask account connected:", accounts[0])
        } else {
          setIsWalletConnected(false)
          setUserAddress("")
        }
      } catch (error) {
        console.log("Failed to get MetaMask accounts:", error)
        setIsWalletConnected(false)
        setUserAddress("")
      }
    }
    getAccount()

    // ✅ Cleanup all event listeners
    return () => {
      metaMaskProvider.removeListener?.("accountsChanged", handleAccountsChanged)
      metaMaskProvider.removeListener?.("connect", handleConnect)
      metaMaskProvider.removeListener?.("disconnect", handleDisconnect)
    }
  }, [metaMaskProvider])

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
    // ✅ Use EIP-6963 discovered MetaMask provider
    if (!metaMaskProvider) {
      showToastMessage("MetaMask not found. Please install MetaMask extension for EVM token minting.")
      return
    }

    validateEthApi(metaMaskProvider)
    const accountPermissions = await requestPermissions(metaMaskProvider)
    if (!accountPermissions) {
      throw Error("Something went wrong when connecting MetaMask wallet. Please follow the steps in the popup page.")
    }
    const addressList = await metaMaskProvider
      .request<string[]>({
        method: "eth_requestAccounts",
      })
      .catch((error: Error) => {
        showToastMessage(`Something went wrong: ${error.message}`)
      })
    const currentChainId = await metaMaskProvider.request<string>({ method: "eth_chainId" }).catch((error: Error) => {
      showToastMessage(`Something went wrong: ${error.message}`)
    })
    if (addressList) {
      setUserAddress(addressList[0])
      saveConnectionState(addressList[0], currentChainId as string)
    }
  }

  const requestPermissions = async (provider: EIP1193Provider) => {
    let accountsPermission: RequestPermissions | undefined
    await provider
      .request<RequestPermissions[]>({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      .then((permissions) => {
        accountsPermission = permissions.find(
          (permission: RequestPermissions) => permission.parentCapability === "eth_accounts"
        )
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Permissions needed to continue.")
        } else {
          console.error(error)
        }
      })
    return accountsPermission
  }

  return (
    <WalletErrorBoundary>
      <div className="mint-component">
        {!isWalletConnected && (
          <>
            <p>Connect your browser wallet to get started:</p>
            <button
              className={button.secondary}
              style={{ display: "flex", gap: "var(--space-2x)", alignItems: "center", alignSelf: "center" }}
              onClick={connectToWallet}
            >
              <img
                src="https://smartcontract.imgix.net/icons/wallet_filled.svg?auto=compress%2Cformat"
                alt="wallet icon"
              />
              Connect Wallet
            </button>
          </>
        )}
        {userAddress && (
          <>
            <NetworkDropdown userAddress={userAddress} />
          </>
        )}
        {showToast && <Toast message={toastMessage} onClose={closeToast} />}
      </div>
    </WalletErrorBoundary>
  )
}
