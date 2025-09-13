/** @jsxImportSource react */
import React, { useMemo, useState } from "react"
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk"
import { AptosWalletAdapterProvider, useWallet, type WalletInfo } from "@aptos-labs/wallet-adapter-react"

import button from "@chainlink/design-system/button.module.css"
import styles from "./AptosTestTokens.module.css"
import walletStyles from "../WalletConnection.module.css"
import "../container.css"

// Optional (same toast you use elsewhere in docs)
import { Toast } from "../Toast.tsx"

// ---------------------------------------------------------
// Chain & faucet config
// ---------------------------------------------------------

// Aptos Testnet network
const APTOS_NETWORK = Network.TESTNET

// Faucet module address provided in the request:
const CCIP_BNM_FAUCET_ADDRESS = "0xf92c11250dd30e7d11090326b6057c3ed5555fc1a2d29765ea0307bbebd4e77e" as const

// If the faucet requires a type argument for the coin type, add it here.
const TYPE_ARGS: string[] = []

// ---------------------------------------------------------
// Utility helpers (explorer link, labels, small UI helpers)
// ---------------------------------------------------------

const explorerTxnUrl = (hash: string) => `https://explorer.aptoslabs.com/txn/${hash}?network=testnet`

const explorerRunUrl =
  "https://explorer.aptoslabs.com/object/0xf92c11250dd30e7d11090326b6057c3ed5555fc1a2d29765ea0307bbebd4e77e/modules/run/faucet/drip?network=testnet"

