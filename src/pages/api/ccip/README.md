# CCIP API

The CCIP API provides information about supported chains and tokens in the Cross-Chain Interoperability Protocol (CCIP). This API allows you to query chain details, token information, supported fee tokens, and contract addresses needed for cross-chain operations.

## Quick Start

### Using Postman

We provide a complete [Postman Collection](/api/ccip/v1/postman-collection.json) that you can import to quickly test all API endpoints. The collection includes:

- All available endpoints with example requests
- Success and error test cases
- Environment variables for easy configuration

To import the collection into Postman:

1. Download the collection file from [https://docs.chain.link/api/ccip/v1/postman-collection.json](/api/ccip/v1/postman-collection.json)
2. Open Postman
3. Click "Import" in the top left corner
4. Drag and drop the downloaded file or click "Upload Files" to select it
5. Click "Import" to confirm

Before making requests:

1. In Postman, go to "Environments" and create a new environment
2. Add a variable named `baseUrl` with:
   - Initial value: `https://docs.chain.link`
   - Current value: `http://localhost:4321` (for local testing) or `https://docs.chain.link` (for production)
3. Select your environment from the environment dropdown in the top right

Now you can start making requests to test the API endpoints!

### Direct API Usage

```bash
# Chains API
# Get all mainnet chains
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet"

# Get Ethereum mainnet
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&chainId=1"

# Get multiple chains by chainId
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&chainId=1,56"

# Get multiple chains by internalId
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&internalId=ethereum-mainnet,bsc-mainnet"

# Tokens API
# Get all mainnet tokens
curl "https://docs.chain.link/api/ccip/v1/tokens?environment=mainnet"

# Get tokens by symbol
curl "https://docs.chain.link/api/ccip/v1/tokens?environment=mainnet&symbol=LINK"

# Get tokens available on a specific chain
curl "https://docs.chain.link/api/ccip/v1/tokens?environment=mainnet&chainId=1"
```

## API Reference

### Endpoints

#### GET /api/ccip/v1/chains

Query CCIP chain information.

**Query Parameters:**

- `environment` (required): Network environment
  - Values: `mainnet`, `testnet`
- `chainId` (optional): Filter by chain ID
  - Single value: `1` (Ethereum)
  - Multiple values: `1,56` (Ethereum and BSC)
- `selector` (optional): Filter by CCIP chain selector
  - Single value: `5009297550715157269`
  - Multiple values: `5009297550715157269,13264668187771770619`
- `internalId` (optional): Filter by internal chain identifier
  - Single value: `ethereum-mainnet`
  - Multiple values: `ethereum-mainnet,bsc-mainnet`
- `outputKey` (optional): Key to use for response organization
  - Values: `chainId`, `selector`, `internalId`
  - Default: `chainId`

**Response Format:**

```typescript
interface ChainApiResponse {
  metadata: {
    environment: string
    timestamp: string
    requestId: string
    ignoredChainCount: number
    validChainCount: number
  }
  data: {
    evm: Record<string, ChainDetails>
  }
  ignored: ChainConfigError[]
}

interface ChainDetails {
  chainId: number
  displayName: string
  selector: string
  internalId: string
  feeTokens: string[]
  router: string
  rmn: string
  registryModule: string
  tokenAdminRegistry: string
}
```

#### GET /api/ccip/v1/tokens

Query CCIP token information.

**Query Parameters:**

- `environment` (required): Network environment
  - Values: `mainnet`, `testnet`
- `symbol` (optional): Filter by token symbol
  - Single value: `LINK` (Chainlink)
  - Multiple values: `LINK,ETH` (Chainlink and Ethereum)
- `chainId` (optional): Filter by chain ID where the token is available
  - Single value: `1` (Ethereum)
  - Multiple values: `1,56` (Ethereum and BSC)
- `outputKey` (optional): Key to use for response organization
  - Values: `chainId`, `selector`, `internalId`
  - Default: `chainId`

**Response Format:**

```typescript
interface TokenApiResponse {
  metadata: {
    environment: string
    timestamp: string
    requestId: string
    ignoredTokenCount: number
    validTokenCount: number
  }
  data: Record<string, TokenDetails>
  ignored: TokenConfigError[]
}

interface TokenDetails {
  symbol: string
  lanes: Record<string, string[]> // Source chain -> destination chains
  chains: TokenChainInfo[]
}

interface TokenChainInfo {
  chainId: number
  chainName: string
  tokenAddress: string
  decimals: number
  poolType: string
  poolAddress: string
}
```

#### GET /api/ccip/v1/tokens/{tokenCanonicalSymbol}/chains/{chain}

Query token directory data for one token on one source chain, scoped to token + pool configuration.

**Path Parameters:**

- `tokenCanonicalSymbol` (required): Canonical token symbol (e.g., `LINK`, `CCIP-BnM`, `LBTC`)
- `chain` (required): Source chain identifier
  - Accepts directory-style internal IDs (e.g., `mainnet`, `bsc-testnet`)
  - Accepts selector-style internal IDs (e.g., `ethereum-mainnet`, `binance_smart_chain-testnet`)
  - Does **not** accept numeric chainId in this endpoint path

**Query Parameters:**

- `environment` (required): Network environment
  - Values: `mainnet`, `testnet`
- `internalIdFormat` (optional): Naming convention for `internalId` fields
  - Values: `selector`, `directory`
  - Default: `selector`

**Examples:**

```bash
# Directory-style chain identifier in path
curl "https://docs.chain.link/api/ccip/v1/tokens/LBTC/chains/mainnet?environment=mainnet"

# Selector-style chain identifier in path
curl "https://docs.chain.link/api/ccip/v1/tokens/LBTC/chains/ethereum-mainnet?environment=mainnet"

# Return internalId fields using directory naming
curl "https://docs.chain.link/api/ccip/v1/tokens/LBTC/chains/ethereum-mainnet?environment=mainnet&internalIdFormat=directory"
```

For lane-level data (`rateLimits`, `fees`, `verifiers`), use the lane endpoints:

- `/api/ccip/v1/lanes/by-chain-id/{source}/{destination}`
- `/api/ccip/v1/lanes/by-selector/{source}/{destination}`
- `/api/ccip/v1/lanes/by-internal-id/{source}/{destination}`
- `/api/ccip/v1/lanes/by-chain-id/{source}/{destination}/supported-tokens`
- `/api/ccip/v1/lanes/by-selector/{source}/{destination}/supported-tokens`
- `/api/ccip/v1/lanes/by-internal-id/{source}/{destination}/supported-tokens`

**Token + pool response example (`/tokens/{tokenCanonicalSymbol}/chains/{chain}`):**

```json
{
  "metadata": {
    "environment": "mainnet",
    "timestamp": "2025-12-10T12:00:00Z",
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "symbol": "LBTC",
    "sourceChain": "ethereum-mainnet"
  },
  "data": {
    "internalId": "ethereum-mainnet",
    "chainId": 1,
    "selector": "5009297550715157269",
    "token": {
      "address": "0x8236a87084f8B84306f72007F36F2618A5634494",
      "decimals": 8
    },
    "pool": {
      "address": "0x88E18636EfFC3b3cd520FC72B710eb99C0017BC7",
      "rawType": "BurnMintTokenPool",
      "type": "burnMint",
      "version": "2.0.0",
      "hook": null,
      "capabilities": {
        "supportsV2Features": true
      },
      "finality": {
        "finalityDepth": 5,
        "finalitySafe": true
      },
      "ccv": {
        "thresholdAmount": "100000000000"
      }
    }
  }
}
```

**Field semantics for pool data:**

- `pool.capabilities.supportsV2Features=true` indicates v2 features are available for this pool.
- `pool.finality.finalityDepth` is the minimum confirmations used for finalized execution.
- `pool.finality.finalitySafe` indicates whether FCR-safe finality is supported.
- `pool.ccv.thresholdAmount` is the amount threshold (smallest token unit) used for threshold verifier logic.
- `pool.hook` is the hook contract address when configured, otherwise `null`.

**Lane token data example (`/lanes/by-internal-id/{source}/{destination}/supported-tokens`):**

```bash
curl "https://docs.chain.link/api/ccip/v1/lanes/by-internal-id/ethereum-mainnet/ethereum-mainnet-base-1/supported-tokens?environment=mainnet"
```

```json
{
  "metadata": {
    "environment": "mainnet",
    "timestamp": "2025-12-10T12:00:00Z",
    "requestId": "123e4567-e89b-12d3-a456-426614174111",
    "sourceChain": "ethereum-mainnet",
    "destinationChain": "ethereum-mainnet-base-1",
    "tokenCount": 1
  },
  "data": {
    "LBTC": {
      "rateLimits": {
        "standard": {
          "in": {
            "capacity": "100000000000",
            "rate": "100000000",
            "isEnabled": true
          },
          "out": {
            "capacity": "200000000000",
            "rate": "200000000",
            "isEnabled": true
          }
        },
        "custom": null
      },
      "fees": {
        "standardTransferFeeBps": 0,
        "customTransferFeeBps": 0
      },
      "verifiers": {
        "belowThreshold": ["0x1111111111111111111111111111111111111111"],
        "aboveThreshold": ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"]
      }
    }
  }
}
```

**Field semantics for lane token data:**

- `rateLimits.standard` and `rateLimits.custom` each contain directional limits (`in` and `out`).
- `fees` are lane transfer fees in basis points.
- `verifiers` is available on lane token endpoints; this is where verifier sets are exposed.
- `verifiers.belowThreshold` applies below the pool threshold amount.
- `verifiers.aboveThreshold` applies at or above the threshold.

### Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `400`: Invalid request (e.g., invalid parameters)
- `500`: Server error

Error responses follow this format:

```typescript
interface ErrorResponse {
  error: string
  message: string
}
```

## Development Tools

1. **Postman Collection**: Available at [/api/ccip/v1/postman-collection.json](/api/ccip/v1/postman-collection.json)
2. **OpenAPI Spec**: Available at [/api/ccip/v1/openapi.json](/api/ccip/v1/openapi.json)

## Support

- Documentation: https://docs.chain.link/ccip
- Issues: https://github.com/smartcontractkit/chainlink/issues
