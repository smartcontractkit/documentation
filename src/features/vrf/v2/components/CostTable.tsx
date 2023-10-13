/** @jsxImportSource preact */
import { Chain, ChainNetwork, getNetworkFromQueryString } from "~/features/data/chains"
import "./costTable.css"
import { useCallback, useEffect, useReducer } from "preact/hooks"
import { BigNumber, utils } from "ethers"
import button from "@chainlink/design-system/button.module.css"

interface Props {
  method: "vrfSubscription" | "vrfDirectFunding"
  network: string
  aside: HTMLElement | undefined
}

interface directFundingResponse {
  wrapperGasOverhead: number
  currentVerificationGas: number
  wrapperLinkPremiumPercentage: number
}

interface dataResponse {
  gasPrice: string
  L1GasPriceEstimate: string | undefined
  callbackGasLimit: number
  gasLaneList: number[]
  currentLINKPriceFeed: string
  decimalPlaces: number
  LINKPremium: number
  directFunding: directFundingResponse | Record<string, never>
}

interface State {
  isLoading: boolean
  networkName: string
  mainChain: Chain | null
  mainChainNetwork: ChainNetwork | null
  gasPrice: string
  L1GasPriceEstimate: string | undefined
  currentL1GasPriceEstimate: string
  currentGasPrice: string
  LINKPremium: number
  callbackGasLimit: number
  decimalPlaces: number
  callbackGas: number
  wrapperOverheadGas: number
  gasLaneList: number[] | null
  currentGasLane: number
  currentVerificationGas: number
  priceFeed: string
  wrapperLinkPremiumPercentage: number
  totalGasLimit: number
  total: string
  maxCost: string
}

interface CacheEntry {
  data: dataResponse
  latestCacheUpdate: number
}

interface UpdateChainResponse {
  networkName: string
  chain: Chain
  chainNetwork: ChainNetwork
}

type Cache = {
  [key: string]: CacheEntry
}

const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5 min in milliseconds

const initialState: State = {
  isLoading: true,
  networkName: "",
  mainChain: null,
  mainChainNetwork: null,
  gasPrice: "0",
  L1GasPriceEstimate: "0",
  currentL1GasPriceEstimate: "0",
  currentGasPrice: "1",
  LINKPremium: 0.5,
  decimalPlaces: 0,
  callbackGasLimit: 0,
  callbackGas: 0,
  wrapperOverheadGas: 0,
  gasLaneList: null,
  currentGasLane: 0,
  currentVerificationGas: 115000,
  priceFeed: "",
  wrapperLinkPremiumPercentage: 0,
  totalGasLimit: 0,
  total: "0.00",
  maxCost: "0.00",
}

