# Portfolio n8n workflow package

These workflows are importable starter implementations for the public portfolio systems. They expose stable webhook contracts immediately after activation; credentials and tenant-specific IDs are intentionally not embedded.

## Install in the n8n UI

1. In n8n, choose **Import from File** and import the matching JSON.
2. Open the workflow and review the validation/normalization Code nodes.
3. Add your credentials and replace documented connector placeholders with your Monday, Google, Zoho, Supabase, OCR, or notification nodes.
4. Activate the workflow.
5. Copy its **Production webhook URL**.
6. Open the matching portfolio demo, select **Connect n8n**, paste the URL, and run **Test connection**.

## Create through the n8n Public API

The JSON files intended for API creation contain only writable workflow properties. n8n's Public API rejects read-only properties such as `active`, `versionId`, `meta`, and `tags` on `POST /api/v1/workflows`.

For Project 02, the API payload can therefore be sent directly from `01-enterprise-operations-workspace.json` after loading it in PowerShell:

```powershell
$workflow = Get-Content ".\n8n-workflows\01-enterprise-operations-workspace.json" -Raw
Invoke-RestMethod `
  -Method POST `
  -Uri "$env:N8N_BASE_URL/api/v1/workflows" `
  -Headers @{ "X-N8N-API-KEY" = $env:N8N_API_KEY } `
  -ContentType "application/json" `
  -Body $workflow
```

Use the ngrok HTTPS origin as `N8N_BASE_URL` when calling a local self-hosted n8n instance through ngrok.

## Included workflows

| Portfolio project | File | Webhook path |
|---|---|---|
| Project 02 — Monday.com Project Operations Control Center | `01-enterprise-operations-workspace.json` | `/webhook/portfolio-enterprise-operations` |
| SPX OCR Automated Encoder System | `02-spx-ocr-encoder.json` | `/webhook/portfolio-spx-ocr` |
| Enterprise Zoho CRM Engineering & Migration | `03-zoho-migration-control.json` | `/webhook/portfolio-zoho-migration` |
| Google Sheets-Powered Automation Systems | `04-google-sheets-automation.json` | `/webhook/portfolio-sheets-automation` |
| Custom Operations Dashboard | `05-custom-operations-api.json` | `/webhook/portfolio-operations-api` |

## Project 02 request envelope

```json
{
  "action": "session.start",
  "project": "monday-project-ops",
  "requestId": "browser-generated-uuid",
  "sentAt": "2026-09-04T00:00:00.000Z",
  "payload": {
    "itemId": "TSK-001",
    "projectId": "PRJ-002"
  }
}
```

The Project 02 starter contract already recognizes actions for task/project validation, work-session lifecycle, revision control, timesheets, approval, effective-dated rate resolution, approved-ledger posting, escalation, dashboard refresh, reconciliation, and retry. Individual production workflow families will implement those actions against the Monday API.

The workflow returns JSON containing `ok`, `executionId`, `action`, `status`, and a project-specific result. The website sends an optional shared secret through `X-Portfolio-Token`; validate it in n8n or at your reverse proxy before publishing a production endpoint.

## Production hardening

- Restrict CORS to the deployed portfolio origin.
- Validate `X-Portfolio-Token` or use an authenticated gateway.
- Store secrets only in n8n credentials or environment variables.
- Add idempotent persistence keyed by `requestId` or the domain-specific idempotency key.
- Add error workflows, retry limits, and a dead-letter/review path.
- Remove personal or client data from webhook responses.
- Replace sample output nodes with real platform connectors only after credentials are configured.
- For Project 02, write every material cross-board action to Activity & Automation Logs with a correlation ID and n8n execution ID.

