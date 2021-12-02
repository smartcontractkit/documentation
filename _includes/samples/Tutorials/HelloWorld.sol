// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract HelloWorld {
  string public message;

  constructor(string memory initialMessage) {
    message = initialMessage;
  }

  function updateMessage(string memory newMessage) public {
    message = newMessage;
  }
}