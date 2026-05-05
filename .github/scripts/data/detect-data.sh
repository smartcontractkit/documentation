#!/usr/bin/env bash
set -e  # Exit immediately on error

# This script orchestrates the detection of new data using the TS script src/scripts/data/detect-new-data.ts
# 1) "init-baseline": creates a baseline with all currently visible feedIDs and deprecating markers (no changelog updates)
# 2) "check-data": calls the TS script, checks for new items/deprecation changes, updates baseline/changelog if found

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
  "knownIds": [],
  "knownDeprecatingFeeds": [],
  "knownDeprecatingStreams": []
}
EOF
    log "No items found, baseline created as empty."
    return
  fi

  # read newly found IDs as a JSON array
  # e.g. [ "arbitrum-1inch-usd", "arbitrum-aave-usd", ... ]
  ids=$(jq '[.newlyFoundItems[]?.feedID] | unique' "$NEW_DATA_FILE")
  deprecatingFeeds=$(jq '[.currentDeprecatedItems[]? | {feedID, shutdownDate}] | unique_by(.feedID) | sort_by(.feedID)' "$NEW_DATA_FILE")
  deprecatingStreams=$(jq '[.currentDeprecatedStreams[]? | {feedID, shutdownDate}] | unique_by(.feedID) | sort_by(.feedID)' "$NEW_DATA_FILE")

  # Write baseline as a single array
  cat <<EOF > "$BASELINE_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "knownIds": $ids,
  "knownDeprecatingFeeds": $deprecatingFeeds,
  "knownDeprecatingStreams": $deprecatingStreams
}
EOF

  log "Baseline file created with current known IDs and deprecating markers."
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

  # 2) If NEW_DATA_FOUND.json doesn't exist => no new items or deprecation changes
  if [ ! -f "$NEW_DATA_FILE" ]; then
    log "No new data or deprecation changes found. Exiting."
    exit 0
  fi

  # 3) We do have changes, so read them
  newCount=$(jq '.newlyFoundItems // [] | length' "$NEW_DATA_FILE")
  newDeprecationCount=$(jq '.newlyDeprecatedItems // [] | length' "$NEW_DATA_FILE")
  resolvedDeprecationCount=$(jq '.resolvedDeprecatedItems // [] | length' "$NEW_DATA_FILE")
  changedDeprecationCount=$(jq '.changedDeprecatedItems // [] | length' "$NEW_DATA_FILE")
  deprecationBaselineInitialized=$(jq -r '.deprecationBaselineInitialized // false' "$NEW_DATA_FILE")
  newStreamDeprecationCount=$(jq '.newlyDeprecatedStreams // [] | length' "$NEW_DATA_FILE")
  resolvedStreamDeprecationCount=$(jq '.resolvedDeprecatedStreams // [] | length' "$NEW_DATA_FILE")
  changedStreamDeprecationCount=$(jq '.changedDeprecatedStreams // [] | length' "$NEW_DATA_FILE")
  streamDeprecationBaselineInitialized=$(jq -r '.streamDeprecationBaselineInitialized // false' "$NEW_DATA_FILE")
  log "Found $newCount new items, $newDeprecationCount new feed deprecations, $resolvedDeprecationCount resolved feed deprecations, $changedDeprecationCount changed feed deprecations, $newStreamDeprecationCount new stream deprecations, $resolvedStreamDeprecationCount resolved stream deprecations, and $changedStreamDeprecationCount changed stream deprecations."

  # 4) Merge new IDs and deprecation markers into baseline
  # Step A: read existing knownIds (as JSON array) from the baseline
  existingArray=$(jq '.knownIds // []' "$BASELINE_FILE")

  # Step B: read newly found feedIDs (as JSON array)
  newArray=$(jq '[.newlyFoundItems[]?.feedID] | unique' "$NEW_DATA_FILE")

  # Step C: combine them in pure JSON
  combinedArray=$(jq -n --argjson old "$existingArray" --argjson new "$newArray" '
    ($old + $new) | unique
  ')

  if [ "$deprecationBaselineInitialized" = "true" ]; then
    combinedDeprecatingFeeds=$(jq '[.currentDeprecatedItems[]? | {feedID, shutdownDate}] | unique_by(.feedID) | sort_by(.feedID)' "$NEW_DATA_FILE")
  else
    existingDeprecatingFeeds=$(jq '.knownDeprecatingFeeds // []' "$BASELINE_FILE")
    addedDeprecatingFeeds=$(jq '[((.newlyDeprecatedItems // []) + ((.changedDeprecatedItems // []) | map(.current)))[] | {feedID, shutdownDate}]' "$NEW_DATA_FILE")
    removedDeprecatingFeedIds=$(jq '[((.resolvedDeprecatedItems // []) + ((.changedDeprecatedItems // []) | map(.previous)))[] | .feedID]' "$NEW_DATA_FILE")

    combinedDeprecatingFeeds=$(jq -n \
      --argjson old "$existingDeprecatingFeeds" \
      --argjson added "$addedDeprecatingFeeds" \
      --argjson removed "$removedDeprecatingFeedIds" '
        ($old | map(select(.feedID as $id | ($removed | index($id) | not)))) + $added
        | unique_by(.feedID)
        | sort_by(.feedID)
      ')
  fi

  if [ "$streamDeprecationBaselineInitialized" = "true" ]; then
    combinedDeprecatingStreams=$(jq '[.currentDeprecatedStreams[]? | {feedID, shutdownDate}] | unique_by(.feedID) | sort_by(.feedID)' "$NEW_DATA_FILE")
  else
    existingDeprecatingStreams=$(jq '.knownDeprecatingStreams // []' "$BASELINE_FILE")
    addedDeprecatingStreams=$(jq '[((.newlyDeprecatedStreams // []) + ((.changedDeprecatedStreams // []) | map(.current)))[] | {feedID, shutdownDate}]' "$NEW_DATA_FILE")
    removedDeprecatingStreamIds=$(jq '[((.resolvedDeprecatedStreams // []) + ((.changedDeprecatedStreams // []) | map(.previous)))[] | .feedID]' "$NEW_DATA_FILE")

    combinedDeprecatingStreams=$(jq -n \
      --argjson old "$existingDeprecatingStreams" \
      --argjson added "$addedDeprecatingStreams" \
      --argjson removed "$removedDeprecatingStreamIds" '
        ($old | map(select(.feedID as $id | ($removed | index($id) | not)))) + $added
        | unique_by(.feedID)
        | sort_by(.feedID)
      ')
  fi

  # Step D: write updated baseline
  cat <<EOF > "$BASELINE_FILE"
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "knownIds": $combinedArray,
  "knownDeprecatingFeeds": $combinedDeprecatingFeeds,
  "knownDeprecatingStreams": $combinedDeprecatingStreams
}
EOF

  log "Baseline updated with new IDs and deprecating markers."

  # 5) Now update the changelog
node <<EOF
    const fs = require('fs');
    const path = require('path');

    const newlyFound = JSON.parse(fs.readFileSync('${NEW_DATA_FILE}', 'utf8'));
    const items = newlyFound.newlyFoundItems || [];
    const newlyDeprecatedItems = newlyFound.newlyDeprecatedItems || [];
    const resolvedDeprecatedItems = newlyFound.resolvedDeprecatedItems || [];
    const changedDeprecatedItems = newlyFound.changedDeprecatedItems || [];
    const newlyDeprecatedStreams = newlyFound.newlyDeprecatedStreams || [];
    const resolvedDeprecatedStreams = newlyFound.resolvedDeprecatedStreams || [];
    const changedDeprecatedStreams = newlyFound.changedDeprecatedStreams || [];
    const deprecatingItems = [
      ...newlyDeprecatedItems,
      ...changedDeprecatedItems.map(change => change.current).filter(Boolean),
    ];
    const deprecatingStreamItems = [
      ...newlyDeprecatedStreams,
      ...changedDeprecatedStreams.map(change => change.current).filter(Boolean),
    ];
    const deprecatedFeedIdsToRemove = new Set([
      ...resolvedDeprecatedItems.map(item => item.feedID),
      ...changedDeprecatedItems.map(change => change.previous && change.previous.feedID).filter(Boolean),
    ]);
    const deprecatedFeedUrlsToRemove = new Set([
      ...resolvedDeprecatedItems.map(item => item.url).filter(Boolean),
      ...changedDeprecatedItems.map(change => change.previous && change.previous.url).filter(Boolean),
    ]);
    const deprecatedStreamIdsToRemove = new Set([
      ...resolvedDeprecatedStreams.map(item => item.feedID),
      ...changedDeprecatedStreams.map(change => change.previous && change.previous.feedID).filter(Boolean),
    ]);
    const deprecatedStreamUrlsToRemove = new Set([
      ...resolvedDeprecatedStreams.map(item => item.url).filter(Boolean),
      ...changedDeprecatedStreams.map(change => change.previous && change.previous.url).filter(Boolean),
    ]);

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
    function createChangelogEntry(topic, title, description, relatedNetworks, tokens, category = "integration") {
      return {
        category,
        date: new Date().toISOString().split('T')[0],
        description,
        ...(relatedNetworks ? { relatedNetworks } : {}),
        relatedTokens: tokens,
        title,
        topic,
      };
    }

    function buildDeprecationDescription(productName, linkText, linkUrl, deprecatingItems) {
      const shutdownDates = [
        ...new Set(deprecatingItems.map(item => item.shutdownDate).filter(Boolean))
      ];
      const dateText = shutdownDates.length === 1 ? \` on \${shutdownDates[0]}\` : "";
      return \`The following \${productName} are scheduled for deprecation\${dateText}. See [\${linkText}](\${linkUrl}) for shutdown dates and the latest status:\`;
    }

    // DevHub changelog is Webflow CMS: structured rows with relatedTokens/networks
    // match the "Integration" template (e.g. "Added support to Data Streams"). "Release"
    // entries are typically prose-only there, so use integration until deprecations have
    // a dedicated CMS category synced from JSON.
    const DEPRECATION_CHANGELOG_CATEGORY = "integration";

    // === data-streams networks
    const STREAMS_NETWORKS = [
      "0g", "apechain", "adi", "aptos", "arbitrum", "arc", "avalanche", "base", "berachain", "bitlayer", "blast",
      "bnb-chain", "bob", "botanix", "celo", "dogeos", "ethereum", "giwa", "gnosis-chain", "gravity", "hashkey", 
      "hedera", "hyperliquid", "injective", "ink", "jovay", "katana", "lens", "linea", "mantle", 
      "metis", "monad", "opbnb", "optimism", "polygon", "perennial", "pharos", "plasma", "ronin",
      "robinhood", "scroll", "shibarium", "sei", "seismic", "soneium", "sonic", "solana", "stable", 
      "xlayer","taiko", "unichain", "worldchain", "zksync"
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
      const seen = new Set();
      return streamItems.map(i => {
        const baseLower = i.baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset: i.baseAsset,
          quoteAsset: i.quoteAsset || "",
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).filter(t => {
        // Deduplicate by URL — equity streams have multiple hour-variant feeds
        // (regular/overnight/extended) that now each produce distinct URLs, but
        // guard against any edge cases where URL generation still produces duplicates.
        if (seen.has(t.url)) return false;
        seen.add(t.url);
        return true;
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

    // === Build relatedTokens for DATA FEED DEPRECATIONS
    function buildDeprecatingDataFeedTokens(deprecatingFeedItems) {
      return deprecatingFeedItems.map(i => {
        const baseLower = i.baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset: i.baseAsset,
          quoteAsset: i.quoteAsset || "",
          network: i.network,
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).sort((a, b) => {
        return a.assetName.localeCompare(b.assetName);
      });
    }

    // === Build relatedTokens for DATA STREAM DEPRECATIONS
    function buildDeprecatingDataStreamTokens(deprecatingStreamItems) {
      const seen = new Set();
      return deprecatingStreamItems.map(i => {
        const baseAsset = i.baseAsset || "";
        const baseLower = baseAsset.toLowerCase();
        return {
          assetName: i.assetName,
          baseAsset,
          quoteAsset: i.quoteAsset || "",
          network: i.network,
          url: i.url,
          iconUrl: \`https://d2f70xi62kby8n.cloudfront.net/tokens/\${baseLower}.webp\`
        };
      }).filter(t => {
        if (seen.has(t.url)) return false;
        seen.add(t.url);
        return true;
      }).sort((a, b) => {
        return (a.assetName || "").localeCompare(b.assetName || "");
      });
    }

    function removeResolvedDeprecationsFromChangelog(topic, emptyEntryTitle, feedIds, urls) {
      if (feedIds.size === 0 && urls.size === 0) return;

      changelog.data = changelog.data.filter(entry => {
        if (
          entry.topic !== topic ||
          (entry.category !== "deprecation" && entry.title !== emptyEntryTitle) ||
          !Array.isArray(entry.relatedTokens)
        ) {
          return true;
        }

        const originalLength = entry.relatedTokens.length;
        entry.relatedTokens = entry.relatedTokens.filter(token => {
          if (!token || typeof token !== "object") return true;
          return !feedIds.has(token.feedID) && !urls.has(token.url);
        });

        if (entry.relatedTokens.length === originalLength) return true;

        if (entry.relatedTokens.length === 0 && entry.title === emptyEntryTitle) {
          return false;
        }

        const remainingNetworks = [...new Set(
          entry.relatedTokens
            .filter(token => token && typeof token === "object" && token.network)
            .map(token => token.network)
        )];
        if (remainingNetworks.length > 0) {
          entry.relatedNetworks = remainingNetworks;
        } else {
          delete entry.relatedNetworks;
        }

        return true;
      });
    }

    // === Now build each group
    const dataFeedsTokens = buildDataFeedTokens(dataFeeds);
    const dataStreamsTokens = buildDataStreamTokens(dataStreams);
    const smartDataTokens  = buildSmartDataTokens(smartData);
    const deprecatingDataFeedTokens = buildDeprecatingDataFeedTokens(deprecatingItems);
    const deprecatingDataStreamTokens = buildDeprecatingDataStreamTokens(deprecatingStreamItems);

    removeResolvedDeprecationsFromChangelog("Data Feeds", "Feeds scheduled for deprecation", deprecatedFeedIdsToRemove, deprecatedFeedUrlsToRemove);
    removeResolvedDeprecationsFromChangelog("Data Streams", "Streams scheduled for deprecation", deprecatedStreamIdsToRemove, deprecatedStreamUrlsToRemove);

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

    // If we have newly scheduled deprecations
    if (deprecatingDataFeedTokens.length > 0) {
      const networksSet = new Set(deprecatingDataFeedTokens.map(t => t.network));
      const networksList = [...networksSet];
      newEntries.push(
        createChangelogEntry(
          "Data Feeds",
          "Feeds scheduled for deprecation",
          buildDeprecationDescription(
            "Data Feeds",
            "Feeds Scheduled For Deprecation",
            "https://docs.chain.link/data-feeds/deprecating-feeds",
            deprecatingItems
          ),
          networksList,
          deprecatingDataFeedTokens,
          DEPRECATION_CHANGELOG_CATEGORY
        )
      );
    }

    // If we have newly scheduled stream deprecations
    if (deprecatingDataStreamTokens.length > 0) {
      const networksSet = new Set(deprecatingDataStreamTokens.map(t => t.network));
      const networksList = [...networksSet];
      newEntries.push(
        createChangelogEntry(
          "Data Streams",
          "Streams scheduled for deprecation",
          buildDeprecationDescription(
            "Data Streams",
            "Deprecating Data Streams",
            "https://docs.chain.link/data-streams/deprecating-streams",
            deprecatingStreamItems
          ),
          networksList,
          deprecatingDataStreamTokens,
          DEPRECATION_CHANGELOG_CATEGORY
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
