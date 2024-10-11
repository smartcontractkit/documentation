/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks"
import {
  Environment,
  getAllEnvironments,
  getAllSupportedTokens,
  getTokenMechanism,
  calculateNetworkFeesForTokenMechanism,
  Version,
} from "@config/data/ccip"
import { getTitle } from "@features/utils"
import { SupportedChain } from "@config"
import button from "@chainlink/design-system/button.module.css"
import { TokenCalculatorDropdown } from "./TokenCalculatorDropdown"
import {
  FetchParams,
  FetchDataReturn,
  TokenDetails,
  FeeDetails,
  EnvironmentData,
  TokenData,
  BlockchainData,
  FeeData,
  BlockchainTitle,
} from "./types"

const fetchData = (endpoint: string, fetchParams: Partial<FetchParams> = {}): FetchDataReturn => {
  const params = { version: Version.V1_2_0, ...fetchParams }
  const dataMapping = {
    environments: () => ({ environments: getAllEnvironments() }),
    tokens: (params: FetchParams) => ({
      tokens: getAllSupportedTokens(params as { environment: Environment; version: Version }),
    }),
    blockchains: (params: FetchParams) => {
      const { tokens, token, sourceBlockchain, destinationBlockchain } = params
      const tokenData = tokens[token]
      if (!sourceBlockchain) {
        if (!tokenData) {
          return { blockchains: [] }
        }
        return { blockchains: Object.keys(tokenData) as SupportedChain[] }
      } else if (sourceBlockchain && !destinationBlockchain) {
        const sourceData = tokenData[sourceBlockchain]
        if (sourceData) {
          return { blockchains: Object.keys(sourceData) as SupportedChain[] }
        } else {
          return { blockchains: [] }
        }
      }
    },
    fees: (params: FetchParams) => {
      const { token, sourceBlockchain, destinationBlockchain, environment, version } = params
      const mechanism = getTokenMechanism({
        token,
        sourceChain: sourceBlockchain,
        destinationChain: destinationBlockchain,
        environment,
        version,
      })

      const networkFee = calculateNetworkFeesForTokenMechanism(mechanism, sourceBlockchain, destinationBlockchain)

      return { fees: { token, mechanism, fee: networkFee } }
    },
  }

  const result = dataMapping[endpoint]
  if (!result) {
    console.error(`No data mapping found for endpoint: ${endpoint}`)
    return {}
  }

  return result(params)
}

const inputAndButtonBaseStyle = {
  flex: "1 1 auto",
  maxWidth: "9em",
}

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "left",
  alignItems: "center",
  gap: "0.5em",
  padding: "1em",
  overflowX: "auto",
}

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
  marginTop: "2em",
}

const cellStyle = {
  textAlign: "center",
  border: "1px solid #ddd",
  padding: "1em",
}

const getTokensList = (tokens: TokenDetails | undefined) => {
  if (!tokens) return []
  if (Array.isArray(tokens) && tokens.length === 0) {
    console.error("No tokens found")
    return []
  }

  return Object.keys(tokens).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
}

