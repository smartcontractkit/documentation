// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import {KeeperRegistryInterface, State, Config} from "../interfaces/KeeperRegistryInterface.sol";
import {LinkTokenInterface} from "../interfaces/LinkTokenInterface.sol";

interface KeeperRegistrarInterface {
  function register(
    string memory name,
    bytes calldata encryptedEmail,
    address upkeepContract,
    uint32 gasLimit,
    address adminAddress,
    bytes calldata checkData,
    uint96 amount,
    uint8 source,
    address sender
  ) external;
}

contract UpkeepIDConsumerExample {
  LinkTokenInterface public immutable i_link;
  address public immutable i_registrar;
  KeeperRegistryInterface public immutable i_registry;
  bytes4 registerSig = bytes4(keccak256("register(string,bytes,address,uint32,address,bytes,uint96,uint8,address)"));

  constructor(
    LinkTokenInterface link,
    address registrar,
    KeeperRegistryInterface registry
  ) {
    i_link = link;
    i_registrar = registrar;
    i_registry = registry;
  }

  function registerAndPredictID(
    string memory name,
    bytes calldata encryptedEmail,
    address upkeepContract,
    uint32 gasLimit,
    address adminAddress,
    bytes calldata checkData,
    uint96 amount,
    uint8 source,
    address sender
  ) public {
    (State memory state, Config memory _c, address[] memory _k) = i_registry.getState();
    uint256 oldNonce = state.nonce;
    i_link.transferAndCall(
      i_registrar,
      5 ether,
      abi.encodeWithSelector(
        registerSig,
        name,
        encryptedEmail,
        upkeepContract,
        gasLimit,
        adminAddress,
        checkData,
        amount,
        source,
        sender
      )
    );
    (state, _c, _k) = i_registry.getState();
    uint256 newNonce = state.nonce;
    if (newNonce == oldNonce + 1) {
      // auto approve enabled
      uint256 upkeepID = uint256(
        keccak256(abi.encodePacked(blockhash(block.number - 1), address(i_registry), oldNonce))
      );
      // DEV - Use the upkeepID however you see fit
    } else {
      revert("auto-approve disabled");
    }
  }
}