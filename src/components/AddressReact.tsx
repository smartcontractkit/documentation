// This is a copy of the Preact Address component. This was required in the CCIP pages.
import { clsx } from "~/lib"

export type Props = {
  contractUrl?: string
  address?: string
  endLength?: number
  urlClass?: string
  urlId?: string
  eventName?: string
  additionalInfo?: Record<string, string>
}

const AddressComponent = ({ contractUrl, address, endLength, urlClass, urlId }: Props) => {
  address = address || contractUrl?.split("/").pop()

  if (!address) return null

  const handleClick = (e) => {
    e.preventDefault()
    if (address) navigator.clipboard.writeText(address)
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

      <style>{`
        .addressLink {
          padding: 1px 0px;
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
