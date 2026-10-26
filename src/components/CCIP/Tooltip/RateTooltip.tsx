import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { LaneFilter, SupportedTokenConfig, displayRate } from "~/config/data/ccip/index.ts"

function RateTooltip({
  destinationLane,
  inOutbound,
  symbol,
  decimals,
  position,
  showUnavailableText = false,
}: {
  destinationLane: SupportedTokenConfig
  inOutbound: LaneFilter
  symbol: string
  decimals: number
  position?: "top" | "bottom" | "left" | "right"
  showUnavailableText?: boolean
}) {
  if (!destinationLane.rateLimiterConfig?.[inOutbound === LaneFilter.Inbound ? "in" : "out"]?.isEnabled) {
    if (showUnavailableText) {
      return (
        <Tooltip
          label="Unavailable"
          tip="Rate limit data is currently unavailable. You can find the Token Pool rate limit by reading the Token Pool contract directly on the relevant blockchain."
          labelStyle={{
            marginRight: "5px",
          }}
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginBottom: "2px",
          }}
          position={position}
        />
      )
    }
    return <span>N/A</span>
  }
  const { rateSecond, maxThroughput } = displayRate(
    String(destinationLane.rateLimiterConfig?.[inOutbound === LaneFilter.Inbound ? "in" : "out"]?.capacity || 0),
    String(destinationLane.rateLimiterConfig?.[inOutbound === LaneFilter.Inbound ? "in" : "out"]?.rate || 0),
    symbol,
    decimals
  )

  return (
    <Tooltip
      label={rateSecond}
      tip={maxThroughput}
      labelStyle={{
        marginRight: "5px",
      }}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginBottom: "2px",
      }}
      position={position}
    />
  )
}

export default RateTooltip
