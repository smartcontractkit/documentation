import { clsx } from "~/lib"

export type Props = {
  value?: string
  valueClass?: string
  valueId?: string
}

const CopyValue = ({ value, valueClass, valueId }: Props) => {
  if (!value) return null

  const handleClick = (e) => {
    e.preventDefault()
    if (value) navigator.clipboard.writeText(value)
  }

  return (
    <span className={`addressContainer ${valueClass || ""}`} id={valueId}>
      <span className="valueCopy">{value}</span>
      <button
        className={clsx("copyBtn", "copy-iconbutton")}
        style={{ height: "16px", width: "16px", minWidth: "12px" }}
        data-clipboard-text={value}
        onClick={handleClick}
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>

      <style>{`
        .valueCopy {
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

export default CopyValue
