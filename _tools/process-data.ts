import * as fs from 'fs';
import { NETWORKS } from './networks';

const targetData = NETWORKS;

/**
 * Structure of JSON files we're reading
 */
interface DataFile {
  contracts: {
    [key: string]: {
      deviationThreshold: number;
      heartbeat: string;
      decimals: number;
      v3Facade: string;
      name: string;
      status: 'dead' | 'live' | 'testnet-priority' | 'backup';
      config?: {
        maxContractValueAge: string;
        relativeDeviationThresholdPPB: string;
      }
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
  deviationThreshold: number;
  heartbeat: string;
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
    const liveContracts: { [key: string]: { decimals: number, deviationThreshold: number, heartbeat: string } } = {};
    for (let contractKey of Object.keys(contents.contracts)) {
      const contract = contents.contracts[contractKey];
      if (
        (contract.status === 'testnet-priority' ||
          contract.status === 'live') &&
        // Only include if the key does not exist or it's not true
        !contract['docsHidden']
      ) {
        let threshold;
        if (threshold = Number.parseInt(contract.config?.relativeDeviationThresholdPPB, 10)) {
          threshold = threshold / 10000000;
        }
        liveContracts[contractKey] = {

          deviationThreshold: contract.deviationThreshold ? contract.deviationThreshold : threshold,
          heartbeat: contract.heartbeat ? contract.heartbeat : contract.config?.maxContractValueAge,
          decimals: contract.decimals
        };
        if (contract.v3Facade) {
          liveContracts[contract.v3Facade] = { deviationThreshold: contract.deviationThreshold, heartbeat: contract.heartbeat, decimals: contract.decimals };
        }
      }
    }

    // Then make a list of only the proxies that are live
    const proxyList: ResultProxy[] = [];
    if (contents.proxies) {
      for (let proxyKey of Object.keys(contents.proxies)) {
        const proxy = contents.proxies[proxyKey];
        if (liveContracts[proxy.aggregator] && !proxy.name.includes("Healthcheck")) {
          proxyList.push({
            pair: proxy.name,
            deviationThreshold: liveContracts[proxy.aggregator].deviationThreshold,
            heartbeat: liveContracts[proxy.aggregator].heartbeat,
            decimals: liveContracts[proxy.aggregator].decimals,
            proxy: proxyKey.startsWith("sol-") ? proxyKey.replace("sol-", "") : proxyKey,
          });
        }
      }
    } else {
      for (let contractKey of Object.keys(contents.contracts)) {
        const contract = contents.contracts[contractKey];
        proxyList.push({
          pair: contract.name,
          deviationThreshold: liveContracts[contractKey].deviationThreshold,
          heartbeat: liveContracts[contractKey].heartbeat,
          decimals: liveContracts[contractKey].decimals,
          proxy: contractKey.startsWith("sol-") ? contractKey.replace("sol-", "") : contractKey,
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
  fs.mkdirSync('_src/addresses');
} catch (err) {
  // Doesn't matter if the directory already exists
}
const path = '_src/addresses/addresses.json';
fs.writeFileSync(path, JSON.stringify(finalResult));
console.log(`processed results written to ${path}`);