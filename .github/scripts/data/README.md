# Data Detection GitHub Workflow Scripts

This directory contains scripts for detecting newly added data (feeds, smartData, streams).

## Scripts

### `detect-data.sh`

A Bash script that can do two main tasks:

1. `init-baseline` mode – Creates the initial baseline of all known IDs.  
1. `check-data` mode – Compares current data against the baseline to detect newly added items, then updates the `changelog.json` if any are found.

### `test-detect-data.sh`

Script for local testing of `detect-data.sh`. You can supply mock JSON files and confirm that the script behaves as expected.

### `baseline.json`

Stores the known feed/stream/smartData IDs from the last run. This is updated each time new items are detected.

## Workflow Integration

A scheduled workflow (`.github/workflows/detect-new-data.yml`) will:

1. Check out the repo
1. Run `detect-data.sh check-data`
1. Commit and open a PR if new feeds are detected

## Maintenance

- Update the baseline or script logic as new data fields appear.
- Keep `.gitignore` up-to-date to ensure no temporary JSON dumps are committed.
