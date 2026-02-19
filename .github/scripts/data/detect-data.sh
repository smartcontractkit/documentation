#!/usr/bin/env bash
set -e  # Exit immediately on error

# This script orchestrates the detection of new data using the TS script src/scripts/data/detect-new-data.ts
# 1) "init-baseline": creates a baseline with all currently visible feedIDs (no changelog updates)
# 2) "check-data": calls the TS script, checks for new items, updates baseline/changelog if found

BASELINE_FILE=".github/scripts/data/baseline.json"
CHANGELOG_FILE="public/changelog.json"
TEMP_DIR="temp"
NEW_DATA_FILE="${TEMP_DIR}/NEW_DATA_FOUND.json"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $*"
}

init_baseline() {
  log "Initializing baseline..."

  # If baseline exists, back it up or remove it
  if [ -f "$BASELINE_FILE" ]; then
    mv "$BASELINE_FILE" "${BASELINE_FILE}.bak"
  fi

  # Run TS script once, ignoring any exit code
  npx tsx src/scripts/data/detect-new-data.ts || true

  # If NEW_DATA_FOUND.json doesn't exist => no new data
  if [ ! -f "$NEW_DATA_FILE" ]; then
    cat <<EOF > "$BASELINE_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "knownIds": []
}
EOF
    log "No items found, baseline created as empty."
    return
  fi

  # read newly found IDs as a JSON array
  # e.g. [ "arbitrum-1inch-usd", "arbitrum-aave-usd", ... ]
  ids=$(jq '[.newlyFoundItems[].feedID] | unique' "$NEW_DATA_FILE")

  # Write baseline as a single array
  cat <<EOF > "$BASELINE_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "knownIds": $ids
}
EOF

  log "Baseline file created with current known IDs."
  rm -f "$NEW_DATA_FILE"
}

