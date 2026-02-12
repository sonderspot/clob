# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

### Email
- **Account:** clob@elitecurrensea.com (Gmail OAuth2 — readonly + send)
- **Tokens:** gmail_tokens.json (auto-refreshes)
- **Check script:** scripts/check_email.py
- **Cron:** Daily at 14:30 UTC (9:30 AM ET), isolated session
- **Model:** anthropic/claude-opus-4-5 (Sonnet not available on this setup)
- **RULE:** When new email arrives, notify Mukut on **Telegram**. Do NOT reply by email unless explicitly asked.
- **RULE:** Email is for receiving info. Telegram is for talking to Mukut. Always.

### Claude Code
- **Wrapper:** `/usr/local/bin/claude-code` (unsets ANTHROPIC_BASE_URL)
- **Project:** `/root/projects/waitingforamacguffin`
- **Default timeout:** 1800 (30 min) — prevents session death on long tasks
- **Always use:** `pty: true`, `background: true`, `timeout: 1800`
- **RULE:** Use Claude Code for ALL code changes to waitingforamacguffin — don't edit files directly. Stay in orchestrator mode.

#### Completion Notifications (IMPORTANT)
**DON'T use generic wake triggers** — they broadcast to "main session" which may be a different chat than where the task originated.

**DO use `sessions_send`** to deliver completion messages back to the originating chat:
1. Note the current `sessionKey` before spawning Claude Code
2. After task completes, use `sessions_send(sessionKey, "Done: [summary]")` to announce in the right place
3. Or poll with `process action:log` and announce manually in the current context

**Session keys by chat type:**
- Direct Mukut: `agent:main:main`
- Nano-Claw group: `agent:main:telegram:group:-5136302044`
- ECS IT group: `agent:main:telegram:group:-1001502301090:topic:2`

**Example flow:**
```javascript
// 1. Remember where we are
const originSession = "agent:main:telegram:group:-5136302044";

// 2. Spawn Claude Code (no wake trigger)
exec({
  command: 'claude-code "Fix X, commit, push"',
  pty: true,
  workdir: '/root/projects/waitingforamacguffin',
  background: true,
  timeout: 1800
})

// 3. When done, announce back to origin
sessions_send({ sessionKey: originSession, message: "Done: Fixed X and pushed" })
```

### Task Monitoring
- **Skill:** task-monitor (workspace/skills/task-monitor/)
- **Logs:** `/root/.openclaw/workspace/logs/`
  - `cron-runs/` — Individual run logs (YYYY-MM-DD-jobname.log)
  - `cron-failures/` — Failure analysis logs
  - `task-overview.md` — Rolling status of all tasks
  - `failure-summary.json` — Structured failure data
- **On failure:** Document details, notify Mukut on Telegram, update logs

Add whatever helps you do your job. This is your cheat sheet.

### Notion API
- **Token:** `scripts/notion_secrets.json` (gitignored)
- **Bible:** `docs/OpenClaw-Notion-Bible.md` (full spec)
- **Helper:** `scripts/notion_api.sh <METHOD> <endpoint> [json_body]`
- **MCP Config:** `~/.claude/mcp.json` (for Claude Code)

#### Databases
| Database | ID | Access |
|----------|----|----|
| Tasks | `d27d66c4b43942e5898cb81347220abf` | Read/Write (pending) |
| Wiki | `23c6a541b895809c9aa3df1da48c34fc` | Read-only |
| Client Communications | `28a6a541b895804c9363d19c7aaf9b8f` | Read/Write (pending) |

#### Users
| Name | ID | Team |
|------|----|------|
| Vasyl Vursta | `e7a46d86-0bb1-4904-90e5-1077f965dd10` | IT |
| Andrey Artymovych | `5573e6fa-ee04-494d-8a63-68cc748d62c1` | Operations |
| Mukut (Nikita) | `06b0bd32-0786-48d6-8284-3b09270c5bf3` | Operations |

#### Key Rules
- **Task creation:** Preview + confirmation before API call
- **Status:** Due date → "Estimated", no due date → "Idea"
- **Task body:** Context (toggles) → Goals (to_do) → Notes (bullets)
- **Query filters:** Use AND for `does_not_equal` exclusions (OR is a trap)
- **Images:** Must be hosted on GitHub (`sonderspot/ECS-Public-Assets`)
- **Rate limit:** 2-second delay between API calls
- **Client Comms:** SEC Rule 204-2 compliance required

### Browser (Chrome + Xvfb)
- **Installed:** Feb 10, 2026 — for testing, may remove if RAM becomes an issue
- **Setup:** Google Chrome + Xvfb (virtual display) for non-headless browsing
- **Wrapper:** `/usr/local/bin/chrome-xvfb` (sets DISPLAY=:99)
- **Xvfb service:** `systemctl status xvfb` (auto-starts on boot)
- **RULE:** Only ONE tab at a time to conserve RAM
- **To remove:** `apt remove google-chrome-stable && systemctl disable --now xvfb`

### Secure Vault (age encryption)
- **Location:** `~/.openclaw/vault/`
- **Key:** `key.txt` (age private key, chmod 600)
- **Data:** `personal.age` (encrypted JSON)
- **Decrypt:** `age -d -i ~/.openclaw/vault/key.txt ~/.openclaw/vault/personal.age`
- **Contains:** Name, DOB, email, account passwords (NOT address/phone)
- **RULE:** Never log decrypted contents; use only when needed for registrations

### Smooth.sh (Backup Browser Agent)
- **API Key:** Stored in `scripts/smooth_task.sh` (or use SMOOTH_API_KEY env var)
- **Credits:** ~489 remaining (as of Feb 10, 2026)
- **Features:** Residential IPs, CAPTCHA solving, human-like behavior
- **Scripts:**
  - `scripts/smooth_task.sh "task"` — Generic runner (no recording, auto-deletes)
  - `scripts/smooth_spirit_register.sh` — Spirit Airlines specific (deprecated)
- **RULES:**
  - `enable_recording: false` — ALWAYS disable recordings for privacy
  - Auto-delete tasks after completion
  - Use as backup when local Chrome fails (PerimeterX, etc.)
- **Limitations:** Struggled with Spirit's dynamic dropdowns
