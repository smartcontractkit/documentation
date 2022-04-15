// This configuration file sets up the paths and compilers so we can test our solidity samples
import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-dependency-compiler';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const accounts = process.env.MNEMONIC !== undefined ? { mnemonic: process.env.MNEMONIC } : [];
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  paths: {
    root: './',
    sources: './_includes/samples',
    cache: './.test/cache',
    artifacts: './.test/artifacts',
  },
  solidity: {
    compilers: [
      { version: '0.4.24' },
      { version: '0.6.6' },
      { version: '0.6.12' },
      { version: '0.7.6' },
      { version: '0.8.7' },
    ],
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts,
    },
    kovan: {
      url: process.env.KOVAN_URL || '',
      accounts,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
  },
  mocha: {
    timeout: 300000,
  },
  typechain: {
    outDir: './.test/typechain',
    // externalArtifacts: ['./node_modules/@chainlink/contracts/abi/**/*.json'],
  },
  dependencyCompiler: {
    paths: ['@chainlink/contracts/src/v0.4/interfaces/ERC677.sol'],
  },
};

export default config;
