const Web3 = require("web3")

const web3 = new Web3("https://rpc.ankr.com/eth")
web3.eth.ens.getAddress("eth-usd.data.eth").then((address) => {
  console.log(address)
})
