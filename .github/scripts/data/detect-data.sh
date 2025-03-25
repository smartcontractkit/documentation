#!/usr/bin/env bash
set -e  # Exit immediately on error

# This script orchestrates the detection of new data using the TS script src/scripts/data/detect-new-data.ts
# 1) "init-baseline": creates a baseline with all currently visible feedIDs (no changelog updates)
# 2) "check-data": calls the TS script, checks for new items, updates baseline/changelog if found

BASELINE_FILE=".github/scripts/data/baseline.json"
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

  # 5) Now update the changelog (placeholder)
  node <<EOF
    const fs = require('fs');
    const newlyFound = JSON.parse(fs.readFileSync('${NEW_DATA_FILE}', 'utf8'));
    // TODO: parse newlyFound.newlyFoundItems, group by productTypeCode, etc.
    // Insert relevant entries into changelog.json
    console.log("Pretending to update changelog.json here...");
EOF

  log "changelog.json updated (placeholder)."

  # 6) Remove the NEW_DATA_FOUND.json
  rm -f "$NEW_DATA_FILE"

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
