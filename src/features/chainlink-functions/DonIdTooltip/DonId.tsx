import { Tooltip } from "@chainlink/components"

export const DonId = () => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
  }

  const textStyle = {
    marginRight: "0.25em", // using viewport width units for responsive margin
  }

  return (
    <div>
      <span style={containerStyle}>
        <span style={textStyle}>DON ID</span>
        <Tooltip
          tip={
            "The DON ID string is used for the Functions Toolkit NPM package, while the bytes32 hex is used for onchain DON calls."
          }
        >
          <img src="https://smartcontract.imgix.net/icons/info.svg" width={12} height={12} />
        </Tooltip>
      </span>
    </div>
  )
}
