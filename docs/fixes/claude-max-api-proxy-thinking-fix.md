# claude-max-api-proxy Extended Thinking Fix

**Date:** 2026-02-13  
**Upstream:** https://github.com/atalovesyou/claude-max-api-proxy  
**Version patched:** 1.0.0  
**Location on VPS:** `/usr/lib/node_modules/claude-max-api-proxy/`

## Problem

The proxy converts OpenAI-format requests to Claude CLI invocations, but it ignores the `thinking` parameter. This means extended thinking levels set in OpenClaw (`/reasoning` command) have no effect — Claude CLI always runs without the `--thinking` flag.

## Root Cause

Three files needed changes:

1. `adapter/openai-to-cli.js` — doesn't extract `thinking` from request
2. `server/routes.js` — doesn't pass `thinkingLevel` to subprocess
3. `subprocess/manager.js` — doesn't add `--thinking` flag to CLI args

## Fix

### 1. `dist/adapter/openai-to-cli.js`

Add thinking extraction function and include in return:

```javascript
/**
 * Extract thinking level from request
 * Supports: "off", "low", "medium", "high", "xhigh"
 */
function extractThinking(request) {
    // Check various possible field names
    const thinking = request.thinking || request.thinkingLevel || request.thinking_level;
    if (!thinking || thinking === "off") return null;
    // Validate level
    const validLevels = ["low", "medium", "high", "xhigh"];
    if (validLevels.includes(thinking)) return thinking;
    return null;
}

export function openaiToCli(request) {
    return {
        prompt: messagesToPrompt(request.messages),
        model: extractModel(request.model),
        sessionId: request.user,
        thinkingLevel: extractThinking(request),  // ADD THIS
    };
}
```

### 2. `dist/server/routes.js`

Pass `thinkingLevel` to subprocess.start() in BOTH handlers (streaming and non-streaming):

```javascript
subprocess.start(cliInput.prompt, {
    model: cliInput.model,
    sessionId: cliInput.sessionId,
    thinkingLevel: cliInput.thinkingLevel,  // ADD THIS
})
```

### 3. `dist/subprocess/manager.js`

Add `--thinking` flag in `buildArgs()`:

```javascript
if (options.sessionId) {
    args.push("--session-id", options.sessionId);
}
// ADD THIS BLOCK:
if (options.thinkingLevel) {
    args.push("--thinking", options.thinkingLevel);
}
return args;
```

## Verification

Test with curl:

```bash
curl -X POST http://localhost:3456/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-opus-4", "messages": [{"role": "user", "content": "Hi"}], "thinking": "medium"}'
```

Check proxy logs for `--thinking medium` in CLI args.

## Backup Location

Pre-patch files backed up to:
`/root/.openclaw/backups/claude-max-api-proxy-20260213-211235/`

## Rollback

```bash
cp /root/.openclaw/backups/claude-max-api-proxy-20260213-211235/*.js \
   /usr/lib/node_modules/claude-max-api-proxy/dist/

# Restart proxy
pkill -f "claude-max-api" && nohup node /usr/bin/claude-max-api 3456 &
```