check_data() {
  log "Checking for new data..."

  if [ ! -f "$BASELINE_FILE" ]; then
    log "Baseline file not found. Please run: $0 init-baseline"
    exit 1
  fi

  # 1) Run the TS script
  set +e
  npx tsx src/scripts/data/detect-new-data.ts
  exit_code=$?
  set -e

  if [ "$exit_code" -ne 0 ]; then
    log "TypeScript script encountered an error (exit=$exit_code)."
    exit 1
  fi

  # 2) If NEW_DATA_FOUND.json doesn't exist => no new items
  if [ ! -f "$NEW_DATA_FILE" ]; then
    log "No new data found. Exiting."
    exit 0
  fi

  # 3) We do have new items, so read them
  count=$(jq '.newlyFoundItems | length' "$NEW_DATA_FILE")
  log "Found $count new items."

  # 4) Merge new IDs into baseline
  # Step A: read existing knownIds (as JSON array) from the baseline
  existingArray=$(jq '.knownIds' "$BASELINE_FILE")

  # Step B: read newly found feedIDs (as JSON array)
  newArray=$(jq '[.newlyFoundItems[].feedID] | unique' "$NEW_DATA_FILE")

  # Step C: combine them in pure JSON
  combinedArray=$(jq -n --argjson old "$existingArray" --argjson new "$newArray" '
    ($old + $new) | unique
  ')

  # Step D: write updated baseline
  cat <<EOF > "$BASELINE_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "knownIds": $combinedArray
}
EOF

  log "Baseline updated with new IDs."

  # 5) Now update the changelog
node <<EOF
    const fs = require('fs');
    const path = require('path');

    const newlyFound = JSON.parse(fs.readFileSync('${NEW_DATA_FILE}', 'utf8'));
    const items = newlyFound.newlyFoundItems || [];

    const CHANGELOG_PATH = path.resolve('${CHANGELOG_FILE}');
    let changelog;
    if (fs.existsSync(CHANGELOG_PATH)) {
      changelog = JSON.parse(fs.readFileSync(CHANGELOG_PATH, 'utf8'));
    } else {
      changelog = { networks: {}, data: [] };
    }
    if (!changelog.data) {
      changelog.data = [];
    }

    // === GROUPING: data-streams, smartData, data-feeds ===
    const dataStreams = [];
    const smartData = [];
    const dataFeeds = [];

    for (const item of items) {
      const code = (item.productTypeCode || '').toUpperCase().trim();
      if (item.deliveryChannelCode === 'DS') {
        dataStreams.push(item);
      } else if (['POR','NAV','AUM'].includes(code)) {
        smartData.push(item);
      } else {
        dataFeeds.push(item);
      }
    }

    // === HELPER to build a single Changelog Entry
    function createChangelogEntry(topic, title, description, relatedNetworks, tokens) {
      return {
        category: "integration",
        date: new Date().toISOString().split('T')[0],
        description,
        ...(relatedNetworks ? { relatedNetworks } : {}),
        relatedTokens: tokens,
        title,
        topic,
      };
    }

    // === data-streams networks
    const STREAMS_NETWORKS = [
      "0g", "apechain", "adi", "aptos", "arbitrum", "arc", "avalanche", "base", "berachain", "bitlayer", "blast",
      "bnb-chain", "bob", "botanix", "celo", "dogeos", "ethereum", "gnosis-chain", "gravity", "hashkey", 
      "hedera", "hyperliquid", "injective", "ink", "jovay", "katana", "lens", "linea", "mantle", 
      "metis", "monad", "opbnb", "optimism", "polygon", "pharos", "plasma", "ronin", "scroll", "shibarium", "sei",
      "soneium", "sonic", "solana", "stable", "taiko", "unichain", "worldchain", "zksync"
    ];

    // === Build relatedTokens for FEEDS
    function buildDataFeedTokens(feedItems) {
      return feedItems.map(i => {
        const baseLower = i.baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset: i.baseAsset,
          quoteAsset: i.quoteAsset || "",
          network: i.network,
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).sort((a, b) => a.assetName.localeCompare(b.assetName));
    }

    // === Build relatedTokens for STREAMS
    function buildDataStreamTokens(streamItems) {
      return streamItems.map(i => {
        const baseLower = i.baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset: i.baseAsset,
          quoteAsset: i.quoteAsset || "",
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).sort((a, b) => a.assetName.localeCompare(b.assetName));
    }

    // === Build relatedTokens for SMARTDATA
    function buildSmartDataTokens(smartItems) {
      return smartItems.map(i => {
        const baseLower = i.baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset: i.baseAsset,
          network: i.network,
          productTypeCode: i.productTypeCode,
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).sort((a, b) => a.assetName.localeCompare(b.assetName));
    }

    // === Now build each group
    const dataFeedsTokens = buildDataFeedTokens(dataFeeds);
    const dataStreamsTokens = buildDataStreamTokens(dataStreams);
    const smartDataTokens  = buildSmartDataTokens(smartData);

    // === Create new changelog entries
    const newEntries = [];

    // If we have streams
    if (dataStreamsTokens.length > 0) {
      newEntries.push(
        createChangelogEntry(
          "Data Streams",
          "Added support to Data Streams",
          "New Data Streams available on all [supported networks](https://docs.chain.link/data-streams/crypto-streams):",
          STREAMS_NETWORKS,
          dataStreamsTokens
        )
      );
    }

    // If we have smartData
    if (smartDataTokens.length > 0) {
      const networksSet = new Set(smartDataTokens.map(t => t.network));
      const networksList = [...networksSet];
      newEntries.push(
        createChangelogEntry(
          "SmartData",
          "Added support to SmartData",
          "New SmartData Feeds available:",
          networksList,
          smartDataTokens
        )
      );
    }

    // If we have normal data feeds
    if (dataFeedsTokens.length > 0) {
      const networksSet = new Set(dataFeedsTokens.map(t => t.network));
      const networksList = [...networksSet];
      newEntries.push(
        createChangelogEntry(
          "Data Feeds",
          "Added support to Data Feeds",
          "New Data Feeds available:",
          networksList,
          dataFeedsTokens
        )
      );
    }

    // Insert them at the start of `changelog.data`
    for (const entry of newEntries.reverse()) {
      changelog.data.unshift(entry);
    }

    fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(changelog, null, 2), 'utf8');
    console.log(\`changelog.json updated with \${newEntries.length} new entry(ies).\`);
EOF

  log "changelog.json updated."

  log "Done."
}

main() {
  local cmd="${1:-help}"

  case "$cmd" in
    init-baseline)
      init_baseline
      ;;
    check-data)
      check_data
      ;;
    *)
      echo "Usage: $0 {init-baseline|check-data}"
      exit 1
      ;;
  esac
}

main "$@"
