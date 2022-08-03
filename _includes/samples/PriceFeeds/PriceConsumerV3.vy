# SPDX-License-Identifier: MIT
# @version ^0.3.4
import interfaces.AggregatorV3Interface as AggregatorV3Interface

price_feed: public(AggregatorV3Interface)

@external
def __init__(_price_feed_address: address):
    self.price_feed = AggregatorV3Interface(_price_feed_address)

@external
@view
def get_latest_price() -> int256:
    a: uint80 = 0
    price: int256 = 0
    b: uint256 = 0
    c: uint256 = 0
    d: uint80 = 0
    (a, price, b, c, d) = self.price_feed.latestRoundData()
    return price
