window.DCODE_AI_CONFIG = {
  // demo: runs entirely in the browser using representative portfolio responses.
  // live: POSTs the documented request contract to endpoint.
  mode: 'demo',
  endpoint: '',
  timeoutMs: 45000,
  requestHeaders: {
    'Content-Type': 'application/json'
  }
};

/*
LIVE N8N CONTRACT
=================
Set mode to 'live' and endpoint to a PUBLIC, PROTECTED proxy URL.
Do not place n8n API keys or other secrets in this file.

REQUEST
POST <endpoint>
{
  "sessionId": "uuid-like-browser-session",
  "mode": "design | audit | match",
  "message": "visitor request",
  "context": {
    "source": "dcode-portfolio",
    "page": "ai-architect"
  }
}

EXPECTED RESPONSE
{
  "title": "Automated recruitment intake and screening",
  "summary": "...",
  "complexity": "Moderate",
  "architecture": [
    {"name":"Candidate sources","detail":"Forms · job boards · email"},
    {"name":"n8n intake","detail":"Normalize · deduplicate · validate"},
    {"name":"AI extraction","detail":"Structured candidate profile"},
    {"name":"Zoho CRM","detail":"Applicants · logs · history"},
    {"name":"Human review","detail":"Recruiter decision"}
  ],
  "recommendations": ["..."],
  "controls": ["..."],
  "relatedProjects": [
    {"id":"recruitment","title":"Smart Recruitment Management","reason":"...","href":"case-study.html?id=recruitment"}
  ],
  "followUpQuestions": ["..."]
}
*/