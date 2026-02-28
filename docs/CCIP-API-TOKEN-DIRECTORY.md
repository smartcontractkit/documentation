# CCIP Token Directory API

## Overview

The CCIP API provides endpoints to retrieve detailed token information including pool configurations, rate limits, custom finality settings, and cross-chain verifier (CCV) configurations.

## Endpoints

### 1. Token Directory (Single Chain)

Retrieves detailed token information for a specific token on a specific chain, including outbound/inbound lanes with rate limits and verifiers.

```
GET /api/ccip/v1/tokens/{symbol}/chains/{chain}?environment={env}&outputKey=internalId&internalIdFormat=directory
```

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `symbol` | Yes | Token canonical symbol (e.g., `BETS`, `LINK`, `GHO`) |
| `chain` | Yes | Chain identifier (e.g., `mainnet`, `avalanche-mainnet`) |
| `environment` | Yes | `mainnet` or `testnet` |
| `outputKey` | No | Output key format: `chainId`, `selector`, or `internalId` (default: `chainId`) |
| `internalIdFormat` | No | Format for internalId values: `directory` or `selector` (default: `selector`). External callers should keep the default; `directory` is for the CCIP Directory docs website. |

**Example Request:**

```
GET /api/ccip/v1/tokens/BETS/chains/mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory
```

**Example Response:**

```json
{
  "metadata": {
    "environment": "mainnet",
    "timestamp": "2026-02-22T18:00:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "symbol": "BETS",
    "sourceChain": "mainnet"
  },
  "data": {
    "internalId": "mainnet",
    "chainId": 1,
    "selector": "5009297550715157269",
    "token": {
      "address": "0x94025780a1aB58868D9B2dBBB775f44b32e8E6e5",
      "decimals": 18
    },
    "pool": {
      "address": "0x8315Bbe2b2828559CEeCCCBCB4550A466227336E",
      "rawType": "BurnMintTokenPool",
      "type": "burnMint",
      "version": "2.0.0",
      "advancedPoolHooks": null,
      "supportsV2Features": true
    },
    "ccvConfig": {
      "thresholdAmount": "50000000000000000000000000"
    },
    "customFinality": {
      "hasCustomFinality": false,
      "minBlockConfirmation": 0
    },
    "outboundLanes": {
      "ethereum-mainnet-base-1": {
        "internalId": "ethereum-mainnet-base-1",
        "chainId": 8453,
        "selector": "15971525489660198786",
        "rateLimits": {
          "standard": {
            "in": { "capacity": "0", "isEnabled": false, "rate": "0" },
            "out": { "capacity": "0", "isEnabled": false, "rate": "0" }
          },
          "custom": {
            "in": { "capacity": "1000000000000000000000", "isEnabled": true, "rate": "1000000000000000000" },
            "out": { "capacity": "1000000000000000000000", "isEnabled": true, "rate": "1000000000000000000" }
          }
        },
        "fees": null,
        "verifiers": {
          "belowThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          "aboveThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"]
        }
      }
    },
    "inboundLanes": {
      "avalanche-mainnet": {
        "internalId": "avalanche-mainnet",
        "chainId": 43114,
        "selector": "6433500567565415381",
        "rateLimits": {
          "standard": {
            "in": { "capacity": "30000000000000000000000000", "isEnabled": true, "rate": "50000000000000000000000" },
            "out": { "capacity": "30000000000000000000000000", "isEnabled": true, "rate": "50000000000000000000000" }
          },
          "custom": {
            "in": { "capacity": "18810000000000000000000000", "isEnabled": true, "rate": "31350000000000000000000" },
            "out": { "capacity": "13020000000000000000000000", "isEnabled": true, "rate": "21700000000000000000000" }
          }
        },
        "fees": null,
        "verifiers": {
          "belowThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
          "aboveThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"]
        }
      }
    }
  }
}
```

### 2. Lane Supported Tokens

Retrieves all supported tokens for a specific lane with their rate limits.

```
GET /api/ccip/v1/lanes/by-internal-id/{source}/{destination}/supported-tokens?environment={env}&internalIdFormat=directory
```

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `source` | Yes | Source chain identifier (e.g., `mainnet`) |
| `destination` | Yes | Destination chain identifier (e.g., `bsc-mainnet`) |
| `environment` | Yes | `mainnet` or `testnet` |
| `internalIdFormat` | No | Format for internalId values: `directory` or `selector` (default: `selector`). External callers should keep the default; `directory` is for the CCIP Directory docs website. |

