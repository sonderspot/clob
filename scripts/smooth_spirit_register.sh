#!/bin/bash
# Smooth.sh Spirit Airlines Registration Script
# Usage: ./smooth_spirit_register.sh YOUR_SMOOTH_API_KEY

API_KEY="${1:-$SMOOTH_API_KEY}"

if [ -z "$API_KEY" ]; then
    echo "Error: API key required"
    echo "Usage: ./smooth_spirit_register.sh cmzr-YOUR_API_KEY"
    echo "Or set SMOOTH_API_KEY environment variable"
    exit 1
fi

TASK='Go to https://www.spirit.com/free-spirit and sign up for a free Free Spirit loyalty account.

Fill the form with these exact details:
- First Name: Mykyta
- Last Name: Barabanov
- Date of Birth: 02/10/1990 (February 10, 1990)
- Country: United States
- Address: 118 W 123rd St
- City: New York
- State: New York
- Zip Code: 10027
- Email: clob@elitecurrensea.com
- Password: Sp1r!t_Fr33_2026xK9m

Steps:
1. Click "Sign up today for free" button
2. Fill all required fields with the info above
3. Check the Terms & Conditions checkbox
4. Complete any CAPTCHA or verification if prompted
5. Click Sign Up Now
6. If successful, report the Free Spirit member number

Take your time to appear human-like. Complete the entire registration process.'

echo "Starting Smooth.sh task..."
echo ""

RESPONSE=$(curl -s -X POST https://api.smooth.sh/api/v1/task \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"task\": $(echo "$TASK" | jq -Rs .), \"enable_recording\": false}")

echo "Response:"
echo "$RESPONSE" | jq .

# Extract task ID and live URL if available
TASK_ID=$(echo "$RESPONSE" | jq -r '.task_id // .id // empty')
LIVE_URL=$(echo "$RESPONSE" | jq -r '.live_url // empty')

if [ -n "$LIVE_URL" ]; then
    echo ""
    echo "Watch live: $LIVE_URL"
fi

if [ -n "$TASK_ID" ]; then
    echo ""
    echo "Task ID: $TASK_ID"
    echo ""
    echo "To check status:"
    echo "curl -H 'apikey: $API_KEY' https://api.smooth.sh/api/v1/task/$TASK_ID"
fi
