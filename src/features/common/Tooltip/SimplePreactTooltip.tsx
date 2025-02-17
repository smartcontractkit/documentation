/** @jsxImportSource preact */
import { useState } from "preact/hooks"

export const SimplePreactTooltip = ({
  label,
  tip,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
  labelStyle = {},
  tooltipStyle = {},
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "help",
    ...labelStyle,
  }

  const iconStyle = {
    width: "0.8em",
    height: "0.8em",
    marginLeft: "2px",
    marginRight: "4px",
  }

  const defaultTooltipStyle = {
    position: "absolute",
    backgroundColor: "white",
    color: "var(--color-text-secondary)",
    padding: "8px 12px",
    borderRadius: "4px",
    right: "20%",
    whiteSpace: "normal",
    display: isVisible ? "block" : "none",
    fontSize: "12px",
    fontWeight: "normal",
    maxWidth: "200px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    zIndex: "1000",
    ...tooltipStyle,
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={containerStyle} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {label}
        <img src={imgURL} alt="Info" style={iconStyle} />
      </div>
      {isVisible && <div style={defaultTooltipStyle}>{tip}</div>}
    </div>
  )
}