function shortAddr(addr?: string) {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function connectLabel(name?: string) {
  if (!name) return "Connect"
  const n = name.trim()
  return /^continue/i.test(n) ? n : `Connect ${n}`
}

function connectionLabel(name?: string) {
  if (!name) return "Connected"
  const n = name.trim()
  const prefix = "continue with "
  if (n.toLowerCase().startsWith(prefix)) {
    const provider = n.slice(prefix.length)
    return `Connected with ${provider}`
  }
  return `Connected to ${n}`
}

// Wallet download links for the help footer
const WALLET_LINKS: Record<string, string> = {
  Petra: "https://petra.app/",
  Pontem: "https://pontem.network/",
  Martian: "https://martianwallet.xyz/",
  Nightly: "https://nightly.app/aptos-wallet",
  Bitget: "https://web3.bitget.com/en/wallet-download",
  Trust: "https://trustwallet.com/download",
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

type Step = "idle" | "processing"
type Status = "idle" | "success" | "error"

function AptosTestTokensContent(): React.JSX.Element {
  const { account, connected, connect, disconnect, wallets, wallet, signAndSubmitTransaction, network } = useWallet()

  const [step, setStep] = useState<Step>("idle")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const isWrongNetwork = useMemo(() => network?.name?.toLowerCase() !== "testnet", [network?.name])

  const aptosClient = useMemo(() => new Aptos(new AptosConfig({ network: APTOS_NETWORK })), [])

  const requestTokens = async (): Promise<void> => {
    if (!connected || !account) return
    if (step !== "idle") return

    setStep("processing")
    setStatus("idle")
    setError(null)
    setTxHash(null)

    try {
      // Build entry-function payload to mint exactly 1 CCIP-BnM to caller.
      const response = await signAndSubmitTransaction({
        data: {
          function: `${CCIP_BNM_FAUCET_ADDRESS}::faucet::drip`,
          typeArguments: TYPE_ARGS,
          // Many faucet modules accept a single `to: address` argument.
          functionArguments: [account.address.toString()],
        },
      })

      // Wait for confirmation
      await aptosClient.waitForTransaction({ transactionHash: response.hash })

      setTxHash(response.hash)
      setStatus("success")
      setToastMessage("CCIP-BnM test token requested successfully!")
      setShowToast(true)
    } catch (e: any) {
      const msg = e?.message || e?.error?.message || "Request failed — please try again or check network/wallet."
      setError(msg)
      setStatus("error")
    } finally {
      setStep("idle")
    }
  }

  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className={`mint-component ${styles.container}`}>
      {/* Connected */}
      {connected ? (
        <div className={walletStyles.connectedContainer}>
          {/* Connection status */}
          <div className={walletStyles.connectionStatus}>
            <div className={walletStyles.statusWithNetwork}>
              <div>
                <span>
                  {connectionLabel(wallet?.name)} on Aptos {network?.name ?? "Testnet"}
                </span>
              </div>
              <div
                className={walletStyles.walletAddress}
                onClick={() => copy(account?.address.toString() || "")}
                title="Click to copy address"
              >
                {shortAddr(account?.address.toString())}
              </div>
            </div>
          </div>

          {/* Network guard */}
          {isWrongNetwork && (
            <div className={styles.errorMessage}>
              <div className={styles.errorContent} role="alert" aria-live="polite">
                <p className={styles.errorTitle}>Wrong network</p>
                <p className={styles.errorSubtext}>
                  Please switch your wallet to <strong>Aptos Testnet</strong> and try again.
                </p>
              </div>
            </div>
          )}

          {/* Action */}
          <div className={walletStyles.actionSection}>
            <div className={walletStyles.primaryAction}>
              <div
                className={walletStyles.actionTooltip}
                data-tooltip="Get free CCIP-BnM tokens for testing on Aptos Testnet"
              >
                <button
                  className={`${button.primary} ${walletStyles.connectButton}`}
                  onClick={requestTokens}
                  disabled={step !== "idle" || isWrongNetwork}
                  aria-label="Request CCIP-BnM test token to your connected Aptos wallet"
                >
                  {step === "processing" && <span className={styles.loadingSpinner} />}
                  {step === "processing" ? "Requesting…" : "Mint 1 CCIP-BnM"}
                </button>
              </div>
              <div className={styles.tokenInfo}>Mints exactly 1 CCIP-BnM to your address.</div>
            </div>
          </div>

          {/* Success */}
          {status === "success" && txHash && (
            <div className={styles.successMessage}>
              <div>
                <strong>Success!</strong> You requested CCIP-BnM.
              </div>
              <div className={styles.successSubtext}>Click below to view your transaction on the explorer.</div>
              <div
                className={styles.transactionDetails}
                onClick={() => window.open(explorerTxnUrl(txHash), "_blank")}
                title="Open in Aptos Explorer"
              >
                {txHash}
              </div>
              <div className={styles.successActions}>
                <button
                  className={button.secondary}
                  onClick={() => {
                    setStatus("idle")
                    setTxHash(null)
                  }}
                >
                  Request Again
                </button>
                <a className={button.link} href={explorerTxnUrl(txHash)} target="_blank" rel="noreferrer">
                  View on Explorer
                </a>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className={styles.errorMessage}>
              <div className={styles.errorContent} role="alert" aria-live="polite">
                <p className={styles.errorTitle}>Request failed</p>
                <p className={styles.errorSubtext}>{error}</p>
                <button
                  className={button.secondary}
                  onClick={() => {
                    setStatus("idle")
                    setError(null)
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Technical details & disconnect */}
          <div className={styles.technicalDetails} style={{ marginTop: "var(--space-4x)" }}>
            <details>
              <summary>Technical details</summary>
              <div className={styles.detailsContent}>
                <p>
                  Faucet module and function:{" "}
                  <a href={explorerRunUrl} target="_blank" rel="noreferrer">
                    <code>{`${CCIP_BNM_FAUCET_ADDRESS}::faucet::drip`}</code>
                  </a>
                </p>
                <p>
                  Network: <code>{APTOS_NETWORK}</code>
                </p>
              </div>
            </details>
          </div>

          <div className={walletStyles.disconnectRow}>
            <button className={button.tertiary} onClick={disconnect}>
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        // Disconnected: wallet selection
        <div className={walletStyles.connectionContainer}>
          <p className={walletStyles.connectionMessage}>Connect your Aptos wallet to get started:</p>

          <div className={styles.walletSelection}>
            <div
              className={styles.walletList}
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-2x)", width: "100%" }}
            >
              {wallets.map((w: WalletInfo) => (
                <button
                  key={w.name}
                  className={`${button.secondary} ${walletStyles.walletOption}`}
                  style={{ width: "100%" }}
                  onClick={() => connect(w.name)}
                >
                  {connectLabel(w.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Optional manual “connect last detected” */}
          {wallet && (
            <div className={styles.connectButtonWrapper}>
              <button
                className={`${button.primary} ${walletStyles.connectButton}`}
                onClick={() => connect(wallet.name)}
              >
                {connectLabel(wallet.name)}
              </button>
            </div>
          )}

          <div className={styles.walletConnectionHelp}>
            <span className={styles.helpText}>
              Don’t have an Aptos wallet? Try{" "}
              <a href={WALLET_LINKS.Petra} target="_blank" rel="noreferrer">
                Petra
              </a>
              ,{" "}
              <a href={WALLET_LINKS.Pontem} target="_blank" rel="noreferrer">
                Pontem
              </a>
              ,{" "}
              <a href={WALLET_LINKS.Martian} target="_blank" rel="noreferrer">
                Martian
              </a>
              ,{" "}
              <a href={WALLET_LINKS.Nightly} target="_blank" rel="noreferrer">
                Nightly
              </a>
              ,{" "}
              <a href={WALLET_LINKS.Bitget} target="_blank" rel="noreferrer">
                Bitget
              </a>
              , or{" "}
              <a href={WALLET_LINKS.Trust} target="_blank" rel="noreferrer">
                Trust
              </a>
              . Install and refresh.
            </span>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}

// Provider wrapper (auto-detects AIP-62 wallets)
export function AptosTestTokensClient(): React.JSX.Element {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: APTOS_NETWORK }}
      onError={(err) => console.error("Wallet adapter error:", err)}
    >
      <AptosTestTokensContent />
    </AptosWalletAdapterProvider>
  )
}