**Example Request:**

```bash
curl "http://localhost:4321/api/ccip/v1/lanes/by-internal-id/mainnet/bsc-mainnet/supported-tokens?environment=mainnet&internalIdFormat=directory"
```

**Example Response:**

```json
{
  "metadata": {
    "environment": "mainnet",
    "timestamp": "2026-02-22T20:56:52.870Z",
    "requestId": "9dd7f5a7-d27d-41f4-82aa-d46335fe9496",
    "sourceChain": "mainnet",
    "destinationChain": "bsc-mainnet",
    "tokenCount": 62
  },
  "data": {
    "$PAAL": {
      "rateLimits": {
        "standard": {
          "in": { "capacity": "0", "isEnabled": false, "rate": "0" },
          "out": { "capacity": "0", "isEnabled": false, "rate": "0" }
        },
        "custom": {
          "in": { "capacity": "1000000000000", "isEnabled": true, "rate": "1000000000" },
          "out": { "capacity": "1000000000000", "isEnabled": true, "rate": "1000000000" }
        }
      },
      "fees": null
    },
    "BETS": {
      "rateLimits": {
        "standard": {
          "in": { "capacity": "0", "isEnabled": false, "rate": "0" },
          "out": { "capacity": "0", "isEnabled": false, "rate": "0" }
        },
        "custom": {
          "in": { "capacity": "1000000000000000000000", "isEnabled": true, "rate": "1000000000000000000" },
          "out": { "capacity": "1000000000000000000000", "isEnabled": true, "rate": "1000000000000000000" }
        }
      },
      "fees": null
    }
  }
}
```

**Note:** `data` is keyed by token symbol. Each token has `rateLimits` (standard + custom, each with `in`/`out` directions) and `fees` (null when not available). When `rateLimits.standard` or `rateLimits.custom` is `null`, display "Unavailable" per the Lane Details UI.

---

## Understanding Pool Versions (v1.x vs v2.x)

The API distinguishes between v1.x and v2.x pools using the `pool.supportsV2Features` boolean flag. When `supportsV2Features` is `true`, `pool.version` is `2.0.0` or higher (consistent with v2 features). When `false`, `pool.version` reflects the actual pool contract version (e.g., `1.6.0`).

### v2 Features

The following features are **only available for v2.x pools** (`supportsV2Features: true`):

- `ccvConfig` - Cross-Chain Verifier configuration with threshold amounts
- `customFinality` - Custom block confirmation settings
- `verifiers` - Lane-specific verifier addresses with threshold-based sets

---

## Recommendation: Handling Null Values

**Always check `data.pool.supportsV2Features` first** before interpreting null values. This flag is at the pool level and applies to all lanes:

1. **Pool level:** `data.pool.supportsV2Features` - use for `ccvConfig`, `customFinality`, and `verifiers` in all lanes

### Fields That Require `pool.supportsV2Features` Check

| Field            | Location   | When `pool.supportsV2Features=false` | When `pool.supportsV2Features=true`                     |
| ---------------- | ---------- | ------------------------------------ | ------------------------------------------------------- |
| `ccvConfig`      | Pool level | `null` (not supported)               | Object with `thresholdAmount`                           |
| `customFinality` | Pool level | `null` (not supported)               | Object with `hasCustomFinality`, `minBlockConfirmation` |
| `verifiers`      | Each lane  | `null` (not supported)               | Object with `belowThreshold`, `aboveThreshold` arrays   |

### Interpreting Values by Field

#### ccvConfig (Pool Level)

| `pool.supportsV2Features` | Value                     | Meaning                         |
| ------------------------- | ------------------------- | ------------------------------- |
| `false`                   | `null`                    | **Not supported** (v1.x pool)   |
| `true`                    | `{thresholdAmount: "0"}`  | **Not configured**              |
| `true`                    | `{thresholdAmount: "N"}`  | **Configured** with threshold N |
| `true`                    | `{thresholdAmount: null}` | **Downstream API error**        |

#### customFinality (Pool Level)

| `pool.supportsV2Features` | Value                                                   | Meaning                             |
| ------------------------- | ------------------------------------------------------- | ----------------------------------- |
| `false`                   | `null`                                                  | **Not supported** (v1.x pool)       |
| `true`                    | `{hasCustomFinality: false, minBlockConfirmation: 0}`   | **Not configured**                  |
| `true`                    | `{hasCustomFinality: true, minBlockConfirmation: N}`    | **Configured** with N confirmations |
| `true`                    | `{hasCustomFinality: null, minBlockConfirmation: null}` | **Downstream API error**            |

