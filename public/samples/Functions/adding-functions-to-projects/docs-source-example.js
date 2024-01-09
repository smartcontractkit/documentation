// This example shows how to make a decentralized price feed using multiple APIs

// Expects a different consumer contract than FunctionsConsumer.sol.
// Modify your consumer contract before using this example.

// Arguments can be provided when a request is initiated onchain and used in the request source code as shown below
const coinGeckoCoinId = args[0]
const coinPaprikaCoinId = args[1]
const badApiCoinId = args[2]

// To make an HTTP request, use the Functions.makeHttpRequest function
// Functions.makeHttpRequest function parameters:
// - url
// - method (optional, defaults to 'GET')
// - headers: headers supplied as an object (optional)
// - params: URL query parameters supplied as an object (optional)
// - data: request body supplied as an object (optional)
// - timeout: maximum request duration in ms (optional, defaults to 10000ms)
// - responseType: expected response type (optional, defaults to 'json')

// Use multiple APIs & aggregate the results to enhance decentralization
const coinGeckoRequest = Functions.makeHttpRequest({
  url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoCoinId}&vs_currencies=usd`,
})
const coinPaprikaRequest = Functions.makeHttpRequest({
  url: `https://api.coinpaprika.com/v1/tickers/${coinPaprikaCoinId}`,
})
// This dummy request simulates a failed API request
const badApiRequest = Functions.makeHttpRequest({
  url: `https://badapi.com/price/symbol/${badApiCoinId}`,
})

// First, execute all the API requests are executed concurrently, then wait for the responses
const [coinGeckoResponse, coinPaprikaResponse, badApiResponse] = await Promise.all([
  coinGeckoRequest,
  coinPaprikaRequest,
  badApiRequest,
])

const prices = []

if (!coinGeckoResponse.error) {
  prices.push(coinGeckoResponse.data[coinGeckoCoinId].usd)
} else {
  console.log("CoinGecko Error")
}
if (!coinPaprikaResponse.error) {
  prices.push(coinPaprikaResponse.data.quotes.USD.price)
} else {
  console.log("CoinPaprika Error")
}
// A single failed API request does not cause the whole request to fail
if (!badApiResponse.error) {
  prices.push(httpResponses[3].data.price.usd)
} else {
  console.log(
    "Bad API request failed. (This message is expected to demonstrate using console.log for debugging locally with the simulator)"
  )
}

// At least 3 out of 4 prices are needed to aggregate the median price
if (prices.length < 3) {
  // If an error is thrown, it will be returned back to the smart contract
  throw Error("More than 1 API failed")
}

const medianPrice = prices.sort((a, b) => a - b)[Math.round(prices.length / 2)]
console.log(`Median Bitcoin price: $${medianPrice.toFixed(2)}`)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeUint256(Math.round(medianPrice * 100))
