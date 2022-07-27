# THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
# THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
# DO NOT USE THIS CODE IN PRODUCTION.

from web3 import Web3

# Change this to use your own RPC url
web3 = Web3(Web3.HTTPProvider('https://rpc.ankr.com/eth_rinkeby'))
# AggregatorV3Interface ABI
abi = '[{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
# Price Feed address
addr = '0xECe365B379E1dD183B20fc5f022230C044d51404'

# Set up contract instance
contract = web3.eth.contract(address=addr, abi=abi)

#  Valid roundId must be known. They are NOT incremental.
# invalidRoundId = 18446744073709562300
validRoundId = 55340232221128657028

historicalData = contract.functions.getRoundData(validRoundId).call()
print(historicalData)