#### verifiers (Per Lane, interpreted via Pool Level)

| `pool.supportsV2Features` | Value                                           | Meaning                                   |
| ------------------------- | ----------------------------------------------- | ----------------------------------------- |
| `false`                   | `null`                                          | **Not supported** (v1.x pool)             |
| `true`                    | `{belowThreshold: [], aboveThreshold: []}`      | **Not configured** for this lane          |
| `true`                    | `{belowThreshold: [A], aboveThreshold: [A]}`    | **Configured** - same verifiers           |
| `true`                    | `{belowThreshold: [A], aboveThreshold: [A, B]}` | **Configured** - with threshold verifiers |
| `true`                    | `{belowThreshold: null, aboveThreshold: null}`  | **Downstream API error**                  |

### Code Example

```typescript
// Check pool-level features
if (data.pool.supportsV2Features) {
  // v2.x pool - ccvConfig and customFinality are objects
  if (data.ccvConfig?.thresholdAmount === null) {
    // Downstream API error fetching CCV config
  } else if (data.ccvConfig?.thresholdAmount === "0") {
    // CCV not configured
  } else {
    // CCV configured with threshold
  }
} else {
  // v1.x pool - ccvConfig and customFinality are null (not supported)
}

// Check lane verifiers (use pool-level supportsV2Features for interpretation)
for (const [key, lane] of Object.entries(data.outboundLanes)) {
  if (data.pool.supportsV2Features) {
    if (lane.verifiers?.belowThreshold === null) {
      // Downstream API error fetching verifiers
    } else if (lane.verifiers?.belowThreshold?.length === 0) {
      // No verifiers configured for this lane
    } else {
      // Verifiers configured
    }
  } else {
    // v1.x pool - verifiers is null (not supported)
  }
}
```

---

## Null Value Interpretation Table (Quick Reference)

| `pool.supportsV2Features` | `ccvConfig`               | `customFinality`                                        | Meaning                               |
| ------------------------- | ------------------------- | ------------------------------------------------------- | ------------------------------------- |
| `false`                   | `null`                    | `null`                                                  | **Feature not supported** (v1.x pool) |
| `true`                    | `{thresholdAmount: "0"}`  | `{hasCustomFinality: false, minBlockConfirmation: 0}`   | **Not configured** (v2.x pool)        |
| `true`                    | `{thresholdAmount: null}` | `{hasCustomFinality: null, minBlockConfirmation: null}` | **Downstream API error**              |
| `true`                    | `{thresholdAmount: "N"}`  | `{hasCustomFinality: true, minBlockConfirmation: N}`    | **Configured** (v2.x pool)            |

### Examples

**v1.x Pool (GHO):**

```json
{
  "pool": {
    "version": "1.6.0",
    "supportsV2Features": false
  },
  "ccvConfig": null,
  "customFinality": null
}
```

**v2.x Pool - Configured (BETS on ethereum-mainnet-base-1):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/BETS/chains/ethereum-mainnet-base-1?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

```json
{
  "pool": {
    "version": "2.0.0",
    "supportsV2Features": true
  },
  "ccvConfig": {
    "thresholdAmount": "25000000000000000000000000"
  },
  "customFinality": {
    "hasCustomFinality": true,
    "minBlockConfirmation": 3
  }
}
```

**v2.x Pool - Not Configured (BETS on matic-mainnet):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/BETS/chains/matic-mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

```json
{
  "pool": {
    "version": "2.0.0",
    "supportsV2Features": true
  },
  "ccvConfig": {
    "thresholdAmount": "0"
  },
  "customFinality": {
    "hasCustomFinality": true,
    "minBlockConfirmation": 5
  }
}
```

**v2.x Pool - Downstream API Error (BETS on bsc-mainnet):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/BETS/chains/bsc-mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

```json
{
  "pool": {
    "version": "2.0.0",
    "supportsV2Features": true
  },
  "ccvConfig": {
    "thresholdAmount": "0"
  },
  "customFinality": {
    "hasCustomFinality": null,
    "minBlockConfirmation": null
  }
}
```

---

## Lane Verifiers (Outbound & Inbound)

The `verifiers` field in each lane shows which verifier addresses are required for message validation. The verifiers vary based on:

