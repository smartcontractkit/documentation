type PageAvailability = {
  notAvailableIn?: string[]
  onlyAvailableIn?: string[]
}

export const PAGE_AVAILABILITY: Record<string, Record<string, PageAvailability>> = {
  ccip: {
    "burn-mint-erc20": {
      notAvailableIn: ["v1.5.0"],
    },
    "rate-limiter": {
      notAvailableIn: ["v1.5.0"],
    },
    "ownable-2-step-msg-sender": {
      notAvailableIn: ["v1.5.0"],
    },
    "ownable-2-step": {
      notAvailableIn: ["v1.5.0"],
    },
    "fee-quoter": {
      notAvailableIn: ["v1.5.0"],
    },
  },
  "chainlink-local": {
    "mock-evm2evm-offramp": {
      onlyAvailableIn: ["v0.2.1"],
    },
    "ccip-local-router": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3", "v0.2.4", "v0.2.5", "v0.2.6", "v0.2.7", "v0.2.8", "v0.2.9"],
    },
    "data-streams-local-simulator": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "data-streams-local-simulator-fork": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "data-streams-register": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "mock-fee-manager": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "mock-report-generator": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "mock-reward-manager": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "mock-verifier": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "mock-verifier-proxy": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
    "report-versions": {
      notAvailableIn: ["v0.2.1", "v0.2.2", "v0.2.3"],
    },
  },
}
