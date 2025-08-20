/** @jsxImportSource react */
import { useSolanaWallet, useWalletConnection } from "./react.tsx"
import type { SolanaCapabilities } from "./core.ts"
import { getCapabilities, WalletHandle } from "./core.ts"

// Default wallet icon for wallets without icons
const DEFAULT_WALLET_ICON =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 6H3C2.45 6 2 6.45 2 7V17C2 17.55 2.45 18 3 18H21C21.55 18 22 17.55 22 17V7C22 6.45 21.55 6 21 6ZM20 16H4V8H20V16Z' fill='%23666'/%3E%3C/svg%3E"

/**
 * Props for styling components
 */
interface ComponentStyleProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Wallet Picker Component
 * Displays a list of compatible wallets for selection
 */
export function WalletPicker({
  className,
  style,
  onSelect,
  showCapabilities = false,
  // requirements is intentionally omitted - not yet implemented
  ...props
}: ComponentStyleProps & {
  requirements?: Partial<SolanaCapabilities>
  onSelect?: (walletId: string) => void
  showCapabilities?: boolean
}) {
  const { compatibleWallets, chosen, setChosenId } = useSolanaWallet()

  if (compatibleWallets.length === 0) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: "16px", textAlign: "center", color: "#666" }}>
          <p>No compatible wallets detected.</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Install Phantom, Solflare, or Backpack and refresh the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={style} role="listbox" aria-label="Choose a wallet">
      {compatibleWallets.map((wallet) => {
        const isSelected = chosen?.id === wallet.id

        return (
          <button
            key={wallet.id}
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              setChosenId(wallet.id)
              onSelect?.(wallet.id)
            }}
            className="wallet-picker-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: isSelected ? "2px solid var(--blue-400)" : "1px solid var(--gray-300)",
              borderRadius: "4px",
              padding: "8px 12px",
              backgroundColor: "transparent",
              cursor: "pointer",
              width: "100%",
              ...style,
            }}
          >
            <img
              src={wallet.icon || DEFAULT_WALLET_ICON}
              alt=""
              width={20}
              height={20}
              style={{ borderRadius: "4px" }}
            />
            <span>{wallet.name}</span>
            {showCapabilities && <CapabilityBadges wallet={wallet} style={{ marginLeft: "auto" }} />}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Connect Button Component
 * Handles wallet connection with loading states
 */
export function ConnectButton({
  className,
  style,
  children,
  ...props
}: ComponentStyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode
  }) {
  const { wallet, isConnected, isConnecting, connect } = useWalletConnection()

  const handleConnect = async () => {
    if (!wallet) return

    try {
      await connect()
    } catch (error) {
      console.error("Connection failed:", error)
      // Error handling can be customized by parent components
    }
  }

  const isDisabled = !wallet || isConnecting || isConnected

  const defaultIcon = "https://smartcontract.imgix.net/icons/wallet_filled.svg?auto=compress%2Cformat"

  return (
    <button
      className={className}
      onClick={handleConnect}
      disabled={isDisabled}
      style={{
        display: "flex",
        gap: "var(--space-2x)",
        alignItems: "center",
        alignSelf: "center",
        ...style,
      }}
      {...props}
    >
      <img src={defaultIcon} alt="" />
      {children || (
        <>
          {isConnecting
            ? "Connecting..."
            : isConnected
              ? `Connected to ${wallet?.name}`
              : wallet
                ? `Connect ${wallet.name}`
                : "Select a Wallet"}
        </>
      )}
    </button>
  )
}

/**
 * Address Badge Component
 * Displays the connected wallet address
 */
