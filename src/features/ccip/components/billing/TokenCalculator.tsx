/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks"
import {
  Environment,
  NetworkFeeStructure,
  SupportedTokenConfig,
  TokenMechanism,
  Version,
  getAllEnvironments,
  getAllSupportedTokens,
  getTokenMechanism,
  calculateNetworkFeesForTokenMechanism,
} from "@config/data/ccip"
import { getTitle } from "@features/utils"
import { SupportedChain } from "@config"
import button from "@chainlink/design-system/button.module.css"
import { TokenCalculatorDropdown } from "./TokenCalculatorDropdown"

interface EnvironmentData {
  environments: Environment[]
}

interface TokenDetails {
  [sourceChain: string]: Record<SupportedChain, Record<SupportedChain, SupportedTokenConfig>> | never[]
}

interface TokenData {
  tokens: TokenDetails
}

interface BlockchainData {
  blockchains: SupportedChain[]
}

interface FeeDetails {
  token: string
  mechanism: TokenMechanism
  fee: NetworkFeeStructure
}

interface FeeData {
  fees: FeeDetails
}

type FetchDataReturn = EnvironmentData | TokenData | BlockchainData | FeeData | Record<string, never>

interface FetchParams {
  environment: Environment
  version: Version
  token: string
  tokens: TokenDetails
  sourceBlockchain: SupportedChain
  destinationBlockchain: SupportedChain
}

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
        return { blockchains: Object.keys(tokenData) as SupportedChain[] }
      } else if (sourceBlockchain && !destinationBlockchain) {
        return { blockchains: Object.keys(tokenData[sourceBlockchain]) as SupportedChain[] }
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

      console.log({ fees: { token, mechanism, fee: networkFee } })

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
  maxWidth: "10em",
}

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "left",
  alignItems: "center",
  gap: "0.5em",
  padding: "1em",
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
    // test for never[]
    console.error("No tokens found")
    return []
  }

  return Object.keys(tokens).sort()
}

const NetworkFeeCalculator = () => {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [environment, setEnvironment] = useState<Environment | undefined>()
  const [token, setToken] = useState<string | undefined>()
  const [tokens, setTokens] = useState<TokenDetails>() // All available tokens
  const [tokensDropDownReset, setTokensDropDownReset] = useState(false)
  const [sourceBlockchain, setSourceBlockchain] = useState<{ title: string; key: SupportedChain } | undefined>()
  const [sourceBlockchainDropdownReset, setSourceBlockchainDropDownReset] = useState(false)
  const [destinationBlockchain, setDestinationBlockchain] = useState<
    { title: string; key: SupportedChain } | undefined
  >()
  const [destinationBlockchainDropdownReset, setDestinationBlockchainDropDownReset] = useState(false)

  const [sourceBlockchains, setSourceBlockchains] = useState<{ title: string; key: SupportedChain }[]>([])
  const [destinationBlockchains, setDestinationBlockchains] = useState<{ title: string; key: SupportedChain }[]>([])
  const [fees, setFees] = useState<FeeDetails | undefined>()

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
    setSourceBlockchain(undefined)
    setSourceBlockchainDropDownReset((prev) => !prev)
    setDestinationBlockchain(undefined)
    setDestinationBlockchainDropDownReset((prev) => !prev)
    setFees(undefined)
    setSourceBlockchains([])
    setDestinationBlockchains([])

    if (token && environment) {
      const data = fetchData("blockchains", { token, tokens }) as BlockchainData
      if ("blockchains" in data) {
        const blockchains = data.blockchains.reduce((acc, chain) => {
          const title = getTitle(chain)
          if (title) {
            acc.push({ title, key: chain })
          } else {
            console.error(`No title found for chain: ${chain}`)
          }
          return acc
        }, [] as Array<{ title: string; key: SupportedChain }>)

        setSourceBlockchains(blockchains)
      }
    }
  }, [token, environment, tokens])

  useEffect(() => {
    setFees(undefined)
    setDestinationBlockchains([])
    setDestinationBlockchains([])
    if (token && environment && sourceBlockchain) {
      const data = fetchData("blockchains", { token, tokens, sourceBlockchain: sourceBlockchain.key })
      if ("blockchains" in data) {
        const blockchains = data.blockchains.reduce((acc, chain) => {
          const title = getTitle(chain)
          if (title) {
            acc.push({ title, key: chain })
          } else {
            console.error(`No title found for chain: ${chain}`)
          }
          return acc
        }, [] as Array<{ title: string; key: SupportedChain }>)
        setDestinationBlockchains(blockchains)
      }
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
        renderOption={(option) => <div>{option.toUpperCase()}</div>}
        optionToString={(option) => option.toUpperCase()}
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
          return sourceBlockchains.find((chain) => chain.title === value) as { title: string; key: SupportedChain }
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
          return destinationBlockchains.find((chain) => chain.title === value) as { title: string; key: SupportedChain }
        }}
        disabled={sourceBlockchain === undefined}
        style={inputAndButtonBaseStyle}
        resetTrigger={destinationBlockchainDropdownReset}
      />

      {/* Fetch Button */}
      <button onClick={handleGetNetworkFee} className={button.secondary} style={inputAndButtonBaseStyle}>
        Network Fee
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
            <th style={cellStyle}>(Wrapped) Gas Token</th>
            <th style={cellStyle}>LINK</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>{fees ? fees.token : ""}</td>
            <td style={cellStyle}>{fees ? fees.mechanism : ""}</td>
            <td style={cellStyle}>{fees ? fees.fee.gasTokenFee : ""}</td>
            <td style={cellStyle}>{fees ? fees.fee.linkFee : ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NetworkFeeCalculator
