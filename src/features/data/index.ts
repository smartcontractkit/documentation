export type FeedDataItem = {
  [key: string]: string
}

export const priceFeedAddresses = {
  btc: {
    usd: {
      sepolia: {
        address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
        historicalRound: "18446744073709551978",
      },
    },
  },
}

export const linkEth = {
  link: {
    eth: {
      sepolia: {
        address: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
        historicalRound: "36893488147419106612",
      },
    },
  },
}

export const registryAddresses = {
  "link-usd": {
    baseSymbol: "LINK",
    quoteSymbol: "USD",
    network: {
      mainnet: {
        address: "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf",
        baseAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        quoteAddress: "0x0000000000000000000000000000000000000348",
      },
    },
  },
}

export const monitoredFeeds = {
  mainnet: [
    {
      "0xBE456fd14720C3aCCc30A2013Bffd782c9Cb75D5": "TrueUSD",
    },
  ],
}
