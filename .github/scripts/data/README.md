# Data Detection GitHub Workflow Scripts

This directory contains scripts for detecting newly added data (feeds, smartData, streams), Data Feed/Data Stream deprecation changes, and validating URLs.

## Scripts

### `detect-data.sh`

A Bash script that can do two main tasks:

1. `init-baseline` mode – Creates the initial baseline of all known IDs and deprecating markers.
1. `check-data` mode – Compares current data against the baseline to detect newly added items and Data Feed/Data Stream deprecation changes, then updates the `changelog.json` if any are found.

### `validate-urls.sh`

A script that validates URLs found in newly detected data. It checks both feed URLs and icon URLs to ensure they are accessible, and generates a validation report for any broken links.

### `baseline.json`

Stores the known feed/stream/smartData IDs and currently known deprecating Data Feed/Data Stream markers from the last run. This is updated each time new items or deprecation changes are detected.

## Workflow Integration

A scheduled workflow (`.github/workflows/detect-new-data.yml`) will:

1. Check out the repo
1. Run `detect-data.sh check-data`
1. Validate URLs if new data or newly scheduled deprecations are found
1. Commit and open a PR if new feeds or deprecation changes are detected

## Maintenance

- Update the baseline or script logic as new data fields appear.
- Keep `.gitignore` up-to-date to ensure no temporary JSON dumps are committed.
