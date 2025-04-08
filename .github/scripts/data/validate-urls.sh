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

  # We'll parse .newlyFoundItems[]. (url, iconUrl, etc.) via jq
  # We'll track feed vs icon in separate arrays
  feedFailures=()
  iconFailures=()
  feedTested=0
  iconTested=0

  while IFS= read -r line; do
    # Format: "URL|assetName|type"
    # type is either 'feed' or 'icon'
    url=$(echo "$line" | cut -d"|" -f1)
    assetName=$(echo "$line" | cut -d"|" -f2)
    urlType=$(echo "$line" | cut -d"|" -f3)

    if [ "$urlType" = "feed" ]; then
      feedTested=$((feedTested+1))
    else
      iconTested=$((iconTested+1))
    fi

    status=$(curl -s -o /dev/null -w "%{http_code}" -I "$url" || echo "000")
    if [ "$status" -lt 200 ] || [ "$status" -ge 400 ]; then
      # Store failures in different arrays depending on type
      if [ "$urlType" = "feed" ]; then
        feedFailures+=("$assetName|$url|$status")
      else
        iconFailures+=("$assetName|$url|$status")
      fi
    fi
  done < <(
    jq -r '
      .newlyFoundItems[] as $item
      | [
          $item.iconUrl,
          $item.assetName,
          "icon"
        ],
        [
          $item.url,
          $item.assetName,
          "feed"
        ]
      | @csv
    ' "$NEW_DATA_FILE" \
      | sed 's/"//g' \
      | sed 's/,/|/g'
  )

  totalFailures=$(( ${#feedFailures[@]} + ${#iconFailures[@]} ))
  if [ "$totalFailures" -eq 0 ]; then
    log "All URLs validated successfully."
    echo "url_validation_failed=false" >> $GITHUB_OUTPUT
    exit 0
  fi

  log "Some URLs are invalid."
  echo "url_validation_failed=true" >> $GITHUB_OUTPUT

  # Build the markdown report
  mkdir -p "$TEMP_DIR"
  {
    echo "# GHA-data-validate-urls: Invalid URLs Detected"
    echo ""
    echo "**Summary**:"
    echo "- Feed URLs tested: **$feedTested**  (Failures: **${#feedFailures[@]}**)"
    echo "- Icon URLs tested: **$iconTested**  (Failures: **${#iconFailures[@]}**)"
    echo ""

    if [ "${#feedFailures[@]}" -gt 0 ]; then
      echo "## Broken Feed URLs"
      echo ""
      for fail in "${feedFailures[@]}"; do
        IFS='|' read -r assetName badUrl status <<< "$fail"
        echo "- **AssetName:** $assetName"
        echo "  - **URL:** $badUrl"
        echo "  - **HTTP Status:** $status"
        echo ""
      done
    fi

    if [ "${#iconFailures[@]}" -gt 0 ]; then
      echo "## Broken Icon URLs"
      echo ""
      for fail in "${iconFailures[@]}"; do
        IFS='|' read -r assetName badUrl status <<< "$fail"
        echo "- **AssetName:** $assetName"
        echo "  - **URL:** $badUrl"
        echo "  - **HTTP Status:** $status"
        echo ""
      done
    fi
  } > "$URL_REPORT"
}

main "$@"
