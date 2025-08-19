/** @jsxImportSource react */
import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import {
  EnhancedWalletProvider,
  WalletPicker,
  ConnectButton,
  CapabilityGate,
  CAPABILITY_PROFILES,
  SuccessState,
  processError,
  getStepMessage,
  isProcessingStep,
  getButtonStateClass,
} from "@lib/solana/wallet-adapter/index.ts"
import type { MintingStep, Status, ErrorState } from "@lib/solana/wallet-adapter/index.ts"

import button from "@chainlink/design-system/button.module.css"
import styles from "./SVMTestTokens.module.css"
import walletStyles from "../WalletConnection.module.css"
import "../container.css"

import { Toast } from "../Toast.tsx"
import { WalletSetupGate } from "../WalletSetupGate.tsx"
import { getBnMParams } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { supportedChainToChainInRdd, getExplorer, getExplorerTransactionUrl } from "@features/utils/index.ts"
import { API_ENDPOINTS } from "@config/api.ts"

const SUPPORTED_CHAIN = "SOLANA_DEVNET" as const

interface TransactionResult {
  signature: string
  receiverAta: string
  tokenProgram: string
}

function SVMTestTokensContent(): React.JSX.Element {
  const { connected, connecting, publicKey, signMessage, wallet } = useWallet()

  // Component state
  const [step, setStep] = useState<MintingStep>("idle")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<ErrorState | null>(null)
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Chain configuration
  const chainRddName = supportedChainToChainInRdd(SUPPORTED_CHAIN)
  const tokenInfo = getBnMParams({
    supportedChain: SUPPORTED_CHAIN,
    version: Version.V1_2_0,
  })
  const explorerInfo = getExplorer(SUPPORTED_CHAIN)
  const getTransactionUrl = explorerInfo ? getExplorerTransactionUrl(explorerInfo) : null

  // Derived values
  const tokenAddress: string | undefined = tokenInfo?.options.address
  const receiverAddress: string | undefined = publicKey?.toBase58()

  // Note: Wallet compatibility is now handled by CapabilityGate and WalletPicker

  const mintTokens = async (): Promise<void> => {
    if (!connected || !publicKey || !tokenAddress || !signMessage) return
    if (step !== "idle") return

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

      setStep("signing")

      const challengeParts = challengeData.challenge.split("|")
      if (challengeParts.length !== 4 || challengeParts.some((part) => !part.trim())) {
        throw new Error("Invalid SIWS challenge format received from server")
      }

      const challengeText = challengeParts[0]
      const challengeBytes = new TextEncoder().encode(challengeText)
      const signature = await signMessage(challengeBytes)

      setStep("verifying")

      const toB64Url = (bytes: Uint8Array) =>
        btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "")
      const signatureB64 = toB64Url(signature)

      const verifyResponse = await fetch(API_ENDPOINTS.CCIP.FAUCET.EXECUTE(chainRddName), {
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
        const responseData = await verifyResponse.json()

        setStep("processing")
        setStatus("success")

        if (responseData.status === "success" && responseData.data) {
          setTransactionResult({
            signature: responseData.data.signature,
            receiverAta: responseData.data.receiverAta,
            tokenProgram: responseData.data.tokenProgram,
          })
        }

        setToastMessage(`${tokenInfo?.options.symbol || "CCIP-BnM"} tokens requested successfully!`)
        setShowToast(true)
      } else {
        const errorData = await verifyResponse.json()
        setError({
          code: errorData.code || errorData.details?.code,
          message: errorData.message || "Verification failed",
          details: errorData.details,
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
    setTransactionResult(null)
    mintTokens()
  }

  const resetSuccess = (): void => {
    setStatus("idle")
    setTransactionResult(null)
  }

  // Process error for UX display
  const errorDisplay = error ? processError(error) : null

  return (
    <div className="mint-component">
      <CapabilityGate
        requirements={CAPABILITY_PROFILES.MESSAGE_SIGNING}
        fallback={
          <WalletSetupGate
            hasWallet={false}
            walletName="Solana Wallet"
            suggestedWallets={["Phantom", "Solflare", "Backpack"]}
            installLinks={[
              {
                name: "Phantom",
                url: "https://phantom.app/download",
                description: "Mobile & Browser",
              },
              {
                name: "Solflare",
                url: "https://solflare.com/download",
                description: "Mobile & Browser",
              },
              {
                name: "Backpack",
                url: "https://www.backpack.app/download",
                description: "Mobile & Browser",
              },
            ]}
            onRefresh={() => window.location.reload()}
          >
            <div />
          </WalletSetupGate>
        }
      >
        {/* Connected state */}
        {connected ? (
          <div className={walletStyles.connectedContainer}>
            {/* Enhanced Connection Status with Address */}
            <div className={walletStyles.connectionStatus}>
              <div className={walletStyles.statusWithNetwork}>
                <div>
                  <span>Connected to {wallet?.adapter.name} on Solana Devnet</span>
                </div>
                <div
                  className={walletStyles.walletAddress}
                  onClick={() => navigator.clipboard.writeText(publicKey?.toBase58() || "")}
                  title="Click to copy address"
                >
                  {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-4)}
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className={walletStyles.actionSection}>
              <div className={walletStyles.primaryAction}>
                <div
                  className={walletStyles.actionTooltip}
                  data-tooltip="Get free CCIP-BnM tokens for testing on Solana"
                >
                  <button
                    className={`${button.primary} ${walletStyles.connectButton} ${getButtonStateClass(step)}`}
                    onClick={mintTokens}
                    disabled={isProcessingStep(step) || !tokenAddress || connecting}
                    aria-label="Mint CCIP-BnM test tokens to your connected wallet"
                  >
                    {isProcessingStep(step) && <span className={styles.loadingSpinner} />}
                    {getStepMessage(step, tokenInfo?.options.symbol)}
                  </button>
                </div>
              </div>
            </div>

            {/* Success state */}
            {status === "success" && transactionResult && (
              <SuccessState
                tokenSymbol={tokenInfo?.options.symbol || "CCIP-BnM"}
                transactionResult={transactionResult}
                getTransactionUrl={getTransactionUrl || undefined}
                onMintMore={resetSuccess}
              />
            )}

            {/* Enhanced error handling */}
            {status === "error" && errorDisplay && (
              <div className={styles.errorMessage}>
                <div className={styles.errorContent} role="alert" aria-live="polite">
                  <p className={styles.errorTitle}>{errorDisplay.title}</p>
                  <p className={styles.errorSubtext}>{errorDisplay.message}</p>
                  {errorDisplay.subtext && <p className={styles.errorSubtext}>{errorDisplay.subtext}</p>}

                  {errorDisplay.timer?.show && <div className={styles.errorTimer}>{errorDisplay.timer.message}</div>}

                  {errorDisplay.action === "retry" && (
                    <button className={button.secondary} onClick={resetAndRetry}>
                      Try Again
                    </button>
                  )}

                  {errorDisplay.action === "refresh" && (
                    <button className={button.secondary} onClick={() => window.location.reload()}>
                      Refresh Page
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Wallet selection state */
          <div className={walletStyles.connectionContainer}>
            <p className={walletStyles.connectionMessage}>Connect your browser wallet to get started:</p>

            <div className={walletStyles.walletSelection}>
              <WalletPicker
                className={styles.walletList}
                requirements={CAPABILITY_PROFILES.MESSAGE_SIGNING}
                showCapabilities={false}
              />
            </div>

            {wallet && (
              <div className={walletStyles.buttonWrapper}>
                <ConnectButton className={`${button.primary} ${walletStyles.connectButton}`} disabled={connecting}>
                  Connect {wallet.adapter.name}
                </ConnectButton>
              </div>
            )}
          </div>
        )}
      </CapabilityGate>

      {/* Toast notifications */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export function SVMTestTokensClient(): React.JSX.Element {
  return (
    <EnhancedWalletProvider autoConnect={true}>
      <SVMTestTokensContent />
    </EnhancedWalletProvider>
  )
}
