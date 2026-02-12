# ECS Money In/Out — Status Transition Specification

**Purpose:** Single source of truth for how Notion status changes should trigger WordPress actions.

**Audience:** Developer (implementation verification) + QA (test case creation)

**Last Updated:** 2026-02-11

---

## Overview

### System Architecture
```
┌─────────────────┐      Sync      ┌─────────────────┐      Trigger     ┌─────────────────┐
│     NOTION      │ ───────────▶   │    WORDPRESS    │ ───────────────▶ │     EMAILS      │
│ (Source of Truth)│               │  (User Portal)   │                  │  (Notifications) │
└─────────────────┘               └─────────────────┘                  └─────────────────┘
     D&W Transactions                  User Balances                    Confirmation Emails
     Internal Transfers                Method Balances                  Status Updates
```

### Key Rules
1. **Notion is the source of truth** — all status changes originate here
2. **WP syncs from Notion** — WP database mirrors Notion data
3. **Emails fire from WP** — based on status changes received via sync
4. **Balance updates only on terminal success states:**
   - D&W Transactions: `Completed`
   - Internal Transfers: `Capital Deployed`

---

## Part 1: D&W Transactions (Money In/Out)

### Available Statuses

| Group | Status | Color | Meaning |
|-------|--------|-------|---------|
| To-do | Blocked | Gray | Requires review/additional information |
| To-do | Pending | Gray | Submitted, waiting to process |
| In progress | In Transit | Yellow | Actively processing |
| Complete | Canceled | Red | Terminated (no balance change) |
| Complete | Completed | Green | Success (balance updated) |

### Status Transition → Action Matrix

| # | From Status | To Status | WP Database Action | Balance Impact | Email Template | Recipient |
|---|-------------|-----------|-------------------|----------------|----------------|-----------|
| **D1** | *(new)* | Pending | Create transaction record | None | `deposit_request_received` / `withdrawal_request_received` | User |
| **D2** | *(new)* | Blocked | Create transaction record (flagged) | None | `transaction_review_required` | User + Admin |
| **D3** | Pending | In Transit | Update status to "In Transit" | None | `transaction_processing` | User |
| **D4** | Pending | Blocked | Update status to "Blocked" | None | `transaction_review_required` | User + Admin |
| **D5** | Pending | Canceled | Update status to "Canceled" | None | `transaction_canceled` | User |
| **D6** | Blocked | Pending | Update status to "Pending" | None | `transaction_unblocked` | User |
| **D7** | Blocked | In Transit | Update status to "In Transit" | None | `transaction_processing` | User |
| **D8** | Blocked | Canceled | Update status to "Canceled" | None | `transaction_canceled` | User |
| **D9** | In Transit | **Completed** | Update status to "Completed" | ✅ **Add/subtract from user balance** | `deposit_complete` / `withdrawal_complete` | User |
| **D10** | In Transit | Canceled | Update status to "Canceled" | None | `transaction_canceled` | User |
| **D11** | In Transit | Blocked | Update status to "Blocked" | None | `transaction_review_required` | User + Admin |

### Email Content Requirements (D&W)

| Email Template | Subject Line (suggested) | Must Include |
|----------------|-------------------------|--------------|
| `deposit_request_received` | Your deposit request has been received | Amount, Transaction Method, Reference ID |
| `withdrawal_request_received` | Your withdrawal request has been received | Amount, Transaction Method, Reference ID |
| `transaction_processing` | Your transaction is being processed | Amount, Expected timeframe (if known) |
| `transaction_review_required` | Action required: Your transaction needs review | Amount, What's needed, Contact info |
| `transaction_unblocked` | Your transaction is ready to proceed | Amount, Next steps |
| `transaction_canceled` | Your transaction has been canceled | Amount, Reason (if available) |
| `deposit_complete` | Your deposit is complete | Amount, New balance, Transaction ID |
| `withdrawal_complete` | Your withdrawal is complete | Amount, New balance, Destination details |

---

## Part 2: Internal Transfers (Fund Allocation)

### Available Statuses

