/** @jsxImportSource preact */
import detectEthereumProvider from "@metamask/detect-provider"
import button from "@chainlink/design-system/button.module.css"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { useEffect, useState } from "preact/hooks"
import { NetworkDropdown } from "./NetworkDropdown"
import { InjectedProvider, checkConnection } from "../../utils/getInjectedProvider"
import "./container.css"

declare global {
  interface Window {
    ethereum?:
      | InjectedProvider
      | {
          providers: InjectedProvider[]
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | any
  }
}

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
  const [userAddress, setUserAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // Listen for changes in the MetaMask provider (e.g., connection changes)
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    const getAccount = async () => {
      if (!window.ethereum) return
      const account = await checkConnection()
      if (account) {
        setUserAddress(account.address)
        setIsWalletConnected(true)
      }
    }
    getAccount()
  }, [userAddress, isWalletConnected])

  const validateEthApi = (ethereum: MetaMaskInpageProvider) => {
    if (!ethereum || !ethereum.isMetaMask) {
      throw new Error(`Something went wrong. Connect wallet is called while an ethereum object is not detected.`)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    // accounts is an array of connected accounts, if empty, the user disconnected
    setIsWalletConnected(accounts.length > 0)
    setUserAddress(accounts.length > 0 ? accounts[0] : "")
  }

  const connectToWallet = async () => {
    const ethereum = (await detectEthereumProvider()) as MetaMaskInpageProvider
    validateEthApi(ethereum)
    const accountPermissions = await requestPermissions(ethereum)
    if (!accountPermissions) {
      throw Error("Something went wrong when connecting MetaMask wallet. Please follow the steps in the popup page.")
    }
    const addressList = await ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((error: Error) => {
        alert(`Something went wrong: ${error.message}`)
      })
    const currentChainId = await ethereum.request({ method: "eth_chainId" }).catch((error: Error) => {
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
        if (accountsPermission) {
          console.log("eth_accounts permission successfully requested!")
        }
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
