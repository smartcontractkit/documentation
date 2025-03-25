#!/usr/bin/env bash
set -e

#
# test-detect-data.sh
#
# A basic test script to verify that the detect-data.sh and detect-new-data.ts flow works as expected.
# It uses mock JSON files in a local temp directory (not actual endpoints).
#
# Typical usage:
#   ./test-detect-data.sh
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DETECT_SCRIPT="$SCRIPT_DIR/detect-data.sh"
BASELINE_FILE="$SCRIPT_DIR/baseline.json"
TEMP_TEST_DIR="$SCRIPT_DIR/test-data"
NEW_DATA_FILE="temp/NEW_DATA_FOUND.json"

# Print messages with timestamps
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $*"
}

# Ensures the TypeScript script is compiled/usable. If you're using tsx, you might not need a build step.
prepare_environment() {
  log "Preparing environment (if needed)."
  # If you need to compile TS -> JS:
  #   npm install
  #   npm run build
  # But if you are using tsx to run TS directly, you can skip this.
}

# Clean up baseline, temp folders, etc.
clean_env() {
  log "Cleaning environment..."
  rm -rf "$TEMP_TEST_DIR"
  rm -f "$BASELINE_FILE"
  rm -f "$NEW_DATA_FILE"
  mkdir -p "$TEMP_TEST_DIR"
}

# Test Case 1: init-baseline with mock data
test_init_baseline() {
  log "=== Test Case 1: init-baseline ==="

  # Create a mock JSON file that the TS script would normally fetch from a network
  # In your real TS code, you'll fetch them from the URLs, but for testing, we'll simulate that
  cat <<EOF > "${TEMP_TEST_DIR}/feeds-ethereum.json"
[
  {
    "feedID": "mockFeed1",
    "docs": { "hidden": false, "deliveryChannelCode": "DF", "productTypeCode": "RefPrice" }
  },
  {
    "feedID": "hiddenFeedXYZ",
    "docs": { "hidden": true }
  }
]
EOF

  # We'll temporarily modify the TS script or environment so it reads from these local mock files
  # Instead of from actual endpoints. For example, you might define a special environment variable
  # to indicate "TEST_MODE" or override the URLs in detect-new-data.ts. 
  export TEST_MODE=1

  # For a real approach, you can do the "download" step in your TS code only if not TEST_MODE, etc.
  # Or mock fetch. For brevity, let's just say the TS code checks $TEST_MODE and uses local files.

  # 1) init-baseline
  bash "$DETECT_SCRIPT" init-baseline

  # 2) Check that baseline.json was created and contains mockFeed1 (but not hiddenFeedXYZ)
  if [ ! -f "$BASELINE_FILE" ]; then
    echo "FAIL: Baseline file not created."
    exit 1
  fi

  if grep -q "mockFeed1" "$BASELINE_FILE"; then
    log "PASS: baseline.json includes mockFeed1."
  else
    echo "FAIL: baseline.json missing mockFeed1."
    exit 1
  fi

  if grep -q "hiddenFeedXYZ" "$BASELINE_FILE"; then
    echo "FAIL: baseline.json should not include hidden feed."
    exit 1
  fi

  log "Test Case 1 passed."
}

# Test Case 2: check-data with newly discovered feed
test_check_data() {
  log "=== Test Case 2: check-data ==="

  # Modify the mock file to add a new feed
  cat <<EOF > "${TEMP_TEST_DIR}/feeds-ethereum.json"
[
  {
    "feedID": "mockFeed1",
    "docs": { "hidden": false, "deliveryChannelCode": "DF", "productTypeCode": "RefPrice" }
  },
  {
    "feedID": "mockFeed2",
    "docs": { "hidden": false, "deliveryChannelCode": "DF", "productTypeCode": "RefPrice" }
  }
]
EOF

  # 1) check-data
  bash "$DETECT_SCRIPT" check-data

  # The TS script should discover "mockFeed2" as new. 
  # The detect-data.sh orchestration should create/append .github/scripts/data/baseline.json 
  # with mockFeed2.

  if [ ! -f "$BASELINE_FILE" ]; then
    echo "FAIL: Baseline file missing after check-data."
    exit 1
  fi
  if ! grep -q "mockFeed2" "$BASELINE_FILE"; then
    echo "FAIL: New feed not recorded in baseline."
    exit 1
  fi

  # Also, the script might have removed temp/NEW_DATA_FOUND.json after processing
  if [ -f "$NEW_DATA_FILE" ]; then
    echo "WARNING: $NEW_DATA_FILE still exists. Typically it's removed after processing."
  fi

  log "Test Case 2 passed."
}

main() {
  prepare_environment

  # Clean environment to ensure a fresh state
  clean_env

  # Test 1: init-baseline
  test_init_baseline

  # Test 2: check-data
  test_check_data

  log "All tests passed!"
}

main
