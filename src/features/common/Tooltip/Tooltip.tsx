import { Tooltip as ChainlinkToolTip } from "@chainlink/components/src/Tooltip/Tooltip.tsx"

export const Tooltip = ({
  label,
  tip,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
  style = {},
  labelStyle = {},
  position = "top" as "top" | "bottom" | "right" | "left",
}) => {
  // setting default width and height
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const textStyle = {
    marginRight: "2%", // more responsive to work with % than px
    ...labelStyle,
  }

  const tooltipIconStyle = {
    width: "16px",
    height: "16px",
    minWidth: "16px",
    minHeight: "16px",
    objectFit: "contain" as const,
    display: "block",
  }

  return (
    <div {...(!(Object.keys(style).length === 0) && { style })}>
      <span style={containerStyle}>
        <span style={textStyle}>{label}</span>
        <ChainlinkToolTip tip={tip} position={position}>
          <img src={imgURL} alt="info" style={tooltipIconStyle} />
        </ChainlinkToolTip>
      </span>
    </div>
  )
}
