// main.go

package main

import (
	"context"
	"data-streams-direct-ws/client"
	"log"
	"os"
)

func main() {
    if len(os.Args) < 2 {
        log.Fatalf("Usage: %s <feedID1> <feedID2> ...", os.Args[0])
    }

    feedIds := os.Args[1:]

    ctx := context.Background()

    // Pass feed IDs to the ConnectAndListen function
    if err := client.ConnectAndListen(ctx, feedIds); err != nil {
        log.Fatalf("Error connecting and listening: %v", err)
    }
}
