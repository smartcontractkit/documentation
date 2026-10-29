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
      onlyAvailableIn: ["v0.3.1"],
    },
    "data-streams-local-simulator": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "data-streams-local-simulator-fork": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "data-streams-register": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "mock-fee-manager": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "mock-report-generator": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "mock-reward-manager": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "mock-verifier": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "mock-verifier-proxy": {
      onlyAvailableIn: ["v0.3.1"],
    },
    "report-versions": {
      onlyAvailableIn: ["v0.3.1"],
    },
  },
}
