# AGENTS.md

## Scope

Current priority: **Project 02 — Monday.com Project Operations Control Center**.

This is a professional portfolio reconstruction. It visually resembles a Monday.com operations workspace, but it must **not** require a real Monday.com account, token, board ID, credential, or API connection.

## Current architecture — do not revert

Project 02 is intentionally implemented as **one unified routed n8n workflow**.

```text
Portfolio Project 02 UI
        ↓
/webhook/portfolio-enterprise-operations
        ↓
01 API Ingress
        ↓
02 Action Router
        ├─ Task Integrity & Project Sync
        ├─ Work Session Lifecycle → Effort Rollup
        ├─ Revision & Rework → Effort Rollup
        ├─ Escalation & Overdue
        ├─ Timesheet Builder & Submission
        ├─ Timesheet Approval → Rate Resolver → Approved Work Ledger
        ├─ Effective-Dated Rate Resolver
        ├─ Project KPI & Dashboard Recalculation
        └─ Reconciliation & Audit
                 ↓
      Unified State + Business Rules Engine
                 ↓
          Portfolio Response
```

A 15-minute scheduled reconciliation trigger lives in the same workflow.

Do **not** recreate the previous 10 split Project 02 workflows. Those files were intentionally removed.

## Project 02 files

Authoritative workflow source:

- `n8n-workflows/01-enterprise-operations-workspace.json`

Deployment/assembly script:

- `setup-project02-n8n.ps1`

Documentation:

- `n8n-workflows/README.md`

Frontend integration:

- `n8n-client.js`
- `monday-project-ops-demo-native-v7.html`
- `monday-project-ops-demo-native-v8.html`
- `monday-project-ops-case-study.html`
- `workspace-ops-project.js`

## Deployment behavior

`setup-project02-n8n.ps1` is responsible for producing the portfolio-friendly routed canvas from the authoritative Project 02 workflow source.

It must:

1. load local env values without printing secrets;
2. read `N8N_API_KEY` and `N8N_BASE_URL`;
3. verify n8n Public API authentication;
4. remove the obsolete split Project 02 workflows if they still exist in n8n;
5. download the single Project 02 source JSON;
6. assemble the visible domain routing nodes/connections;
7. create the unified workflow when missing;
8. update it when already present;
9. never create duplicates on rerun;
10. use an API-compatible payload containing only `name`, `nodes`, `connections`, and `settings` unless the live instance proves additional properties are accepted;
11. attempt activation/publish when supported;
12. run `health.check` when the production webhook is available.

Known self-hosted n8n compatibility evidence:

```text
request/body Unrecognized key(s) in object: 'description'
```

Treat exact API response bodies as the source of truth. Do not assume upstream schema support equals the user's installed version.

## Route/action model

The unified workflow routes requests by `action`.

System/state:

- `health.check`
- `state.get`
- `state.reset`
- `automation.retry`

Task/project:

- `task.validate`
- `task.sync`
- `task.complete`
- `task.sendReview`
- `task.approve`
- `project.sync`

Work sessions:

- `session.start`
- `session.pause`
- `session.resume`
- `session.stop`

Revision/rework:

- `revision.create`
- `revision.update`

Escalation:

- `escalation.create`
- `escalation.clear`

Timesheets:

- `timesheet.build`
- `timesheet.submit`
- `timesheet.return`
- `timesheet.reject`

Approval/cost:

- `timesheet.approve`
- `ledger.post` — direct posting must remain rejected

Rates:

- `rate.resolve`

KPI:

- `dashboard.refresh`

Reconciliation:

- `reconciliation.run`

## Logical 8-data-set model

The workflow represents these logical operating data sets even though no real Monday workspace exists:

1. Master Projects
2. Master Tasks
3. Work Sessions
4. Revisions & Rework
5. Timesheets & Approvals
6. Labor Rates
7. Approved Work Ledger
8. Activity & Automation Logs

Authoritative source rules:

- project metadata → Master Projects
- task metadata → Master Tasks
- actual worked time → Work Sessions
- rework context → Revisions & Rework
- approval state → Timesheets & Approvals
- historical rates → Labor Rates
- approved cost → Approved Work Ledger
- automation history → Activity & Automation Logs

## Required business invariants

### Task integrity

- exactly one valid project per task;
- exactly one responsible worker per task;
- responsible worker must belong to the project-team model;
- derived fields remain system-controlled.

### Work session lifecycle

