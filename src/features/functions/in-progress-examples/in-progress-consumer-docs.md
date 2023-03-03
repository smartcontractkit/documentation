### Create a consumer contract

You can use the [FunctionsConsumer.sol](https://github.com/smartcontractkit/functions-hardhat-starter-kit/blob/main/contracts/FunctionsConsumer.sol) contract in your `./contracts` folder as your consumer contract, modify it to fit your needs, or create your own contract from scratch. In general, a consumer contract requires several components.

Create a contract in `./contracts` named `FunctionsExample.sol`. Import `ConfirmedOwner.sol` from the [@chainlink/contracts](https://www.npmjs.com/package/@chainlink/contracts) NPM package and import `FunctionsClient.sol` from the files you copied into your project earlier:

```solidity
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./dev/functions/FunctionsClient.sol";

```

Modify your contract to use `ConfirmedOwner` and `FunctionsClient`:

```solidity
contract MyFirstContract is FunctionsClient, ConfirmedOwner {
```

Add the following variables:

```solidity
bytes32 public latestRequestId;
bytes public latestResponse;
bytes public latestError;

event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
```

In the constructor for your contract, set a passed oracle contract address and set the confirmed owner to the address that you will use to deploy this consumer contract:

```solidity
constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {}

```

Create a simple function for making a request to the DON. For example, a simple `setNumber` function would include the following arguments:

```solidity
function setNumber(
    string calldata source,
    bytes calldata secrets,
    Functions.Location secretsLocation,
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyOwner returns (bytes32) {
```

The body of the `setNumber` function builds and executes the call to the DON as shown in the following example:

```solidity
Functions.Request memory req;
  req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
  if (secrets.length > 0) {
    if (secretsLocation == Functions.Location.Inline) {
      req.addInlineSecrets(secrets);
    } else {
      req.addRemoteSecrets(secrets);
    }
  }
  if (args.length > 0) req.addArgs(args);

  bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
  latestRequestId = assignedReqID;
  return assignedReqID;
}
```

Add a callback function that the DON can use to return the result. In this example, also add a step to convert the returned bytes to an int:

```solidity
function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
  latestResponse = response;
  //convert response to number
  number = bytesToUint(response);
  latestError = err;
  emit OCRResponse(requestId, response, err);
}

function bytesToUint(bytes memory b) internal pure returns (uint256) {
  uint256 number;
  for (uint256 i = 0; i < b.length; i++) {
    number = number + uint256(uint8(b[i])) * (2 ** (8 * (b.length - (i + 1))));
  }
  return number;
}

```

Optionally, add helper functions:

```solidity
function updateOracleAddress(address oracle) public onlyOwner {
  setOracle(oracle);
}

function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
  addExternalRequest(oracleAddress, requestId);
}

```

The final contract should look like the following example:

<CodeSample src="samples/Functions/adding-functions-to-projects/FunctionsExample.sol" />

Make sure the contract compiles. The contract must be in the `./contracts` folder of your project.

```shell
npx hardhat compile
```

Next, deploy the contract.
