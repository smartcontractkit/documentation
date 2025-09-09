/** @jsxImportSource react */
import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"

interface ConnectButtonProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function ConnectButton({
  className = "",
  style,
  children,
  disabled = false,
  onClick,
  ...props
}: ConnectButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { wallet, connected, connecting, connect, disconnect, publicKey } = useWallet()

  const handleClick = async () => {
    if (onClick) {
      onClick()
      return
    }

    if (connected) {
      await disconnect()
    } else if (wallet) {
      try {
        await connect()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  const getButtonText = (): string => {
    if (connecting) return "Connecting..."
    if (connected && publicKey) {
      return children ? String(children) : `Connected: ${publicKey.toBase58().slice(0, 8)}...`
    }
    if (wallet) {
      return children ? String(children) : `Connect ${wallet.adapter.name}`
    }
    return children ? String(children) : "Select Wallet"
  }

  const isDisabled = disabled || connecting

  return (
    <button
      className={className}
      style={style}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={
        connected
          ? `Disconnect from ${wallet?.adapter.name || "wallet"}`
          : `Connect to ${wallet?.adapter.name || "wallet"}`
      }
      {...props}
    >
      {connecting && (
        <span
          style={{
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            border: "2px solid transparent",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginRight: "8px",
          }}
        />
      )}
      {children || getButtonText()}
    </button>
  )
}