export function AddressBadge({
  className,
  style,
  showFull = false,
  copyable = true,
}: ComponentStyleProps & {
  showFull?: boolean
  copyable?: boolean
}) {
  const { account, isConnected } = useWalletConnection()

  if (!isConnected || !account) {
    return null
  }

  const address = account.address
  const displayAddress = showFull ? address : `${address.slice(0, 4)}...${address.slice(-4)}`

  const handleCopy = async () => {
    if (copyable && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(address)
        // You can add toast notification here
      } catch (error) {
        console.error("Failed to copy address:", error)
      }
    }
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "6px",
        fontSize: "14px",
        fontFamily: "monospace",
        cursor: copyable ? "pointer" : "default",
        ...style,
      }}
      onClick={copyable ? handleCopy : undefined}
      title={copyable ? "Click to copy address" : address}
    >
      <span>📍</span>
      <span>{displayAddress}</span>
      {copyable && <span style={{ opacity: 0.6 }}>📋</span>}
    </div>
  )
}

/**
 * Capability Badges Component
 * Shows what features a wallet supports
 */
export function CapabilityBadges({
  wallet,
  className,
  style,
}: ComponentStyleProps & {
  wallet: WalletHandle
}) {
  const capabilities = wallet ? getCapabilities(wallet) : {}

  const badges = [
    { key: "connect", label: "Connect", icon: "🔗" },
    { key: "signMessage", label: "Sign Message", icon: "✍️" },
    { key: "signTransaction", label: "Sign Tx", icon: "📝" },
    { key: "signAndSend", label: "Send Tx", icon: "🚀" },
  ]

  return (
    <div className={className} style={{ display: "flex", gap: "4px", ...style }}>
      {badges.map(({ key, label, icon }) => {
        const supported = capabilities[key as keyof typeof capabilities]
        return (
          <span
            key={key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              padding: "2px 6px",
              fontSize: "11px",
              borderRadius: "4px",
              backgroundColor: supported ? "#d4edda" : "#f8d7da",
              color: supported ? "#155724" : "#721c24",
              border: `1px solid ${supported ? "#c3e6cb" : "#f5c6cb"}`,
            }}
            title={`${label}: ${supported ? "Supported" : "Not supported"}`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </span>
        )
      })}
    </div>
  )
}

/**
 * Capability Gate Component
 * Shows requirements and blocks content if wallet doesn't meet them
 */
export function CapabilityGate({
  children,
  fallback,
  className,
  style,
  // requirements is intentionally omitted - not yet implemented in capability checking
  ...props
}: ComponentStyleProps & {
  requirements: Partial<SolanaCapabilities>
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { compatibleWallets } = useSolanaWallet()

  // Check if a compatible wallets exist for these requirements
  const hasCompatibleWallets = compatibleWallets.length > 0

  if (!hasCompatibleWallets) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div
        className={className}
        style={{
          padding: "16px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "8px",
          color: "#856404",
          ...style,
        }}
      >
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>⚠️ Wallet Requirements Not Met</div>
        <p style={{ margin: 0, fontSize: "14px" }}>
          No compatible wallets found. Please install a wallet that supports the required features.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Wallet Status Component
 * Shows current connection status with visual indicators
 */
export function WalletStatus({
  className,
  style,
  showAddress = true,
  showCapabilities = false,
}: ComponentStyleProps & {
  showAddress?: boolean
  showCapabilities?: boolean
}) {
  const { wallet, account, status } = useWalletConnection()

  const statusConfig = {
    none: { icon: "❌", color: "#dc3545", text: "No wallet selected" },
    selected: { icon: "⏳", color: "#ffc107", text: "Wallet selected" },
    connecting: { icon: "🔄", color: "#17a2b8", text: "Connecting..." },
    connected: { icon: "✅", color: "#28a745", text: "Connected" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.none

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        ...style,
      }}
    >
      <span style={{ fontSize: "18px" }}>{config.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "500", color: config.color }}>
          {config.text}
          {wallet && ` (${wallet.name})`}
        </div>
        {showAddress && account && (
          <div style={{ fontSize: "12px", color: "#666", fontFamily: "monospace" }}>
            {account.address.slice(0, 8)}...{account.address.slice(-8)}
          </div>
        )}
      </div>
      {showCapabilities && wallet && <CapabilityBadges wallet={wallet} />}
    </div>
  )
}
