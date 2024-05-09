// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity 0.8.19;

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * Import IVRFV2PlusWrapper which is not yet available in the chainlink/contracts package.
 * https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/vrf/dev/interfaces/IVRFV2PlusWrapper.sol
 */

interface IVRFV2PlusWrapper {
    /**
     * @return the request ID of the most recent VRF V2 request made by this wrapper. This should only
     * be relied option within the same transaction that the request was made.
     */
    function lastRequestId() external view returns (uint256);

    /**
     * @notice Calculates the price of a VRF request with the given callbackGasLimit at the current
     * @notice block.
     *
     * @dev This function relies on the transaction gas price which is not automatically set during
     * @dev simulation. To estimate the price at a specific gas price, use the estimatePrice function.
     *
     * @param _callbackGasLimit is the gas limit used to estimate the price.
     * @param _numWords is the number of words to request.
     */
    function calculateRequestPrice(
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) external view returns (uint256);

    /**
     * @notice Calculates the price of a VRF request in native with the given callbackGasLimit at the current
     * @notice block.
     *
     * @dev This function relies on the transaction gas price which is not automatically set during
     * @dev simulation. To estimate the price at a specific gas price, use the estimatePrice function.
     *
     * @param _callbackGasLimit is the gas limit used to estimate the price.
     * @param _numWords is the number of words to request.
     */
    function calculateRequestPriceNative(
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) external view returns (uint256);

    /**
     * @notice Estimates the price of a VRF request with a specific gas limit and gas price.
     *
     * @dev This is a convenience function that can be called in simulation to better understand
     * @dev pricing.
     *
     * @param _callbackGasLimit is the gas limit used to estimate the price.
     * @param _numWords is the number of words to request.
     * @param _requestGasPriceWei is the gas price in wei used for the estimation.
     */
    function estimateRequestPrice(
        uint32 _callbackGasLimit,
        uint32 _numWords,
        uint256 _requestGasPriceWei
    ) external view returns (uint256);

    /**
     * @notice Estimates the price of a VRF request in native with a specific gas limit and gas price.
     *
     * @dev This is a convenience function that can be called in simulation to better understand
     * @dev pricing.
     *
     * @param _callbackGasLimit is the gas limit used to estimate the price.
     * @param _numWords is the number of words to request.
     * @param _requestGasPriceWei is the gas price in wei used for the estimation.
     */
    function estimateRequestPriceNative(
        uint32 _callbackGasLimit,
        uint32 _numWords,
        uint256 _requestGasPriceWei
    ) external view returns (uint256);

    /**
     * @notice Requests randomness from the VRF V2 wrapper, paying in native token.
     *
     * @param _callbackGasLimit is the gas limit for the request.
     * @param _requestConfirmations number of request confirmations to wait before serving a request.
     * @param _numWords is the number of words to request.
     */
    function requestRandomWordsInNative(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        bytes calldata extraArgs
    ) external payable returns (uint256 requestId);

    function link() external view returns (address);

    function linkNativeFeed() external view returns (address);
}

/**
 * Import VRFV2PlusWrapperConsumerBase which is not yet available in the chainlink/contracts package.
 * https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol
 */

abstract contract VRFV2PlusWrapperConsumerBase {
    error OnlyVRFWrapperCanFulfill(address have, address want);

    LinkTokenInterface internal immutable i_linkToken;
    IVRFV2PlusWrapper public immutable i_vrfV2PlusWrapper;

    /**
     * @param _vrfV2PlusWrapper is the address of the VRFV2Wrapper contract
     */
    constructor(address _vrfV2PlusWrapper) {
        IVRFV2PlusWrapper vrfV2PlusWrapper = IVRFV2PlusWrapper(
            _vrfV2PlusWrapper
        );

        i_linkToken = LinkTokenInterface(vrfV2PlusWrapper.link());
        i_vrfV2PlusWrapper = vrfV2PlusWrapper;
    }

    /**
     * @dev Requests randomness from the VRF V2+ wrapper.
     *
     * @param _callbackGasLimit is the gas limit that should be used when calling the consumer's
     *        fulfillRandomWords function.
     * @param _requestConfirmations is the number of confirmations to wait before fulfilling the
     *        request. A higher number of confirmations increases security by reducing the likelihood
     *        that a chain re-org changes a published randomness outcome.
     * @param _numWords is the number of random words to request.
     *
     * @return requestId is the VRF V2+ request ID of the newly created randomness request.
     */
    // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
    function requestRandomness(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        bytes memory extraArgs
    ) internal returns (uint256 requestId, uint256 reqPrice) {
        reqPrice = i_vrfV2PlusWrapper.calculateRequestPrice(
            _callbackGasLimit,
            _numWords
        );
        i_linkToken.transferAndCall(
            address(i_vrfV2PlusWrapper),
            reqPrice,
            abi.encode(
                _callbackGasLimit,
                _requestConfirmations,
                _numWords,
                extraArgs
            )
        );
        return (i_vrfV2PlusWrapper.lastRequestId(), reqPrice);
    }

    // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
    function requestRandomnessPayInNative(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        bytes memory extraArgs
    ) internal returns (uint256 requestId, uint256 requestPrice) {
        requestPrice = i_vrfV2PlusWrapper.calculateRequestPriceNative(
            _callbackGasLimit,
            _numWords
        );
        return (
            i_vrfV2PlusWrapper.requestRandomWordsInNative{value: requestPrice}(
                _callbackGasLimit,
                _requestConfirmations,
                _numWords,
                extraArgs
            ),
            requestPrice
        );
    }

    /**
     * @notice fulfillRandomWords handles the VRF V2 wrapper response. The consuming contract must
     * @notice implement it.
     *
     * @param _requestId is the VRF V2 request ID.
     * @param _randomWords is the randomness result.
     */
    // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal virtual;

    function rawFulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) external {
        address vrfWrapperAddr = address(i_vrfV2PlusWrapper);
        if (msg.sender != vrfWrapperAddr) {
            revert OnlyVRFWrapperCanFulfill(msg.sender, vrfWrapperAddr);
        }
        fulfillRandomWords(_requestId, _randomWords);
    }

    /// @notice getBalance returns the native balance of the consumer contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice getLinkToken returns the link token contract
    function getLinkToken() public view returns (LinkTokenInterface) {
        return i_linkToken;
    }
}

contract DirectFundingConsumer is VRFV2PlusWrapperConsumerBase, ConfirmedOwner {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

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

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 2;

    // Address LINK - hardcoded for Arbitrum Sepolia
    address linkAddress = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;

    // address WRAPPER - hardcoded for Arbitrum Sepolia
    address wrapperAddress = 0x29576aB8152A09b9DC634804e4aDE73dA1f3a3CC;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2PlusWrapperConsumerBase(wrapperAddress)
    {}

    function requestRandomWords() external onlyOwner returns (uint256) {
        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
        );
        (uint256 requestId, uint256 reqPrice) = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords,
            extraArgs
        );
        s_requests[requestId] = RequestStatus({
            paid: reqPrice,
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
