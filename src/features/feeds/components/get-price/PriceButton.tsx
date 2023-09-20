/** @jsxImportSource preact */
import button from "@chainlink/design-system/button.module.css"

export const PriceButton = ({
  buttonName,
  buttonFunction,
  value,
}: {
  buttonName: string
  buttonFunction: (e: Event) => void
  value: string
}) => {
  return (
    <div style={{ display: "flex", marginTop: "var(--space-2x)" }}>
      <button type="button" onClick={buttonFunction} className={button.secondary}>
        {buttonName}
      </button>
      <p
        style={{
          marginLeft: 20,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {value}
      </p>
    </div>
  )
}
