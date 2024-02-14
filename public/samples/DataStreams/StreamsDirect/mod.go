module data-streams-direct

go 1.21

require (
	github.com/ethereum/go-ethereum v1.12.2
	github.com/pkg/errors v0.9.1
	github.com/smartcontractkit/chainlink/v2 v2.2.1-0.20230823171354-1ead9ee6f6bb
)

replace (
	//// needed to address mismatch between cosmosSDK and hdevalence/ed25519consensus
	filippo.io/edwards25519 => filippo.io/edwards25519 v1.0.0-rc.1

	// updating CosmWasm to v1.2.4 which brings ARM support
	github.com/CosmWasm/wasmvm => github.com/CosmWasm/wasmvm v1.2.4

	//// Fix go mod tidy issue for ambiguous imports from go-ethereum
	//// See https://github.com/ugorji/go/issues/279
	github.com/btcsuite/btcd => github.com/btcsuite/btcd v0.22.1

	// replicating the replace directive on cosmos SDK
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
)