const NetworkFeeCalculator = () => {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [environment, setEnvironment] = useState<Environment | undefined>()
  const [token, setToken] = useState<string | undefined>()
  const [tokens, setTokens] = useState<TokenDetails>() // All available tokens
  const [tokensDropDownReset, setTokensDropDownReset] = useState(false)
  const [sourceBlockchain, setSourceBlockchain] = useState<BlockchainTitle | undefined>()
  const [sourceBlockchainDropdownReset, setSourceBlockchainDropDownReset] = useState(false)
  const [destinationBlockchain, setDestinationBlockchain] = useState<BlockchainTitle | undefined>()
  const [destinationBlockchainDropdownReset, setDestinationBlockchainDropDownReset] = useState(false)

  const [sourceBlockchains, setSourceBlockchains] = useState<BlockchainTitle[]>([])
  const [destinationBlockchains, setDestinationBlockchains] = useState<BlockchainTitle[]>([])
  const [fees, setFees] = useState<FeeDetails | undefined>()

  const fetchAndSetBlockchains = ({
    isSourceBlockchain = true,
    sourceBlockchainKey,
  }: {
    isSourceBlockchain: boolean
    sourceBlockchainKey?: SupportedChain
  }) => {
    setFees(undefined)
    if (isSourceBlockchain) {
      setSourceBlockchain(undefined)
      setSourceBlockchainDropDownReset((prev) => !prev)
      setSourceBlockchains([])
    } else {
      setDestinationBlockchain(undefined)
      setDestinationBlockchainDropDownReset((prev) => !prev)
      setDestinationBlockchains([])
    }

    // Determine the appropriate parameters for fetchData based on the context
    const fetchParams: Partial<FetchParams> = isSourceBlockchain
      ? { token, tokens }
      : { token, tokens, sourceBlockchain: sourceBlockchainKey }
    const data = fetchData("blockchains", fetchParams) as BlockchainData

    if ("blockchains" in data) {
      const blockchains = data.blockchains
        .reduce((acc, chain) => {
          let title = getTitle(chain)
          if (title) {
            title = title.replace(/(mainnet|testnet)$/i, "").trim()
            acc.push({ title, key: chain })
          } else {
            console.error(`No title found for chain: ${chain}`)
          }
          return acc
        }, [] as Array<BlockchainTitle>)
        .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))

      if (isSourceBlockchain) {
        setSourceBlockchains(blockchains)
      } else {
        setDestinationBlockchains(blockchains)
      }
    }
  }

  useEffect(() => {
    const data = fetchData("environments") as EnvironmentData
    if ("environments" in data) {
      setEnvironments(data.environments)
    }
  }, [])

  // Fetch tokens when environment is selected
  useEffect(() => {
    setToken(undefined)
    setTokensDropDownReset((prev) => !prev)
    setSourceBlockchain(undefined)
    setSourceBlockchainDropDownReset((prev) => !prev)
    setDestinationBlockchain(undefined)
    setDestinationBlockchainDropDownReset((prev) => !prev)
    setFees(undefined)
    setSourceBlockchains([])
    setDestinationBlockchains([])
    if (environment) {
      const data = fetchData("tokens", { environment }) as TokenData
      if ("tokens" in data) {
        setTokens(data.tokens)
      }
    }
  }, [environment])

  // Fetch source blockchains when token is selected
  useEffect(() => {
    if (token && environment) {
      fetchAndSetBlockchains({ isSourceBlockchain: true })
    }
  }, [token, environment, tokens])

  useEffect(() => {
    if (token && environment && sourceBlockchain) {
      fetchAndSetBlockchains({ isSourceBlockchain: false, sourceBlockchainKey: sourceBlockchain.key })
    }
  }, [sourceBlockchain, token, environment])

  useEffect(() => {
    setFees(undefined)
  }, [sourceBlockchain, token, environment, destinationBlockchain])

  const handleGetNetworkFee = () => {
    if (isButtonDisabled) return
    if (!environment || !token || !sourceBlockchain || !destinationBlockchain) {
      console.error("Missing required parameters")
      setFees(undefined)
    } else {
      const feeData = fetchData("fees", {
        environment,
        token,
        sourceBlockchain: sourceBlockchain.key,
        destinationBlockchain: destinationBlockchain.key,
      }) as FeeData

      if (feeData && feeData.fees) {
        setFees(feeData.fees)
      } else {
        console.error("Failed to fetch fees data or data is in an unexpected format.")
      }
    }
  }

  const isButtonDisabled = !(environment && token && sourceBlockchain && destinationBlockchain)

  return (
    <div style={containerStyle}>
      {/* Environment Dropdown */}
      <TokenCalculatorDropdown
        options={environments}
        placeholder="Environment"
        onSelect={(environment) => {
          setEnvironment(environment)
        }}
        filterFunction={(option, filter) => option.toLowerCase().includes(filter.toLowerCase())}
        renderOption={(option) => (
          <div>{option ? option.charAt(0).toUpperCase() + option.slice(1).toLowerCase() : ""}</div>
        )}
        optionToString={(option) => (option ? option.charAt(0).toUpperCase() + option.slice(1).toLowerCase() : "")}
        stringToOption={(value) => {
          if (value === "") return undefined
          return environments.find((environment) => environment.toLowerCase() === value.toLowerCase()) as Environment
        }}
        style={inputAndButtonBaseStyle}
      />
      <TokenCalculatorDropdown
        options={getTokensList(tokens)}
        placeholder="Token"
        onSelect={(token) => setToken(token)}
        filterFunction={(token, filter) => token.toLowerCase().includes(filter.toLowerCase())}
        renderOption={(option) => <div>{option}</div>}
        optionToString={(option) => option}
        stringToOption={(value) => {
          if (value === "") return undefined
          return value
        }}
        disabled={environment === undefined || environment.toString() === ""}
        style={inputAndButtonBaseStyle}
        resetTrigger={tokensDropDownReset}
      />

      <TokenCalculatorDropdown
        options={sourceBlockchains}
        placeholder="Source"
        onSelect={(chain) => setSourceBlockchain(chain)}
        filterFunction={(chain, filter) => chain.title.toLowerCase().includes(filter.toLowerCase())}
        renderOption={(option) => <div>{option.title}</div>}
        optionToString={(option) => option.title}
        stringToOption={(value) => {
          if (value === "") return undefined
          return sourceBlockchains.find((chain) => chain.title === value) as BlockchainTitle
        }}
        disabled={token === undefined}
        style={inputAndButtonBaseStyle}
        resetTrigger={sourceBlockchainDropdownReset}
      />

      <TokenCalculatorDropdown
        options={destinationBlockchains}
        placeholder="Destination"
        onSelect={(chain) => setDestinationBlockchain(chain)}
        filterFunction={(chain, filter) => chain.title.toLowerCase().includes(filter.toLowerCase())}
        renderOption={(option) => <div>{option.title}</div>}
        optionToString={(option) => option.title}
        stringToOption={(value) => {
          if (value === "") return undefined
          return destinationBlockchains.find((chain) => chain.title === value) as BlockchainTitle
        }}
        disabled={sourceBlockchain === undefined}
        style={inputAndButtonBaseStyle}
        resetTrigger={destinationBlockchainDropdownReset}
      />

      {/* Fetch Button */}
      <button onClick={handleGetNetworkFee} className={button.secondary} style={inputAndButtonBaseStyle}>
        Calculate
      </button>

      {/* Fees Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th rowSpan={2} style={cellStyle}>
              Token
            </th>
            <th rowSpan={2} style={cellStyle}>
              Mechanism
            </th>
            <th colSpan={2} style={cellStyle}>
              Fee Token
            </th>
          </tr>
          <tr>
            <th style={cellStyle}>LINK</th>
            <th style={cellStyle}>Others</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>{fees ? fees.token : ""}</td>
            <td style={cellStyle}>{fees ? fees.mechanism : ""}</td>
            <td style={cellStyle}>{fees ? fees.fee.linkFee : ""}</td>
            <td style={cellStyle}>{fees ? fees.fee.gasTokenFee : ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NetworkFeeCalculator