type Action =
  | { type: "UPDATE_STATE"; payload: Partial<State> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NETWORK_NAME"; payload: string }
  | { type: "SET_MAIN_CHAIN"; payload: Chain }
  | { type: "SET_MAIN_CHAIN_NETWORK"; payload: ChainNetwork }
  | { type: "SET_GAS_PRICE"; payload: string }
  | { type: "SET_CURRENT_GAS_PRICE"; payload: string }
  | { type: "SET_CALLBACK_GAS_LIMIT"; payload: number }
  | { type: "SET_CALLBACK_GAS"; payload: number }
  | { type: "SET_LINK_PREMIUM"; payload: number }
  | { type: "SET_DECIMAL_PLACES"; payload: number }
  | { type: "SET_GAS_LANE_LIST"; payload: number[] }
  | { type: "SET_CURRENT_GAS_LANE"; payload: number }
  | { type: "SET_CURRENT_VERIFICATION_GAS"; payload: number }
  | { type: "SET_PRICE_FEED"; payload: string }
  | { type: "SET_WRAPPER_LINK_PREMIUM_PERCENTAGE"; payload: number }
  | { type: "SET_TOTAL"; payload: string }
  | { type: "SET_MAX_COST"; payload: string }
  | { type: "SET_CURRENT_L1_GAS_PRICE_ESTIMATE"; payload: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return Object.assign({}, state, action.payload)
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_NETWORK_NAME":
      return { ...state, networkName: action.payload }
    case "SET_MAIN_CHAIN":
      return { ...state, mainChain: action.payload }
    case "SET_MAIN_CHAIN_NETWORK":
      return { ...state, mainChainNetwork: action.payload }
    case "SET_GAS_PRICE":
      return { ...state, gasPrice: action.payload, currentGasPrice: action.payload }
    case "SET_CURRENT_GAS_PRICE":
      return { ...state, currentGasPrice: action.payload }
    case "SET_CALLBACK_GAS_LIMIT":
      return { ...state, callbackGasLimit: action.payload }
    case "SET_CALLBACK_GAS":
      return { ...state, callbackGas: action.payload }
    case "SET_LINK_PREMIUM":
      return { ...state, LINKPremium: action.payload }
    case "SET_DECIMAL_PLACES":
      return { ...state, decimalPlaces: action.payload }
    case "SET_GAS_LANE_LIST":
      return { ...state, gasLaneList: action.payload, currentGasLane: action.payload[0] }
    case "SET_CURRENT_GAS_LANE":
      return { ...state, currentGasLane: action.payload }
    case "SET_CURRENT_VERIFICATION_GAS":
      return { ...state, currentVerificationGas: action.payload }
    case "SET_PRICE_FEED":
      return { ...state, priceFeed: action.payload }
    case "SET_WRAPPER_LINK_PREMIUM_PERCENTAGE":
      return { ...state, wrapperLinkPremiumPercentage: action.payload }
    case "SET_TOTAL":
      return { ...state, total: action.payload }
    case "SET_MAX_COST":
      return { ...state, maxCost: action.payload }
    case "SET_CURRENT_L1_GAS_PRICE_ESTIMATE":
      return { ...state, currentL1GasPriceEstimate: action.payload }
    default:
      return state
  }
}

const cache: Cache = {}

export const getGasCalculatorUrl = ({
  mainChainName,
  networkName,
  chainNetwork,
  method,
}: {
  mainChainName: string
  networkName: string
  chainNetwork: ChainNetwork
  method: "vrfSubscription" | "vrfDirectFunding"
}) => {
  return `https://vrf.chain.link/api/calculator?networkName=${mainChainName}&networkType=${
    networkName === mainChainName ? chainNetwork.networkType.toLowerCase() : networkName
  }&method=${method === "vrfSubscription" ? "subscription" : "directFunding"}`
}

