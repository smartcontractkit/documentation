### Response Types

Make sure to choose an oracle job that supports the data type that your contract needs to consume. Multiple data types are available such as:

- **`uint256`** - Unsigned integers
- **`int256`** - Signed integers
- **`bool`** - True or False values
- **`string`** - String
- **`bytes32`** - Strings and byte values. If you need to return a string, use `bytes32`. Here's [one method](https://gist.github.com/alexroan/a8caf258218f4065894ecd8926de39e7) of converting `bytes32` to `string`. Currently, any return value must fit within 32 bytes. If the value is bigger than that, make multiple requests.
- **`bytes`** - Arbitrary-length raw byte data

## Setting the LINK token address, Oracle, and JobId

The [`setChainlinkToken`](/any-api/api-reference/#setchainlinktoken) function sets the LINK token address for the [network](/resources/link-token-contracts/) you are deploying to. The [`setChainlinkOracle`](/any-api/api-reference/#setchainlinkoracle) function sets a specific Chainlink oracle that a contract makes an API call from. The `jobId` refers to a specific job for that node to run.

Each job is unique and returns different types of data. For example, a job that returns a `bytes32` variable from an API would have a different `jobId` than a job that retrieved the same data, but in the form of a `uint256` variable.

Check the [Find Existing Jobs page](/any-api/find-oracle/) to learn how to find a job suitable to your use case.
