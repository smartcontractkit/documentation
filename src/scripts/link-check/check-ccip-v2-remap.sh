#!/usr/bin/env bash
#
# Guards the CCIP v2 -> /ccip remap in lychee.toml.
#
# vercel.json 301-redirects /ccip/v2/:path* to /ccip/:path* and /ccip/v2 to /ccip
# on the live site, so links that are valid in production must not fail
# linkcheck-internal. The static build has no /ccip/v2 directory, so lychee needs
# the matching `remap` rules to follow the redirect.
#
# This script proves three things:
#   1. Real pages reached through the /ccip/v2 alias pass, including anchors, and
#      the URLs lychee actually resolves keep unrelated paths such as /ccip/v1
#      and /ccip/v20 intact.
#   2. Real misses still fail, and the output shows the remap was applied.
#   3. vercel.json still declares exactly the redirects the remap mirrors.
#
# Usage: check-ccip-v2-remap.sh [path-to-lychee]
#   Defaults to `lychee` on PATH when no argument is given.

set -uo pipefail

LYCHEE="${1:-lychee}"
EVIDENCE="/tmp/linkcheck-ccip-v2-remap-evidence.txt"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
FIXTURE_DIR="${REPO_ROOT}/src/scripts/link-check/fixtures/ccip-v2-remap"
STATIC_DIR="${FIXTURE_DIR}/static"

failures=0
fail() {
    echo "FAIL: $*" >&2
    failures=$((failures + 1))
}

if ! command -v "${LYCHEE}" >/dev/null 2>&1 && [ ! -x "${LYCHEE}" ]; then
    echo "FAIL: lychee binary not found: ${LYCHEE}" >&2
    exit 1
fi

cd "${REPO_ROOT}" || exit 1

: > "${EVIDENCE}"
{
    echo "=== lychee: ${LYCHEE} ($("${LYCHEE}" --version 2>&1)) ==="
    echo
} >> "${EVIDENCE}"

run_lychee() {
    # Extra flags (such as --dump) may be passed before the fixture path.
    "${LYCHEE}" \
        --root-dir "${STATIC_DIR}" \
        --config lychee.toml \
        "$@"
}

# --- 1. The pass fixture must be clean -------------------------------------
pass_output="$(run_lychee src/scripts/link-check/fixtures/ccip-v2-remap/should-pass.html 2>&1)"
pass_status=$?
{
    echo "=== should-pass.html (exit ${pass_status}) ==="
    echo "${pass_output}"
    echo
} >> "${EVIDENCE}"

if [ "${pass_status}" -ne 0 ]; then
    fail "should-pass.html: expected exit 0, got ${pass_status}"
fi

# A clean exit is not enough on its own: an over-broad remap can rewrite a real
# URL into a different URL that also happens to resolve. Inspect the resolved
# URLs directly. In particular, a bare "?" in a Rust regex is a quantifier, so
# "/ccip/v2? /ccip?" silently rewrites /ccip/v1 and /ccip/v20.
dump_output="$(run_lychee --dump src/scripts/link-check/fixtures/ccip-v2-remap/should-pass.html 2>&1)"
dump_status=$?
{
    echo "=== should-pass.html --dump (exit ${dump_status}) ==="
    echo "${dump_output}"
    echo
} >> "${EVIDENCE}"

if [ "${dump_status}" -ne 0 ]; then
    fail "should-pass.html --dump: expected exit 0, got ${dump_status}"
fi

# Paths that must survive the remap unchanged.
for survivor in \
    "ccip/v1/evm/getting-started" \
    "ccip/v20/page" \
    "ccip/evm/getting-started?x=1" \
    "ccip?x=1"; do
    if ! grep -qF -- "${survivor}" <<<"${dump_output}"; then
        fail "should-pass.html --dump: resolved URLs are missing '${survivor}'"
    fi
done

# Rewrites that prove a literal '?' was treated as a regex quantifier.
for corrupted in "ccip?1" "ccip?0"; do
    if grep -qF -- "${corrupted}" <<<"${dump_output}"; then
        fail "should-pass.html --dump: resolved URLs contain '${corrupted}'; a remap rule is treating '?' as a regex quantifier"
    fi
done

# --- 2. The fail fixture must still fail, and show the remap ---------------
fail_output="$(run_lychee src/scripts/link-check/fixtures/ccip-v2-remap/should-fail.html 2>&1)"
fail_status=$?
{
    echo "=== should-fail.html (exit ${fail_status}) ==="
    echo "${fail_output}"
    echo
} >> "${EVIDENCE}"

if [ "${fail_status}" -eq 0 ]; then
    fail "should-fail.html: expected a non-zero exit, got 0"
fi

for marker in "Cannot find fragment" "File not found" "Remaps:"; do
    if ! grep -qF -- "${marker}" <<<"${fail_output}"; then
        fail "should-fail.html: output is missing '${marker}'"
    fi
done

# The v2 URL must be shown rewritten onto its /ccip equivalent before the check,
# otherwise the pass fixture is passing for some other reason.
if ! grep -qE 'ccip/v2/not-a-real-page --> [^ ]*ccip/not-a-real-page' <<<"${fail_output}"; then
    fail "should-fail.html: output does not show /ccip/v2/... remapped onto /ccip/..."
fi

# --- 3. vercel.json must still declare the redirects we mirror -------------
redirect_check="$(python3 - "${REPO_ROOT}/vercel.json" <<'PY'
import json
import sys

expected = [
    ("/ccip/v2/:path*", "/ccip/:path*"),
    ("/ccip/v2", "/ccip"),
]

with open(sys.argv[1]) as handle:
    config = json.load(handle)

redirects = config.get("redirects", [])
problems = []
for source, destination in expected:
    match = next((r for r in redirects if r.get("source") == source), None)
    if match is None:
        problems.append(f"vercel.json has no redirect with source {source!r}")
    elif match.get("destination") != destination:
        problems.append(
            f"vercel.json redirect {source!r} now points at "
            f"{match.get('destination')!r}, expected {destination!r}"
        )

print("\n".join(problems))
PY
)"
redirect_status=$?
{
    echo "=== vercel.json redirect check (exit ${redirect_status}) ==="
    if [ -n "${redirect_check}" ]; then
        echo "${redirect_check}"
    else
        echo "ok: /ccip/v2/:path* -> /ccip/:path* and /ccip/v2 -> /ccip"
    fi
    echo
} >> "${EVIDENCE}"

if [ "${redirect_status}" -ne 0 ]; then
    fail "vercel.json could not be parsed"
fi
if [ -n "${redirect_check}" ]; then
    fail "vercel.json no longer mirrors the lychee remap: ${redirect_check//$'\n'/; }"
fi

# --- Verdict ---------------------------------------------------------------
echo "Evidence written to ${EVIDENCE}"
if [ "${failures}" -ne 0 ]; then
    echo "ccip-v2 remap check FAILED (${failures} problem(s))" >&2
    exit 1
fi

echo "ccip-v2 remap check passed"
exit 0
