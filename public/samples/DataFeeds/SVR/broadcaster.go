import "github.com/flashbots/mev-share-node/mevshare"

// ... create and sign your transaction
// Your transaction should send ETH to block.coinbase as the tip/bid
// Example: Include a call that does payable(block.coinbase).transfer(msg.value)
tx := types.NewTransaction(...)
signedTx, err := types.SignTx(tx, ...)
txBytes := signedTx.MarshalBinary()

bundle := []mevshare.MevBundleBody {
    {
        Hash: &event.EventHash,
    },
    {
        Tx:        &txBytes,
        CanRevert: false,
    },
}

params := mevshare.SendMevBundleArgs {
    Body:      bundle,
    Inclusion: mevshare.MevBundleInclusion{blockNumber, blockNumber+1},
}

byteParams, err := json.Marshal(params)
body := []byte(fmt.Sprintf(`{"jsonrpc":"2.0","method":"mev_sendBundle","params":["%s"], "id":1}`, string(byteParams)))
bodyReader := bytes.NewReader(body)
postReq, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://relay.flashbots.net/", bodyReader)

hashedBody := crypto.Keccak256Hash(body).Hex()
signedMessage, err := crypto.Sign(accounts.TextHash([]byte(hashedBody)), privKey)
postReq.Header.Add("X-Flashbots-signature", address.String()+":"+hexutil.Encode(signedMessage))
resp, err := http.DefaultClient.Do(postReq)
