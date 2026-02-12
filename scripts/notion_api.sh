#!/bin/bash
# Notion API helper for OpenClaw
# Usage: notion_api.sh <method> <endpoint> [json_body]
# Example: notion_api.sh GET "databases/23c6a541b895809c9aa3df1da48c34fc"
# Example: notion_api.sh POST "databases/d27d66c4b43942e5898cb81347220abf/query" '{"page_size":10}'

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_FILE="${SCRIPT_DIR}/notion_secrets.json"

if [ ! -f "$SECRETS_FILE" ]; then
    echo "Error: notion_secrets.json not found at $SECRETS_FILE"
    exit 1
fi

NOTION_TOKEN=$(jq -r '.token' "$SECRETS_FILE")
BASE_URL="https://api.notion.com/v1"
NOTION_VERSION="2022-06-28"

METHOD="${1:-GET}"
ENDPOINT="${2}"
BODY="${3:-}"

if [ -z "$ENDPOINT" ]; then
    echo "Usage: notion_api.sh <METHOD> <endpoint> [json_body]"
    echo ""
    echo "Databases:"
    echo "  Tasks:        d27d66c4b43942e5898cb81347220abf"
    echo "  Wiki:         23c6a541b895809c9aa3df1da48c34fc"
    echo "  Client Comms: 28a6a541b895804c9363d19c7aaf9b8f"
    echo ""
    echo "Examples:"
    echo "  notion_api.sh GET 'databases/23c6a541b895809c9aa3df1da48c34fc'"
    echo "  notion_api.sh POST 'databases/d27d66c4b43942e5898cb81347220abf/query' '{\"page_size\":5}'"
    exit 1
fi

if [ -n "$BODY" ]; then
    curl -s -X "$METHOD" "${BASE_URL}/${ENDPOINT}" \
        -H "Authorization: Bearer ${NOTION_TOKEN}" \
        -H "Notion-Version: ${NOTION_VERSION}" \
        -H "Content-Type: application/json" \
        -d "$BODY" | jq .
else
    curl -s -X "$METHOD" "${BASE_URL}/${ENDPOINT}" \
        -H "Authorization: Bearer ${NOTION_TOKEN}" \
        -H "Notion-Version: ${NOTION_VERSION}" | jq .
fi
