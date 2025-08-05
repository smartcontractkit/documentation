# CCIP GitHub Workflow Scripts

This directory contains scripts used by GitHub Actions workflows for CCIP (Cross-Chain Interoperability Protocol) related tasks.

## Scripts

### `detect-tokens.sh`

A modular bash script that handles token detection workflow tasks, including checking for new tokens, validating URLs, and generating reports.

#### Usage

```bash
# Check for script errors (used in GitHub workflow)
./detect-tokens.sh check-errors EXIT_CODE [ERROR_MESSAGE]

# Check for new tokens and process them
./detect-tokens.sh check-tokens
```

#### Functions

- `check_script_errors`: Generates error reports for failed script executions
- `check_new_tokens`: Detects new tokens from the token file and processes them
- `check_url_validation`: Validates token URLs and generates reports for failures
- `generate_pr_description`: Creates markdown content for PR descriptions

#### Environment Variables

The script uses `$GITHUB_OUTPUT` to communicate with GitHub Actions.

### `test-detect-tokens.sh`

A test script to validate the functionality of `detect-tokens.sh`.

#### Usage

```bash
# Run all tests
./test-detect-tokens.sh
```

#### Test Cases

1. No tokens found
2. New tokens found with no URL validation issues
3. New tokens found with URL validation issues
4. Script error handling

## Workflow Integration

These scripts are used in the `.github/workflows/detect-new-tokens.yml` workflow to:

1. Check for new CCIP tokens
2. Generate reports for URL validation failures
3. Create pull requests for new tokens
4. Create issues for script failures

## Maintenance

When making changes to these scripts:

1. Run the test script to validate functionality
2. Update this README if you add new features or commands
3. Ensure proper error handling and logging 