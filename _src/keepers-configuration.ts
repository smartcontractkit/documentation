import { abi } from './keepers-abi';
declare var Web3: any;

document.addEventListener('DOMContentLoaded', () => {
  const contracts: { [key: string]: any } = {
    ethereum: new new Web3('https://rpc.ankr.com/eth').eth.Contract(abi, '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'),
    polygon: new new Web3('https://rpc.ankr.com/polygon').eth.Contract(
      abi,
      '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'
    ),
    bnbchain: new new Web3('https://rpc.ankr.com/bsc').eth.Contract(abi, '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'),
    avalanche: new new Web3('https://rpc.ankr.com/avalanche').eth.Contract(
      abi,
      '0x409CF388DaB66275dA3e44005D182c12EeAa12A0'
    ),
    fantom: new new Web3('https://rpc.ankr.com/fantom').eth.Contract(abi, '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'),
  };

  for (let key of Object.keys(contracts)) {
    contracts[key].methods
      .getConfig()
      .call()
      .then((configs: any) => {
        configs['paymentPremiumPPB'] = Math.round(parseInt(configs['paymentPremiumPPB'], 10) / 10000000);
        renderConfigs(key, configs);
      });
  }
});
const renderConfigs = (network: string, configs: any) => {
  for (let key of Object.keys(configs)) {
    const node = document.getElementById(`show-${network}-${key}`);
    if (node) {
      node.innerHTML = new Number(configs[key]).toLocaleString();
    } else {
      // This is expected for a bunch of keys because web3 gives us more params than the real return value
      // console.log('show-',network, key,'not found');
    }
  }
};