- Pool version (v1.x vs v2.x)
- Whether CCV (Cross-Chain Verifier) is configured
- Whether threshold-based additional verifiers are set
- Lane direction (outbound vs inbound)

### Testing Verifier Scenarios

Each scenario below can be verified using the dev server. Start the server with `npm run dev` and use these curl commands:

**Scenario 1 - v1.x Pool (GHO):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/GHO/chains/mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

**Scenarios 2, 3, 4 - v2.x Pool (LBTC):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/LBTC/chains/mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

Then check:

- Scenario 2: `outboundLanes["avalanche-mainnet"]` - empty verifier arrays
- Scenario 3: `inboundLanes["ethereum-mainnet-base-1"]` - same verifiers in both arrays
- Scenario 4: `outboundLanes["ethereum-mainnet-base-1"]` - different verifiers (threshold)

**Scenario 5 - v2.x Pool Downstream Error (BETS on bsc-mainnet):**

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/BETS/chains/bsc-mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

Then check: `outboundLanes["mainnet"]` - null verifier arrays (downstream error)

### Verifier Scenarios

#### Scenario 1: v1.x Pool (No Verifiers)

**Test:** `curl "http://localhost:4321/api/ccip/v1/tokens/GHO/chains/mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"`

For v1.x pools (`pool.supportsV2Features: false`), verifiers are not supported:

```json
{
  "internalId": "avalanche-mainnet",
  "chainId": 43114,
  "selector": "6433500567565415381",
  "rateLimits": { "standard": null, "custom": null },
  "fees": null,
  "verifiers": null
}
```

**Key point:** `pool.supportsV2Features: false` + `verifiers: null` means v1.x pool, feature not supported.

---

#### Scenario 2: v2.x Pool - No Verifiers Configured

**Test:** From LBTC response, check `outboundLanes["avalanche-mainnet"]`

For v2.x pools where CCV verifiers are not configured for a specific lane:

```json
{
  "internalId": "avalanche-mainnet",
  "chainId": 43114,
  "selector": "6433500567565415381",
  "rateLimits": { "standard": null, "custom": null },
  "fees": null,
  "verifiers": {
    "belowThreshold": [],
    "aboveThreshold": []
  }
}
```

**Key point:** `pool.supportsV2Features: true` + `verifiers: { belowThreshold: [], aboveThreshold: [] }` means v2.x pool but no verifiers configured for this lane.

---

#### Scenario 3: v2.x Pool - Verifiers WITHOUT Threshold

**Test:** From LBTC response, check `inboundLanes["ethereum-mainnet-base-1"]`

For v2.x pools with base verifiers but no additional threshold verifiers:

```json
{
  "internalId": "ethereum-mainnet-base-1",
  "chainId": 8453,
  "selector": "15971525489660198786",
  "rateLimits": { "standard": null, "custom": null },
  "fees": null,
  "verifiers": {
    "belowThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
    "aboveThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"]
  }
}
```

**Key point:** `pool.supportsV2Features: true` + `belowThreshold` equals `aboveThreshold` - same verifiers used regardless of transfer amount. Check `ccvConfig.thresholdAmount` to distinguish: `"0"` = threshold disabled pool-wide; `"N"` (N > 0) = no additional verifiers configured for this lane.

---

#### Scenario 4: v2.x Pool - Verifiers WITH Threshold

**Test:** From LBTC response, check `outboundLanes["ethereum-mainnet-base-1"]`

For v2.x pools with base verifiers AND additional threshold verifiers:

```json
{
  "internalId": "ethereum-mainnet-base-1",
  "chainId": 8453,
  "selector": "15971525489660198786",
  "rateLimits": {
    "standard": {
      "in": { "capacity": "5000000000", "isEnabled": true, "rate": "462963" },
      "out": { "capacity": "5000000000", "isEnabled": true, "rate": "462963" }
    },
    "custom": {
      "in": { "capacity": "2820000000", "isEnabled": true, "rate": "261111" },
      "out": { "capacity": "3490000000", "isEnabled": true, "rate": "323148" }
    }
  },
  "fees": null,
  "verifiers": {
    "belowThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D"],
    "aboveThreshold": ["0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D", "0xF4c7E640EdA248ef95972845a62bdC74237805dB"]
  }
}
```

**Key point:** `pool.supportsV2Features: true` + `aboveThreshold` contains additional verifiers beyond `belowThreshold`. When transfer amount >= `ccvConfig.thresholdAmount`, use `aboveThreshold` verifiers. Note how `custom` rate limits show different `in` vs `out` values, reflecting independently configured directional limits.

