// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity 0.8.19;

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UNAUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract DirectFundingConsumerV2_5 is
    VRFV2PlusWrapperConsumerBase,
    ConfirmedOwner
{
    event RequestSent(uint256 requestId, uint32 numWords, uint256 paid);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    error InsufficientFunds(uint256 balance, uint256 calculatedRequestPrice);
    error RequestNotFound(uint256 requestId);
    error LinkTransferError(address sender, address receiver, uint256 amount);
    error FailedToWithdrawEth(address sender, address receiver, uint256 amount);
    error NothingToWithdraw();

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // configuration: https://docs.chain.link/vrf/v2-5/supported-networks
    constructor(
        address _wrapperAddress
    )
        ConfirmedOwner(msg.sender)
        VRFV2PlusWrapperConsumerBase(_wrapperAddress)
    {}

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    // The default is 3, but you can set this higher.
    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2PlusWrapper.getConfig().maxNumWords.
    function requestRandomWords(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        bool enableNativePayment
    ) external onlyOwner returns (uint256) {
        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment})
        );
        uint256 requestId;
        uint256 reqPrice;
        if (enableNativePayment) {
            uint256 calculatedRequestPrice = i_vrfV2PlusWrapper
                .calculateRequestPriceNative(_callbackGasLimit, _numWords);
            uint256 balance = address(this).balance;
            if (calculatedRequestPrice > balance)
                revert InsufficientFunds(balance, calculatedRequestPrice);
            (requestId, reqPrice) = requestRandomnessPayInNative(
                _callbackGasLimit,
                _requestConfirmations,
                _numWords,
                extraArgs
            );
        } else {
            uint256 calculatedRequestPrice = i_vrfV2PlusWrapper
                .calculateRequestPrice(_callbackGasLimit, _numWords);
            uint256 balance = i_linkToken.balanceOf(address(this));
            if (calculatedRequestPrice > balance)
                revert InsufficientFunds(balance, calculatedRequestPrice);
            (requestId, reqPrice) = requestRandomness(
                _callbackGasLimit,
                _requestConfirmations,
                _numWords,
                extraArgs
            );
        }

        s_requests[requestId] = RequestStatus({
            paid: reqPrice,
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, _numWords, reqPrice);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        RequestStatus storage request = s_requests[_requestId];
        if (request.paid == 0) revert RequestNotFound(_requestId);
        request.fulfilled = true;
        request.randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords, request.paid);
    }

    function getNumberOfRequests() external view returns (uint256) {
        return requestIds.length;
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        RequestStatus memory request = s_requests[_requestId];
        if (request.paid == 0) revert RequestNotFound(_requestId);
        return (request.paid, request.fulfilled, request.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink(address _receiver) public onlyOwner {
        uint256 amount = i_linkToken.balanceOf(address(this));
        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        bool success = i_linkToken.transfer(_receiver, amount);
        if (!success)
            revert LinkTransferError(
                msg.sender,
                _receiver,
                i_linkToken.balanceOf(address(this))
            );
    }

    function withdraw(address _receiver) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent, ) = _receiver.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, _receiver, amount);
    }

    receive() external payable {}
}
