import { Tooltip as ChainlinkToolTip } from "@chainlink/components/src/Tooltip/Tooltip"

export const Tooltip = ({
  label,
  tip,
  imgURL = "https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat",
  style = {},
  labelStyle = {},
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
    width: "auto",
    height: "0.8em", // Adjusts size relative to font size
    maxWidth: "100%",
  }

  return (
    <div {...(!(Object.keys(style).length === 0) && { style })}>
      <span style={containerStyle}>
        <span style={textStyle}>{label}</span>
        <ChainlinkToolTip tip={tip}>
          <img src={imgURL} alt="info" style={tooltipIconStyle} />
        </ChainlinkToolTip>
      </span>
    </div>
  )
}
