/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { FunctionComponent } from "preact"
import BigNumber from "bignumber.js"
import { utils } from "ethers"
import { SimplePreactTooltip } from "./SimplePreactTooltip"

interface TokenExtraInfo {
  token: string
  address: string
  rateLimiterConfig: {
    capacity: string
    isEnabled: boolean
    rate: string
  }
  decimals: number
  poolMechanism?: string
}

interface TokenSearchProps {
  tokens: TokenExtraInfo[]
}

const normalizeNumber = (bigNum: BigNumber, decimals = 18) => {
  const divisor = new BigNumber(10).pow(decimals)
  const normalized = bigNum.dividedBy(divisor)

  return normalized.toNumber()
}

const display = (bigNum: string, decimals = 18) => {
  const numberWithoutDecimals = normalizeNumber(new BigNumber(bigNum), decimals).toString()
  return utils.commify(numberWithoutDecimals)
}

const formatTime = (seconds: number) => {
  const minute = 60
  const hour = 3600 // 60*60

  if (seconds < minute) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`
  } else if (seconds < hour && hour - seconds > 300) {
    // if the difference less than 5 minutes(300 seconds), round to hours
    const minutes = Math.round(seconds / minute)
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  } else {
    let hours = Math.floor(seconds / hour)
    const remainingSeconds = seconds % hour

    // Determine the nearest 5-minute interval
    let minutes = Math.round(remainingSeconds / minute / 5) * 5

    // Round up to the next hour if minutes are 60
    if (minutes === 60) {
      hours += 1
      minutes = 0
    }

    return `${hours}${
      minutes > 0
        ? ` hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes > 1 ? "s" : ""}`
        : ` hour${hours > 1 ? "s" : ""}`
    }`
  }
}

const displayRate = (capacity: string, rate: string, symbol: string, decimals = 18) => {
  const capacityNormalized = normalizeNumber(new BigNumber(capacity), decimals) // normalize capacity
  const rateNormalized = normalizeNumber(new BigNumber(rate), decimals) // normalize capacity

  const totalRefillTime = capacityNormalized / rateNormalized // in seconds
  const displayTime = `${formatTime(totalRefillTime)}`

  return {
    rateSecond: `${rateNormalized} ${symbol}/second`,
    maxThroughput: `Refills from 0 to ${utils.commify(capacityNormalized)} ${symbol} in ${displayTime}`,
  }
}

const TokenSearch: FunctionComponent<TokenSearchProps> = ({ tokens }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTokens, setFilteredTokens] = useState(tokens)

  const handleInput = (event) => {
    const newSearchTerm = event.currentTarget.value.toLowerCase()
    setSearchTerm(newSearchTerm)
    const newFilteredTokens = tokens.filter((token) => token.token.toLowerCase().includes(newSearchTerm))
    setFilteredTokens(newFilteredTokens)
  }

  return (
    <>
      <input type="text" placeholder="Search tokens..." value={searchTerm} onInput={handleInput} />
      <div style="overflow: visible; width: 100%; position: relative; z-index: 1;">
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Token Address</th>
                <th>Decimals</th>
                <th>
                  <div style="position: relative;">
                    <SimplePreactTooltip
                      label="Mechanism"
                      tip="Token pool mechanism: Lock & Mint, Burn & Mint, Lock & Unlock, Burn & Unlock"
                      labelStyle={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      tooltipStyle={{ marginTop: "8px", minWidth: "200px" }}
                    />
                  </div>
                </th>
                <th>
                  <div style="position: relative;">
                    <SimplePreactTooltip
                      label="Rate Limit Capacity"
                      tip="Maximum amount per transaction"
                      labelStyle={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      tooltipStyle={{ marginTop: "8px", minWidth: "200px" }}
                    />
                  </div>
                </th>
                <th>
                  <div style="position: relative;">
                    <SimplePreactTooltip
                      label="Rate Limit Refill Rate"
                      tip="Rate at which available capacity is replenished"
                      labelStyle={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                      tooltipStyle={{ marginTop: "8px", minWidth: "200px" }}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>{token.token}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{token.address}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{token.decimals}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{token.poolMechanism}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {token.rateLimiterConfig?.isEnabled
                        ? display(token.rateLimiterConfig.capacity, token.decimals) + " " + token.token
                        : "N/A"}
                    </td>
                    <td>
                      {token.rateLimiterConfig?.isEnabled
                        ? (() => {
                            const { rateSecond, maxThroughput } = displayRate(
                              token.rateLimiterConfig.capacity,
                              token.rateLimiterConfig.rate,
                              token.token,
                              token.decimals
                            )
                            return (
                              <div style={{ position: "relative" }}>
                                <SimplePreactTooltip
                                  label={rateSecond}
                                  tip={maxThroughput}
                                  labelStyle={{ fontWeight: "normal", whiteSpace: "nowrap" }}
                                  tooltipStyle={{ marginTop: "8px", minWidth: "200px" }}
                                />
                              </div>
                            )
                          })()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No token found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TokenSearch
