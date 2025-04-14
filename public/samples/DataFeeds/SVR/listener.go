import "github.com/flashbots/mev-share-node/mevshare"

req, err := http.NewRequestWithContext(
  ctx,
  "GET",
  "https://mev-share.flashbots.net",
  nil,
)

// ... read the event data from the response

var event mevshare.Hint
err := json.Unmarshal(responseData, &event)

// ... check if tx is calling the forward method
if strings.Compare(
  strings.ToLower(tx.FunctionSelector.String()),
  "0x6fadcf72",
) != 0 {
	continue
}
