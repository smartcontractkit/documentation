import { clsx } from "../lib"
import "./ReactCopyText.css"

interface ReactCopyTextProps {
  text: string
  code?: boolean
  format?: boolean
  formatType?: "bytes32"
  eventName?: string
  additionalInfo?: Record<string, string>
}

interface Window {
  dataLayer?: {
    push: (event: { event: string } & Record<string, string | number>) => void
  }
}

declare const window: Window

export const ReactCopyText = ({
  text,
  code,
  format,
  formatType,
  eventName,
  additionalInfo = {},
}: ReactCopyTextProps) => {
  const formatText = (text: string, type: string | undefined) => {
    if (type === "bytes32" && text.length > 10) {
      return text.slice(0, 6) + "..." + text.slice(-4)
    }
    return text
  }

  const displayText = format ? formatText(text, formatType) : text

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (eventName !== undefined) {
      const dataLayerEvent = {
        event: eventName,
        ...additionalInfo,
      }
      window.dataLayer?.push(dataLayerEvent)
    }
  }

  return (
    <span className="copyContainer">
      {code ? <code>{displayText}</code> : displayText}
      <button
        className={clsx("copyBtn", "copy-iconbutton")}
        style={{ height: "16px", width: "16px", minWidth: "12px" }}
        data-clipboard-text={text}
        onClick={handleClick}
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>
    </span>
  )
}
