package main

import (
	"log"

	"github.com/aelmanaa/chainlink-price-feed-golang/aggregatorv3"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	client, err := ethclient.Dial("https://kovan.infura.io/v3/<infura_project_id>")
	if err != nil {
		log.Fatal(err)
	}

	// Price Feed address
	aggregatorAddress := common.HexToAddress("0x9326BFA02ADD2366b30bacB125260Af641031331")
	chainlinkPriceFeedProxy, err := aggregatorv3.NewAggregatorV3Interface(aggregatorAddress, client)
	if err != nil {
		log.Fatal(err)
	}

	roundData, err := chainlinkPriceFeedProxy.LatestRoundData(&bind.CallOpts{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println(roundData)

}
