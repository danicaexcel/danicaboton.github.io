# Portfolio n8n workflow package

These workflows support the reconstructed portfolio systems. Credentials, API keys, and private tenant identifiers are never embedded in the repository.

## Project 02 — Monday.com Project Operations Control Center

Project 02 is implemented as **one central state engine plus ten visible n8n workflow families**. It does **not** connect to a real Monday.com account and does not require a Monday API token.

### Core workflow

`01-enterprise-operations-workspace.json` is the authoritative Project 02 state engine. It owns the isolated synthetic demo state, calculations, append-only work-session evidence, revisions, timesheets, effective-dated rates, locked approved ledger, KPI recomputation, audit history, idempotency, and scheduled reconciliation.

### Functional workflow families

The `project-02/` directory contains:

1. `01-task-integrity.json` — task integrity and project sync
2. `02-work-session-lifecycle.json` — Start / Pause / Resume / Stop sessions
3. `03-effort-rollup.json` — effort and remaining-hours recomputation
4. `04-revision-rework.json` — revision and rework control
5. `05-escalation-overdue.json` — escalation and dynamic overdue evaluation
6. `06-timesheet-builder.json` — timesheet build and submission
7. `07-approval-ledger.json` — approval, return/reject, and locked ledger posting
8. `08-rate-resolver.json` — effective-dated labor-rate resolution
9. `09-kpi-dashboard.json` — project/task KPI and dashboard recalculation
10. `10-reconciliation-audit.json` — reconciliation, retry, and audit retrieval

Each family exposes its own webhook and validates its domain-specific request before delegating the authoritative state mutation/calculation to the core engine. This keeps the portfolio architecture modular and visible in n8n while preserving one consistent source of truth.

The self-contained state store uses n8n workflow static data. This is suitable for a portfolio reconstruction and light demo traffic. For high-frequency or multi-instance production use, migrate the state collections to n8n Data Tables or an external transactional database.

## Deploy Project 02 from Windows

Keep n8n and ngrok running, and keep a local environment file containing:

```dotenv
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-current-ngrok-hostname
```

The repository includes `setup-project02-n8n.ps1`. It:

1. loads the local environment file;
2. authenticates to the n8n Public API;
3. downloads the core workflow and all ten family workflows from GitHub;
4. creates missing workflows and updates existing workflows by name;
5. uses a compatibility payload containing only `name`, `nodes`, `connections`, and `settings` for older/self-hosted n8n API schemas;
6. attempts to activate/publish every workflow through the n8n Public API;
7. runs a production `health.check` against the core webhook when activation succeeds.

The installer is idempotent: rerunning it updates the Project 02 package instead of creating duplicate workflows.

## Project 02 core webhook contract

Core production path:

```text
/webhook/portfolio-enterprise-operations
```

Example request:

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

The core engine supports health/state operations plus task/project validation, session lifecycle, revisions, timesheets, approvals, rate resolution, ledger posting controls, escalations, dashboard refresh, reconciliation, and retry.

`ledger.post` intentionally rejects unauthorized direct cost writes. Locked ledger lines are created through the approval boundary so approved cost remains traceable to timesheet approval.

## Included top-level workflows

| Portfolio project | File | Webhook path |
|---|---|---|
| Project 02 core state engine | `01-enterprise-operations-workspace.json` | `/webhook/portfolio-enterprise-operations` |
| SPX OCR Automated Encoder System | `02-spx-ocr-encoder.json` | `/webhook/portfolio-spx-ocr` |
| Enterprise Zoho CRM Engineering & Migration | `03-zoho-migration-control.json` | `/webhook/portfolio-zoho-migration` |
| Google Sheets-Powered Automation Systems | `04-google-sheets-automation.json` | `/webhook/portfolio-sheets-automation` |
| Custom Operations Dashboard | `05-custom-operations-api.json` | `/webhook/portfolio-operations-api` |

## Security

- Keep `.env` and API keys local; `.env` files are git-ignored.
- Never put the n8n Public API key in browser JavaScript.
- The browser should call only production webhook endpoints, never `/api/v1`.
- If the webhook is exposed beyond a controlled portfolio demo, add authentication/rate limiting in front of it.
- The seeded records are synthetic portfolio data only.
