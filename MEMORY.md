# MEMORY.md - Long-Term Memory

_Curated learnings and persistent context. Daily files have the raw notes._

## Key Learnings

### Bot Detection & Browser Automation
- **IP reputation is primary**: PerimeterX and similar use IP trust scores before any behavioral analysis
- **Datacenter IPs = red flag**: Hetzner, AWS, GCP, etc. get negative trust scores automatically
- **Residential IPs are trusted**: Home connections start with clean slates
- **Xvfb > headless**: Non-headless browsing (with virtual display) less detectable than headless mode
- **Snap Chrome broken**: Snap-packaged Chromium doesn't work with OpenClaw browser tool; use .deb

### Claude Code Integration
- **Environment conflict**: `ANTHROPIC_BASE_URL` breaks Claude Code when OpenClaw sets it
- **Solution**: Wrapper at `/usr/local/bin/claude-code` that unsets the var
- **Permissions**: Use allowlist in `.claude/settings.json` instead of `--dangerously-skip-permissions`
- **Timeouts**: Set 30 min (1800s) default to prevent session death

### Model Availability
- **Sonnet 4 not available** on this Anthropic API setup
- Always use `anthropic/claude-opus-4-5` for cron jobs and spawned sessions

### Blog Publishing (waitingforamacguffin)
1. Create markdown file in `content/blog/`
2. Add metadata to `content/blog/posts.json`
3. Add to `articleContent` in appropriate component
4. Frontmatter gets stripped by MarkdownArticle.tsx

---

## People

### Mukut (Mykyta Barabanov)
- Timezone: US Eastern (ET)
- Named me "Clob" after "slob" — trust is earned
- Telegram: @mukuta (id: 99261167)
- Has Mac with residential IP (useful for future registrations)

---

## Infrastructure

### Server
- Ubuntu 24.04 LTS, x86_64
- ~1.9GB RAM, 2GB swap
- Datacenter: Hetzner (flagged by bot detection)

### Browser Setup
- Chrome via `/usr/local/bin/chrome-xvfb`
- Xvfb service on display :99
- ONE tab at a time (RAM constraint)

### Secure Vault
- `~/.openclaw/vault/` with age encryption
- Contains personal data (name, DOB, passwords)
- Never log decrypted contents

---

## Active Projects

### waitingforamacguffin.com
- Path: `/root/projects/waitingforamacguffin`
- RULE: Use Claude Code for ALL code changes — orchestrator mode
- Public routes: `/calculator`, `/picks`
- Auth routes: `/account/*`

### ESC Monitoring
- Repo: `sonderspot/esc`
- Cron: Daily 5 PM ET (22:00 UTC)
- Job ID: `fafe5094-2106-47bd-90fb-ffc757c3fb3c`
