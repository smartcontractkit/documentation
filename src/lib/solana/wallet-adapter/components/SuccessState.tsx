/** @jsxImportSource react */
import React from "react"
import button from "@chainlink/design-system/button.module.css"
import styles from "@features/ccip/components/faucet/SVMTestTokens.module.css"

interface TransactionResult {
  signature: string
  receiverAta: string
  tokenProgram: string
}

interface SuccessStateProps {
  tokenSymbol: string
  transactionResult: TransactionResult | null
  getTransactionUrl?: (signature: string) => string
  onMintMore: () => void
  className?: string
}

export function SuccessState({
  tokenSymbol,
  transactionResult,
  getTransactionUrl,
  onMintMore,
  className = "",
}: SuccessStateProps) {
  const handleCopySignature = () => {
    if (transactionResult?.signature && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(transactionResult.signature)
    }
  }

  return (
    <div className={`${styles.successMessage} ${className}`}>
      <p style={{ margin: 0, fontWeight: 600 }}>{tokenSymbol} tokens minted successfully!</p>

      {transactionResult && (
        <>
          <div
            className={styles.transactionDetails}
            onClick={handleCopySignature}
            title="Click to copy transaction hash"
          >
            <span style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>Transaction:</span>
            <br />
            <span>
              {transactionResult.signature.slice(0, 8)}...{transactionResult.signature.slice(-6)}
            </span>
          </div>

          <div className={styles.successActions}>
            <button className={button.primary} onClick={onMintMore} style={{ width: "100%" }}>
              Mint More Tokens
            </button>

            {getTransactionUrl && (
              <a
                href={getTransactionUrl(transactionResult.signature)}
                target="_blank"
                rel="noopener noreferrer"
                className={button.secondary}
                style={{ width: "100%" }}
              >
                View Transaction
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}
