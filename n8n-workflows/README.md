# Portfolio n8n workflow package

These workflows support the reconstructed portfolio systems. Credentials, API keys, and private tenant identifiers are never embedded in the repository.

## Project 02 — Monday.com Project Operations Control Center

Project 02 is intentionally deployed as **one unified routed n8n workflow**. It does **not** connect to a real Monday.com account and does not require a Monday API token.

Source file:

- `01-enterprise-operations-workspace.json`

Deployment script:

- `../setup-project02-n8n.ps1`

The source contains the authoritative Project 02 state/business-rule engine. During deployment, `setup-project02-n8n.ps1` assembles the portfolio-facing canvas around it so the n8n editor visibly shows:

```text
01 API Ingress
      ↓
02 Action Router
      ├─ 01 Task Integrity & Project Sync
      ├─ 02 Work Session Lifecycle
      │      ↓
      │   03 Effort Rollup Engine
      ├─ 04 Revision & Rework Control
      │      ↓
      │   03 Effort Rollup Engine
      ├─ 05 Escalation & Overdue Engine
      ├─ 06 Timesheet Builder & Submission
      ├─ 07 Timesheet Approval Boundary
      │      ↓
      │   08 Effective-Dated Rate Resolver
      │      ↓
      │   07B Approved Work Ledger Posting
      ├─ 08 Effective-Dated Rate Resolver
      ├─ 09 Project KPI & Dashboard Recalculation
      └─ 10 Reconciliation & Audit
              ↓
     Unified State + Business Rules Engine
              ↓
         Portfolio Response
```

A 15-minute scheduled reconciliation trigger remains in the same workflow.

## Why one workflow

The public portfolio should communicate the whole operating system at a glance. One routed workflow makes the architecture easier to inspect in n8n while still keeping each operational domain visible as a separate branch. The single authoritative state engine prevents contradictory state across multiple workflows.

The logical data model still represents eight operational data sets:

1. Master Projects
2. Master Tasks
3. Work Sessions
4. Revisions & Rework
5. Timesheets & Approvals
6. Labor Rates
7. Approved Work Ledger
8. Activity & Automation Logs

## Functional rules preserved

- exactly one valid project per task;
- exactly one responsible worker per task;
- one ACTIVE work session per worker;
- Pause/Stop close a session;
- Resume creates a new append-only session;
- ORIGINAL and REVISION work remain separate;
- recorded time is not approved/payable time;
- timesheet approval is the authoritative ledger-posting boundary;
- ledger evidence is locked after approval;
- labor rates are effective-dated and frozen into ledger lines;
- Approved Rework Cost is a subset of Approved Labor Cost;
- overdue is derived from due date + non-terminal status;
- derived totals are recomputed from source evidence;
- idempotency, correlation IDs and audit history are preserved;
- reconciliation checks integrity and performs only safe repairs.

## Deploy Project 02 from Windows

Keep n8n and ngrok running. Keep a local environment file containing:

```dotenv
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-current-ngrok-hostname
```

The deployer:

1. loads the local env without printing the API key;
2. authenticates to the n8n Public API;
3. removes the previous ten split Project 02 workflows from n8n when present;
4. downloads the single Project 02 source JSON;
5. builds the visible routing canvas in memory;
6. creates or updates the unified workflow instead of duplicating it;
7. sends only API-compatible top-level fields (`name`, `nodes`, `connections`, `settings`);
8. attempts activation/publishing;
9. runs `health.check` on the production webhook when available.

The previous `n8n-workflows/project-02/` split workflow files have intentionally been removed from the repository.

## Project 02 webhook

Production path:

```text
/webhook/portfolio-enterprise-operations
```

Example:

```json
{
  "action": "session.start",
  "project": "monday-project-ops",
  "clientId": "browser-generated-client-id",
  "requestId": "browser-generated-request-id",
  "payload": {
    "taskId": "TSK-002",
    "worker": "John Reyes",
    "idempotencyKey": "session.start:john:tsk-002:001"
  }
}
```

Supported action families include health/state, task/project control, session lifecycle, revision/rework, escalation, timesheets, approval/ledger, rate resolution, KPI refresh, reconciliation and retry.

`ledger.post` intentionally rejects unauthorized direct cost writes. Locked ledger lines are created through `timesheet.approve`.

## Other portfolio workflows

| Portfolio project | File | Webhook path |
|---|---|---|
| Project 02 unified operations workflow | `01-enterprise-operations-workspace.json` | `/webhook/portfolio-enterprise-operations` |
| SPX OCR Automated Encoder System | `02-spx-ocr-encoder.json` | `/webhook/portfolio-spx-ocr` |
| Enterprise Zoho CRM Engineering & Migration | `03-zoho-migration-control.json` | `/webhook/portfolio-zoho-migration` |
| Google Sheets-Powered Automation Systems | `04-google-sheets-automation.json` | `/webhook/portfolio-sheets-automation` |
| Custom Operations Dashboard | `05-custom-operations-api.json` | `/webhook/portfolio-operations-api` |

## Security

- Keep `.env` and API keys local; `.env` files are git-ignored.
- Never put the n8n Public API key in browser JavaScript.
- The browser calls only the production webhook, never `/api/v1`.
- Add authentication/rate limiting before exposing the webhook beyond a controlled portfolio demo.
- Seeded records are synthetic portfolio data only.
