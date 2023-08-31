/** @jsxImportSource preact */
import { clsx } from "../lib" // Ensure that the `clsx` function is correctly imported or implemented.

export type Props = {
  text: string
  code?: boolean
}

const CopyContainer = ({ text, code }: Props) => {
  return (
    <span className="copyContainer">
      {code ? <code>{text}</code> : text}
      <button
        className={clsx("copyBtn", "copy-iconbutton")}
        style={{ height: "16px", width: "16px" }}
        data-clipboard-text={text}
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>

      <style jsx>{`
        .copyContainer {
          white-space: nowrap;
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
