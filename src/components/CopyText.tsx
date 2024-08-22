/** @jsxImportSource preact */
import { clsx } from "../lib" // Ensure that the `clsx` function is correctly imported or implemented.

export type Props = {
  text: string
  code?: boolean
  format?: boolean // determine if formatting is needed
  formatType?: "bytes32"
  eventName?: string
  additionalInfo?: Record<string, string>
}

const CopyContainer = ({ text, code, format, formatType, eventName, additionalInfo = {} }: Props) => {
  // Function to format text based on format type
  const formatText = (text: string, type: string | undefined) => {
    if (type === "bytes32" && text.length > 10) {
      // Format the text as per 'bytes32' requirements, e.g., shorten the string
      return text.slice(0, 6) + "..." + text.slice(-4)
    }
    // Handle other format types as needed
    // if (type === 'otherType') { /* ... */ }

    // If no type is provided or the type doesn't match, return the original text
    return text
  }

  // Determine if formatting is needed
  const displayText = format ? formatText(text, formatType) : text

  const handleClick = (e) => {
    e.preventDefault()

    if (eventName !== undefined) {
      const dataLayerEvent = {
        event: eventName,
        ...additionalInfo,
      }
      window.dataLayer.push(dataLayerEvent)
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

      <style jsx>{`
        .copyContainer {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1x);
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          margin-top: 0;
        }

        .copyBtn {
          background: none;
          border: none;
        }

        .copyBtn:hover {
          color: var(--color-text-link);
        }
      `}</style>
    </span>
  )
}

export default CopyContainer
