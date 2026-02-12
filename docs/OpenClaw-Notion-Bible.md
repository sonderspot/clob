# OpenClaw Notion Bible
> Single reference for all Notion API operations.
> Distilled from the Claude Code Notion Unified Guide — governance removed, all functional rules preserved.

---

## 1. Databases

| Database | ID | Purpose |
|----------|----|---------| 
| Tasks | `d27d66c4b43942e5898cb81347220abf` | Task management and project tracking |
| Wiki | `23c6a541b895809c9aa3df1da48c34fc` | Documentation and knowledge base |
| Client Communications | `28a6a541b895804c9363d19c7aaf9b8f` | Compliance-grade tracking of all client communications |

---

## 2. Users & Teams

| Name | ID | Team |
|------|----|------|
| Vasyl Vursta | `e7a46d86-0bb1-4904-90e5-1077f965dd10` | IT |
| Andrey Artymovych | `5573e6fa-ee04-494d-8a63-68cc748d62c1` | Operations |
| Mykyta Barabanov (Nikita) | `06b0bd32-0786-48d6-8284-3b09270c5bf3` | Operations |

When assigning a task to a person, set the **Team** property to match the assignee's team above.

---

## 3. Templates

| Template | ID | Default Assignee | When to Use |
|----------|----|-------------------|-------------|
| IT Bug | `2536a541b8958002925bcf247bc1f324` | Vasyl Vursta | Bug reports for IT |
| IT Feature | `1e66a541b895807097abc55331c5efab` | Vasyl Vursta | Feature requests for IT |
| Default | `23b6a541b895804c83d5df2ef8c477fb` | None | All other task types |

**Notes:**
- Preserve template pre-configuration unless the user request contradicts it.
- Template icons/emojis do not apply automatically via the API — this is a known limitation. Template properties (assignee, priority) work correctly.

---

## 4. Task Creation

### Assignment Rules
- **IT Bug/Feature tasks** → default assignee: Vasyl Vursta
- **All other tasks** → leave unassigned unless user specifies
- **User mentions** → add inside `to_do` item text, not in database properties

### Status Rules
- **Due date provided** → set status to `"Estimated"`
- **No due date / unclear** → set status to `"Idea"`
- Override only when the user explicitly requests a different status.

### Preview Before Create
Always show the user a preview (title, assignee, priority, content summary) and wait for confirmation before calling the create API.

### Task Body Structure
Tasks follow a three-section layout: **Context** (toggles) → **Goals** (to_do) → **Notes** (bullets).

Use `heading_3` for section titles. Place a `divider` after each heading.

```json
[
  { "object": "block", "type": "heading_3", "heading_3": {"rich_text": [{"type": "text", "text": {"content": "Context"}}]} },
  {"object": "block", "type": "divider", "divider": {}},
  { "object": "block", "type": "toggle", "toggle": { "rich_text": [{"type": "text", "text": {"content": "What?"}}], "children": [{"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": "Description here"}}]}}] } },
  { "object": "block", "type": "toggle", "toggle": { "rich_text": [{"type": "text", "text": {"content": "Where?"}}], "children": [{"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": "Location/module here"}}]}}] } },
  { "object": "block", "type": "toggle", "toggle": { "rich_text": [{"type": "text", "text": {"content": "Why?"}}], "children": [{"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": "Business justification here"}}]}}] } },
  { "object": "block", "type": "heading_3", "heading_3": {"rich_text": [{"type": "text", "text": {"content": "Goals"}}]} },
  {"object": "block", "type": "divider", "divider": {}},
  { "object": "block", "type": "to_do", "to_do": {"rich_text": [{"type": "text", "text": {"content": "Action item 1"}}], "checked": false} },
  { "object": "block", "type": "to_do", "to_do": {"rich_text": [{"type": "text", "text": {"content": "Action item 2"}}], "checked": false} },
  { "object": "block", "type": "heading_3", "heading_3": {"rich_text": [{"type": "text", "text": {"content": "Notes"}}]} },
  {"object": "block", "type": "divider", "divider": {}},
  { "object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": "Additional context or references"}}]} }
]
```

---

## 5. Query Filters

### AND vs OR for `does_not_equal` (Critical Gotcha)
When excluding multiple statuses, **always use AND**. OR passes almost everything.

**WRONG — OR logic (a "Done" task still passes the "not Dropped" check):**
```json
{
  "or": [
    {"property": "Status", "status": {"does_not_equal": "Done"}},
    {"property": "Status", "status": {"does_not_equal": "Dropped"}}
  ]
}
```

**CORRECT — AND logic (properly excludes every listed status):**
```json
{
  "and": [
    {"property": "Status", "status": {"does_not_equal": "Done"}},
    {"property": "Status", "status": {"does_not_equal": "Dropped"}},
    {"property": "Status", "status": {"does_not_equal": "Archived"}},
    {"property": "Status", "status": {"does_not_equal": "Idea"}}
  ]
}
```

### Combined Filter Example (status exclusion + date + assignee)
```json
{
  "and": [
    {"property": "Responsible", "people": {"contains": "USER_ID_HERE"}},
    {"property": "Due", "date": {"before": "2025-12-04"}},
    {"property": "Status", "status": {"does_not_equal": "Done"}},
    {"property": "Status", "status": {"does_not_equal": "Dropped"}},
    {"property": "Status", "status": {"does_not_equal": "Archived"}},
    {"property": "Status", "status": {"does_not_equal": "Idea"}}
  ]
}
```

