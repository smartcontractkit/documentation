import * as fs from 'fs';
import { NETWORKS } from './networks';

const targetData = NETWORKS;

/**
 * Structure of JSON files we're reading
 */
interface DataFile {
  contracts: {
    [key: string]: {
      decimals: number;
      v3Facade: string;
      status: 'dead' | 'live' | 'testnet-priority' | 'backup';
    };
  };
  proxies: {
    [key: string]: {
      aggregator: string;
      name: string;
    };
  };
}

interface ResultProxy {
  pair: string;
  decimals: number;
  proxy: string;
}

function load(filename): DataFile {
  return JSON.parse(
    fs.readFileSync(`data-source/${filename}`, {
      encoding: 'utf8',
    })
  );
}

/**
 * The shape of the final JSON we want to serve to individual pages
 */
const finalResult: {
  [key: string]: {
    title: string;
    networks: {
      name: string;
      url: string;
      proxies: ResultProxy[];
    }[];
  };
} = {};

// Generate the data we need to serve
for (let page of targetData) {
  finalResult[page.page] = { title: page.title, networks: [] };

  for (let network of page.networks) {
    const contents = load(network.source);

    // First find all the live contracts
    const liveContracts: { [key: string]: { decimals: number } } = {};
    for (let contractKey of Object.keys(contents.contracts)) {
      const contract = contents.contracts[contractKey];
      if (
        contract.status === 'testnet-priority' ||
        contract.status === 'live'
      ) {
        liveContracts[contractKey] = { decimals: contract.decimals };
        if (contract.v3Facade) {
          liveContracts[contract.v3Facade] = { decimals: contract.decimals };
        }
      }
    }

    // Then make a list of only the proxies that are live
    const proxyList: ResultProxy[] = [];
    for (let proxyKey of Object.keys(contents.proxies)) {
      const proxy = contents.proxies[proxyKey];
      if (liveContracts[proxy.aggregator]) {
        proxyList.push({
          pair: proxy.name,
          decimals: liveContracts[proxy.aggregator].decimals,
          proxy: proxyKey,
        });
      }
    }

    // Save the data into our final output
    proxyList.sort((a, b) => (a.pair < b.pair ? -1 : 1));
    finalResult[page.page].networks.push({
      name: network.name,
      url: network.url,
      proxies: proxyList,
    });
  }
}

// Write the data to disk
try {
  fs.mkdirSync('address_dist')
} catch (err) {
  // Doesn't matter if the directory already exists
}
fs.writeFileSync('address_dist/addresses.json',JSON.stringify(finalResult));
