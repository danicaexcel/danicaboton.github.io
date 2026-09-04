# AGENTS.md

## Scope

This repository is a professional portfolio reconstruction. The current priority is **Project 02 — Monday.com Project Operations Control Center**.

Codex should treat this file as the operating contract for debugging and modifying Project 02.

## Core project intent

Project 02 visually reconstructs a Monday.com-style operations workspace, but it **must not require a real Monday.com account, Monday API token, Monday board IDs, or Monday credentials**.

The target architecture is:

```text
Portfolio Project 02 UI
        ↓
Public n8n webhooks
        ↓
Project 02 workflow families
        ↓
Authoritative Project 02 state engine
        ↓
Synthetic portfolio data + derived calculations + audit history
```

The UI should behave like a realistic Monday.com operations control center while n8n provides the backend behavior.

## Do not change these architectural decisions

- Do not add a Monday.com dependency.
- Do not embed API keys, tokens, `.env` contents, secrets, or credentials in GitHub files.
- Do not commit `.env`; it is intentionally git-ignored.
- Do not move the n8n Public API key into browser JavaScript.
- Do not collapse the system back into one giant workflow or one giant Code node merely because it is simpler.
- Keep the central state engine as the authoritative state/calculation layer, but preserve the separate functional workflow families for architecture visibility and debugging.
- Do not create a standalone Monday approval board. Approval evidence belongs to Timesheets & Approvals and the Approved Work Ledger.
- Do not double-count approved rework cost. Approved Rework Cost is a subset/breakout of Approved Labor Cost.
- Do not use hard-coded task IDs for overdue logic. Overdue must be derived from due date + terminal status.
- Do not overwrite work-session history. Sessions are append-only evidence.
- Do not increment derived totals indefinitely. Recompute derived totals from source evidence.

## Project 02 n8n files

The core workflow is:

- `n8n-workflows/01-enterprise-operations-workspace.json`

The ten functional workflow families are:

- `n8n-workflows/project-02/01-task-integrity.json`
- `n8n-workflows/project-02/02-work-session-lifecycle.json`
- `n8n-workflows/project-02/03-effort-rollup.json`
- `n8n-workflows/project-02/04-revision-rework.json`
- `n8n-workflows/project-02/05-escalation-overdue.json`
- `n8n-workflows/project-02/06-timesheet-builder.json`
- `n8n-workflows/project-02/07-approval-ledger.json`
- `n8n-workflows/project-02/08-rate-resolver.json`
- `n8n-workflows/project-02/09-kpi-dashboard.json`
- `n8n-workflows/project-02/10-reconciliation-audit.json`

Deployment script:

- `setup-project02-n8n.ps1`

Shared browser client:

- `n8n-client.js`

Current Project 02 demo/case-study files include:

- `monday-project-ops-demo-native-v7.html`
- `monday-project-ops-demo-native-v8.html`
- `monday-project-ops-case-study.html`
- `workspace-ops-project.js`

## Required workflow families and responsibilities

### 01 — Task Integrity & Project Sync

Must enforce:

- every task has exactly one project;
- every task has exactly one responsible worker;
- responsible worker belongs to the project team model;
- source/project context can be synchronized safely;
- validation result is explicit;
- validation activity is auditable.

### 02 — Work Session Lifecycle

Must support:

- `session.start`
- `session.pause`
- `session.resume`
- `session.stop`

Rules:

- at most one ACTIVE session per worker;
- Start creates a new append-only session;
- Pause/Stop closes the current active session;
- Resume creates a new session, never reopens or overwrites a closed session;
- session type is ORIGINAL or REVISION;
- every material write carries idempotency/correlation/execution metadata.

### 03 — Effort Rollup Engine

Derived calculations:

```text
Actual Original Hours = SUM(CLOSED sessions where Session Type = ORIGINAL)
Rework Hours          = SUM(CLOSED sessions where Session Type = REVISION)
Total Recorded Hours  = Actual Original Hours + Rework Hours
Task Remaining Hours  = max(Planned Hours - Total Recorded Hours, 0)
```

Rollups should propagate to projects from source evidence.

### 04 — Revision & Rework Control

Must support:

- revision creation when work is returned;
- revision number;
- reason/root cause;
- assignee;
- due date;
- linked revision work sessions;
- resolution evidence;
- rework hours and approved rework cost derivation.

Future sessions associated with an open revision should be classifiable as REVISION work.

### 05 — Escalation & Overdue Engine

Must support:

- escalation create;
- escalation clear;
- reason/note;
- duplicate guard;
- scheduled overdue evaluation;
- project risk/health/open escalation count.

Overdue rule must be dynamic:

```text
Due Date < now AND task status is not terminal
```

Typical terminal statuses include Done/Completed/Cancelled/Approved, depending on the data model.

### 06 — Timesheet Builder & Submission

Must:

- aggregate eligible CLOSED work sessions by worker/period;
- keep original and rework hours separate;
- create/update timesheet headers;
- support submit;
- lock or constrain submitted evidence appropriately.

### 07 — Timesheet Approval & Ledger Posting

Must support:

- approve;
- return;
- reject;
- idempotent posting;
- locked ledger entries on approval.

Ledger dimensions should include, where available:

- timesheet;
- worker;
- project;
- task;
- session/revision;
- work type;
- approved hours;
- applied rate ID;
- applied rate;
- currency;
- approved labor cost;
- approval date;
- period;
- lock state.

Direct arbitrary ledger writes should remain blocked. Approval is the authoritative posting boundary.

### 08 — Effective-Dated Rate Resolver

Must:

- validate rate gaps and overlaps;
- resolve the applicable rate by work/session date;
- freeze rate ID, rate value, and currency into ledger entries when approval posts;
- preserve historical rate accuracy after future rate changes.

### 09 — Project KPI & Dashboard Recalculation

Must recompute from source evidence:

- actual original hours;
- rework hours;
- total recorded hours;
- approved hours;
- approved labor cost;
- approved rework cost;
- remaining labor budget;
- task counts;
- overdue count;
- escalation count;
- progress;
- project health;
- Last Calculated timestamp.

Critical formulas:

```text
Approved Hours       = SUM(Approved Work Ledger.Approved Hours)
Approved Labor Cost  = SUM(Approved Work Ledger.Labor Cost)
Approved Rework Cost = SUM(Approved Work Ledger.Labor Cost where Work Type = REVISION)
Remaining Budget     = Approved Labor Budget - Approved Labor Cost
```

Approved Rework Cost must never be added again on top of Approved Labor Cost.

### 10 — Reconciliation & Audit

Must detect/report or safely repair:

- orphan sessions;
- invalid project/task links;
- more than one active session for a worker;
- mismatched derived rollups;
- duplicate ledger lines;
- rate gaps/overlaps;
- modified locked ledger evidence;
- stale dashboard totals;
- failed/retried automation activity.

Every material operation should be traceable through correlation ID and n8n execution ID.

## Logical 8-board data model

Project 02 represents these logical boards/data sets even though no real Monday workspace is connected:

1. Master Projects
2. Master Tasks
3. Work Sessions
4. Revisions & Rework
5. Timesheets & Approvals
6. Labor Rates
7. Approved Work Ledger
8. Activity & Automation Logs

Authoritative sources:

- project metadata → Master Projects
- task metadata → Master Tasks
- actual worked time → Work Sessions
- rework context → Revisions & Rework
- approval state → Timesheets & Approvals
- historical rates → Labor Rates
- approved project cost → Approved Work Ledger
- automation history → Activity & Automation Logs

## Demo/backend separation

Synthetic seed data is acceptable because this is a public portfolio reconstruction. However:

- UI values should be derived consistently from the same backend state when live mode is enabled;
- avoid separate contradictory hard-coded totals in multiple layers;
- browser-only fallback/synthetic mode may remain, but live n8n mode should be authoritative once configured;
- each visitor/session should be isolated using a stable `clientId` so public users do not mutate the same demo state.

## n8n compatibility rules

The user's self-hosted n8n Public API has already demonstrated that some optional workflow properties can be rejected.

Known observed incompatibility:

```text
request/body Unrecognized key(s) in object: 'description'
```

Therefore:

- deployment payloads should prefer the stable core properties `name`, `nodes`, `connections`, and `settings`;
- do not assume the user's instance accepts every field supported by current upstream n8n;
- when debugging API errors, use the exact response body as the source of truth;
- keep the installer backward-compatible where practical;
- repeated deployment must update existing workflows instead of creating duplicates.

## Deployment behavior required

`setup-project02-n8n.ps1` should:

1. load a local env file without printing secret values;
2. read `N8N_API_KEY` and `N8N_BASE_URL`;
3. verify `GET /api/v1/workflows` authentication;
4. download all Project 02 JSON files from GitHub;
5. validate the JSON before sending it;
6. use an API-safe payload;
7. detect existing workflows by stable names;
8. PUT updates to existing workflows;
9. POST only when a workflow is missing;
10. attempt activation/publish only when supported by the user's n8n API;
11. report per-workflow success/failure clearly;
12. never reveal the API key in logs.

A failure in one family should identify exactly which workflow and which API response failed.

## Debugging priorities for Codex

Work in this order unless evidence points elsewhere:

1. Validate every Project 02 JSON file parses as JSON.
2. Check that node types, node parameters, connections, and type versions are internally consistent.
3. Check all webhook paths are unique and intentional.
4. Check all action names are consistent between portfolio UI, family workflows, and the core state engine.
5. Check the deployment script against the actual self-hosted n8n API behavior.
6. Check idempotent create/update behavior and duplicate prevention.
7. Check session lifecycle invariants.
8. Check timesheet → rate resolution → locked ledger posting.
9. Check KPI formulas and rework-cost subset logic.
10. Check reconciliation rules.
11. Check browser integration only after backend workflow contracts are stable.

## Tests Codex should add/run when practical

Prefer deterministic local tests that do not require live credentials.

At minimum, build or run checks for:

- parse all `n8n-workflows/project-02/*.json`;
- parse core state engine JSON;
- assert workflow names are unique;
- assert webhook paths are unique;
- assert connection targets reference existing node names;
- assert no secret-looking environment values are embedded in tracked files;
- assert Project 02 action names are recognized consistently;
- assert overdue logic is date/status based, not task-ID based;
- assert approved rework cost is a subset of approved labor cost;
- assert Resume creates a new session rather than reopening a prior session;
- assert approval posting is idempotent;
- assert locked ledger lines are not directly mutable.

If n8n is not installed in the Codex environment, perform structural/static workflow validation rather than pretending execution succeeded.

## Portfolio UI expectations

Project 02 should remain visually polished and believable as a Monday-style reconstruction.

Do not replace the current visual design with generic debug UI.

When modifying the demo:

- preserve the existing Monday-style visual language;
- fix functional wiring without degrading layout;
- avoid hard-coded production values when the live backend can provide them;
- keep public demo data synthetic and non-sensitive;
- keep full-screen and case-study preview layouts working.

Known prior synthetic issue to look for:

```js
const overdue = tasks.filter(t => ['TSK-001','TSK-002'].includes(t.id));
```

If still present, replace it with dynamic date/status logic without breaking the visual output.

## Security

Never:

- commit `.env`;
- print API keys in test output;
- copy secrets into workflow JSON;
- put the n8n Public API key in frontend JavaScript;
- add real client/resume/recruitment data to this project.

If a test fixture needs credentials, use placeholders only.

## Definition of done for the current Project 02 debugging pass

A successful Codex pass should leave the repository in a state where:

- all 11 Project 02 workflows are structurally valid;
- the PowerShell installer can idempotently create/update all 11 against the user's self-hosted n8n API;
- failures are actionable and identify the exact workflow/API field causing the problem;
- the core state engine and ten family workflows use consistent actions/contracts;
- no Monday.com connection is required;
- no secrets are committed;
- the portfolio demo can be wired to the live n8n webhook without changing the business rules above;
- a concise debug report lists tests run, failures found, files changed, remaining risks, and any manual verification still needed.

## Preferred Codex output

When finished, Codex should report:

```text
1. Root cause(s)
2. Files changed
3. Tests/checks run
4. n8n compatibility fixes
5. Remaining manual verification
6. Any unresolved risks
```

Do not claim an n8n workflow executed successfully unless it was actually executed against a compatible n8n runtime or the user's live endpoint.
