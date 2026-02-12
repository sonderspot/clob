#!/usr/bin/env python3
"""Check clob@elitecurrensea.com for new unread emails and output summaries."""
import json, requests, os, base64

TOKEN_PATH = "/root/.openclaw/workspace/gmail_tokens.json"
STATE_PATH = "/root/.openclaw/workspace/memory/email-state.json"
SECRETS_PATH = "/root/.openclaw/workspace/scripts/gmail_secrets.json"

def load_secrets():
    with open(SECRETS_PATH) as f:
        return json.load(f)

def refresh_token(tokens):
    secrets = load_secrets()
    resp = requests.post("https://oauth2.googleapis.com/token", data={
        "client_id": secrets["client_id"],
        "client_secret": secrets["client_secret"],
        "refresh_token": tokens["refresh_token"],
        "grant_type": "refresh_token"
    })
    new_tokens = resp.json()
    tokens["access_token"] = new_tokens["access_token"]
    with open(TOKEN_PATH, "w") as f:
        json.dump(tokens, f, indent=2)
    return tokens

def get_headers(tokens):
    return {"Authorization": f"Bearer {tokens['access_token']}"}

def check():
    with open(TOKEN_PATH) as f:
        tokens = json.load(f)

    # Load state (last checked history ID)
    state = {}
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH) as f:
            state = json.load(f)

    headers = get_headers(tokens)
    
    # Get unread messages
    r = requests.get(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread+in:inbox&maxResults=10",
        headers=headers
    )
    
    if r.status_code == 401:
        tokens = refresh_token(tokens)
        headers = get_headers(tokens)
        r = requests.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread+in:inbox&maxResults=10",
            headers=headers
        )

    data = r.json()
    messages = data.get("messages", [])
    
    # Filter out already-seen message IDs
    seen = set(state.get("seen_ids", []))
    new_messages = [m for m in messages if m["id"] not in seen]
    
    if not new_messages:
        print("NO_NEW_MAIL")
        return
    
    results = []
    for msg in new_messages:
        r2 = requests.get(
            f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg['id']}?format=full",
            headers=headers
        )
        mdata = r2.json()
        hdrs = {h['name']: h['value'] for h in mdata.get('payload', {}).get('headers', [])}
        
        # Get body
        snippet = mdata.get('snippet', '')
        
        results.append({
            "id": msg["id"],
            "from": hdrs.get("From", "Unknown"),
            "subject": hdrs.get("Subject", "(no subject)"),
            "date": hdrs.get("Date", ""),
            "snippet": snippet
        })
    
    # Update seen IDs (keep last 100)
    all_seen = list(seen | {m["id"] for m in new_messages})[-100:]
    state["seen_ids"] = all_seen
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)
    
    # Output
    for r in results:
        print(f"NEW_EMAIL|{r['from']}|{r['subject']}|{r['snippet']}")

if __name__ == "__main__":
    check()
