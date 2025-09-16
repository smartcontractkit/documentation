/** @jsxImportSource react */
import React from "react"
import button from "@chainlink/design-system/button.module.css"
import styles from "./WalletSetupGate.module.css"
import "./container.css"

interface WalletInstallLink {
  name: string
  url: string
  description: string
}

interface WalletSetupGateProps {
  /**
   * Whether a compatible wallet is detected
   */
  hasWallet: boolean

  /**
   * The name of the required wallet technology (e.g., "MetaMask", "Solana wallet")
   */
  walletName: string

  /**
   * Array of specific wallet names to suggest
   */
  suggestedWallets: string[]

  /**
   * Installation links for suggested wallets
   */
  installLinks: WalletInstallLink[]

  /**
   * Children to render when wallet is available
   */
  children: React.ReactNode

  /**
   * Optional callback when user requests wallet detection refresh
   */
  onRefresh?: () => void
}

/**
 * Professional wallet setup gate component
 * Shows installation guidance when wallet is not available
 * Renders children when wallet is ready
 *
 * Uses consistent design system and responsive patterns
 */
export function WalletSetupGate({
  hasWallet,
  walletName,
  suggestedWallets,
  installLinks,
  children,
  onRefresh,
}: WalletSetupGateProps): React.JSX.Element {
  // If wallet is available, render children directly
  if (hasWallet) {
    return <>{children}</>
  }

  // Handle refresh action
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  // Format wallet list for display
  const walletList =
    suggestedWallets.length > 1
      ? `${suggestedWallets.slice(0, -1).join(", ")} or ${suggestedWallets[suggestedWallets.length - 1]}`
      : suggestedWallets[0]

  return (
    <div className="mint-component">
      <div className={styles.warningContainer}>
        <div className={styles.warningHeader}>
          <span className={styles.warningIcon} role="img" aria-label="Warning">
            ⚠
          </span>
          <div className={styles.warningContent}>
            <h3>{walletName} Required</h3>
            <p>To mint test tokens, you need a compatible wallet. Please install {walletList} to continue.</p>
          </div>
        </div>

        {installLinks.length > 0 && (
          <div className={styles.installSection}>
            <h4>Install Wallet:</h4>
            <div className={styles.installLinks}>
              {installLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.installLink}
                >
                  <span className={styles.linkIcon} role="img" aria-hidden="true">
                    🔗
                  </span>
                  <span>Install {link.name}</span>
                  {link.description && <span className={styles.linkDescription}>{link.description}</span>}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={styles.helpSection}>
          <p className={styles.helpText}>After installing your wallet, refresh this page to detect it automatically.</p>
          <button onClick={handleRefresh} className={`${button.secondary} ${styles.refreshButton}`} type="button">
            Check for Wallets
          </button>
        </div>
      </div>
    </div>
  )
}
