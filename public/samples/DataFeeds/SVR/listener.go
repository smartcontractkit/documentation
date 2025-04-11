type MevShareEvent struct {
	Hash common.Hash          `json:"hash"`
	Txs  []PendingTransaction `json:"txs"`
}

type PendingTransaction struct {
	To               common.Address `json:"to"`
	FunctionSelector string         `json:"functionSelector"`
	CallData         string         `json:"callData"`
}

req, err := http.NewRequestWithContext(
  ctx,
  "GET",
  "https://mev-share.flashbots.net",
  nil,
)

// ... read the event data from the response

var event MevShareEvent
err := json.Unmarshal(responseData, &event)

// ... check if tx is calling the forward method
if strings.Compare(
  strings.ToLower(tx.FunctionSelector),
  "0x6fadcf72",
) != 0 {
	continue
}
