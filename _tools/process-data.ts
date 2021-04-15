import * as fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { NETWORKS } from './networks';

global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;

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
  aggregator: string;
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
        contract.status === 'live' ||
        (page.internal && contract.status !== 'dead')
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
          aggregator: proxy.aggregator,
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

// Upload the data to firebase
const firebaseConfig = {
  apiKey: 'AIzaSyA2hTOlj4DHnYJ4KMYlnvCiJP9v1vd-Oec',
  authDomain: 'docs2-cl.firebaseapp.com',
  databaseURL: 'https://docs2-cl-default-rtdb.firebaseio.com',
  projectId: 'docs2-cl',
  storageBucket: 'docs2-cl.appspot.com',
  messagingSenderId: '650776382319',
  appId: '1:650776382319:web:a58e9e0f186d296574769a',
  measurementId: 'G-WWWK70W05J',
};

initializeApp(firebaseConfig);

const filename = 'addresses.json';
const storage = getStorage();
const fileRef = ref(storage, filename);

console.log(finalResult);
/*
try {
uploadString(fileRef, JSON.stringify(finalResult), 'string', {
  contentType: 'application/json',
}).then((snapshot) => {
  console.log('Uploaded address data!');
}).catch(err => {console.error('error uploading was',err)});
} catch(err) {
  console.log("caught an error",err);
}
*/