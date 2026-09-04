# Portfolio n8n workflow package

These workflows support the reconstructed portfolio systems. Credentials, API keys, and private tenant identifiers are never embedded in the repository.

## Project 02 — Monday.com Project Operations Control Center

`01-enterprise-operations-workspace.json` is now a self-contained n8n backend for the public Monday-style reconstruction. It does **not** connect to a real Monday.com account and does not require a Monday API token.

The workflow provides:

- task integrity validation and controlled source-field updates;
- append-only Start / Pause / Resume / Stop work-session handling;
- one active session per worker;
- original-work vs revision/rework classification;
- task and project effort rollups recomputed from session evidence;
- revision creation, resolution, and rework tracking;
- timesheet build, submit, return, reject, and approval states;
- effective-dated labor-rate resolution;
- locked Approved Work Ledger posting only through timesheet approval;
- dynamic overdue detection and escalation create/clear actions;
- dashboard/KPI recalculation from source evidence;
- idempotency keys, correlation IDs, execution IDs, and audit logs;
- manual reconciliation plus a 15-minute scheduled reconciliation trigger;
- isolated state by `clientId`, so separate portfolio visitors can use separate demo state.

The self-contained state store uses n8n workflow static data. This is suitable for a portfolio reconstruction and light demo traffic. For high-frequency or multi-instance production use, migrate the state collections to n8n Data Tables or an external transactional database.

## Deploy Project 02 from Windows

Keep n8n and ngrok running, and keep a local `.env` containing:

```dotenv
N8N_API_KEY=your_n8n_api_key
N8N_BASE_URL=https://your-current-ngrok-hostname
```

The repository includes `setup-project02-n8n.ps1`. It:

1. finds and loads the local `.env`;
2. authenticates to the n8n Public API;
3. downloads the latest Project 02 workflow from GitHub;
4. creates it if missing or updates the existing Project 02 workflow if already present;
5. reports the workflow ID and publication state;
6. tests `health.check` automatically when the workflow is already published.

The n8n Public API currently supports workflow create/update, while publishing trigger/webhook workflows is performed from the n8n editor. After the first deployment, open the workflow and click **Publish** once. Subsequent API updates to an already published workflow are re-published by n8n unless explicitly disabled.

## Project 02 webhook contract

Production path:

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

Supported Project 02 actions:

```text
health.check
state.get
state.reset

task.validate
task.sync
task.complete
task.sendReview
task.approve
project.sync

session.start
session.pause
session.resume
session.stop

revision.create
revision.update

timesheet.build
timesheet.submit
timesheet.approve
timesheet.return
timesheet.reject

rate.resolve
ledger.post

escalation.create
escalation.clear

dashboard.refresh
reconciliation.run
automation.retry
```

`ledger.post` intentionally rejects direct writes. Locked ledger lines are created only by `timesheet.approve`, preserving approval as the authoritative cost-posting boundary.

## Included workflows

| Portfolio project | File | Webhook path |
|---|---|---|
| Project 02 — Monday.com Project Operations Control Center | `01-enterprise-operations-workspace.json` | `/webhook/portfolio-enterprise-operations` |
| SPX OCR Automated Encoder System | `02-spx-ocr-encoder.json` | `/webhook/portfolio-spx-ocr` |
| Enterprise Zoho CRM Engineering & Migration | `03-zoho-migration-control.json` | `/webhook/portfolio-zoho-migration` |
| Google Sheets-Powered Automation Systems | `04-google-sheets-automation.json` | `/webhook/portfolio-sheets-automation` |
| Custom Operations Dashboard | `05-custom-operations-api.json` | `/webhook/portfolio-operations-api` |

## Security

- Keep `.env` and API keys local; `.env` files are git-ignored.
- Never put the n8n Public API key in browser JavaScript.
- The browser should call only the production webhook, never `/api/v1`.
- If the webhook is exposed beyond a controlled portfolio demo, put authentication/rate limiting in front of it.
- The seeded records are synthetic portfolio data only.