export const CostTable = ({ method, network, aside }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const getDataResponse = useCallback(
    async (mainChainName: string, networkName: string, chainNetwork: ChainNetwork): Promise<dataResponse> => {
      const cacheKey = `${mainChainName}-${
        networkName === mainChainName ? state.mainChainNetwork?.networkType : networkName
      }-${method === "vrfSubscription" ? "subscription" : "directFunding"}`
      if (cache[cacheKey] && cache[cacheKey].latestCacheUpdate - Date.now() < CACHE_EXPIRY_TIME) {
        return cache[cacheKey].data
      }
      const response = await fetch(getGasCalculatorUrl({ mainChainName, networkName, chainNetwork, method }), {
        method: "GET",
      })
      const json: dataResponse = await response.json()
      cache[cacheKey] = {
        data: json,
        latestCacheUpdate: Date.now(),
      }
      return json
    },
    [method]
  )

  const getChainAndNetworkValues = async (): Promise<UpdateChainResponse | null> => {
    if (typeof network !== "string" || network === "") return null

    const { chain, chainNetwork } = getNetworkFromQueryString(network)
    const networkName = network.split("-")[1]

    if (!chainNetwork || !networkName || !chain) {
      return null
    }

    return { networkName, chain, chainNetwork }
  }

  const fillInputs = useCallback(
    async (network: string) => {
      try {
        if (!state.isLoading) {
          dispatch({
            type: "SET_LOADING",
            payload: true,
          })
        }
        const updatedChainAndNetworkValues = await getChainAndNetworkValues()
        if (!updatedChainAndNetworkValues) return

        const { networkName, chain, chainNetwork } = updatedChainAndNetworkValues

        const responseJson = await getDataResponse(network.split("-")[0], networkName, chainNetwork)

        const {
          gasPrice,
          L1GasPriceEstimate,
          callbackGasLimit,
          LINKPremium,
          decimalPlaces,
          gasLaneList,
          currentLINKPriceFeed,
          directFunding,
        } = responseJson

        const updatedState = {
          ...initialState,
          gasPrice,
          networkName,
          mainChain: chain,
          mainChainNetwork: chainNetwork,
          L1GasPriceEstimate,
          currentL1GasPriceEstimate: L1GasPriceEstimate,
          decimalPlaces,
          currentGasPrice: gasPrice,
          callbackGasLimit,
          LINKPremium,
          gasLaneList,
          currentGasLane: gasLaneList[0] || 0,
          priceFeed: currentLINKPriceFeed,
        }

        if (Object.keys(directFunding).length) {
          updatedState.wrapperOverheadGas = directFunding.wrapperGasOverhead
          updatedState.currentVerificationGas = directFunding.currentVerificationGas
          updatedState.wrapperLinkPremiumPercentage = directFunding.wrapperLinkPremiumPercentage
        }

        dispatch({ type: "UPDATE_STATE", payload: updatedState })
      } catch (error) {
        console.error(error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [getDataResponse, network]
  )

  useEffect(() => {
    fillInputs(network)
  }, [fillInputs])

  const handleRadioChange = (event) => {
    dispatch({ type: "SET_CURRENT_GAS_LANE", payload: parseInt(event.target.value) })
  }

  const computeArbitrumCost = () => {
    const VRFCallDataSizeBytes = 140 + 580
    const {
      L1GasPriceEstimate,
      currentL1GasPriceEstimate,
      gasPrice,
      currentGasPrice,
      decimalPlaces,
      currentVerificationGas,
      currentGasLane,
      callbackGas,
      LINKPremium,
      priceFeed,
      wrapperOverheadGas,
    } = state
    // If currentGasPrice is 0, it will throw a division by zero error. So, let's adjust it to a very small value to still give an approximation of the cost.
    const formattedCurrentGasPrice =
      parseFloat(currentGasPrice) === 0 && BigNumber.from(currentGasPrice).toNumber() === 0
        ? "0.000001"
        : currentGasPrice
    const L1P =
      currentL1GasPriceEstimate === L1GasPriceEstimate
        ? BigNumber.from(currentL1GasPriceEstimate)
        : utils.parseUnits(currentL1GasPriceEstimate, "gwei")
    const L2P =
      currentGasPrice === gasPrice
        ? BigNumber.from(formattedCurrentGasPrice)
        : utils.parseUnits(formattedCurrentGasPrice, "gwei")

    const L2PGasLane = utils.parseUnits(currentGasLane.toString(), "gwei")
    const VRFL1CostEstimate = L1P.mul(VRFCallDataSizeBytes)
    const bigNumberPriceFeed = utils.formatUnits(BigNumber.from(priceFeed), decimalPlaces)
    const formattedPriceFeed = utils.parseEther(bigNumberPriceFeed)
    const VRFL1Buffer = VRFL1CostEstimate.div(L2P)
    const VRFL1GasLaneBuffer = VRFL1CostEstimate.div(L2PGasLane)
    const bigNumberLINKPremium = utils.parseUnits(LINKPremium.toString())
    if (method === "vrfSubscription") {
      const VRFL2SubscriptionGasSubtotal = BigNumber.from(currentVerificationGas + callbackGas)
      const VRFSubscriptionGasTotal = VRFL2SubscriptionGasSubtotal.add(VRFL1Buffer)
      const VRFSubscriptionGasEstimate = L2P.mul(VRFSubscriptionGasTotal)

      const VRFSubscriptionMaxCostTotal = VRFL2SubscriptionGasSubtotal.add(VRFL1GasLaneBuffer)
      const VRFSubscriptionMaxCostEstimate = L2PGasLane.mul(VRFSubscriptionMaxCostTotal)

      const formattedGasEstimate = utils.parseEther(VRFSubscriptionGasEstimate.toString())
      const VRFSubscriptionGasEstimateTotal = utils.formatUnits(
        formattedGasEstimate.div(formattedPriceFeed).add(bigNumberLINKPremium).toString(),
        decimalPlaces
      )

      const formattedMaxCostEstimate = utils.parseEther(VRFSubscriptionMaxCostEstimate.toString())
      const VRFSubscriptionMaxCostEstimateTotal = utils.formatUnits(
        formattedMaxCostEstimate.div(formattedPriceFeed).add(bigNumberLINKPremium).toString(),
        decimalPlaces
      )

      dispatch({
        type: "UPDATE_STATE",
        payload: {
          total: VRFSubscriptionGasEstimateTotal,
          maxCost: VRFSubscriptionMaxCostEstimateTotal,
        },
      })
    } else {
      const VRFL2DirectFundingGasSubtotal = BigNumber.from(currentVerificationGas + wrapperOverheadGas + callbackGas)
      const VRFDirectFundingGasTotal = VRFL2DirectFundingGasSubtotal.add(VRFL1Buffer)
      const VRFDirectFundingGasEstimate = L2P.mul(VRFDirectFundingGasTotal)

      const formattedGasEstimate = utils.parseEther(VRFDirectFundingGasEstimate.toString())
      const VRFDirectFundingGasEstimateTotal = utils.formatUnits(
        formattedGasEstimate.div(formattedPriceFeed).add(bigNumberLINKPremium).toString(),
        decimalPlaces
      )

      dispatch({
        type: "SET_TOTAL",
        payload: VRFDirectFundingGasEstimateTotal,
      })
    }
  }

  const getsupportedNetworkShortcut = () => {
    const chainName = state.mainChain?.label.toLowerCase()
    switch (chainName) {
      case "ethereum":
        if (state.networkName !== "mainnet") {
          return `${state.networkName}-${state.mainChainNetwork?.networkType}`
        }
        return `${chainName}-${state.mainChainNetwork?.networkType}`
      case "bnb chain":
        return `${chainName.replace(" ", "-")}${
          state.mainChainNetwork?.networkType === "testnet" ? "-" + state.mainChainNetwork.networkType : ""
        }`
      case "polygon (matic)":
        return `polygon-matic-${
          state.mainChainNetwork?.networkType === "testnet"
            ? state.networkName + "-" + state.mainChainNetwork?.networkType
            : state.mainChainNetwork?.networkType
        }`
      case "avalanche":
        return `${chainName}-${
          state.mainChainNetwork?.networkType === "testnet"
            ? state.networkName + "-" + state.mainChainNetwork?.networkType
            : state.mainChainNetwork?.networkType
        }`
      case "fantom":
        return `${chainName}-${state.mainChainNetwork?.networkType}`
      case "arbitrum":
        return `${chainName}-${
          state.mainChainNetwork?.networkType === "testnet"
            ? state.networkName + "-" + state.mainChainNetwork?.networkType
            : state.mainChainNetwork?.networkType
        }`
      default:
        throw new Error("network/chain does not exist or is not supported by VRF yet.")
    }
  }

  const computeTotalRequestCost = () => {
    if (state.mainChain && state.mainChain.label.toLowerCase() === "arbitrum") {
      computeArbitrumCost()
      return
    }
    const {
      currentGasPrice,
      gasPrice,
      decimalPlaces,
      callbackGas,
      currentVerificationGas,
      priceFeed,
      currentGasLane,
      LINKPremium,
      wrapperOverheadGas,
      wrapperLinkPremiumPercentage,
    } = state
    const bigNumberGasPrice =
      currentGasPrice === gasPrice ? BigNumber.from(currentGasPrice) : utils.parseUnits(currentGasPrice, "gwei")
    const bigNumberGasLane = utils.parseUnits(currentGasLane.toString(), "gwei")
    const bigNumberPriceFeed = utils.formatUnits(BigNumber.from(priceFeed), decimalPlaces)
    const formattedPriceFeed = utils.parseEther(bigNumberPriceFeed)
    if (method === "vrfSubscription") {
      const vrfSubscriptionGasSubTotal = BigNumber.from(callbackGas + currentVerificationGas)

      const addition = bigNumberGasPrice.mul(vrfSubscriptionGasSubTotal)
      const maxCostAddition = bigNumberGasLane.mul(vrfSubscriptionGasSubTotal)

      const formattedMaxCostAddition = utils.parseEther(maxCostAddition.toString())
      const formattedAddition = utils.parseEther(addition.toString())

      const total = utils.formatUnits(formattedAddition.div(formattedPriceFeed).toString(), decimalPlaces)
      const maxCost = utils.formatUnits(formattedMaxCostAddition.div(formattedPriceFeed).toString(), decimalPlaces)
      const [result, maxResult] = [parseFloat(total) + LINKPremium, parseFloat(maxCost) + LINKPremium]
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          total: result.toString(),
          maxCost: maxResult.toString(),
        },
      })
    } else {
      const vrfDirectFundingGasSubTotal = BigNumber.from(callbackGas + currentVerificationGas + wrapperOverheadGas)
      const totalGasCost = bigNumberGasPrice.mul(vrfDirectFundingGasSubTotal)
      const formattedTotalGasCost = utils.parseEther(totalGasCost.toString())
      const totalGasCostInToken = utils.formatUnits(
        formattedTotalGasCost.div(formattedPriceFeed).toString(),
        decimalPlaces
      )
      const total = LINKPremium + parseFloat(totalGasCostInToken) * (1 + wrapperLinkPremiumPercentage)
      dispatch({
        type: "SET_TOTAL",
        payload: total.toString(),
      })
    }
  }

  const handleChangeCallback = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      if (!target.value) {
        dispatch({
          type: "SET_CALLBACK_GAS",
          payload: 0,
        })
        return
      }
      const val = target.value.replaceAll(",", "")
      if (parseInt(val) >= state.callbackGasLimit) {
        dispatch({
          type: "SET_CALLBACK_GAS",
          payload: state.callbackGasLimit,
        })
      } else {
        dispatch({ type: "SET_CALLBACK_GAS", payload: parseInt(val) })
      }
    }
  }

  const handleChangeGas = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      const val = target.value || "0"
      dispatch({
        type: "SET_CURRENT_GAS_PRICE",
        payload: val,
      })
    }
  }

  const cleanGasValue = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      const val = parseFloat(target.value).toString()
      dispatch({
        type: "SET_CURRENT_GAS_PRICE",
        payload: val,
      })
    }
  }

  const handleChangeGasL1 = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      const val = target.value || "0"
      dispatch({
        type: "SET_CURRENT_L1_GAS_PRICE_ESTIMATE",
        payload: val,
      })
    }
  }

  const cleanL1GasValue = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      const val = parseFloat(target.value).toString()
      dispatch({
        type: "SET_CURRENT_L1_GAS_PRICE_ESTIMATE",
        payload: val,
      })
    }
  }

  const kebabize = (str: string) =>
    str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

  const getGasPrice = (gasPrice: string) => {
    const fullGasPrice = utils.formatUnits(BigNumber.from(gasPrice).toHexString(), "gwei")
    return parseFloat(fullGasPrice).toFixed(2)
  }

  // Format total VRF cost to stop after second non-zero decimal.
  const formatTotal = () => {
    if (state.total === "0.00") {
      return state.total
    }
    let idx = state.total.indexOf(".") + 1
    let countNonZeroDigits = 0
    let res = parseInt(state.total).toString().includes(".")
      ? parseInt(state.total).toString()
      : parseInt(state.total).toString() + "."
    while (countNonZeroDigits < 1) {
      if (state.total[idx] !== "0") {
        countNonZeroDigits++
      }
      res += state.total[idx]
      idx++
    }
    if (idx === state.total.length) {
      return res
    }
    if (parseInt(state.total[idx + 1]) >= 5) {
      const digitPlusOne = parseInt(state.total[idx]) + 1
      res += digitPlusOne.toString()
    } else {
      res += state.total[idx]
    }
    return res
  }

  // Format max VRF cost to stop after second non-zero decimal.
  const formatmaxCost = () => {
    if (state.maxCost === "0.00") {
      return state.maxCost
    }
    let idx = state.maxCost.indexOf(".") + 1
    let countNonZeroDigits = 0
    let res = parseInt(state.maxCost).toString().includes(".")
      ? parseInt(state.maxCost).toString()
      : parseInt(state.maxCost).toString() + "."
    while (countNonZeroDigits < 1) {
      if (state.maxCost[idx] !== "0") {
        countNonZeroDigits++
      }
      res += state.maxCost[idx]
      idx++
    }
    if (idx === state.maxCost.length) {
      return res
    }
    if (parseInt(state.maxCost[idx + 1]) >= 5) {
      const digitPlusOne = parseInt(state.maxCost[idx]) + 1
      res += digitPlusOne.toString()
    } else {
      res += state.maxCost[idx]
    }
    return res
  }

  if (state.isLoading) {
    return <p className="loading-text">Data is being fetched. Please wait a moment...</p>
  } else {
    return (
      <div className="table-container">
        <table>
          <tr>
            <th>Input</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Gas price (current is {getGasPrice(state.gasPrice)} gwei)</td>
            <td>
              <input
                type="number"
                id="gas"
                min={0}
                value={
                  state.currentGasPrice === state.gasPrice
                    ? utils.formatUnits(state.currentGasPrice, "gwei")
                    : state.currentGasPrice
                }
                onChange={handleChangeGas}
                onBlur={cleanGasValue}
              />
            </td>
          </tr>
          {state.mainChain && state.mainChain.label.toLowerCase() === "arbitrum" && state.L1GasPriceEstimate && (
            <tr>
              <td>L1 gas price (current is {getGasPrice(state.L1GasPriceEstimate)} gwei)</td>
              <td>
                <input
                  type="number"
                  id="L1Gas"
                  min={0}
                  value={
                    state.currentL1GasPriceEstimate === state.L1GasPriceEstimate
                      ? utils.formatUnits(state.currentL1GasPriceEstimate, "gwei")
                      : state.currentL1GasPriceEstimate
                  }
                  onChange={handleChangeGasL1}
                  onBlur={cleanL1GasValue}
                />
              </td>
            </tr>
          )}
          <tr>
            <td>Callback gas (max. {utils.commify(state.callbackGasLimit)})</td>
            <td>
              <input
                id="callback-gas-value"
                type="text"
                max={state.callbackGasLimit.toLocaleString()}
                value={utils.commify(state.callbackGas ?? "0")}
                onChange={handleChangeCallback}
              />
            </td>
          </tr>
          <tr>
            <td>
              {method === "vrfSubscription"
                ? "Average verification gas"
                : "Coordinator gas overhead (verification gas)"}
            </td>
            <td>{utils.commify(state.currentVerificationGas)}</td>
          </tr>
          <tr>
            {method === "vrfSubscription" && (
              <>
                <td>Gas lane (Hash)</td>
                <td>
                  {state.gasLaneList &&
                    state.gasLaneList.map((gasLane: number, index: number) => (
                      <>
                        {
                          <div className="keyhash-radio-container">
                            <input
                              type="radio"
                              name="keyHash"
                              className="radio-inputs"
                              id={gasLane.toString()}
                              value={gasLane}
                              checked={index === 0 || state.currentGasLane === gasLane}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor={gasLane.toString()}>{gasLane} gwei</label>
                          </div>
                        }
                      </>
                    ))}
                </td>
              </>
            )}
          </tr>
          {method === "vrfDirectFunding" && (
            <tr>
              <td>Wrapper overhead gas</td>
              <td>{state.wrapperOverheadGas}</td>
            </tr>
          )}
          <tr>
            <td>LINK premium</td>
            <td>{state.LINKPremium} LINK</td>
          </tr>
        </table>
        <div className="button-container">
          <button onClick={computeTotalRequestCost} class={button.secondary}>
            Calculate
          </button>
        </div>
        {method === "vrfSubscription" &&
          (state.currentGasPrice === state.gasPrice
            ? BigNumber.from(state.currentGasPrice).gt(utils.parseUnits(state.currentGasLane.toString(), "gwei"))
            : parseFloat(state.currentGasPrice) > state.currentGasLane) && (
            <div className="warning-container">{aside}</div>
          )}
        <h6>Estimated cost per request: {formatTotal()} LINK</h6>

        {method === "vrfSubscription" && (
          <>
            <h6>Maximum cost per request under the selected gas lane: {formatmaxCost()} LINK</h6>
            <p>
              If you use the subscription method, a minimum balance of LINK is required to use VRF. Check your balance
              at
              <a href="https://vrf.chain.link" target="_blank">
                {" "}
                vrf.chain.link
              </a>
              .
            </p>
          </>
        )}
        <p>
          To see these parameters in greater detail, read the
          {state.mainChain && (
            <a
              href={`/vrf/v2/${kebabize(
                method === "vrfSubscription" ? "subscription" : "directFunding"
              )}/supported-networks/#${getsupportedNetworkShortcut()}`}
              target="_blank"
            >
              {" "}
              Supported Networks{" "}
            </a>
          )}
          page.
        </p>
      </div>
    )
  }
}
