# Portfolio n8n workflow package

These workflows are importable starter implementations for the five public portfolio systems. They expose stable webhook contracts immediately after activation; credentials and tenant-specific IDs are intentionally not embedded.

## Install

1. In n8n, choose **Import from File** and import the matching JSON.
2. Open the workflow and review the validation/normalization Code nodes.
3. Add your credentials and replace documented connector placeholders with your Monday, Google, Zoho, Supabase, OCR, or notification nodes.
4. Activate the workflow.
5. Copy its **Production webhook URL**.
6. Open the matching portfolio demo, select **Connect n8n**, paste the URL, and run **Test connection**.

## Included workflows

| Portfolio project | File | Webhook path |
|---|---|---|
| Enterprise Operations Workspace | `01-enterprise-operations-workspace.json` | `/webhook/portfolio-enterprise-operations` |
| SPX OCR Automated Encoder System | `02-spx-ocr-encoder.json` | `/webhook/portfolio-spx-ocr` |
| Enterprise Zoho CRM Engineering & Migration | `03-zoho-migration-control.json` | `/webhook/portfolio-zoho-migration` |
| Google Sheets-Powered Automation Systems | `04-google-sheets-automation.json` | `/webhook/portfolio-sheets-automation` |
| Custom Operations Dashboard | `05-custom-operations-api.json` | `/webhook/portfolio-operations-api` |

## Shared request envelope

```json
{
  "action": "request.create",
  "project": "ops-dashboard",
  "requestId": "browser-generated-uuid",
  "sentAt": "2026-09-01T00:00:00.000Z",
  "payload": {}
}
```

The workflow returns JSON containing `ok`, `executionId`, `action`, `status`, and a project-specific result. The website sends an optional shared secret through `X-Portfolio-Token`; validate it in n8n or at your reverse proxy before publishing a production endpoint.

## Production hardening

- Restrict CORS to the deployed portfolio origin.
- Validate `X-Portfolio-Token` or use an authenticated gateway.
- Store secrets only in n8n credentials or environment variables.
- Add idempotent persistence keyed by `requestId`.
- Add error workflows, retry limits, and a dead-letter/review path.
- Remove personal or client data from webhook responses.
- Replace sample output nodes with real platform connectors only after credentials are configured.