---

## 6. Content Formatting

### Properties vs Page Content
- **Database properties**: brief summaries and metadata only (max 2000 chars).
- **Page content** (`append_block_children`): detailed/unlimited content.

### Block Type Priority
1. `heading_1` / `heading_2` / `heading_3` — hierarchical structure
2. `paragraph` — general content (always use `rich_text` array)
3. `bulleted_list_item` — lists and options
4. `to_do` — actionable items with interactive checkboxes
5. `toggle` — collapsible sections with nested children

**Action items must use `to_do` blocks** with `"checked": false` — never `bulleted_list_item` with checkbox symbols in text.

### Anti-Formatting Rules
- No colored text — use `"color": "default"` only
- No decorative callouts — use plain paragraphs and bullets
- No emoji icons in headings — clean text only
- No background colors on blocks
- Strip repetitive or over-detailed content — essential information only

### Content-First Principles
- Structure from general to specific (progressive disclosure)
- Use headings and bullets for hierarchy, not decoration
- Every formatting choice must serve content clarity

---

## 7. Screenshots & Images

**Key fact:** Notion API does not support binary file uploads. All images must be externally hosted and referenced by URL.

### Hosting
- **Repository**: `github.com/sonderspot/ECS-Public-Assets`
- **Folder**: `Notion Task Screenshots/`
- **URL format**: `https://raw.githubusercontent.com/sonderspot/ECS-Public-Assets/main/Notion%20Task%20Screenshots/{filename}.png`
- **URL encoding**: replace spaces with `%20`

### Before Embedding
1. Verify the image URL returns HTTP 200 (`curl -I <url>`)
2. Use descriptive, kebab-case filenames (e.g. `black-friday-campaign-banner.png`, not `screenshot-1.png`)

### Notion Image Block
```json
{
  "object": "block",
  "type": "image",
  "image": {
    "type": "external",
    "external": {
      "url": "https://raw.githubusercontent.com/sonderspot/ECS-Public-Assets/main/Notion%20Task%20Screenshots/example-screenshot.png"
    }
  }
}
```

### Best Practices
- Add a paragraph block before the image to describe what it shows.
- Apply 2-second delays between image block additions.
- Group related screenshots under section headings.

---

## 8. Meeting Setup

1. Set **Meeting Start Time** and **Meeting End Time** in database properties.
2. Add the agenda to page content using proper heading hierarchy.
3. Use `to_do` blocks for action items.
4. Keep property-level notes as brief summaries only.

---

## 9. Wiki Documentation

- **Database**: Wiki (`23c6a541b895809c9aa3df1da48c34fc`)
- Always ask the user for permission before creating wiki entries.
- Clarify scope (what aspects to document) before writing.
- Structure: purpose, key features, setup instructions, lessons learned.

---

## 10. Client Communications

- **Database**: Client Communications (`28a6a541b895804c9363d19c7aaf9b8f`)
- Always create an entry when drafting, revising, or finalizing any client-facing communication.

### Required Properties

| Property | Example Values |
|----------|----------------|
| Communication Date | Date sent or scheduled |
| Communication Type | Risk Alert, Performance Update, Strategy Change |
| Recipient(s) | Specific client name or "All Clients" |
| Channel | Email, Phone, Meeting, Portal, Video Call |
| Status | Draft, Sent, Responded, Requires Follow-Up, Closed |
| Related Strategy/Fund | Securities Fund, Fixed Income Fund, Trading Funds, Fund of Funds |
| Priority | Urgent, High, Normal, Low |

### Compliance
- Serves as regulatory recordkeeping under **SEC Rule 204-2**.
- All client communications must be tracked for audit purposes.
- Complete documentation required for **5-year retention** compliance.
- Include the full communication text in page content for a complete audit trail.

---

## 11. Quick Reference

### Common Block Templates
```
paragraph       {"object":"block","type":"paragraph","paragraph":{"rich_text":[{"type":"text","text":{"content":"TEXT"}}]}}
heading_2       {"object":"block","type":"heading_2","heading_2":{"rich_text":[{"type":"text","text":{"content":"TEXT"}}]}}
heading_3       {"object":"block","type":"heading_3","heading_3":{"rich_text":[{"type":"text","text":{"content":"TEXT"}}]}}
bulleted_list   {"object":"block","type":"bulleted_list_item","bulleted_list_item":{"rich_text":[{"type":"text","text":{"content":"TEXT"}}]}}
to_do           {"object":"block","type":"to_do","to_do":{"rich_text":[{"type":"text","text":{"content":"TEXT"}}],"checked":false}}
toggle          {"object":"block","type":"toggle","toggle":{"rich_text":[{"type":"text","text":{"content":"LABEL"}}],"children":[...]}}
divider         {"object":"block","type":"divider","divider":{}}
image           {"object":"block","type":"image","image":{"type":"external","external":{"url":"URL"}}}
```

### Rich Text with Annotations
```json
{"type": "text", "text": {"content": "TEXT"}, "annotations": {"bold": false, "italic": false, "code": false, "color": "default"}}
```

### Rate Limiting
- **2-second minimum** delay between every API call.
- Batch operations: 1-5 blocks per request.
- Halt after 5 consecutive failures (circuit breaker).

### Error Handling
- **Retry** (with backoff): network timeouts, rate limit errors, temporary API issues.
- **Halt immediately**: authentication failures, permission denied, content validation failures.
