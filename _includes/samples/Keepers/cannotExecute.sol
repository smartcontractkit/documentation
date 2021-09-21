function checkUpkeep(bytes calldata checkData)
  external
  cannotExecute() /** from KeeperBase.sol */
  returns (bool, bytes memory)
{
  (address someLibrary, bytes memory payload) = abi.decode(
    checkData,
    (address, bytes)
  );
  return someLibrary.delegatecall(payload);
}