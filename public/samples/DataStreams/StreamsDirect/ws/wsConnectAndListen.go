// wsConnectAndListen.go

package main

import (
	"context"
	"data-streams-direct-ws/client"
	"log"
)

func main() {
    ctx := context.Background()

    // Start listening on WebSocket
    if err := client.ConnectAndListen(ctx); err != nil {
        log.Fatalf("Error connecting and listening: %v", err)
    }
}