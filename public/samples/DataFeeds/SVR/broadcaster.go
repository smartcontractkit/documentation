type MevBundle struct {
    Hash      common.Hash
    Tx        []byte
    CanRevert bool
}

type Inclusion struct {
    Block       *big.Int
    MaxBlock    *big.Int
}

type BundleParams struct {
    Body []MevBundle
    inclusion Inclusion
}

// ... create and sign your transaction
tx := types.NewTransaction(...)
signedTx, err := types.SignTx(tx, ...)
txBytes := signedTx.MarshalBinary()

bundle := []MevBundle {
    {
        Hash: event.EventHash,
    },
    {
        Tx:        &txBytes,
        CanRevert: false,
    },
}

params := BundleParams {
    Body:      bundle,
    Inclusion: Inclusion{blockNumber, blockNumber+1},
}

byteParams, err := json.Marshal(params)
body := []byte(fmt.Sprintf(`{"jsonrpc":"2.0","method":"mev_sendBundle","params":["%s"], "id":1}`, string(byteParams)))
bodyReader := bytes.NewReader(body)
postReq, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://relay.flashbots.net/", bodyReader)

hashedBody := crypto.Keccak256Hash(body).Hex()
signedMessage, err := crypto.Sign(accounts.TextHash([]byte(hashedBody)), privKey)
postReq.Header.Add("X-Flashbots-signature", address.String()+":"+hexutil.Encode(signedMessage))
resp, err := http.DefaultClient.Do(postReq)
