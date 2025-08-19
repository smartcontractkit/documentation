/** @jsxImportSource react */
import button from "@chainlink/design-system/button.module.css"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { useEffect, useState } from "react"
import { NetworkDropdown } from "./NetworkDropdown.tsx"
import { checkConnection } from "../../utils/getInjectedProvider.ts"
import { useMetaMaskProvider } from "@hooks/useEIP6963Providers.tsx"
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

  // ✅ Use EIP-6963 to get MetaMask specifically
  const metaMaskProvider = useMetaMaskProvider()

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
    const handleConnect = (connectInfo: any) => {
      console.log("🔗 MetaMask connected:", connectInfo)
    }

    const handleDisconnect = (error: any) => {
      console.log("🔌 MetaMask disconnected:", error)
      setIsWalletConnected(false)
      setUserAddress("")
    }

    metaMaskProvider.on("accountsChanged", handleAccountsChanged)
    metaMaskProvider.on("connect", handleConnect)
    metaMaskProvider.on("disconnect", handleDisconnect)

    const getAccount = async () => {
      try {
        const account = await checkConnection()
        if (account) {
          setUserAddress(account.address)
          setIsWalletConnected(true)
          console.log("MetaMask account connected:", account.address)
        }
      } catch (error) {
        console.log("MetaMask not connected or available")
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

  const validateEthApi = (ethereum: MetaMaskInpageProvider) => {
    if (!ethereum || !ethereum.isMetaMask) {
      throw new Error(`Something went wrong. Connect wallet is called while an ethereum object is not detected.`)
    }
  }

  const connectToWallet = async () => {
    // ✅ Use EIP-6963 discovered MetaMask provider
    if (!metaMaskProvider) {
      alert("MetaMask not found. Please install MetaMask extension for EVM token minting.")
      return
    }

    validateEthApi(metaMaskProvider)
    const accountPermissions = await requestPermissions(metaMaskProvider)
    if (!accountPermissions) {
      throw Error("Something went wrong when connecting MetaMask wallet. Please follow the steps in the popup page.")
    }
    const addressList = await metaMaskProvider
      .request({
        method: "eth_requestAccounts",
      })
      .catch((error: Error) => {
        alert(`Something went wrong: ${error.message}`)
      })
    const currentChainId = await metaMaskProvider.request({ method: "eth_chainId" }).catch((error: Error) => {
      alert(`Something went wrong: ${error.message}`)
    })
    if (addressList) {
      setUserAddress(addressList[0])
      localStorage.setItem(
        "isWalletConnected",
        JSON.stringify({
          isWalletConnected: true,
          userAddress: addressList[0],
          currentChainId,
        })
      )
    }
  }

  const requestPermissions = async (ethereum: MetaMaskInpageProvider) => {
    let accountsPermission: RequestPermissions | undefined
    await ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      .then((permissions: RequestPermissions[]) => {
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
    </div>
  )
}
