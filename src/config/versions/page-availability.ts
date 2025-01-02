type RedirectMap = {
  [fromVersion: string]: string
}

type PageAvailability = {
  notAvailableIn?: string[]
  redirectTo?: RedirectMap
  onlyAvailableIn?: string[]
}

export const PAGE_AVAILABILITY: Record<string, Record<string, PageAvailability>> = {
  ccip: {
    "burn-mint-erc20": {
      notAvailableIn: ["v1.5.0"],
      redirectTo: {
        "v1.5.0": "burn-mint-token-pool",
      },
    },
    "rate-limiter": {
      notAvailableIn: ["v1.5.0"],
    },
  },
  "chainlink-local": {
    "mock-evm2evm-offramp": {
      onlyAvailableIn: ["v0.2.1"],
    },
  },
}
