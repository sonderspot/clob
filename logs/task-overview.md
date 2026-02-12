# Task Overview

Last updated: 2026-02-09 15:20 UTC

## Active Cron Jobs

| Job | Schedule | Last Run | Status | Notes |
|-----|----------|----------|--------|-------|
| Daily Email Digest | 14:30 UTC daily | 2026-02-09 (failed) | 🔧 Fixed | Changed model to Opus |
| Weekly Sender Review | Fri 16:00 UTC | pending | ⏳ | Next: 2026-02-14 |

## Recent Failures

| Time | Job | Error | Resolution |
|------|-----|-------|------------|
| 2026-02-09 04:30 | Daily Email Digest | model not allowed: claude-sonnet-4 | Changed to claude-opus-4-5 ✅ |

## Failure Patterns

- **Model availability**: Sonnet 4 not available on this setup — use Opus 4.5 for all cron jobs

## Notes

- Email digest runs daily at 9:30 AM ET (14:30 UTC)
- Weekly sender review on Fridays at 12:00 PM ET (16:00 UTC)
- Logs stored in `/root/.openclaw/workspace/logs/`
