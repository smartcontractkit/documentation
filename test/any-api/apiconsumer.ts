import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { LinkTokenInterface } from '../../.test/typechain/@chainlink/contracts/src/v0.8/interfaces';
import { ERC677 } from '../../.test/typechain';
import config from '../config';
import chai, { expect } from 'chai';
import { inIndirectReceipt, inReceipt } from '../expectEvent';
import { solidity } from 'ethereum-waffle';
import { waitNumBlocks, getBalance, fromWei, toWei } from '../utils';
chai.use(solidity);

describe('Connect to Any API', () => {
  let owner: SignerWithAddress;
  let linkToken: LinkTokenInterface;
  let erc677: ERC677;
  before('setup', async () => {
    [owner] = await ethers.getSigners();
    const { name: networkName, chainId } = await ethers.provider.getNetwork();
    expect(chainId).to.be.equal(config[networkName as keyof typeof config].chainId);
    const linkAddress = config[networkName as keyof typeof config].linkAddress;
    linkToken = (await ethers.getContractAt(
      '@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol:LinkTokenInterface',
      linkAddress
    )) as LinkTokenInterface;
    erc677 = (await ethers.getContractAt('ERC677', linkAddress)) as ERC677;

    const balanceOwnerLink = await linkToken.balanceOf(owner.address);
    const balanceOwnerEth = await getBalance(owner.address);
    console.log('network name is %s and chain id is %d', networkName, chainId);
    console.log(
      'balance of %s is %s LINK and %s ETH ',
      owner.address,
      fromWei(balanceOwnerLink),
      fromWei(balanceOwnerEth)
    );
  });

  it('APIConsumer kovan', async () => {
    const APIConsumer = await ethers.getContractFactory('APIConsumer');
    const apiConsumer = await APIConsumer.deploy();
    await apiConsumer.deployed();
    const apiConsumerAddress = apiConsumer.address;
    console.log(apiConsumerAddress);
    const linkTransfer = toWei('0.1');
    let receipt = await (await linkToken.transfer(apiConsumerAddress, linkTransfer)).wait();

    inIndirectReceipt(receipt, erc677.interface, 'Transfer', {
      from: owner.address,
      to: apiConsumerAddress,
      value: linkTransfer,
    });

    const balanceContractLink = await linkToken.balanceOf(apiConsumerAddress);
    expect(balanceContractLink).to.equal(linkTransfer);
    expect(await apiConsumer.volume()).to.equal(0);
    //
    receipt = await (await apiConsumer.requestVolumeData()).wait();
    inReceipt(receipt, 'ChainlinkRequested');
    const event = receipt.events?.find((event) => event.event === 'ChainlinkRequested');
    console.log(event?.args?.[0]);
    // wait 2 blocks
    await waitNumBlocks(2);

    /*
    * TO BE IMPROVED once we have non rate limiting etherscan api key
    *
    let p = new ethers.providers.EtherscanProvider();
    let history = await p.getHistory(apiConsumerAddress);
    console.log(history);
      */
    console.log('volume data is %s', (await apiConsumer.volume()).toString());
    expect(await apiConsumer.volume()).to.be.gt(0);
  });
});
