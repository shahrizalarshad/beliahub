#!/usr/bin/env bash
# Smoke test production (or staging) deployment.
# Usage: ./scripts/smoke-production.sh [BASE_URL]
# Example: ./scripts/smoke-production.sh https://beliahub.vercel.app

set -euo pipefail

BASE_URL="${1:-${APP_URL:-https://beliahub.vercel.app}}"
BASE_URL="${BASE_URL%/}"

CURL="${CURL:-curl}"
if ! command -v "$CURL" >/dev/null 2>&1; then
    CURL="/usr/bin/curl"
fi

pass=0
fail=0

http_get() {
    local url="$1"
    "$CURL" -sS "$url" 2>/dev/null || true
}

http_code() {
    local url="$1"
    "$CURL" -sS -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000"
}

check_text() {
    local path="$1"
    local label="$2"
    local expect="$3"
    local url="${BASE_URL}${path}"
    local body code

    body="$(http_get "$url")"
    code="$(http_code "$url")"

    if [[ "$code" != "200" && "$code" != "302" ]]; then
        echo "FAIL  HTTP $code  $label  ($path)"
        fail=$((fail + 1))
        return
    fi

    if ! grep -q "$expect" <<<"$body"; then
        echo "FAIL  missing '$expect'  $label  ($path)"
        fail=$((fail + 1))
        return
    fi

    echo "OK    HTTP $code  $label  ($path)"
    pass=$((pass + 1))
}

check_inertia() {
    local path="$1"
    local label="$2"
    local component="$3"
    local url="${BASE_URL}${path}"
    local body code needle

    body="$(http_get "$url")"
    code="$(http_code "$url")"
    needle="${component//\//\\/}"

    if [[ "$code" != "200" && "$code" != "302" ]]; then
        echo "FAIL  HTTP $code  $label  ($path)"
        fail=$((fail + 1))
        return
    fi

    if ! grep -Fq "$needle" <<<"$body"; then
        echo "FAIL  missing Inertia component '$component'  $label  ($path)"
        fail=$((fail + 1))
        return
    fi

    echo "OK    HTTP $code  $label  ($path → $component)"
    pass=$((pass + 1))
}

check_status() {
    local path="$1"
    local label="$2"
    local url="${BASE_URL}${path}"
    local code

    code="$(http_code "$url")"

    if [[ "$code" != "200" && "$code" != "302" ]]; then
        echo "FAIL  HTTP $code  $label  ($path)"
        fail=$((fail + 1))
        return
    fi

    echo "OK    HTTP $code  $label  ($path)"
    pass=$((pass + 1))
}

echo "=== Belia Hub smoke test ==="
echo "Target: $BASE_URL"
echo

check_text "/" "Landing page" "Belia Hub"
check_inertia "/servis" "Service catalog" "Services/Catalog"
check_inertia "/login" "Login page" "Auth/Login"
check_inertia "/register" "Register page" "Auth/Register"
check_inertia "/terma" "Terms page" "Pages/Terms"
check_inertia "/privasi" "Privacy page" "Pages/Privacy"
check_text "/up" "Health check" "Application up"
check_status "/build/manifest.json" "Frontend build manifest"

echo
echo "Passed: $pass  Failed: $fail"

if [[ "$fail" -gt 0 ]]; then
    exit 1
fi

echo "All smoke checks passed."
