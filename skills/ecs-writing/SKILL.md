---
name: ecs-writing
description: Anti-slop copywriting for external communications. Use for ALL blog posts, articles, emails, investor communications, and long-form content. Mandatory for any text that will be read by humans outside the team.
---

# ECS Writing Skill

## Workflow

1. **Spawn sub-agent** with extended thinking for all writing tasks:
   ```
   sessions_spawn(task: "<writing task>", thinking: "high")
   ```

2. **Sub-agent MUST read** `references/full-guide.md` before writing anything

3. **Write** following the guide strictly

4. **Validate** output before delivering (see checklist below)

Don't write long-form content inline. Always spawn.

## Critical Rules (Memorize These)

### BANNED (instant fails):
- Em dashes (—). Use commas or periods.
- Furthermore / Moreover / Additionally / Consequently / Hence / Thus
- Utilize / Leverage / Facilitate / Implement / Optimize / Robust
- "In today's market" / "Let's delve into" / "It's worth noting"
- "The catch?" / "Here's the kicker" / "The best part?" / "Ready to level up?"
- "No X. No Y. Just Z." pattern
- Rule of threes (don't list exactly 3 things repeatedly)
- Fake case studies (no "Sarah Chen" type invented examples)
- "This changed everything" / "Game-changer"

### REQUIRED:
- Contractions (don't, can't, it's, you're)
- Sentence variety (short. Then longer. Fragment.)
- Start sentences with "And" or "But"
- Specific numbers, dates, names
- Simple words (use > utilize, help > facilitate, start > implement)
- Personal conviction ("I think", "In my view")

### THE GOLDEN RULE
If a sentence could appear in anyone's content, delete it.

## Pre-Write Checklist
1. What SPECIFIC insight do I have?
2. What REAL example can I use?
3. What NUMBERS and DATES are relevant?
4. How would I explain this over coffee?

## Post-Write Validation

Before delivering, check for these patterns (should find ZERO):
```
grep -E "(—|furthermore|moreover|additionally|utilize|leverage|facilitate|delve|robust|crucial|essential)" output.md
grep -E "(In today's|Let's dive|worth noting|The catch\?|Here's the kicker|game.changer)" output.md
```

If any match, rewrite those sections.

## Full Reference
Read `references/full-guide.md` for complete banned words, structural patterns, and examples.
