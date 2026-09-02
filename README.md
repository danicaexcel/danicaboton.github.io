# DCode Portfolio Rebuild V12

This revision corrects the presentation issues identified in V11.

## V12 changes

- Removed the oversized black/glowing surround from portfolio demo frames.
- Reworked the laptop presentation into a restrained silver frame with a thin screen bezel and no glow.
- Changed standalone demo pages to a neutral light portfolio shell; product reconstructions keep their own native visual language.
- Rebuilt the shared n8n workflow reconstruction around the current n8n 2.x editor structure:
  - full left navigation with Overview / Personal / Chat and lower Admin Panel / Templates / Insights / Help areas
  - breadcrumb-style workflow header
  - centered Editor / Executions / Evaluations switcher
  - Publish / history / more controls at the upper right
  - dotted dark workflow canvas
  - compact app nodes with labels below the node tile
  - right-side canvas tools
  - lower-left zoom/canvas controls
  - centered Execute workflow control
  - click a node to inspect synthetic input, parameters, and output
- The n8n workflow content remains a portfolio reconstruction using synthetic data. It represents the actual project logic without claiming access to former production instances.
- DEE remains marked as an ongoing private R&D project rather than a finished public demo.

## Main files

- `index.html` — portfolio homepage
- `case-study.html` — case-study view
- `demo.html` — interactive demo shell
- `data.js` — project/case-study content
- `demos.js` — interactive demo logic and n8n reconstructions
- `recruitment-v5.js` — Zoho CRM recruitment reconstruction
- `styles.css` — portfolio and reconstructed-platform styling

All client-identifying business records in reconstructed screens are replaced with synthetic data.
