import { Tooltip } from "@features/common/Tooltip"

export const DonId = () => {
  return (
    <Tooltip
      tip={
        "The DON ID string is used for the Functions Toolkit NPM package, while the bytes32 hex is used for onchain DON calls."
      }
      label={"DON ID"}
    ></Tooltip>
  )
}
