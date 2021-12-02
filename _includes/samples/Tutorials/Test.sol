// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

interface numberComparison {
   function isSameNum(uint a, uint b) external view returns(bool);
}

contract Test is numberComparison {
    
   constructor() {}
   
   function isSameNum(uint a, uint b) override external pure returns(bool){
      if (a == b) {
        return true;
      } else {
        return false;
      }
   }
}