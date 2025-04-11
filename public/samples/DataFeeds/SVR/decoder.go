decoded, err := hex.DecodeString(strings.TrimPrefix(strings.ToLower(tx.CallData), "0x"))
contractAddress := "0x" + strings.ToLower(strings.TrimLeft(hex.EncodeToString(decoded[4:36]), "0"))

ff := strings.ToLower(strings.TrimLeft(hex.EncodeToString(decoded[100:104]), "0"))
if strings.Compare(ff, "ba0cb29e") != 0 {
return nil, fmt.Errorf("event doesn't invoke svr method: ba0cb29e, instead: %s", ff)
}

transmitSecondaryElems := make(map[string]interface{})
err := getTransmissionTypes().UnpackIntoMap(transmitSecondaryElems, decoded[104:])

report, exists := transmitSecondaryElems["report"]
return MedianFromReport(report.([]byte))

func MedianFromReport(report []byte) (*big.Int, error) {
	reportElems := map[string]interface{}{}
	err := getReportTypes().UnpackIntoMap(reportElems, report)
	observationsIface, ok := reportElems["observations"]
	observations, ok := observationsIface.([]*big.Int)
	median := observations[len(observations)/2]
	return median, nil
}

func getReportTypes() abi.Arguments {
	return abi.Arguments([]abi.Argument{
		{Name: "observationsTimestamp", Type: mustNewType("uint32")},
		{Name: "rawObservers", Type: mustNewType("bytes32")},
		{Name: "observations", Type: mustNewType("int192[]")},
		{Name: "juelsPerFeeCoin", Type: mustNewType("int192")},
	})
}

func getTransmissionTypes() abi.Arguments {
	return abi.Arguments([]abi.Argument{
		{Name: "reportContext", Type: mustNewType("bytes32[3]")},
		{Name: "report", Type: mustNewType("bytes")},
		{Name: "rs", Type: mustNewType("bytes32[]")},
		{Name: "ss", Type: mustNewType("bytes32[]")},
		{Name: "rawVs", Type: mustNewType("bytes32")},
	})
}

func mustNewType(t string) abi.Type {
	result, err := abi.NewType(t, "", nil)
	return result
}
