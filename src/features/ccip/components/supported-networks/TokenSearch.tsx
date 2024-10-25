/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { h, FunctionComponent } from "preact"
import BigNumber from "bignumber.js"
import { utils } from "ethers"
import { SupportedChain } from "@config"
import { getExplorer, getExplorerAddressUrl, getTokenIconUrl, fallbackTokenIconUrl } from "@features/utils"
import Address from "@components/Address"
import { SimplePreactTooltip } from "@features/common/Tooltip"
import { TokenExtraInfo } from "./types"

interface TokenSearchProps {
  tokens: TokenExtraInfo[]
  sourceChain: SupportedChain
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
    rateSecond: `${utils.commify(rateNormalized)} ${symbol}/second`,
    maxThroughput: `Refills from 0 to ${utils.commify(capacityNormalized)} ${symbol} in ${displayTime}`,
  }
}

const TokenSearch: FunctionComponent<TokenSearchProps> = ({ tokens, sourceChain }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTokens, setFilteredTokens] = useState(tokens)

  const explorerUrl = getExplorer(sourceChain)

  if (!explorerUrl) throw Error(`Explorer url not found for ${sourceChain}`)

  const handleInput = (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
    const newSearchTerm = event.currentTarget.value.toLowerCase()
    setSearchTerm(newSearchTerm)
    const newFilteredTokens = tokens.filter(
      (token) => token.token.toLowerCase().includes(newSearchTerm) || token.symbol.toLowerCase().includes(newSearchTerm)
    )
    setFilteredTokens(newFilteredTokens)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search tokens..."
        value={searchTerm}
        onInput={handleInput}
        style={{
          height: "42px",
          border: "var(--border-width-primary) solid var(--color-border-primary)",
          backgroundImage:
            "url(https://smartcontract.imgix.net/icons/searchIcon_blue_noborder.svg?auto=compress%2Cformat)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left var(--space-2x) top 50%",
          paddingLeft: "var(--space-8x)",
          backgroundSize: "16px",
          maxWidth: "250px",
        }}
      />

      <div style="overflow: auto; width: 100%; max-height: 350px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="position: sticky; top: 0; background: white; z-index: 1;">
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
              filteredTokens.map((token) => {
                const [imgSrc, setImgSrc] = useState(getTokenIconUrl(token.symbol))
                return (
                  <tr key={token.symbol}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <img
                        width="16"
                        height="16"
                        src={imgSrc}
                        alt={`${token.symbol} icon`}
                        style={{ marginRight: "8px" }}
                        onError={() => setImgSrc(fallbackTokenIconUrl)}
                      />
                      {token.symbol}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Address
                        address={token.address}
                        contractUrl={getExplorerAddressUrl(explorerUrl)(token.address)}
                        endLength={4}
                        eventName="docs_product_interaction"
                        additionalInfo={{
                          product: "CCIP",
                          action: "ccip_supportedTokenAddress_copied",
                          extraInfo1: sourceChain,
                          extraInfo2: token.symbol,
                        }}
                      />
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{token.decimals}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{token.poolMechanism}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {token.rateLimiterConfig?.out?.isEnabled
                        ? display(token.rateLimiterConfig.out?.capacity, token.decimals) + " " + token.symbol
                        : "N/A"}
                    </td>
                    <td>
                      {token.rateLimiterConfig?.out?.isEnabled
                        ? (() => {
                            const { rateSecond, maxThroughput } = displayRate(
                              token.rateLimiterConfig.out?.capacity,
                              token.rateLimiterConfig.out?.rate,
                              token.symbol,
                              token.decimals
                            )
                            return (
                              <div style={{ position: "relative" }}>
                                <SimplePreactTooltip
                                  label={rateSecond}
                                  tip={maxThroughput}
                                  labelStyle={{ fontWeight: "normal", whiteSpace: "nowrap" }}
                                  tooltipStyle={{ marginTop: "8px", minWidth: "200px", bottom: "110%" }}
                                />
                              </div>
                            )
                          })()
                        : "N/A"}
                    </td>
                  </tr>
                )
              })
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
    </>
  )
}

export default TokenSearch
