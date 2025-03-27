#!/usr/bin/env bash

# Script for handling CCIP token detection workflow
# This script contains functions for checking token detection results,
# generating reports, and preparing PR descriptions

set -e  # Exit immediately if a command exits with a non-zero status

TOKEN_FILE="temp/NEW_TOKENS_FOUND.json"

# Print with timestamp for better logging
log_message() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check if script execution failed and generate error report
check_script_errors() {
  local exit_code=$1

  if [[ $exit_code -ne 0 ]]; then
    log_message "Script failed with exit code: $exit_code"

    mkdir -p temp
    {
      echo "# Error: CCIP Token Detection Script Failed"
      echo ""
      echo "The token detection script failed with exit code: $exit_code"
      echo ""
      echo "## Error Details"
      echo ""
      echo '```'
      echo "${2:-No detailed error information available}"
      echo '```'
    } > temp/error_report.md

    echo "script_failed=true" >> $GITHUB_OUTPUT
    return 1
  fi

  log_message "Script execution completed successfully"
  return 0
}

# Check if new tokens were detected and process them
check_new_tokens() {
  log_message "Checking for new tokens..."

  if [[ ! -f "$TOKEN_FILE" ]]; then
    log_message "No token file found at $TOKEN_FILE"
    echo "new_tokens_found=false" >> $GITHUB_OUTPUT
    return 0
  fi

  log_message "Token file found, processing..."
  echo "new_tokens_found=true" >> $GITHUB_OUTPUT

  local timestamp
  timestamp=$(date +%Y%m%d%H%M)
  echo "timestamp=${timestamp}" >> $GITHUB_OUTPUT

  # Check token counts
  local completely_new_tokens
  completely_new_tokens=$(jq -r '.completelyNewTokens | length' "$TOKEN_FILE")
  echo "new_token_count=${completely_new_tokens}" >> $GITHUB_OUTPUT

  log_message "Found $completely_new_tokens completely new tokens"

  # Check for URL validation issues
  check_url_validation

  # Generate PR description
  generate_pr_description "$completely_new_tokens"

  return 0
}

# Check URL validation results and generate report if needed
check_url_validation() {
  log_message "Checking URL validation results..."

  if jq -e '.urlValidation' "$TOKEN_FILE" > /dev/null 2>&1; then
    local url_validation
    url_validation=$(jq -r '.urlValidation.allValid' "$TOKEN_FILE")

    if [[ "$url_validation" == "false" ]]; then
      log_message "URL validation failures detected"
      echo "url_validation_failed=true" >> $GITHUB_OUTPUT

      # Generate URL validation issue report
      {
        echo "# Warning: Invalid Token URLs Detected"
        echo ""
        echo "The following token URLs are not returning valid responses:"
        echo ""
        jq -r '.urlValidation.failures[] | "- **Token:** \(.token)\n  - **URL:** \(.url)\n  - **Type:** \(.type)\n  - **Status:** \(.status // "N/A")\n  - **Error:** \(.error // "N/A")"' "$TOKEN_FILE"
        echo ""
        echo "These URLs should be verified and fixed before the tokens are deployed to production."
      } > temp/url_validation_report.md

      log_message "Generated URL validation report"
    else
      log_message "All URLs validated successfully"
    fi
  else
    log_message "No URL validation data found in token file"
  fi
}

# Generate PR description with token information
generate_pr_description() {
  local completely_new_tokens=$1
  log_message "Generating PR description..."

  {
    echo "# New CCIP Tokens Detected"
    echo ""
    echo "This PR was automatically generated because new CCIP tokens were detected."
    echo ""

    if [[ "$completely_new_tokens" -gt "0" ]]; then
      echo "## New Tokens"
      echo ""
      echo "| Symbol | Name | Documentation | Icon |"
      echo "|--------|------|--------------|------|"
      jq -r '.completelyNewTokens[] | "| \(.symbol) | \(.name) | [Documentation](\(.documentationUrl)) | ![Icon](\(.iconUrl)) |"' "$TOKEN_FILE"
      echo ""
    fi

    local expanded_tokens
    expanded_tokens=$(jq -r '.expandedSupportTokens | length' "$TOKEN_FILE")

    if [[ "$expanded_tokens" -gt "0" ]]; then
      echo "## Tokens with Expanded Support"
      echo ""
      echo "| Symbol | Name | New Chains | New Lanes |"
      echo "|--------|------|------------|-----------|"
      jq -r '.expandedSupportTokens[] | "| \(.symbol) | \(.name) | \(.newChains | join(", ")) | \(.newLanes | length) lanes |"' "$TOKEN_FILE"
    fi
  } > temp/newTokensReport.md

  log_message "PR description generated successfully"
}

# Main function to orchestrate the process
main() {
  local command="${1:-help}"
  shift || true

  case "$command" in
    check-errors)
      check_script_errors "$@"
      ;;
    check-tokens)
      check_new_tokens
      ;;
    help)
      echo "Usage:"
      echo "  $0 check-errors EXIT_CODE [ERROR_MESSAGE]   - Check for script errors and generate report"
      echo "  $0 check-tokens                            - Check for new tokens and process them"
      exit 1
      ;;
    *)
      echo "Unknown command: $command"
      "$0" help
      exit 1
      ;;
  esac
}

# Execute the script with provided arguments
main "$@" 