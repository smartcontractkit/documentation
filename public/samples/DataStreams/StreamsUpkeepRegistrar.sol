// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Common} from "@chainlink/contracts/src/v0.8/libraries/Common.sol";
import {StreamsLookupCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/StreamsLookupCompatibleInterface.sol";
import {ILogAutomation, Log} from "@chainlink/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";
import {IRewardManager} from "@chainlink/contracts/src/v0.8/llo-feeds/interfaces/IRewardManager.sol";
import {IVerifierFeeManager} from "@chainlink/contracts/src/v0.8/llo-feeds/interfaces/IVerifierFeeManager.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/interfaces/IERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE FOR DEMONSTRATION PURPOSES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * @dev Defines the parameters required to register a new upkeep.
 * @param name The name of the upkeep to be registered.
 * @param encryptedEmail An encrypted email address associated with the upkeep (optional).
 * @param upkeepContract The address of the contract that requires upkeep.
 * @param gasLimit The maximum amount of gas to be used for the upkeep execution.
 * @param adminAddress The address that will have administrative privileges over the upkeep.
 * @param triggerType An identifier for the type of trigger that initiates the upkeep (`1` for event-based).
 * @param checkData Data passed to the checkUpkeep function to simulate conditions for triggering upkeep.
 * @param triggerConfig Configuration parameters specific to the trigger type.
 * @param offchainConfig Off-chain configuration data, if applicable.
 * @param amount The amount of LINK tokens to fund the upkeep registration.
 */
struct RegistrationParams {
    string name;
    bytes encryptedEmail;
    address upkeepContract;
    uint32 gasLimit;
    address adminAddress;
    uint8 triggerType;
    bytes checkData;
    bytes triggerConfig;
    bytes offchainConfig;
    uint96 amount;
}

/**
 * @dev Interface for the Automation Registrar contract.
 */
interface AutomationRegistrarInterface {
    /**
     * @dev Registers a new upkeep contract with Chainlink Automation.
     * @param requestParams The parameters required for the upkeep registration, encapsulated in `RegistrationParams`.
     * @return upkeepID The unique identifier for the registered upkeep, used for future interactions.
     */
    function registerUpkeep(
        RegistrationParams calldata requestParams
    ) external returns (uint256);
}

// Custom interfaces for Data Streams: IVerifierProxy and IFeeManager
interface IVerifierProxy {
    function verify(
        bytes calldata payload,
        bytes calldata parameterPayload
    ) external payable returns (bytes memory verifierResponse);

    function s_feeManager() external view returns (IVerifierFeeManager);
}

interface IFeeManager {
    function getFeeAndReward(
        address subscriber,
        bytes memory unverifiedReport,
        address quoteAddress
    ) external returns (Common.Asset memory, Common.Asset memory, uint256);

    function i_linkAddress() external view returns (address);

    function i_nativeAddress() external view returns (address);

    function i_rewardManager() external view returns (address);
}

contract StreamsUpkeep is ILogAutomation, StreamsLookupCompatibleInterface {
    LinkTokenInterface public immutable i_link;
    AutomationRegistrarInterface public immutable i_registrar;

    struct BasicReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified onchain
        int192 price; // DON consensus median price, carried to 8 decimal places
    }

    struct PremiumReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified onchain
        int192 price; // DON consensus median price, carried to 8 decimal places
        int192 bid; // Simulated price impact of a buy order up to the X% depth of liquidity utilisation
        int192 ask; // Simulated price impact of a sell order up to the X% depth of liquidity utilisation
    }

    struct Quote {
        address quoteAddress;
    }

    event PriceUpdate(int192 indexed price);

    IVerifierProxy public verifier;

    address public FEE_ADDRESS;
    string public constant DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant DATASTREAMS_QUERYLABEL = "timestamp";
    int192 public s_last_retrieved_price;
    uint256 s_upkeepID;
    bytes public s_LogTriggerConfig;

    // This example reads the ID for the basic ETH/USD price report on Arbitrum Sepolia.
    // Find a complete list of IDs at https://docs.chain.link/data-streams/stream-ids
    string[] public feedIds = [
        "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b"
    ];

    constructor(
        address _verifier,
        LinkTokenInterface link,
        AutomationRegistrarInterface registrar
    ) {
        verifier = IVerifierProxy(_verifier);
        i_link = link;
        i_registrar = registrar;
    }

    /**
     * @notice Registers a new upkeep using the specified parameters and predicts its ID.
     * @dev This function first approves the transfer of LINK tokens specified in `params.amount` to the Automation Registrar contract.
     *      It then registers the upkeep and stores its ID if registration is successful.
     *      Reverts if auto-approve is disabled or registration fails.
     * @param params The registration parameters, including name, upkeep contract address, gas limit, admin address, trigger type, and funding amount.
     */
    function registerAndPredictID(RegistrationParams memory params) public {
        i_link.approve(address(i_registrar), params.amount);
        uint256 upkeepID = i_registrar.registerUpkeep(params);
        if (upkeepID != 0) {
            s_upkeepID = upkeepID; // DEV - Use the upkeepID however you see fit
        } else {
            revert("auto-approve disabled");
        }
    }

    // This function uses revert to convey call information.
    // See https://eips.ethereum.org/EIPS/eip-3668#rationale for details.
    function checkLog(
        Log calldata log,
        bytes memory
    ) external returns (bool upkeepNeeded, bytes memory performData) {
        revert StreamsLookup(
            DATASTREAMS_FEEDLABEL,
            feedIds,
            DATASTREAMS_QUERYLABEL,
            log.timestamp,
            ""
        );
    }

    // The Data Streams report bytes is passed here.
    // extraData is context data from feed lookup process.
    // Your contract may include logic to further process this data.
    // This method is intended only to be simulated offchain by Automation.
    // The data returned will then be passed by Automation into performUpkeep
    function checkCallback(
        bytes[] calldata values,
        bytes calldata extraData
    ) external pure returns (bool, bytes memory) {
        return (true, abi.encode(values, extraData));
    }

    // function will be performed onchain
    function performUpkeep(bytes calldata performData) external {
        // Decode the performData bytes passed in by CL Automation.
        // This contains the data returned by your implementation in checkCallback().
        (bytes[] memory signedReports, bytes memory extraData) = abi.decode(
            performData,
            (bytes[], bytes)
        );

        bytes memory unverifiedReport = signedReports[0];

        (, /* bytes32[3] reportContextData */ bytes memory reportData) = abi
            .decode(unverifiedReport, (bytes32[3], bytes));

        // Report verification fees
        IFeeManager feeManager = IFeeManager(address(verifier.s_feeManager()));
        IRewardManager rewardManager = IRewardManager(
            address(feeManager.i_rewardManager())
        );

        address feeTokenAddress = feeManager.i_linkAddress();
        (Common.Asset memory fee, , ) = feeManager.getFeeAndReward(
            address(this),
            reportData,
            feeTokenAddress
        );

        // Approve rewardManager to spend this contract's balance in fees
        IERC20(feeTokenAddress).approve(address(rewardManager), fee.amount);

        // Verify the report
        bytes memory verifiedReportData = verifier.verify(
            unverifiedReport,
            abi.encode(feeTokenAddress)
        );

        // Decode verified report data into BasicReport struct
        BasicReport memory verifiedReport = abi.decode(
            verifiedReportData,
            (BasicReport)
        );

        // Log price from report
        emit PriceUpdate(verifiedReport.price);

        // Store the price from the report
        s_last_retrieved_price = verifiedReport.price;
    }
}
