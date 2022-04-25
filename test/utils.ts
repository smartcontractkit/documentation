import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

export const toWei = (value: number | BigNumber | string) => ethers.utils.parseEther(value.toString());

export const fromWei = (value: number | BigNumber | string) =>
  ethers.utils.formatEther(typeof value === 'string' ? value : value.toString());

export const getBalance = ethers.provider.getBalance;

export const waitFor = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

export const waitNumBlocks = async (numberOfBlocks: number) => {
  const currentBlockNumber = await ethers.provider.getBlockNumber();
  const delay = 15 * 1000;
  while ((await ethers.provider.getBlockNumber()) < currentBlockNumber + numberOfBlocks + 1) {
    await waitFor(delay);
  }
};
