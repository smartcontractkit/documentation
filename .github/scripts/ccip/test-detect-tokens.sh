#!/usr/bin/env bash

# Test script for detect-tokens.sh
# This script creates mock test data and verifies that detect-tokens.sh behaves correctly

set -e  # Exit immediately if a command exits with a non-zero status

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOKENS_SCRIPT="$SCRIPT_DIR/detect-tokens.sh"
TEST_DIR="$SCRIPT_DIR/test-data"
TEMP_DIR="temp"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Ensure the script is executable
chmod +x "$TOKENS_SCRIPT"

# Create test directories
mkdir -p "$TEST_DIR" "$TEMP_DIR"

print_header() {
  echo -e "\n${YELLOW}==== $1 ====${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
  exit 1
}

create_mock_github_output() {
  export GITHUB_OUTPUT="$TEST_DIR/github_output.txt"
  echo "" > "$GITHUB_OUTPUT"
}

# Test case 1: No tokens found
test_no_tokens_found() {
  print_header "TEST CASE 1: No tokens found"
  
  # Delete the tokens file if it exists
  rm -f "$TEMP_DIR/NEW_TOKENS_FOUND.json"
  
  # Mock GitHub output
  create_mock_github_output
  
  # Run the script
  "$TOKENS_SCRIPT" check-tokens
  
  # Check results
  if grep -q "new_tokens_found=false" "$GITHUB_OUTPUT"; then
    print_success "Correctly identified no tokens found"
  else
    print_error "Failed to set new_tokens_found=false"
  fi
}

# Test case 2: New tokens found with no URL validation issues
test_new_tokens_no_validation_issues() {
  print_header "TEST CASE 2: New tokens found with no URL validation issues"
  
  # Create mock token data
  cat > "$TEMP_DIR/NEW_TOKENS_FOUND.json" << EOF
{
  "newTokensFound": true,
  "timestamp": "2025-03-20T11:19:24.590Z",
  "completelyNewTokens": [
    {
      "symbol": "TEST1",
      "name": "Test Token 1",
      "documentationUrl": "https://docs.chain.link/ccip/directory/mainnet/token/TEST1",
      "iconUrl": "https://example.com/test1.webp"
    },
    {
      "symbol": "TEST2",
      "name": "Test Token 2",
      "documentationUrl": "https://docs.chain.link/ccip/directory/mainnet/token/TEST2",
      "iconUrl": "https://example.com/test2.webp"
    }
  ],
  "expandedSupportTokens": [
    {
      "symbol": "TEST3",
      "name": "Test Token 3",
      "newChains": ["chain1", "chain2"],
      "newLanes": ["lane1", "lane2"],
      "documentationUrl": "https://docs.chain.link/ccip/directory/mainnet/token/TEST3",
      "iconUrl": "https://example.com/test3.webp"
    }
  ],
  "urlValidation": {
    "allValid": true,
    "failures": []
  }
}
EOF
  
  # Mock GitHub output
  create_mock_github_output
  
  # Run the script
  "$TOKENS_SCRIPT" check-tokens
  
  # Check results
  if grep -q "new_tokens_found=true" "$GITHUB_OUTPUT"; then
    print_success "Correctly identified new tokens found"
  else
    print_error "Failed to set new_tokens_found=true"
  fi
  
  if grep -q "new_token_count=2" "$GITHUB_OUTPUT"; then
    print_success "Correctly counted 2 new tokens"
  else
    print_error "Failed to count new tokens correctly"
  fi
  
  if [[ -f "$TEMP_DIR/newTokensReport.md" ]]; then
    print_success "Successfully generated PR description"
  else
    print_error "Failed to generate PR description"
  fi
  
  if ! grep -q "url_validation_failed" "$GITHUB_OUTPUT"; then
    print_success "Correctly did not flag URL validation failures"
  else
    print_error "Incorrectly flagged URL validation failures"
  fi
}

