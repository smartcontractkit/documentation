# SPDX-License-Identifier: MIT
# @version ^0.3.3

counter: public(uint256)
INTERVAL: immutable(uint256) 
last_time_stamp: uint256

@external
def __init__(update_interval: uint256):
    INTERVAL = update_interval
    self.last_time_stamp = block.timestamp
    self.counter = 0

@external
@view 
def checkUpkeep(checkData: Bytes[32]) -> (bool, Bytes[32]):
    upkeep_needed: bool = (block.timestamp - self.last_time_stamp) > INTERVAL
    return(upkeep_needed, b"\x00")
    
@external
def performUpkeep(calldata: Bytes[1]):
    upkeep_needed: bool = (block.timestamp - self.last_time_stamp) > INTERVAL
    assert upkeep_needed, "upkeep not needed!"
    self.last_time_stamp = block.timestamp
    self.counter = self.counter + 1
