/** @jsxImportSource react */
import React, { useState } from "react"

// Wallet layer imports
import {
  SolanaWalletProvider,
  useSolanaWallet,
  WalletPicker,
  ConnectButton,
  AddressBadge,
  CapabilityGate,
  CAPABILITY_PROFILES,
  type UiWalletAccount,
  type WalletHandle,
} from "@lib/solana/wallet/index.ts"

import button from "@chainlink/design-system/button.module.css"
import styles from "./SVMTestTokens.module.css"
import "../container.css"

import { Toast } from "../Toast.tsx"
import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { supportedChainToChainInRdd, getExplorer, getExplorerAddressUrl } from "@features/utils/index.ts"
import { API_ENDPOINTS } from "@config/api.ts"

// Types - using proper type aliases
type MintingStep = "idle" | "challenge" | "signing" | "verifying" | "processing"
type Status = "idle" | "success" | "error"

interface ErrorState {
  code?: string
  message: string
}

// Type aliases for wallet layer integration
type ConnectedAccount = UiWalletAccount
type SelectedWallet = WalletHandle

// Constants
const SUPPORTED_CHAIN = "SOLANA_DEVNET" as const

/**
 * SIWS Faucet Content Component
 */
function SVMTestTokensContent(): React.JSX.Element {
  const { signMessage, isConnected, account, chosen, compatibleWallets } = useSolanaWallet()

  // Type-safe wallet state
  const connectedAccount: ConnectedAccount | undefined = account
  const selectedWallet: SelectedWallet | undefined = chosen

  // Component state
  const [step, setStep] = useState<MintingStep>("idle")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<ErrorState | null>(null)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Chain configuration (same as before)
  const chainRddName = supportedChainToChainInRdd(SUPPORTED_CHAIN)
  const tokenInfo = getBnMParams({
    supportedChain: SUPPORTED_CHAIN,
    version: Version.V1_2_0,
  })
  const explorerInfo = getExplorer(SUPPORTED_CHAIN)
  const getAddressUrl = explorerInfo ? getExplorerAddressUrl(explorerInfo) : null

  // Derived values
  const tokenAddress: string | undefined = tokenInfo?.options.address
  const receiverAddress: string | undefined = connectedAccount?.address

  const mintTokens = async (): Promise<void> => {
    if (!isConnected || !connectedAccount || !tokenAddress) return
    if (step !== "idle") return // Prevent multiple calls

    setStep("challenge")
    setStatus("idle")
    setError(null)

    try {
      // 1. Fetch SIWS challenge
      const challengeResponse = await fetch(
        `${API_ENDPOINTS.CCIP.FAUCET.CHALLENGE(chainRddName)}?token=${tokenAddress}&receiver=${receiverAddress}`
      )

      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json()
        throw new Error(errorData.message || "Failed to get challenge")
      }

      const challengeData = await challengeResponse.json()

      // 2. Sign SIWS challenge text
      setStep("signing")

      // Extract SIWS text from challenge
      const challengeParts = challengeData.challenge.split("|")
      if (challengeParts.length !== 4) {
        throw new Error("Invalid SIWS challenge format received from server")
      }

      const challengeText = challengeParts[0]

      // Sign UTF-8 encoded SIWS text
      const challengeBytes = new TextEncoder().encode(challengeText)
      const signature = await signMessage(challengeBytes)

      // 3. Verify signature
      setStep("verifying")

      // Convert signature to base64url for transport
      const toB64Url = (bytes: Uint8Array) =>
        btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "")
      const signatureB64 = toB64Url(signature)

      const verifyResponse = await fetch(API_ENDPOINTS.CCIP.FAUCET.VERIFY(chainRddName), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenAddress,
          receiver: receiverAddress,
          challenge: challengeData.challenge,
          receiver_signature: signatureB64,
        }),
      })

      if (verifyResponse.ok) {
        setStep("processing")
        setStatus("success")

        setToastMessage(`${tokenInfo?.options.symbol || "CCIP-BnM"} tokens requested successfully!`)
        setShowToast(true)
      } else {
        const errorData = await verifyResponse.json()
        setError({
          code: errorData.code || errorData.details?.code,
          message: errorData.message || "Verification failed",
        })
        setStatus("error")
      }
    } catch (error) {
      console.error("Minting failed:", error)
      setError({
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
      setStatus("error")
    } finally {
      setStep("idle")
    }
  }

  const resetAndRetry = (): void => {
    setStatus("idle")
    setError(null)

    mintTokens()
  }

  const getStepMessage = (): string => {
    switch (step) {
      case "challenge":
        return "Getting challenge..."
      case "signing":
        return "Please sign in your wallet..."
      case "verifying":
        return "Verifying signature..."
      case "processing":
        return "Processing drip request..."
      default:
        return `Mint ${tokenInfo?.options.symbol || "CCIP-BnM"} Tokens`
    }
  }

  return (
    <div className="mint-component">
      {/* Capability gate ensures wallet supports message signing */}
      <CapabilityGate
        requirements={CAPABILITY_PROFILES.MESSAGE_SIGNING}
        fallback={
          <div style={{ padding: "16px", backgroundColor: "#fff3cd", borderRadius: "8px", marginBottom: "16px" }}>
            <p>⚠️ This feature requires a wallet that supports message signing.</p>
            <p>Please select Phantom, Solflare, or another compatible wallet.</p>
          </div>
        }
      >
        {/* Connected state */}
        {isConnected ? (
          <div>
            {/* Primary action area */}
            <div className={styles.primaryAction}>
              <div className={styles.walletStatus}>
                <p>✅ Connected to {selectedWallet?.name}</p>
                <AddressBadge showFull={false} copyable={true} />
                <small className={styles.tokenInfo}>
                  Minting {tokenInfo?.options.symbol || "CCIP-BnM"} to your wallet on{" "}
                  {SUPPORTED_CHAIN.replace("_", " ")}
                </small>
              </div>

              <button
                className={button.primary}
                onClick={mintTokens}
                disabled={step !== "idle" || !tokenAddress}
                aria-label="Mint CCIP-BnM test tokens to your connected wallet"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {step !== "idle" && <span className={styles.loadingSpinner} />}
                {getStepMessage()}
              </button>
            </div>

            {/* Technical details (collapsible) */}
            <details className={styles.technicalDetails}>
              <summary>Technical Details</summary>
              <div className={styles.detailsContent}>
                <p>
                  <strong>Token:</strong> {tokenInfo?.options.symbol || "CCIP-BnM"} ({tokenAddress?.slice(0, 8)}...
                  {tokenAddress?.slice(-8)})
                </p>
                <p>
                  <strong>Network:</strong> {SUPPORTED_CHAIN.replace("_", " ")} ({chainRddName})
                </p>
                <p>
                  <strong>Receiver:</strong> {connectedAccount?.address.slice(0, 8)}...
                  {connectedAccount?.address.slice(-8)} (your wallet)
                </p>
              </div>
            </details>

            {/* Success state */}
            {status === "success" && (
              <div className={styles.successMessage}>
                <p>✅ {tokenInfo?.options.symbol || "CCIP-BnM"} tokens requested successfully!</p>
                <p className={styles.successSubtext}>Signature verification completed. Ready for faucet integration.</p>
                <div className={styles.successActions}>
                  {getAddressUrl && connectedAccount && (
                    <a
                      href={getAddressUrl(connectedAccount.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={button.secondary}
                    >
                      View Wallet
                    </a>
                  )}
                  <button
                    className={button.secondary}
                    onClick={() => {
                      setStatus("idle")
                    }}
                  >
                    Mint More Tokens
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced error handling */}
            {status === "error" && error && (
              <div className={styles.errorMessage}>
                {error.code === "challenge_expired" && (
                  <div className={styles.errorContent}>
                    <p>⏰ Challenge expired. Please try again.</p>
                    <button className={button.secondary} onClick={resetAndRetry}>
                      Retry
                    </button>
                  </div>
                )}

                {error.code === "invalid_signature" && (
                  <div className={styles.errorContent}>
                    <p>❌ Signature verification failed.</p>
                    <p className={styles.errorSubtext}>Make sure you signed with the correct wallet.</p>
                    <button className={button.secondary} onClick={resetAndRetry}>
                      Try Again
                    </button>
                  </div>
                )}

                {error.code === "challenge_tampered" && (
                  <div className={styles.errorContent}>
                    <p>🔒 Security check failed.</p>
                    <p className={styles.errorSubtext}>Please refresh and try again.</p>
                    <button className={button.secondary} onClick={() => window.location.reload()}>
                      Refresh Page
                    </button>
                  </div>
                )}

                {error.code === "unsupported_chain" && (
                  <div className={styles.errorContent}>
                    <p>⚠️ Chain not supported.</p>
                    <p className={styles.errorSubtext}>Solana Devnet faucet is not currently available.</p>
                  </div>
                )}

                {error.code === "unsupported_token" && (
                  <div className={styles.errorContent}>
                    <p>🪙 Token not allowed.</p>
                    <p className={styles.errorSubtext}>This token is not available for minting.</p>
                  </div>
                )}

                {!error.code && (
                  <div className={styles.errorContent}>
                    <p>❌ {error.message}</p>
                    <button className={button.secondary} onClick={resetAndRetry}>
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Wallet selection state */
          <div className={styles.walletConnectionHelp}>
            <p>Connect your Solana wallet to mint {tokenInfo?.options.symbol || "CCIP-BnM"} test tokens:</p>
            <small className={styles.helpText}>
              Works with wallets that support Wallet Standard and message signing (e.g., Phantom, Solflare, Backpack)
            </small>

            {/* Wallet picker - only show if multiple compatible wallets exist */}
            {compatibleWallets.length > 1 && (
              <WalletPicker
                className={styles.walletList}
                requirements={CAPABILITY_PROFILES.MESSAGE_SIGNING}
                showCapabilities={false}
                style={{
                  display: "grid",
                  gap: "8px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  margin: "12px 0",
                }}
              />
            )}

            {/* Connect button */}
            <ConnectButton
              className={button.primary}
              style={{
                display: "flex",
                gap: "var(--space-2x)",
                alignItems: "center",
                alignSelf: "center",
              }}
            />

            {/* No compatible wallets message */}
            {compatibleWallets.length === 0 && (
              <p className={styles.helpText} style={{ marginTop: "8px" }}>
                No compatible wallets detected. Install Phantom, Solflare, or Backpack and refresh.
              </p>
            )}
          </div>
        )}
      </CapabilityGate>

      {/* Toast notifications */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}

/**
 * Solana Test Tokens Component
 */
export function SVMTestTokensClient(): React.JSX.Element {
  return (
    <SolanaWalletProvider requirements={CAPABILITY_PROFILES.MESSAGE_SIGNING}>
      <SVMTestTokensContent />
    </SolanaWalletProvider>
  )
}