| Group | Status | Color | Meaning |
|-------|--------|-------|---------|
| To-do | Draft | Gray | Created but not submitted |
| To-do | Blocked | Gray | Requires review |
| To-do | Pending | Gray | Submitted, waiting to process |
| In progress | Allocation in Progress | Blue | Actively calculating/processing |
| In progress | Allocation Completed | Yellow | Calculation done, awaiting deployment |
| Complete | Canceled | Red | Terminated (no balance change) |
| Complete | Capital Deployed | Green | Success (method balances updated) |

### Status Transition → Action Matrix

| # | From Status | To Status | WP Database Action | Balance Impact | Email Template | Recipient |
|---|-------------|-----------|-------------------|----------------|----------------|-----------|
| **T1** | *(new)* | Draft | Create transfer record | None | *(none — internal draft)* | — |
| **T2** | Draft | Pending | Update status to "Pending" | None | `transfer_submitted` | User |
| **T3** | Draft | Canceled | Archive/delete record | None | *(none — draft discarded)* | — |
| **T4** | Pending | Allocation in Progress | Update status | None | `transfer_processing` | User |
| **T5** | Pending | Blocked | Update status to "Blocked" | None | `transfer_review_required` | User + Admin |
| **T6** | Pending | Canceled | Update status to "Canceled" | None | `transfer_canceled` | User |
| **T7** | Blocked | Pending | Update status to "Pending" | None | `transfer_unblocked` | User |
| **T8** | Blocked | Canceled | Update status to "Canceled" | None | `transfer_canceled` | User |
| **T9** | Allocation in Progress | Allocation Completed | Update status | None | *(none — intermediate state)* | — |
| **T10** | Allocation in Progress | Blocked | Update status to "Blocked" | None | `transfer_review_required` | User + Admin |
| **T11** | Allocation in Progress | Canceled | Update status to "Canceled" | None | `transfer_canceled` | User |
| **T12** | Allocation Completed | **Capital Deployed** | Update status | ✅ **Move funds between methods** | `transfer_complete` | User |
| **T13** | Allocation Completed | Blocked | Update status to "Blocked" | None | `transfer_review_required` | User + Admin |
| **T14** | Allocation Completed | Canceled | Update status to "Canceled" | None | `transfer_canceled` | User |

### Email Content Requirements (Internal Transfers)

| Email Template | Subject Line (suggested) | Must Include |
|----------------|-------------------------|--------------|
| `transfer_submitted` | Your fund transfer request has been submitted | From Method, To Method, Amount |
| `transfer_processing` | Your fund transfer is being processed | From Method, To Method, Amount |
| `transfer_review_required` | Action required: Your transfer needs review | Amount, What's needed, Contact info |
| `transfer_unblocked` | Your transfer is ready to proceed | From Method, To Method, Amount |
| `transfer_canceled` | Your fund transfer has been canceled | From Method, To Method, Amount, Reason |
| `transfer_complete` | Your funds have been reallocated | From Method (old balance), To Method (new balance), Amount moved |

---

## Part 3: Developer Implementation Checklist

Use this checklist to verify your implementation handles all cases:

### Sync Layer
- [ ] Webhook/polling detects status changes in Notion
- [ ] Status changes are queued for processing (handle duplicates)
- [ ] Failed syncs are logged and retried

### D&W Transaction Handlers
- [ ] **D1:** New Pending transaction → Create record, send email
- [ ] **D2:** New Blocked transaction → Create record, send email to user + admin
- [ ] **D3:** Pending → In Transit → Update record, send email
- [ ] **D4:** Pending → Blocked → Update record, send email to user + admin
- [ ] **D5:** Pending → Canceled → Update record, send email
- [ ] **D6:** Blocked → Pending → Update record, send email
- [ ] **D7:** Blocked → In Transit → Update record, send email
- [ ] **D8:** Blocked → Canceled → Update record, send email
- [ ] **D9:** In Transit → Completed → Update record, **UPDATE BALANCE**, send email
- [ ] **D10:** In Transit → Canceled → Update record, send email
- [ ] **D11:** In Transit → Blocked → Update record, send email to user + admin

