/** @jsxImportSource preact */
import { clsx } from "../lib" // Ensure that the `clsx` function is correctly imported or implemented.

export type Props = {
  contractUrl: string
  address?: string
  endLength?: number
  urlClass?: string
  urlId?: string
  eventName?: string
  additionalInfo?: Record<string, string>
}

const AddressComponent = ({
  contractUrl,
  address,
  endLength,
  urlClass,
  urlId,
  eventName,
  additionalInfo = {}, // Default to an empty object if not provided
}: Props) => {
  address = address || contractUrl.split("/").pop()

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
    <span className={`addressContainer ${urlClass || ""}`} id={urlId}>
      <a title={address} className="addressLink" href={contractUrl} target="_blank" rel="noopener noreferrer">
        {endLength && address ? address.slice(0, endLength + 2) + "..." + address.slice(-endLength) : address}
      </a>
      <button
        className={clsx("copyBtn", "copy-iconbutton")}
        style={{ height: "16px", width: "16px", minWidth: "12px" }}
        data-clipboard-text={address}
        onClick={handleClick}
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>

      <style jsx>{`
        .addressLink {
          background: var(--color-background-secondary);
          padding: 1px 5px;
          border-radius: var(--border-radius-10);
          word-break: break-word;
        }

        .addressContainer {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1x);
          word-break: break-word;
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

export default AddressComponent
