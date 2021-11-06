import { abi } from './keepers-abi';
declare var Web3: any;

document.addEventListener('DOMContentLoaded', () => {
  const contracts: { [key: string]: any } = {
    ethereum: new new Web3('https://eth-mainnet.alchemyapi.io/v2/-_DxqjsKfWsDxYbz-KDGe_BH5OLlZT0-').eth.Contract(
      abi,
      '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'
    ),
    // polygon: new new Web3('https://polygon-mainnet.g.alchemy.com/v2/vn3HPO5qapvV6DMx4Wp6izedOAIKuDxN').eth.Contract(
    //   abi,
    //   '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'
    // ),
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
const renderConfigs = (network:string, configs: any) => {
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