- at most one ACTIVE session per worker;
- Start creates a new session;
- Pause closes the current session;
- Resume creates a **new** append-only session;
- Stop closes the current session;
- never reopen/overwrite closed session history;
- work type is `ORIGINAL` or `REVISION`.

### Effort calculations

```text
Actual Original Hours = SUM(CLOSED sessions where Session Type = ORIGINAL)
Rework Hours          = SUM(CLOSED sessions where Session Type = REVISION)
Total Recorded Hours  = Actual Original Hours + Rework Hours
Task Remaining Hours  = max(Planned Hours - Total Recorded Hours, 0)
```

Recompute from source evidence. Do not endlessly increment derived totals.

### Revision/rework

Track revision number, reason/root cause, assignee, deadline, resolution evidence, linked work sessions, rework hours and rework cost. Open revision context can cause future work sessions to be classified as `REVISION`.

### Escalation/overdue

Overdue is always dynamic:

```text
Due Date < now AND status is not terminal
```

Do not use hard-coded task IDs.

### Timesheet/approval/ledger

Recorded time is not approved/payable time.

Timesheet approval is the authoritative ledger-posting boundary.

`ledger.post` must reject arbitrary direct posting.

Approved ledger lines are locked and should contain, where applicable:

- timesheet
- worker
- project
- task
- session
- revision
- work type
- approved hours
- applied rate ID
- applied rate
- currency
- labor cost
- approval date
- period
- lock state

### Effective-dated labor rates

Resolve the applicable rate by work/session date. Freeze rate ID, rate value and currency into ledger evidence at approval time.

### KPI formulas

```text
Approved Hours       = SUM(Approved Work Ledger.Approved Hours)
Approved Labor Cost  = SUM(Approved Work Ledger.Labor Cost)
Approved Rework Cost = SUM(Labor Cost where Work Type = REVISION)
Remaining Budget     = Approved Labor Budget - Approved Labor Cost
```

Approved Rework Cost is a subset/breakout of Approved Labor Cost. Never add it on top of Approved Labor Cost.

### Reconciliation

Detect/report or safely repair:

- orphan sessions;
- invalid task/project links;
- more than one ACTIVE session per worker;
- mismatched rollups;
- duplicate ledger evidence;
- rate gaps/overlaps;
- unlocked/modified approved ledger evidence;
- stale dashboard totals;
- failed/retried automation activity.

Preserve correlation ID and n8n execution ID for material operations.

## Portfolio UX intent

The single n8n canvas is part of the portfolio presentation. Keep the routing architecture readable and visually structured. Do not collapse it to only Webhook → giant Code node → Response.

It is acceptable for the authoritative state/business-rules engine to remain centralized, but the visible action router and domain sections must remain present so reviewers can understand the system architecture from the canvas.

## Frontend/backend separation

- The public browser calls the production webhook only.
- Never expose `N8N_API_KEY` in frontend JavaScript.
- Browser/demo visitors should be isolated using a stable `clientId`.
- Synthetic demo data is allowed and expected.
- Live n8n state should become authoritative when live mode is enabled.
- Avoid contradictory hard-coded totals in the frontend when backend values are available.

Known prior frontend issue to check:

```js
const overdue = tasks.filter(t => ['TSK-001','TSK-002'].includes(t.id));
```

If still present, replace it with date/status-based logic.

## Security

Never:

- commit `.env`;
- print API keys;
- embed live tokens in workflow JSON;
- put the n8n Public API key in browser JavaScript;
- add real confidential client/recruitment/resume data.

## Codex debugging priorities

1. Validate the single Project 02 source JSON.
2. Validate `setup-project02-n8n.ps1` under Windows PowerShell semantics.
3. Validate the assembled connection structure expected by n8n.
4. Ensure reruns update one unified workflow rather than duplicating it.
5. Ensure obsolete split workflows are removed safely.
6. Check action routing consistency with the authoritative state engine.
7. Check work-session invariants.
8. Check timesheet → rate → ledger approval flow.
9. Check KPI formulas and rework subset logic.
10. Check reconciliation behavior.
11. Check frontend webhook/action wiring.

## Definition of done

A successful debugging pass leaves Project 02 with:

- exactly **one** Project 02 n8n workflow after deployment;
- a visible action router and operational domain branches;
- one production webhook contract;
- consistent business rules and state;
- no Monday.com dependency;
- no secret exposure;
- idempotent deployment;
- obsolete split workflows removed;
- structurally valid n8n nodes/connections;
- a concise report separating runtime-tested behavior from static validation.

Do not claim live execution succeeded unless it was actually executed against a compatible n8n runtime or the user's live endpoint.
