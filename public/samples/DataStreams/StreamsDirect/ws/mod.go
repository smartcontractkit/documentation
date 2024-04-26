module data-streams-direct-ws

go 1.21

require (
	github.com/ethereum/go-ethereum v1.12.2 // Ethereum blockchain interaction library
	github.com/gorilla/websocket v1.5.0 // Websocket library
	github.com/pkg/errors v0.9.1 // Library for handling errors
	github.com/smartcontractkit/chainlink/v2 v2.2.1-0.20230823171354-1ead9ee6f6bb // Chainlink core components library
)

replace (
	// Resolves version mismatch between cosmosSDK and hdevalence/ed25519consensus
	filippo.io/edwards25519 => filippo.io/edwards25519 v1.0.0-rc.1

	// Adds ARM support by updating CosmWasm to v1.2.4
	github.com/CosmWasm/wasmvm => github.com/CosmWasm/wasmvm v1.2.4

	//// Fix go mod tidy issue for ambiguous imports from go-ethereum
	//// See https://github.com/ugorji/go/issues/279
	github.com/btcsuite/btcd => github.com/btcsuite/btcd v0.22.1

	// Aligns protobuf version with cosmos SDK requirements
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
)