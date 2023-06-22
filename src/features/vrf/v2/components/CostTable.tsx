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
  L1GasPriceEstimate: "",
  currentGasPrice: "",
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
    default:
      return state
  }
}

const cache: Cache = {}

export const CostTable = ({ mainChain, chain, method }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const mainChainName = mainChain.name.toLowerCase()
    const networkName = chain.name.toLowerCase()
    const cacheKey = `${mainChainName}-${networkName === mainChainName ? chain.type : networkName}`
    dispatch({ type: "SET_LOADING", payload: true })
    const getDataResponse = async (): Promise<dataResponse> => {
      if (cache[cacheKey] && cache[cacheKey].latestCacheUpdate - Date.now() < CACHE_EXPIRY_TIME) {
        return cache[cacheKey].data
      }
      const response = await fetch(
        `https://vrf.chain.link/api/calculator?networkName=${mainChain.name.toLowerCase()}&networkType=${
          chain.name.toLowerCase() === mainChain.name.toLowerCase()
            ? chain.type.toLowerCase()
            : chain.name.toLowerCase()
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
    const fillInputs = async () => {
      const responseJson: dataResponse = await getDataResponse()
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
          gasPrice,
          L1GasPriceEstimate,
          decimalPlaces,
          currentGasPrice: utils.formatUnits(gasPrice, "gwei"),
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
    const { L1GasPriceEstimate, gasPrice, decimalPlaces, currentVerificationGas, callbackGas, wrapperOverheadGas } =
      state
    const L1P = BigNumber.from(L1GasPriceEstimate)
    const L2P = BigNumber.from(gasPrice)
    const VRFL1CostEstimate = L1P.mul(VRFCallDataSizeBytes)
    const VRFL1Buffer = VRFL1CostEstimate.div(L2P)
    if (method === "subscription") {
      const VRFL2SubscriptionGasSubtotal = BigNumber.from(currentVerificationGas + callbackGas)
      const VRFSubscriptionGasTotal = VRFL2SubscriptionGasSubtotal.add(VRFL1Buffer)
      const VRFSubscriptionGasEstimate = L2P.mul(VRFSubscriptionGasTotal)
      dispatch({
        type: "SET_TOTAL",
        payload: utils.formatUnits(VRFSubscriptionGasEstimate, decimalPlaces),
      })
    } else {
      const VRFL2DirectFundingGasSubtotal = BigNumber.from(currentVerificationGas + wrapperOverheadGas + callbackGas)
      const VRFDirectFundingGasTotal = VRFL2DirectFundingGasSubtotal.add(VRFL1Buffer)
      const VRFDirectFundingGasEstimate = L2P.mul(VRFDirectFundingGasTotal)
      dispatch({
        type: "SET_TOTAL",
        payload: utils.formatUnits(VRFDirectFundingGasEstimate, decimalPlaces),
      })
    }
  }

  const getsupportedNetworkShortcut = () => {
    const mainChainName = mainChain.name.toLowerCase()
    switch (mainChainName) {
      case "ethereum":
        return `${mainChainName}-${chain.type}`
      case "bnb":
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
      return computeArbitrumCost()
    }
    const {
      gasPrice,
      callbackGas,
      currentVerificationGas,
      priceFeed,
      LINKPremium,
      wrapperOverheadGas,
      wrapperLinkPremiumPercentage,
    } = state
    const bigNumberGasPrice = BigNumber.from(gasPrice)
    const bigNumberPriceFeed = BigNumber.from(priceFeed)
    if (method === "subscription") {
      const vrfSubscriptionGasSubTotal = BigNumber.from(callbackGas + currentVerificationGas)
      const totalGasCost = bigNumberGasPrice.mul(vrfSubscriptionGasSubTotal)
      const total = totalGasCost.div(bigNumberPriceFeed).toNumber() + LINKPremium
      dispatch({
        type: "SET_TOTAL",
        payload: total.toString(),
      })
    } else {
      const vrfDirectFundingGasSubTotal = BigNumber.from(callbackGas + currentVerificationGas + wrapperOverheadGas)
      const totalGasCost = bigNumberGasPrice.mul(vrfDirectFundingGasSubTotal)
      const totalGasCostInToken = totalGasCost.div(bigNumberPriceFeed)
      const total = LINKPremium + totalGasCostInToken.add(BigNumber.from(1 + wrapperLinkPremiumPercentage)).toNumber()
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
      dispatch({ type: "SET_CALLBACK_GAS", payload: parseInt(val) })
    }
  }

  const handleChangeGas = (e: Event) => {
    const { target } = e
    if (target instanceof HTMLInputElement) {
      const val = target.value
      dispatch({ type: "SET_CURRENT_GAS_PRICE", payload: val.toString() })
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
    let idx = 2
    let countNonZeroDigits = 0
    let res = parseInt(state.total) + "."
    while (countNonZeroDigits < 1) {
      if (state.total[idx] !== "0") {
        countNonZeroDigits++
      }
      res += state.total[idx]
      idx++
    }
    if (parseInt(state.total[idx + 1]) >= 5) {
      const digitPlusOne = parseInt(state.total[idx]) + 1
      res += digitPlusOne.toString()
    } else {
      res += state.total[idx]
    }
    return res
  }

  if (state.isLoading) {
    return <p>Data is fetched. Please wait a moment...</p>
  } else {
    return (
      <div className="table-container">
        <table>
          <tr>
            <th>Input</th>
            <th>Value</th>
          </tr>
          <tr>
            {/* <td>Gas price (current is {parseFloat(state.gasPrice).toFixed(2).toString()} gwei)</td> */}
            <td>Gas price (current is {getGasPrice()} gwei)</td>
            <td>
              <input type="number" id="gas" value={state.currentGasPrice} onChange={handleChangeGas} />
            </td>
          </tr>
          <tr>
            <td>Callback gas chosen ( max. {utils.commify(state.callbackGasLimit)})</td>
            <td>
              <input
                id="callback-gas-value"
                type="number"
                max={state.callbackGasLimit}
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
                <td>Gas Lane chosen</td>
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
                            <label for={gasLane.toString()}>{gasLane} gwei</label>
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
        <h6>
          {chain.name}: {formatTotal()} LINK
        </h6>

        {method === "subscription" && (
          <p>
            When using the subscription balance, a minimum amount of funds is necessary in order to use the VRF. Take a
            look at your balance in the Subscription manager
            <a href="https://vrf.chain.link" target="_blank">
              {" "}
              here.
            </a>
          </p>
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
