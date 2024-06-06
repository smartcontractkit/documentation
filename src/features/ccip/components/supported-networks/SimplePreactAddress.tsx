/** @jsxImportSource preact */
import { useState } from "preact/hooks"

export const SimplePreactAddress = ({ contractUrl, address, endLength = 6, urlClass = "", urlId = "" }) => {
  address = address || contractUrl.split("/").pop()
  const [isCopied, setIsCopied] = useState(false)

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "--space-1x",
    wordBreak: "break-word",
  }

  const linkStyle = {
    background: "#f0f0f0",
    padding: "1px 5px",
    borderRadius: "5px",
    wordBreak: "break-word",
  }

  const buttonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    height: "16px",
    width: "16px",
    minWidth: "12px",
  }

  const formattedAddress =
    endLength && address ? `${address.slice(0, endLength + 2)}...${address.slice(-endLength)}` : address

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <span className={`addressContainer ${urlClass}`} id={urlId} style={containerStyle}>
      <a href={contractUrl} title={address} style={linkStyle}>
        {formattedAddress}
      </a>
      <button className="copyBtn" style={buttonStyle} onClick={handleCopy}>
        <img
          src={isCopied ? "/assets/icons/checkCircleIconGrey.svg" : "/assets/icons/copyIcon.svg"}
          alt={isCopied ? "Copied" : "Copy to clipboard"}
        />
      </button>
    </span>
  )
}
