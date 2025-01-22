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
  },
  "chainlink-local": {
    "mock-evm2evm-offramp": {
      onlyAvailableIn: ["v0.2.1"],
    },
  },
}