---

#### Scenario 5: v2.x Pool - Downstream API Error

**Test:** From BETS response on bsc-mainnet, check `outboundLanes["mainnet"]`

```bash
curl "http://localhost:4321/api/ccip/v1/tokens/BETS/chains/bsc-mainnet?environment=mainnet&outputKey=internalId&internalIdFormat=directory"
```

For v2.x pools where the verifier data could not be fetched due to a downstream API error:

```json
{
  "internalId": "mainnet",
  "chainId": 1,
  "selector": "5009297550715157269",
  "rateLimits": { "standard": { "in": null, "out": null }, "custom": null },
  "fees": null,
  "verifiers": {
    "belowThreshold": null,
    "aboveThreshold": null
  }
}
```

**Key point:** `pool.supportsV2Features: true` + `verifiers: { belowThreshold: null, aboveThreshold: null }` indicates a downstream API error when fetching verifiers for a v2.x pool. This is distinct from empty arrays which mean "no verifiers configured."

---

### Verifiers Summary Table

| `pool.supportsV2Features` | `verifiers` Value                                 | Meaning                                           |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `false`                   | `null`                                            | v1.x pool - feature not supported                 |
| `true`                    | `{ belowThreshold: [], aboveThreshold: [] }`      | v2.x pool - no verifiers configured for this lane |
| `true`                    | `{ belowThreshold: [A], aboveThreshold: [A] }`    | v2.x pool - base verifiers only (no threshold)    |
| `true`                    | `{ belowThreshold: [A], aboveThreshold: [A, B] }` | v2.x pool - base + threshold verifiers            |
| `true`                    | `{ belowThreshold: null, aboveThreshold: null }`  | v2.x pool - downstream API error                  |
| v2.x                      | `{ belowThreshold: [A], aboveThreshold: [A] }`    | Base verifiers only (no threshold)                |
| v2.x                      | `{ belowThreshold: [A], aboveThreshold: [A, B] }` | Base + threshold verifiers                        |
| v2.x                      | `{ belowThreshold: null, aboveThreshold: null }`  | Downstream API error                              |

### Interpreting belowThreshold === aboveThreshold

When `belowThreshold` equals `aboveThreshold`, the same verifiers are required regardless of transfer amount. This can happen for two distinct reasons—check `ccvConfig.thresholdAmount` to distinguish:

| `ccvConfig.thresholdAmount` | belowThreshold vs aboveThreshold | Meaning                                                                   |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `"0"`                       | Same                             | Threshold feature disabled pool-wide (contract never adds threshold CCVs) |
| `"N"` (N > 0)               | Same                             | No additional verifiers configured for this lane (other lanes may differ) |
| `"N"` (N > 0)               | Different                        | Additional verifiers kick in when transfer amount >= threshold            |

**Example:** A pool with `thresholdAmount = "100000000000"` can have Lane A with `aboveThreshold: [A, B]` (extra verifier) and Lane B with `aboveThreshold: [A]` (same as below—pool owner chose not to require extra verifiers for that lane).

### Using Verifiers with Threshold

1. Get `ccvConfig.thresholdAmount` from the pool data
2. Compare transfer amount to threshold:
   - If `amount < thresholdAmount` → use `belowThreshold` verifiers
   - If `amount >= thresholdAmount` → use `aboveThreshold` verifiers

---

## Field Reference

### Pool Object

| Field                | Type             | Description                                                                        |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `address`            | `string`         | Pool contract address                                                              |
| `rawType`            | `string`         | Raw pool type (e.g., `BurnMintTokenPool`, `LockReleaseTokenPool`, `USDCTokenPool`) |
| `type`               | `string`         | Normalized pool type: `burnMint`, `lockRelease`, `usdc` (transferable tokens only) |
| `version`            | `string`         | Pool contract version (e.g., `1.6.0`, `2.0.0`)                                     |
| `advancedPoolHooks`  | `string \| null` | Address of advanced pool hooks contract, or null if not configured                 |
| `supportsV2Features` | `boolean`        | Whether this pool supports v2 features (ccvConfig, customFinality)                 |

### CCVConfig Object

| Field             | Type             | Description                                                                                                      |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `thresholdAmount` | `string \| null` | Threshold amount in token's smallest unit. `"0"` = not configured, `null` = downstream error, `"N"` = configured |

### CustomFinality Object

