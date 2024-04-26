// client.go

package client

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common/hexutil"
)

type SingleReport struct {
	FeedID                hexutil.Bytes `json:"feedID"`
	ValidFromTimestamp    uint32        `json:"validFromTimestamp"`
	ObservationsTimestamp uint32        `json:"observationsTimestamp"`
	FullReport            hexutil.Bytes `json:"fullReport"`
}

type SingleReportResponse struct {
	Report SingleReport `json:"report"`
}

type BulkReportResponse struct {
	Reports []SingleReport `json:"reports"`
}

const (
	path     = "/api/v1/reports"
	bulkPath = "/api/v1/reports/bulk"
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

func FetchSingleReportSingleFeed(feedId string) (SingleReport, error) {
	baseUrl := os.Getenv("BASE_URL") // Example: api.testnet-dataengine.chain.link
	clientId := os.Getenv("CLIENT_ID") // Example: "00000000-0000-0000-0000-000000000000"
	userSecret := os.Getenv("CLIENT_SECRET") // Example: "your-secret"
	
	timestamp := time.Now().UTC().UnixMilli() - 500

	params := url.Values{
		"feedID":    {feedId},
		"timestamp": {fmt.Sprintf("%d", timestamp/1000)},
	}

	req := &http.Request{
		Method: http.MethodGet,
		URL: &url.URL{
			Scheme:   "https",
			Host:     baseUrl,
			Path:     path,
			RawQuery: params.Encode(),
		},
	}
	req.Header = GenerateAuthHeaders(req.Method, req.URL.RequestURI(), clientId, userSecret)
	fmt.Println("base: ", baseUrl)
	fmt.Println("header: ", req.Header)
	fmt.Println("params: ", params)

	rawRes, err := http.DefaultClient.Do(req)
	if err != nil {
		return SingleReport{}, err
	}
	defer rawRes.Body.Close()

	body, err := io.ReadAll(rawRes.Body)
	if err != nil {
		return SingleReport{}, err
	}

	if rawRes.StatusCode != http.StatusOK {
		// Error messages are typically descriptive
		return SingleReport{}, fmt.Errorf("unexpected status code %d: %v", rawRes.StatusCode, string(body))
	}

	var res SingleReportResponse
	err = json.Unmarshal(body, &res)
	if err != nil {
		return SingleReport{}, err
	}

	return res.Report, nil
}

func FetchSingleReportManyFeeds(feedIds []string) ([]SingleReport, error) {
	baseUrl := os.Getenv("BASE_URL") //Example: api.testnet-dataengine.chain.link
	clientId := os.Getenv("CLIENT_ID") // Example: "00000000-0000-0000-0000-000000000000"
	userSecret := os.Getenv("CLIENT_SECRET") // Example: "your-secret"

	timestamp := time.Now().UTC().UnixMilli() - 500

	params := url.Values{
		"feedIDs":   {strings.Join(feedIds, ",")},
		"timestamp": {fmt.Sprintf("%d", timestamp/1000)},
	}

	req := &http.Request{
		Method: http.MethodGet,
		URL: &url.URL{
			Scheme:   "https",
			Host:     baseUrl,
			Path:     bulkPath,
			RawQuery: params.Encode(),
		},
	}

	req.Header = GenerateAuthHeaders(req.Method, req.URL.RequestURI(), clientId, userSecret)
	fmt.Println("base: ", baseUrl)
	fmt.Println("header: ", req.Header)
	fmt.Println("params: ", params)

	rawRes, err := http.DefaultClient.Do(req)
	if err != nil {
		return []SingleReport{}, err
	}
	defer rawRes.Body.Close()

	body, err := io.ReadAll(rawRes.Body)
	if err != nil {
		return []SingleReport{}, err
	}

	if rawRes.StatusCode != http.StatusOK {
		// Error messages are typically descriptive
		return []SingleReport{}, fmt.Errorf("unexpected status code %d: %v", rawRes.StatusCode, string(body))
	}

	var res BulkReportResponse
	err = json.Unmarshal(body, &res)
	if err != nil {
		return []SingleReport{}, err
	}

	return res.Reports, nil
}