import * as fs from 'fs';
import { exit } from 'process';
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
      };
      docsHidden?: boolean;
      transmissionsAccount?: string;
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

function load(filename: string): DataFile {
  const file = `data-source/${filename}`;
  const result = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
  if (!result.contracts) {
    console.error(
      `It looks like you may have loaded an invalid or unexpectedly formatted data file.\nKey 'contracts' not found in File: ${file}`
    );
    exit(2);
  }
  return result;
}

/**
 * The shape of the final JSON we want to serve to individual pages
 */
const finalResult: {
  [key: string]: {
    title: string;
    feedType: string;
    networks: {
      name: string;
      url: string;
      proxies: ResultProxy[];
    }[];
  };
} = {};

// Generate the data we need to serve
for (let page of targetData) {
  finalResult[page.page] = {
    title: page.title,
    feedType: page.feedType,
    networks: []
  };

  for (let network of page.networks) {
    const contents = load(network.source);

    // First find all the live contracts
    const liveContracts: {
      [key: string]: {
        decimals: number;
        deviationThreshold: number;
        heartbeat: string;
      };
    } = {};
    for (let contractKey of Object.keys(contents.contracts)) {
      const contract = contents.contracts[contractKey];
      if (
        (contract.status === 'testnet-priority' || contract.status === 'live') &&
        // Only include if the key does not exist or it's not true
        !contract['docsHidden']
      ) {
        let threshold: number = 0;
        // Handle Threshold defined in the config object
        if (
          contract.config &&
          (threshold = Number.parseInt(
            contract.config.relativeDeviationThresholdPPB ? contract.config.relativeDeviationThresholdPPB : '',
            10
          ))
        ) {
          threshold = threshold / 10000000;
        }

        // Set the threshold to deviationThreshold if it's specified (deviationThreshold or
        // relativeDeviationThresholdPPB should be set)
        liveContracts[contractKey] = {
          deviationThreshold: contract.deviationThreshold ? contract.deviationThreshold : threshold,
          heartbeat: contract.heartbeat ? contract.heartbeat : contract.config?.maxContractValueAge || '',
          decimals: contract.decimals,
        };
        if (contract.v3Facade) {
          liveContracts[contract.v3Facade] = {
            deviationThreshold: contract.deviationThreshold,
            heartbeat: contract.heartbeat,
            decimals: contract.decimals,
          };
        }
      }
    }

    // Then make a list of only the proxies that are live
    const proxyList: ResultProxy[] = [];
    if (contents.proxies) {
      for (let proxyKey of Object.keys(contents.proxies)) {
        const proxy = contents.proxies[proxyKey];
        if (liveContracts[proxy.aggregator] && !proxy.name.includes("Healthcheck")) {

          // Conditional processing for DPI pairs on specific networks.
          let dpiIndexProxyAddresses: string[] = [
            "0x029849bbc0b1d93b85a8b6190e979fd38F5760E2", // Ethereum DPI / ETH
            "0xD2A593BF7594aCE1faD597adb697b5645d5edDB2", // Ethereum DPI / USD
            "0xC70aAF9092De3a4E5000956E672cDf5E996B4610" // Polygon (Matic) DPI / ETH
          ];
          if (dpiIndexProxyAddresses.includes(proxyKey)) {
            proxy.name = proxy.name.concat(" Index");
          }
          // End conditional

          proxyList.push({
            pair:
              // Only insert 'v1' if this isn't an index
              !/index/i.test(proxy.name) &&
              // Only insert 'v1' if this isn't already a versioned OHM
              !/OHMv/i.test(proxy.name)
              ? proxy.name.replace("OHM", "OHMv1")  : proxy.name,
            deviationThreshold: liveContracts[proxy.aggregator].deviationThreshold,
            heartbeat: liveContracts[proxy.aggregator].heartbeat,
            decimals: liveContracts[proxy.aggregator].decimals,
            proxy: proxyKey,
          });
        }
      }
    } else {
      for (let contractKey of Object.keys(contents.contracts)) {
        const contract = contents.contracts[contractKey];
        if (!contract.docsHidden) {
          proxyList.push({
            pair: contract.name,
            deviationThreshold: liveContracts[contractKey].deviationThreshold,
            heartbeat: liveContracts[contractKey].heartbeat,
            decimals: liveContracts[contractKey].decimals,
            // Use transmissionsAccount for Solana; contractKey otherwise
            proxy: contract.transmissionsAccount || contractKey,
          });
        }
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
