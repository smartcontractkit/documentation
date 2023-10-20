/** @jsxImportSource preact */
import { Tooltip } from "@chainlink/components"

export const DonId = () => {
  return (
    <div>
      <span>
        <span>DON ID</span>
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
