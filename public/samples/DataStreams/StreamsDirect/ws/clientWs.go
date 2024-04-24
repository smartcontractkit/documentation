// clientWs.go

package client

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/gorilla/websocket"
)

// Constants for ping interval, pong timeout, write timeout, and retry backoff
const pingInterval = 5 * time.Second
const pongTimeout = 10 * time.Second
const writeTimeout = 5 * time.Second

// NewReportWSMessage is the struct that we'll send to a subscribed client's MessageChan to be forwarded to the client's websocket connection
type NewReportWSMessage struct {
	Report struct {
		FeedId     hexutil.Bytes `json:"feedID"`
		FullReport hexutil.Bytes `json:"fullReport"`
	} `json:"report"`
}

const (
	wsPath = "/api/v1/ws"
)

func GenerateHMAC(method string, path string, body []byte, clientId string, timestamp int64, userSecret string) string {
	serverBodyHash := sha256.New()
	serverBodyHash.Write(body)
	serverBodyHashString := fmt.Sprintf("%s %s %s %s %d",
		method,
		path,
		hex.EncodeToString(serverBodyHash.Sum(nil)),
		clientId,
		timestamp)
	fmt.Println("Generating HMAC with the following: ", serverBodyHashString)
	signedMessage := hmac.New(sha256.New, []byte(userSecret))
	signedMessage.Write([]byte(serverBodyHashString))
	userHmac := hex.EncodeToString(signedMessage.Sum(nil))
	return userHmac
}

func GenerateAuthHeaders(method string, pathAndParams string, clientId string, userSecret string) http.Header {
	header := http.Header{}
	timestamp := time.Now().UTC().UnixMilli()
	hmacString := GenerateHMAC(method, pathAndParams, []byte(""), clientId, timestamp, userSecret)

	header.Add("Authorization", clientId)
	header.Add("X-Authorization-Timestamp", strconv.FormatInt(timestamp, 10))
	header.Add("X-Authorization-Signature-SHA256", hmacString)
	return header
}

// connectAndListen connects to the WebSocket server and starts listening for messages.
// It also handles ping/pong communication to keep the connection alive.
func ConnectAndListen(ctx context.Context, feedIds []string) error {
	conn, err := openWebsocketConnection(ctx, feedIds)
	if err != nil {
		return err
	}
	defer conn.Close()

	// Start the ping/pong handling
	go pingLoop(ctx, conn)

	// Set the initial read deadline
	err = conn.SetReadDeadline(time.Now().Add(pongTimeout))
	if err != nil {
		return err
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			_, msg, err := conn.ReadMessage()
			if err != nil {
				return err
			}

			var decoded NewReportWSMessage
			err = json.Unmarshal(msg, &decoded)
			if err != nil {
				return fmt.Errorf("failed to unmarshal message: %w", err)
			}

			// From here, you have decoded.FeedId and decoded.FullReport
			// See examples for decoding the full report in other code snippets
			fmt.Println("Received the following message: ", decoded)

			// There may be some latency between when you receive a message and when the report is retrievable
			// So pause for a minute before taking action on the message
			time.Sleep(500 * time.Millisecond)
		}
	}
}

// openWebsocketConnection opens a WebSocket connection to the server.
func openWebsocketConnection(ctx context.Context, feedIds []string) (*websocket.Conn, error) {
	baseUrl := os.Getenv("BASE_URL") // Example: https://ws.testnet-dataengine.chain.link
	clientId := os.Getenv("CLIENT_ID") // Example: "00000000-0000-0000-0000-000000000000"
	userSecret := os.Getenv("CLIENT_SECRET") // Example: "your-secret"

	if len(feedIds) == 0 {
        return nil, fmt.Errorf("no feed ID(s) provided")
    }

	params := url.Values{
		"feedIDs":   {strings.Join(feedIds, ",")},
	}

	reqURL := &url.URL{
		Scheme:   "wss", // Note the scheme here
		Host:     baseUrl,
		Path:     wsPath,
		RawQuery: params.Encode(),
	}

	headers := GenerateAuthHeaders("GET", reqURL.RequestURI(), clientId, userSecret)
	conn, _, err := websocket.DefaultDialer.DialContext(ctx, reqURL.String(), headers)
	if err != nil {
		return nil, err
	}

	// Add the Pong handler
	conn.SetPongHandler(func(string) error {
		log.Println("Websocket:", "Received pong...")
		err := conn.SetReadDeadline(time.Now().Add(pongTimeout))
		return err
	})

	return conn, nil
}

// PingPongLoop is a function that handles sending ping messages to the websocket and handles pong messages received
func pingLoop(ctx context.Context, conn *websocket.Conn) {
	ticker := time.NewTicker(pingInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			log.Println("Websocket:", "Sending ping...")
			err := conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(writeTimeout))
			if err != nil {
				log.Printf("Failed to send ping: %v", err)
				return
			}
		}
	}
}