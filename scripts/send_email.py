#!/usr/bin/env python3
"""Send email via Gmail API"""
import sys
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import json

TOKENS_FILE = "/root/.openclaw/workspace/gmail_tokens.json"
SECRETS_FILE = "/root/.openclaw/workspace/scripts/gmail_secrets.json"

def send_email(to: str, subject: str, body: str, cc: str = None):
    with open(TOKENS_FILE) as f:
        tokens = json.load(f)
    
    with open(SECRETS_FILE) as f:
        secrets = json.load(f)
    
    creds = Credentials(
        token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=secrets["client_id"],
        client_secret=secrets["client_secret"],
        scopes=["https://www.googleapis.com/auth/gmail.send"]
    )
    
    if creds.expired:
        creds.refresh(Request())
        tokens["access_token"] = creds.token
        with open(TOKENS_FILE, "w") as f:
            json.dump(tokens, f)
    
    service = build("gmail", "v1", credentials=creds)
    
    msg = MIMEText(body)
    msg["to"] = to
    msg["subject"] = subject
    msg["from"] = "clob@elitecurrensea.com"
    if cc:
        msg["cc"] = cc
    
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    
    result = service.users().messages().send(
        userId="me",
        body={"raw": raw}
    ).execute()
    
    print(f"Sent! Message ID: {result['id']}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: send_email.py <to> <subject> <body> [cc]")
        sys.exit(1)
    
    to = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]
    cc = sys.argv[4] if len(sys.argv) > 4 else None
    
    send_email(to, subject, body, cc)
