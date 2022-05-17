package main

import (
	"log"

	proxy "github.com/aelmanaa/chainlink-price-feed-golang/aggregatorv3"

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
	addr := "0x9326BFA02ADD2366b30bacB125260Af641031331"
	aggregatorAddress := common.HexToAddress(addr)
	instance, err := proxy.NewAggregatorV3Interface(aggregatorAddress, client)
	if err != nil {
		log.Fatal(err)
	}

	roundData, err := instance.LatestRoundData(&bind.CallOpts{})
	if err != nil {
		log.Fatal(err)
	}

	log.Println(roundData)

}
