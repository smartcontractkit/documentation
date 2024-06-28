// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract FunctionsConsumerDecoder is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    uint256 public s_answer;
    uint256 public s_updatedAt;
    uint8 public s_decimals;
    string public s_description;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    event DecodedResponse(
        bytes32 indexed requestId,
        uint256 answer,
        uint256 updatedAt,
        uint8 decimals,
        string description
    );

    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Send a pre-encoded CBOR request
     * @param request CBOR-encoded request data
     * @param subscriptionId Billing ID
     * @param gasLimit The maximum amount of gas the request can consume
     * @param donID ID of the job to be invoked
     * @return requestId The ID of the sent request
     */
    function sendRequestCBOR(
        bytes memory request,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        s_lastRequestId = _sendRequest(
            request,
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @dev Internal function to process the outcome of a data request. It stores the latest response or error and updates the contract state accordingly. This function is designed to handle only one of `response` or `err` at a time, not both. It decodes the response if present and emits events to log both raw and decoded data.
     *
     * @param requestId The unique identifier of the request, originally returned by `sendRequest`. Used to match responses with requests.
     * @param response The raw aggregated response data from the external source. This data is ABI-encoded and is expected to contain specific information (e.g., answer, updatedAt) if no error occurred. The function attempts to decode this data if `response` is not empty.
     * @param err The raw aggregated error information, indicating an issue either from the user's code or within the execution of the user Chainlink Function.
     *
     * Emits a `DecodedResponse` event if the `response` is successfully decoded, providing detailed information about the data received.
     * Emits a `Response` event for every call to log the raw response and error data.
     *
     * Requirements:
     * - The `requestId` must match the last stored request ID to ensure the response corresponds to the latest request sent.
     * - Only one of `response` or `err` should contain data for a given call; the other should be empty.
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        s_lastError = err;
        s_lastResponse = response;

        if (response.length > 0) {
            (
                uint256 answer,
                uint256 updatedAt,
                uint8 decimals,
                string memory description
            ) = abi.decode(response, (uint256, uint256, uint8, string));

            s_answer = answer;
            s_updatedAt = updatedAt;
            s_decimals = decimals;
            s_description = description;

            emit DecodedResponse(
                requestId,
                answer,
                updatedAt,
                decimals,
                description
            );
        }

        emit Response(requestId, response, err);
    }
}
