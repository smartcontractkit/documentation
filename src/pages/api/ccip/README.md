# CCIP Chains API

The CCIP Chains API provides information about supported chains in the Cross-Chain Interoperability Protocol (CCIP). This API allows you to query chain details, supported fee tokens, and contract addresses needed for cross-chain operations.

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
# Get all mainnet chains
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet"

# Get Ethereum mainnet
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&chainId=1"

# Get multiple chains by chainId
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&chainId=1,56"

# Get multiple chains by internalId
curl "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet&internalId=ethereum-mainnet,bsc-mainnet"
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