# Test case 3: New tokens found with URL validation issues
test_new_tokens_with_validation_issues() {
  print_header "TEST CASE 3: New tokens found with URL validation issues"
  
  # Create mock token data with URL validation issues
  cat > "$TEMP_DIR/NEW_TOKENS_FOUND.json" << EOF
{
  "newTokensFound": true,
  "timestamp": "2025-03-20T11:19:24.590Z",
  "completelyNewTokens": [
    {
      "symbol": "TEST1",
      "name": "Test Token 1",
      "documentationUrl": "https://docs.chain.link/ccip/directory/mainnet/token/TEST1",
      "iconUrl": "https://example.com/test1.webp"
    },
    {
      "symbol": "BADURLTOKEN",
      "name": "Bad URL Token",
      "documentationUrl": "https://docs.chain.link/ccip/directory/mainnet/token/BADURLTOKEN",
      "iconUrl": "https://bad-url.example.com/nonexistent.webp"
    }
  ],
  "expandedSupportTokens": [],
  "urlValidation": {
    "allValid": false,
    "failures": [
      {
        "token": "BADURLTOKEN",
        "url": "https://bad-url.example.com/nonexistent.webp",
        "status": 404,
        "type": "icon"
      }
    ]
  }
}
EOF
  
  # Mock GitHub output
  create_mock_github_output
  
  # Run the script
  "$TOKENS_SCRIPT" check-tokens
  
  # Check results
  if grep -q "new_tokens_found=true" "$GITHUB_OUTPUT"; then
    print_success "Correctly identified new tokens found"
  else
    print_error "Failed to set new_tokens_found=true"
  fi
  
  if grep -q "url_validation_failed=true" "$GITHUB_OUTPUT"; then
    print_success "Correctly flagged URL validation failures"
  else
    print_error "Failed to flag URL validation failures"
  fi
  
  if [[ -f "$TEMP_DIR/url_validation_report.md" ]]; then
    print_success "Successfully generated URL validation report"
  else
    print_error "Failed to generate URL validation report"
  fi
  
  # Verify validation report contains the right information
  if grep -q "BADURLTOKEN" "$TEMP_DIR/url_validation_report.md"; then
    print_success "URL validation report contains correct token information"
  else
    print_error "URL validation report is missing token information"
  fi
}

# Test case 4: Script error handling
test_script_error_handling() {
  print_header "TEST CASE 4: Script error handling"
  
  # Mock GitHub output
  create_mock_github_output
  
  # Temporarily disable exit on error for this test
  set +e
  
  # Run the script with a mock error
  "$TOKENS_SCRIPT" check-errors "123" "Mock error message for testing"
  local script_exit_code=$?
  
  # Re-enable exit on error
  set -e
  
  # Check results
  if grep -q "script_failed=true" "$GITHUB_OUTPUT"; then
    print_success "Correctly flagged script failure"
  else
    print_error "Failed to flag script failure"
  fi
  
  if [[ -f "$TEMP_DIR/error_report.md" ]]; then
    print_success "Successfully generated error report"
  else
    print_error "Failed to generate error report"
  fi
  
  # Verify error report contains the right information
  if grep -q "exit code: 123" "$TEMP_DIR/error_report.md" || grep -q "Mock error message" "$TEMP_DIR/error_report.md"; then
    print_success "Error report contains correct information"
  else
    print_error "Error report is missing error information"
  fi
  
  # Check that the script returned an error code as expected
  if [[ "$script_exit_code" -ne 0 ]]; then
    print_success "Script correctly returned non-zero exit code: $script_exit_code"
  else
    print_error "Script incorrectly returned zero exit code"
  fi
}

# Run all tests
run_all_tests() {
  test_no_tokens_found
  test_new_tokens_no_validation_issues
  test_new_tokens_with_validation_issues
  test_script_error_handling
  
  print_header "ALL TESTS PASSED SUCCESSFULLY"
}

# Clean up after tests
cleanup() {
  rm -rf "$TEST_DIR"
  echo -e "\n${YELLOW}Test cleanup completed${NC}"
}

# Run the tests and clean up afterwards
run_all_tests
cleanup 