| Field                  | Type              | Description                                                                     |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------- |
| `hasCustomFinality`    | `boolean \| null` | Whether custom finality is enabled. `null` = downstream error                   |
| `minBlockConfirmation` | `number \| null`  | Minimum block confirmations required. `0` = not used, `null` = downstream error |

### Lane Object (outboundLanes/inboundLanes)

| Field        | Type                    | Description                                                                                         |
| ------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `internalId` | `string`                | Internal identifier of the remote chain (destination for outbound lanes, source for inbound lanes)  |
| `chainId`    | `number \| string`      | Chain ID of the remote chain                                                                        |
| `selector`   | `string`                | CCIP chain selector of the remote chain                                                             |
| `rateLimits` | `TokenRateLimits`       | Rate limits for standard and custom transfers, each with `in`/`out` directions                      |
| `fees`       | `TokenFees \| null`     | Transfer fees in basis points. `null` = fees not available for this lane                            |
| `verifiers`  | `LaneVerifiers \| null` | Verifier configuration. Use `pool.supportsV2Features` to interpret (see interpretation table above) |

### TokenRateLimits Object

| Field      | Type                            | Description                                             |
| ---------- | ------------------------------- | ------------------------------------------------------- |
| `standard` | `DirectionalRateLimits \| null` | Standard transfer rate limits with in/out directions    |
| `custom`   | `DirectionalRateLimits \| null` | Custom (custom block confirmation) transfer rate limits |

### DirectionalRateLimits Object

| Field | Type                      | Description                                     |
| ----- | ------------------------- | ----------------------------------------------- |
| `in`  | `RateLimitConfig \| null` | Inbound rate limit (receiving chain constraint) |
| `out` | `RateLimitConfig \| null` | Outbound rate limit (sending chain constraint)  |

### RateLimitConfig Object

| Field       | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| `capacity`  | `string`  | Maximum bucket capacity          |
| `rate`      | `string`  | Refill rate per second           |
| `isEnabled` | `boolean` | Whether rate limiting is enabled |

### Fees Interpretation

| `fees` Value                                             | Meaning                                                   |
| -------------------------------------------------------- | --------------------------------------------------------- |
| `null`                                                   | Fees not available for this lane                          |
| `{ standardTransferFeeBps: N, customTransferFeeBps: M }` | Transfer fees configured (in basis points, 1 bps = 0.01%) |

### Verifiers Object

| Field            | Type               | Description                                                                                                 |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `belowThreshold` | `string[] \| null` | Verifier addresses used when transfer amount < threshold. `[]` = not configured, `null` = downstream error  |
| `aboveThreshold` | `string[] \| null` | Verifier addresses used when transfer amount >= threshold. `[]` = not configured, `null` = downstream error |

---

## Query Parameters Reference

| Parameter          | Values                              | Description                                    |
| ------------------ | ----------------------------------- | ---------------------------------------------- |
| `environment`      | `mainnet`, `testnet`                | Network environment                            |
| `outputKey`        | `chainId`, `selector`, `internalId` | Format for output keys in response             |
| `internalIdFormat` | `directory`, `selector`             | Format for internalId values (see table below) |

### internalIdFormat

- **Default (`selector`):** Use for external API integrations. Returns selector names (e.g., `ethereum-mainnet`, `binance_smart_chain-mainnet`).
- **`directory`:** Used by the CCIP Directory docs website for display. Returns chains.json keys (e.g., `mainnet`, `bsc-mainnet`).

### internalIdFormat Examples

| Chain            | `directory` format  | `selector` format             |
| ---------------- | ------------------- | ----------------------------- |
| Ethereum Mainnet | `mainnet`           | `ethereum-mainnet`            |
| BNB Smart Chain  | `bsc-mainnet`       | `binance_smart_chain-mainnet` |
| Polygon          | `matic-mainnet`     | `polygon-mainnet`             |
| Avalanche        | `avalanche-mainnet` | `avalanche-mainnet`           |

---

## Error Responses

| HTTP Status | Condition                                  | Response                                          |
| ----------- | ------------------------------------------ | ------------------------------------------------- |
| **404**     | Chain not found (invalid chain identifier) | `"Chain '{chain}' not found"`                     |
| **404**     | Token not listed on the specified chain    | `"Token '{symbol}' not found on chain '{chain}'"` |

---

## Implementation Notes

- **Lane key format:** The API uses `sourceSelector-to-destSelector` for internal lane resolution (e.g., `ethereum-mainnet-to-base-mainnet`). This format scales to any chain without hardcoded mappings.
