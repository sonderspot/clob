#!/bin/bash
# Generic Smooth.sh task runner
# Usage: ./smooth_task.sh "Your task description here"
# 
# Features:
# - No recordings (privacy)
# - Auto-deletes task after completion
# - Polls until done

API_KEY="${SMOOTH_API_KEY:-cmzr-xQyPampY6XFOs5YfrFAP7cfSBx9cPKP6ATcrqKWLz0tRNlzGvQBXReh1hWJSHPVrhKThI9LCeNnOXN5Dot2dlY7AMZGf_TVVhklurtZw1zrHsTkr9go64jKK}"
TASK="$1"

if [ -z "$TASK" ]; then
    echo "Usage: ./smooth_task.sh \"Your task description\""
    exit 1
fi

echo "Submitting task to Smooth.sh (no recording)..."

RESPONSE=$(curl -s -X POST https://api.smooth.sh/api/v1/task \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"task\": $(echo "$TASK" | jq -Rs .), \"enable_recording\": false}")

TASK_ID=$(echo "$RESPONSE" | jq -r '.r.id // empty')

if [ -z "$TASK_ID" ]; then
    echo "Error submitting task:"
    echo "$RESPONSE" | jq .
    exit 1
fi

echo "Task ID: $TASK_ID"
echo "Live URL: $(echo "$RESPONSE" | jq -r '.r.live_url // "N/A"')"
echo ""
echo "Polling for completion..."

while true; do
    sleep 5
    STATUS_RESPONSE=$(curl -s "https://api.smooth.sh/api/v1/task/$TASK_ID" \
      -H "apikey: $API_KEY")
    
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.r.status')
    
    case "$STATUS" in
        "done"|"failed"|"error")
            echo ""
            echo "=== RESULT ==="
            echo "Status: $STATUS"
            echo "Output:"
            echo "$STATUS_RESPONSE" | jq -r '.r.output // "No output"'
            echo ""
            echo "Credits used: $(echo "$STATUS_RESPONSE" | jq -r '.r.credits_used // "?"')"
            echo "Credits remaining: $(echo "$STATUS_RESPONSE" | jq -r '.r.credits_balance // "?"')"
            
            # Auto-delete task
            echo ""
            echo "Deleting task..."
            curl -s -X DELETE "https://api.smooth.sh/api/v1/task/$TASK_ID" \
              -H "apikey: $API_KEY" > /dev/null
            echo "Task deleted."
            exit 0
            ;;
        "running"|"waiting")
            echo -n "."
            ;;
        *)
            echo "Unknown status: $STATUS"
            echo "$STATUS_RESPONSE" | jq .
            exit 1
            ;;
    esac
done
