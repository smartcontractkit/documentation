// This example shows how to make a call to an open API (no authentication required)
// to retrieve asset price from a symbol(e.g., ETH) to another symbol (e.g., USD)

// CryptoCompare API https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint

// Refer to https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const fromSymbol = args[0]
const toSymbol = args[1]

// make HTTP request
const url = `https://min-api.cryptocompare.com/data/pricemultifull`
console.log(`HTTP GET Request to ${url}?fsyms=${fromSymbol}&tsyms=${toSymbol}`)

// construct the HTTP Request object. See: https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code
// params used for URL query parameters
// Example of query: https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD
const cryptoCompareRequest = Functions.makeHttpRequest({
  url: url,
  params: {
    fsyms: fromSymbol,
    tsyms: toSymbol,
  },
})

// Execute the API request (Promise)
const cryptoCompareResponse = await cryptoCompareRequest
if (cryptoCompareResponse.error) {
  console.error(cryptoCompareResponse.error)
  throw Error("Request failed")
}

const data = cryptoCompareResponse["data"]
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

// extract the price
const price = data["RAW"][fromSymbol][toSymbol]["PRICE"]
console.log(`${fromSymbol} price is: ${price.toFixed(2)} ${toSymbol}`)

// Solidity doesn't support decimals so multiply by 100 and round to the nearest integer
// Use Functions.encodeUint256 to encode an unsigned integer to a Buffer
return Functions.encodeUint256(Math.round(price * 100))
