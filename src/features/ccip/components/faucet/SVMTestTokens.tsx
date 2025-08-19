/** @jsxImportSource preact */
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "preact/hooks"
import button from "@chainlink/design-system/button.module.css"
import styles from "./SVMTestTokens.module.css"
import { Toast } from "../Toast.tsx"
import "../container.css"
import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { supportedChainToChainInRdd, getExplorer, getExplorerAddressUrl } from "@features/utils/index.ts"
import { API_ENDPOINTS } from "@config/api.ts"

type MintingStep = "idle" | "challenge" | "signing" | "verifying" | "processing"
type Status = "idle" | "success" | "error"

interface ErrorState {
  code?: string
  message: string
}

/**
 * Solana Test Tokens Component
 * Handles CCIP-BnM token minting via signature verification
 */
export function SVMTestTokens() {
  const { publicKey, signMessage, connected } = useWallet()
  const [step, setStep] = useState<MintingStep>("idle")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<ErrorState | null>(null)
  const [, setTxHash] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Use consistent SupportedChain enum and convert to RDD name for API calls
  const supportedChain = "SOLANA_DEVNET"
  const chainRddName = supportedChainToChainInRdd(supportedChain) // "solana-devnet"

  // Auto-detect CCIP-BnM token address for Solana Devnet using existing utilities
  const tokenInfo = getBnMParams({
    supportedChain,
    version: Version.V1_2_0,
  })

  // Get explorer info using existing utilities
  const explorerInfo = getExplorer(supportedChain)
  const getAddressUrl = explorerInfo ? getExplorerAddressUrl(explorerInfo) : null

  const tokenAddress = tokenInfo?.options.address // 3PjyGzj1jGVgHSKS4VR1Hr1memm63PmN8L9rtPDKwzZ6
  const receiverAddress = publicKey?.toBase58()

  // Reset state when wallet changes
  useEffect(() => {
    if (connected && publicKey) {
      setStatus("idle")
      setStep("idle")
      setError(null)
      setTxHash(null)
    }
  }, [publicKey?.toBase58()])

  const mintTokens = async () => {
    if (!connected || !publicKey || !signMessage || !tokenAddress) return

    setStep("challenge")
    setStatus("idle")
    setError(null)

    try {
      // 1. Fetch challenge
      const challengeResponse = await fetch(
        `${API_ENDPOINTS.CCIP.FAUCET.CHALLENGE(chainRddName)}?token=${tokenAddress}&receiver=${receiverAddress}`
      )

      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json()
        throw new Error(errorData.message || "Failed to get challenge")
      }

      const challengeData = await challengeResponse.json()

      // 2. Sign challenge
      setStep("signing")
      const [payloadB64] = challengeData.challenge.split(".")
      const payloadBytes = new Uint8Array(Buffer.from(payloadB64, "base64url"))
      const signature = await signMessage(payloadBytes)
      const signatureB64 = Buffer.from(signature).toString("base64")

      // 3. Verify signature
      setStep("verifying")
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
        // In future: capture actual transaction hash from faucet
        setTxHash("signature-verified-ready-for-faucet-integration")
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

  const resetAndRetry = () => {
    setStatus("idle")
    setError(null)
    setTxHash(null)
    mintTokens()
  }

  const getStepMessage = () => {
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

  if (!connected) {
    return (
      <div className="mint-component">
        <div className={styles.walletConnectionHelp}>
          <p>Connect your Solana wallet to mint {tokenInfo?.options.symbol || "CCIP-BnM"} test tokens:</p>
          <small className={styles.helpText}>Supports Phantom, Solflare, Backpack, and other Solana wallets</small>
          <WalletMultiButton />
        </div>
      </div>
    )
  }

  return (
    <div className="mint-component">
      {/* Primary action area */}
      <div className={styles.primaryAction}>
        <div className={styles.walletStatus}>
          <p>✅ Connected: {publicKey?.toBase58().slice(0, 8)}...</p>
          <small className={styles.tokenInfo}>
            Minting {tokenInfo?.options.symbol || "CCIP-BnM"} to your wallet on {supportedChain.replace("_", " ")}
          </small>
        </div>

        <button
          className={button.primary}
          onClick={mintTokens}
          disabled={step !== "idle" || !tokenAddress}
          aria-label="Mint CCIP-BnM test tokens to your connected wallet"
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
            <strong>Network:</strong> {supportedChain.replace("_", " ")} ({chainRddName})
          </p>
          <p>
            <strong>Receiver:</strong> {receiverAddress?.slice(0, 8)}...{receiverAddress?.slice(-8)} (your wallet)
          </p>
        </div>
      </details>

      {/* Success state with next steps */}
      {status === "success" && (
        <div className={styles.successMessage}>
          <p>✅ {tokenInfo?.options.symbol || "CCIP-BnM"} tokens requested successfully!</p>
          <p className={styles.successSubtext}>Signature verification completed. Ready for faucet integration.</p>
          <div className={styles.successActions}>
            {getAddressUrl && receiverAddress && (
              <a
                href={getAddressUrl(receiverAddress)}
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
                setTxHash(null)
              }}
            >
              Mint More Tokens
            </button>
          </div>
        </div>
      )}

      {/* Enhanced error handling with specific actions */}
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

      {/* Toast notifications */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}
