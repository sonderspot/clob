# Task Monitor Skill

Monitor cron jobs and background tasks for failures. Log details, notify via Telegram, and maintain an overview.

## Logs Location

All logs stored at: `/root/.openclaw/workspace/logs/`

Structure:
```
logs/
├── cron-runs/           # Individual run logs (YYYY-MM-DD-jobname.log)
├── cron-failures/       # Failure analysis logs
├── task-overview.md     # Rolling overview of all tasks
└── failure-summary.json # Structured failure data
```

## When a Task Fails

1. **Document the failure** in `logs/cron-failures/YYYY-MM-DD-HH:mm-jobname.log`:
   - Timestamp
   - Job name and ID
   - Error message
   - Stack trace if available
   - Last successful run
   - Attempted fix (if any)

2. **Update failure summary** in `logs/failure-summary.json`:
   ```json
   {
     "failures": [
       {
         "timestamp": "2026-02-09T14:30:00Z",
         "jobId": "...",
         "jobName": "Daily Email Digest",
         "error": "model not allowed",
         "resolution": "Changed model to claude-opus-4-5",
         "resolved": true
       }
     ]
   }
   ```

3. **Notify Mukut on Telegram** immediately with:
   - 🚨 Task failed: [Job Name]
   - Error: [brief description]
   - Time: [when]
   - Fix attempted: [yes/no + what]

4. **Update task-overview.md** with current status of all monitored tasks

## Task Overview Format

Maintain `/root/.openclaw/workspace/logs/task-overview.md`:

```markdown
# Task Overview

Last updated: [timestamp]

## Active Cron Jobs

| Job | Schedule | Last Run | Status | Notes |
|-----|----------|----------|--------|-------|
| Daily Email Digest | 14:30 UTC | 2026-02-09 | ✅ | — |
| Weekly Sender Review | Fri 16:00 | pending | ⏳ | — |

## Recent Failures

| Time | Job | Error | Resolution |
|------|-----|-------|------------|
| ... | ... | ... | ... |

## Failure Patterns

[Any recurring issues or patterns noted]
```

## Monitoring Commands

Check cron status:
```bash
openclaw cron list
```

View recent failures:
```bash
cat /root/.openclaw/workspace/logs/failure-summary.json | jq '.failures[-5:]'
```

## Auto-Recovery

When a failure is detected:
1. Check if it's a known issue (model not available, timeout, etc.)
2. Attempt automatic fix if possible
3. Log the fix attempt
4. Retry once
5. If still failing, escalate to Telegram with full details
