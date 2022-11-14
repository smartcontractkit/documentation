/** @jsxImportSource preact */
import { mainnetProvider } from "@config/web3Providers"

export const getHistoricalPriceForm = () => {
  function getHistoricalPrice() {
    document.getElementById("get-price-field").value = "loading..."
    const web3 = new Web3("https://rpc.ankr.com/eth_goerli")
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ]
    const addr = "0xA39434A63A52E749F02807ae27335515BA4b07F7"
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr)

    // Valid roundId must be known. They are NOT incremental.
    let validId = BigInt("18446744073709554177")
    priceFeed.methods
      .getRoundData(validId)
      .call()
      .then((historicalRoundData) => {
        document.getElementById("get-price-field").value = historicalRoundData.answer
      })
  }

  return (
    <div class="row cl-button-container">
      <div class="col-xs-12 col-md-12">
        <a id="get-price-button" href="javascript:getHistoricalPrice();" class="cl-button--ghost javascript-tracked">
          Round 18446744073709554177:{" "}
        </a>
        <input id="get-price-field" type="number" placeholder="Historical Price"></input>
      </div>
    </div>
  )
}
