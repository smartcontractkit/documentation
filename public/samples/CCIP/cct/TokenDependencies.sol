// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// solhint-disable no-unused-import
import {BurnMintERC20} from "@chainlink/contracts/src/v0.8/shared/token/ERC20/BurnMintERC20.sol";
import {BurnMintTokenPool} from "@chainlink/contracts-ccip/contracts/pools/BurnMintTokenPool.sol";
import {LockReleaseTokenPool} from "@chainlink/contracts-ccip/contracts/pools/LockReleaseTokenPool.sol";
import {RegistryModuleOwnerCustom} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/RegistryModuleOwnerCustom.sol";
import {TokenAdminRegistry} from "@chainlink/contracts-ccip/contracts/tokenAdminRegistry/TokenAdminRegistry.sol";
