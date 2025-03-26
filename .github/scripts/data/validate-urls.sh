#!/usr/bin/env bash
set -e

TEMP_DIR="temp"
NEW_DATA_FILE="${TEMP_DIR}/NEW_DATA_FOUND.json"
URL_REPORT="${TEMP_DIR}/url_validation_report.md"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $*"
}

main() {
  if [ ! -f "$NEW_DATA_FILE" ]; then
    log "No NEW_DATA_FOUND.json to validate. Exiting."
    echo "url_validation_failed=false" >> $GITHUB_OUTPUT
    exit 0
  fi

  # We'll parse .newlyFoundItems[]. (url, iconUrl, etc.)
  # If you store them in the JSON, you can read them with 'jq'

  failures=()

  # Using jq to build a line with "URL,TokenName,Type"
  # E.g. "https://d2f70xi62kby8n.cloudfront.net/tokens/wbtc.webp,WBTC,icon"
    while IFS= read -r line; do
    url=$(echo "$line" | cut -d"|" -f1)
    assetName=$(echo "$line" | cut -d"|" -f2)
    urlType=$(echo "$line" | cut -d"|" -f3)

    status=$(curl -s -o /dev/null -w "%{http_code}" -I "$url" || echo "000")

    if [ "$status" -lt 200 ] || [ "$status" -ge 400 ]; then
        failures+=("$assetName|$url|$urlType|$status")
    fi
    done < <(
    # "as $item" needed, then we output two lines per item: icon + feed
    jq -r '
        .newlyFoundItems[] as $item
        | [
            $item.iconUrl,
            $item.assetName,
            $item.baseAsset,
            "icon"
        ],
        [
            $item.url,
            $item.assetName,
            $item.baseAsset,
            "feed"
        ]
        | @csv
    ' "$NEW_DATA_FILE" \
        | sed 's/"//g' \
        | sed 's/,/|/g'
    )

  # If you also want to validate .url (the feed/streams link), you can do a second loop or unify them.

  if [ "${#failures[@]}" -eq 0 ]; then
    log "All URLs validated successfully."
    echo "url_validation_failed=false" >> $GITHUB_OUTPUT
    exit 0
  fi

  log "Some URLs are invalid."
  echo "url_validation_failed=true" >> $GITHUB_OUTPUT

  # Build the markdown report
  mkdir -p "$TEMP_DIR"
  {
    echo "# GH-action-data-validate-urls: Invalid URLs Detected"
    echo ""
    echo "The following URLs returned an invalid status code:"
    echo ""
    for fail in "${failures[@]}"; do
      # each fail is "assetName|url|type|status"
      IFS='|' read -r asset url type code <<< "$fail"
      echo "- **AssetName:** $asset"
      echo "  - **baseAsset:** $baseAsset"
      echo "  - **URL:** $url"
      echo "  - **Type:** $type"
      echo "  - **HTTP Status:** $code"
      echo ""
    done
  } > "$URL_REPORT"
}

main "$@"
