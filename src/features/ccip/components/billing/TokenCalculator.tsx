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

interface TitleKeyMapping {
  title: string
  supportedChain: SupportedChain
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

const isEnvironment = (value: string) => {
  return Object.values(Environment).includes(value as Environment)
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
  const [token, setToken] = useState("")
  const [tokens, setTokens] = useState<TokenDetails>() // All available tokens
  const [sourceBlockchain, setSourceBlockchain] = useState<{ title: string; key: SupportedChain } | undefined>()
  const [destinationBlockchain, setDestinationBlockchain] = useState<
    { title: string; key: SupportedChain } | undefined
  >()

  const [sourceBlockchains, setSourceBlockchains] = useState<SupportedChain[]>([])
  const [destinationBlockchains, setDestinationBlockchains] = useState<SupportedChain[]>([])
  const [fees, setFees] = useState<FeeDetails | undefined>()

  const titleToKeyMapping: Record<string, TitleKeyMapping> = [...sourceBlockchains, ...destinationBlockchains].reduce(
    (acc, supportedChain) => {
      const title = getTitle(supportedChain)
      if (!title) {
        console.error(`No title found for chain: ${supportedChain}`)
        return acc
      }
      const titleKey = title.toLowerCase()

      acc[titleKey] = {
        title,
        supportedChain,
      }

      return acc
    },
    {} as Record<string, TitleKeyMapping>
  )

  useEffect(() => {
    const data = fetchData("environments") as EnvironmentData
    if ("environments" in data) {
      setEnvironments(data.environments)
    }
  }, [])

  // Fetch tokens when environment is selected
  useEffect(() => {
    setToken("")
    setSourceBlockchain(undefined)
    setDestinationBlockchain(undefined)
    setFees(undefined)
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
    setDestinationBlockchain(undefined)
    setFees(undefined)
    if (token && environment) {
      const data = fetchData("blockchains", { token, tokens }) as BlockchainData
      if ("blockchains" in data) {
        setSourceBlockchains(data.blockchains)
      }
    }
  }, [token, environment])

  // Fetch destination blockchains when source blockchain is selected
  useEffect(() => {
    setDestinationBlockchain(undefined)
    setFees(undefined)
    if (token && environment && sourceBlockchain) {
      const data = fetchData("blockchains", { token, tokens, sourceBlockchain: sourceBlockchain.key })
      if ("blockchains" in data) {
        setDestinationBlockchains(data.blockchains)
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
      <input
        list="environments-list"
        value={environment}
        onInput={(e) => {
          const selectedValue = e.currentTarget.value

          if (isEnvironment(selectedValue)) {
            setEnvironment(selectedValue as Environment)
          } else if (selectedValue !== "") {
            console.error(`Invalid environment selected: ${selectedValue}`)
          } else {
            setEnvironment(undefined)
          }
        }}
        placeholder="Environment"
        style={inputAndButtonBaseStyle}
      />
      <datalist id="environments-list">
        {environments.map((env) => (
          <option key={env} value={env} />
        ))}
      </datalist>
      <input
        list="tokens"
        value={token}
        onInput={(e) => {
          const tokenInput = e.currentTarget.value
          const matchingToken = getTokensList(tokens).find((t: string) => t.toLowerCase() === tokenInput.toLowerCase())
          if (matchingToken) {
            setToken(matchingToken)
          } else {
            setToken("")
          }
        }}
        placeholder="Token"
        disabled={!environment}
        style={inputAndButtonBaseStyle}
      />
      <datalist id="tokens">
        {getTokensList(tokens).map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <input
        list="source-blockchains-list"
        value={sourceBlockchain ? sourceBlockchain.title : ""}
        onInput={(e) => {
          const inputTitle = e.currentTarget.value
          const inputTitleKey = inputTitle.toLowerCase()
          const matchingEntry = titleToKeyMapping[inputTitleKey]
          if (matchingEntry) {
            setSourceBlockchain({ title: matchingEntry.title, key: matchingEntry.supportedChain })
          } else {
            console.log(`No matching key found for title:  ${e.currentTarget.value}`)
            setSourceBlockchain(undefined)
          }
        }}
        placeholder="Source"
        disabled={!token}
        style={inputAndButtonBaseStyle}
      />
      <datalist id="source-blockchains-list">
        {sourceBlockchains.map((b: SupportedChain) => (
          <option key={b} value={getTitle(b)} />
        ))}
      </datalist>

      <input
        list="destination-blockchains-list"
        value={destinationBlockchain ? destinationBlockchain.title : ""}
        onInput={(e) => {
          const inputTitle = e.currentTarget.value
          const inputTitleKey = inputTitle.toLowerCase()
          const matchingEntry = titleToKeyMapping[inputTitleKey]
          if (matchingEntry) {
            setDestinationBlockchain({ title: matchingEntry.title, key: matchingEntry.supportedChain })
          } else {
            console.log(`No matching key found for title:  ${e.currentTarget.value}`)
            setDestinationBlockchain(undefined)
          }
        }}
        placeholder="Destination"
        disabled={!sourceBlockchain}
        style={inputAndButtonBaseStyle}
      />
      <datalist id="destination-blockchains-list">
        {destinationBlockchains.map((b: SupportedChain) => (
          <option key={b} value={getTitle(b)} />
        ))}
      </datalist>

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
