import { network, vrfChain } from "~/features/vrf/v2/data"
import "./costTable.css"
import { useEffect, useReducer } from "preact/hooks"
import { BigNumber, utils } from "ethers"
import button from "@chainlink/design-system/button.module.css"

interface Props {
  mainChain: vrfChain
  chain: network
  method: "subscription" | "directFunding"
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
  gasPrice: string
  L1GasPriceEstimate: string | undefined
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

type Cache = {
  [key: string]: CacheEntry
}

const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5 min in milliseconds

const initialState: State = {
  isLoading: false,
  gasPrice: "0",
  L1GasPriceEstimate: "0",
  currentGasPrice: "1",
  LINKPremium: 0.5,
  decimalPlaces: 0,
  callbackGasLimit: 0,
  callbackGas: 0,
  wrapperOverheadGas: 0,
  gasLaneList: null,
  currentGasLane: 0,
  currentVerificationGas: 200000,
  priceFeed: "",
  wrapperLinkPremiumPercentage: 0,
  totalGasLimit: 0,
  total: "0.00",
  maxCost: "0.00",
}

type Action =
  | { type: "UPDATE_STATE"; payload: Partial<State> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_GAS_PRICE"; payload: string }
  | { type: "SET_CURRENT_GAS_PRICE"; payload: string }
  | { type: "SET_CALLBACK_GAS_LIMIT"; payload: number }
  | { type: "SET_CALLBACK_GAS"; payload: number }
  | { type: "SET_LINK_PREMIUM"; payload: number }
  | { type: "SET_DECIMAL_PLACES"; payload: number }
  | { type: "SET_GAS_LANE_LIST"; payload: number[] | null }
  | { type: "SET_CURRENT_GAS_LANE"; payload: number }
  | { type: "SET_CURRENT_VERIFICATION_GAS"; payload: number }
  | { type: "SET_PRICE_FEED"; payload: string }
  | { type: "SET_WRAPPER_LINK_PREMIUM_PERCENTAGE"; payload: number }
  | { type: "SET_TOTAL"; payload: string }
  | { type: "SET_MAX_COST"; payload: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return Object.assign({}, state, action.payload)
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
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
    default:
      return state
  }
}

const cache: Cache = {}

export const CostTable = ({ mainChain, chain, method }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const getDataResponse = async (mainChainName: string, networkName: string): Promise<dataResponse> => {
    const cacheKey = `${mainChainName}-${networkName === mainChainName ? chain.type : networkName}-${method}`
    if (cache[cacheKey] && cache[cacheKey].latestCacheUpdate - Date.now() < CACHE_EXPIRY_TIME) {
      return cache[cacheKey].data
    }

    const response = await fetch(
      `https://vrf.chain.link/api/calculator?networkName=${mainChainName}&networkType=${
        networkName === mainChainName ? chain.type.toLowerCase() : networkName
      }&method=${method}`,
      { method: "GET" }
    )

    const json: dataResponse = await response.json()
    cache[cacheKey] = {
      data: json,
      latestCacheUpdate: Date.now(),
    }
    return json
  }

  useEffect(() => {
    const mainChainName =
      mainChain.name === "BNB Chain"
        ? mainChain.name.replace("Chain", "").replace(" ", "").toLowerCase()
        : mainChain.name.toLowerCase()
    const networkName =
      chain.name === "BNB Chain"
        ? chain.name.replace("Chain", "").replace(" ", "").toLowerCase()
        : chain.name.toLowerCase()
    dispatch({ type: "SET_LOADING", payload: true })
    const fillInputs = async () => {
      const responseJson: dataResponse = await getDataResponse(mainChainName, networkName)
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

      dispatch({
        type: "UPDATE_STATE",
        payload: {
          ...initialState,
          gasPrice,
          L1GasPriceEstimate,
          decimalPlaces,
          currentGasPrice: gasPrice,
          callbackGasLimit,
          LINKPremium,
          gasLaneList,
          currentGasLane: gasLaneList[0] || 0,
          priceFeed: currentLINKPriceFeed,
        },
      })
      if (Object.keys(directFunding).length) {
        dispatch({
          type: "UPDATE_STATE",
          payload: {
            wrapperOverheadGas: directFunding.wrapperGasOverhead,
            currentVerificationGas: directFunding.currentVerificationGas,
            wrapperLinkPremiumPercentage: directFunding.wrapperLinkPremiumPercentage,
          },
        })
      }
      dispatch({ type: "SET_LOADING", payload: false })
    }

    fillInputs().catch((error: Error) => {
      dispatch({ type: "SET_LOADING", payload: false })
      console.error(error)
    })

    return () => dispatch({ type: "SET_LOADING", payload: false })
  }, [method, mainChain, chain])

  const handleRadioChange = (event) => {
    dispatch({ type: "SET_CURRENT_GAS_LANE", payload: parseInt(event.target.value) })
  }

  const computeArbitrumCost = () => {
    const VRFCallDataSizeBytes = 140 + 580
    const {
      L1GasPriceEstimate,
      currentGasPrice,
      decimalPlaces,
      currentVerificationGas,
      currentGasLane,
      callbackGas,
      wrapperOverheadGas,
    } = state
    const L1P = BigNumber.from(L1GasPriceEstimate)
    const L2P = BigNumber.from(currentGasPrice)

    const L2PGasLane = utils.parseUnits(currentGasLane.toString(), "gwei")
    const VRFL1CostEstimate = L1P.mul(VRFCallDataSizeBytes)

    const VRFL1Buffer = VRFL1CostEstimate.div(L2P)
    const VRFL1GasLaneBuffer = VRFL1CostEstimate.div(L2PGasLane)
    if (method === "subscription") {
      const VRFL2SubscriptionGasSubtotal = BigNumber.from(currentVerificationGas + callbackGas)
      const VRFSubscriptionGasTotal = VRFL2SubscriptionGasSubtotal.add(VRFL1Buffer)
      const VRFSubscriptionGasEstimate = L2P.mul(VRFSubscriptionGasTotal)

      const VRFSubscriptionMaxCostTotal = VRFL2SubscriptionGasSubtotal.add(VRFL1GasLaneBuffer)
      const VRFSubscriptionMaxCostEstimate = L2PGasLane.mul(VRFSubscriptionMaxCostTotal)
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          total: utils.formatUnits(VRFSubscriptionGasEstimate, decimalPlaces),
          maxCost: utils.formatUnits(VRFSubscriptionMaxCostEstimate, decimalPlaces),
        },
      })
    } else {
      const VRFL2DirectFundingGasSubtotal = BigNumber.from(currentVerificationGas + wrapperOverheadGas + callbackGas)
      const VRFDirectFundingGasTotal = VRFL2DirectFundingGasSubtotal.add(VRFL1Buffer)
      const VRFDirectFundingGasEstimate = L2P.mul(VRFDirectFundingGasTotal)

      const VRFDirectFundingTotalWithGasLane = VRFL2DirectFundingGasSubtotal.add(VRFL1GasLaneBuffer)
      const VRFDirectFundingGasMaxCostEstimate = L2PGasLane.mul(VRFDirectFundingTotalWithGasLane)

      dispatch({
        type: "UPDATE_STATE",
        payload: {
          total: utils.formatUnits(VRFDirectFundingGasEstimate, decimalPlaces),
          maxCost: utils.formatUnits(VRFDirectFundingGasMaxCostEstimate, decimalPlaces),
        },
      })
    }
  }

  const getsupportedNetworkShortcut = () => {
    const mainChainName = mainChain.name.toLowerCase()
    switch (mainChainName) {
      case "ethereum":
        return `${mainChainName}-${chain.type}`
      case "bnb chain":
        return `${mainChainName}-chain${chain.type === "testnet" ? "-" + chain.type : ""}`
      case "polygon":
        return `${mainChainName}-matic-${chain.type === "testnet" ? chain.name + "-" + chain.type : chain.type}`
      case "avalanche":
        return `${mainChainName}-${chain.type === "testnet" ? chain.name + "-" + chain.type : chain.type}`
      case "fantom":
        return `${mainChainName}-${chain.type}`
      case "arbitrum":
        return `${mainChainName}-${chain.type === "testnet" ? chain.name + "-" + chain.type : chain.type}`
      default:
        throw new Error("network/chain does not exist or is not supported by VRF yet.")
    }
  }

  const computeTotalRequestCost = () => {
    if (mainChain.name.toLowerCase() === "arbitrum") {
      computeArbitrumCost()
      return
    }
    const {
      currentGasPrice,
      decimalPlaces,
      callbackGas,
      currentVerificationGas,
      priceFeed,
      currentGasLane,
      LINKPremium,
      wrapperOverheadGas,
      wrapperLinkPremiumPercentage,
    } = state
    const bigNumberGasPrice = BigNumber.from(currentGasPrice)
    const bigNumberGasLane = utils.parseUnits(currentGasLane.toString(), "gwei")
    const bigNumberPriceFeed = utils.formatUnits(BigNumber.from(priceFeed), decimalPlaces)
    const formattedPriceFeed = utils.parseEther(bigNumberPriceFeed)
    if (method === "subscription") {
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
      const val = target.value
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
      const val = target.value || "0.0"
      dispatch({ type: "SET_CURRENT_GAS_PRICE", payload: utils.parseUnits(val, "gwei").toString() })
    }
  }

  const kebabize = (str: string) =>
    str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

  const getGasPrice = () => {
    const fullGasPrice = utils.formatUnits(BigNumber.from(state.gasPrice).toHexString(), "gwei")
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

  // Format total VRF cost to stop after second non-zero decimal.
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
            <td>Gas price (current is {getGasPrice()} gwei)</td>
            <td>
              <input
                type="number"
                id="gas"
                min={1}
                value={utils.formatUnits(state.currentGasPrice, "gwei")}
                onBlur={handleChangeGas}
              />
            </td>
          </tr>
          <tr>
            <td>Callback gas chosen (max. {utils.commify(state.callbackGasLimit)})</td>
            <td>
              <input
                id="callback-gas-value"
                type="number"
                max={state.callbackGasLimit}
                value={state.callbackGas}
                min={0}
                onChange={handleChangeCallback}
              />
            </td>
          </tr>
          <tr>
            {method === "directFunding" ? (
              <>
                <td>Coordinator Gas Overhead (Verification Gas)</td>
                <td>{state.currentVerificationGas}</td>
              </>
            ) : (
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
          {method === "directFunding" && (
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
        <h6>Estimated Cost: {formatTotal()} LINK</h6>

        {method === "subscription" && (
          <>
            <h6>Maximum Cost: {formatmaxCost()} LINK</h6>
            <p>
              When using the subscription balance, a minimum amount of funds is necessary in order to use the VRF. Take
              a look at your balance in the Subscription manager
              <a href="https://vrf.chain.link" target="_blank">
                {" "}
                here.
              </a>
            </p>
          </>
        )}
        <h6>
          If you want to take a look at the parameters in more details, click
          <a href={`/vrf/v2/${kebabize(method)}/supported-networks/#${getsupportedNetworkShortcut()}`} target="_blank">
            {" "}
            here.
          </a>
        </h6>
      </div>
    )
  }
}