### Internal Transfer Handlers
- [ ] **T1:** New Draft → Create record (no email)
- [ ] **T2:** Draft → Pending → Update record, send email
- [ ] **T3:** Draft → Canceled → Archive record (no email)
- [ ] **T4:** Pending → Allocation in Progress → Update record, send email
- [ ] **T5:** Pending → Blocked → Update record, send email to user + admin
- [ ] **T6:** Pending → Canceled → Update record, send email
- [ ] **T7:** Blocked → Pending → Update record, send email
- [ ] **T8:** Blocked → Canceled → Update record, send email
- [ ] **T9:** Allocation in Progress → Allocation Completed → Update record (no email)
- [ ] **T10:** Allocation in Progress → Blocked → Update record, send email to user + admin
- [ ] **T11:** Allocation in Progress → Canceled → Update record, send email
- [ ] **T12:** Allocation Completed → Capital Deployed → Update record, **UPDATE METHOD BALANCES**, send email
- [ ] **T13:** Allocation Completed → Blocked → Update record, send email to user + admin
- [ ] **T14:** Allocation Completed → Canceled → Update record, send email

### Balance Calculation
- [ ] User total balance = Sum of all **Completed** D&W transactions (deposits positive, withdrawals negative)
- [ ] Method balance = Sum of all **Capital Deployed** internal transfers allocated to that method
- [ ] Pending/In Transit transactions shown separately (not in main balance)

---

## Part 4: QA Test Case Template

### Test Case Format

```
Test ID: [D1-D11 or T1-T14]
Description: [From Status] → [To Status]
Precondition: Transaction exists in Notion with status [From Status]

Steps:
1. Note current WP database state
2. Note current user balance (if applicable)
3. Change status in Notion from [From Status] to [To Status]
4. Wait for sync (document expected sync time: ___ seconds/minutes)
5. Check WP database
6. Check user balance
7. Check email inbox

Expected Results:
- WP DB: [Expected change]
- Balance: [No change / +$X / -$X / Method A -$X, Method B +$X]
- Email: [Template name] sent to [recipient] OR No email sent

Actual Results:
- WP DB: ___
- Balance: ___
- Email: ___

Status: PASS / FAIL
```

### Priority Test Cases

**Must test first (balance-affecting):**
1. **D9:** In Transit → Completed (deposit) — balance should increase
2. **D9:** In Transit → Completed (withdrawal) — balance should decrease
3. **T12:** Allocation Completed → Capital Deployed — method balances should change

**Edge cases:**
4. Rapid status changes (Pending → In Transit → Completed in quick succession)
5. Blocked → Completed (skipping In Transit — should this be allowed?)
6. Sync failure mid-transaction (what state is WP left in?)

---

## Part 5: Open Questions (To Be Resolved)

| # | Question | Options | Decision |
|---|----------|---------|----------|
| 1 | Can a transaction skip statuses? (e.g., Pending → Completed directly) | Allow / Block / Log warning | |
| 2 | What's the expected sync latency? | Real-time / < 1 min / < 5 min / Scheduled | |
| 3 | If sync fails, should WP show stale data or error? | Stale + warning / Block access / Silent stale | |
| 4 | Should admin receive email on EVERY Blocked status, or only first time? | Every time / First time only / Configurable | |
| 5 | Are Draft transfers visible to users, or admin-only? | User visible / Admin only | |
| 6 | Can users cancel their own pending transactions? | Yes (via WP) / No (admin only via Notion) | |

---

## Appendix: Database IDs (for API reference)

| Database | Notion ID |
|----------|-----------|
| D&W Transactions (Money In/Out) | `1c76a541b8958055906fd0681efbe103` |
| Fund-Level P&L | `29b6a541-b895-81d6-b07a-f8530933b8d0` |
| Monthly Financial Summary | `29b6a541-b895-8151-814b-f8069f0c303e` |
| Fund Expenses Tracker | `29b6a541-b895-810c-a44a-ea4793fb8c40` |
| Operating Expenses Tracker | `29b6a541-b895-813a-b8d9-cc2a9325f2b9` |

---

*This document should be updated when decisions are made on open questions or when new status transitions are identified.*
