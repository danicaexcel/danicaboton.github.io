const raw = $json.body ?? $json;
const headers = $json.headers || {};
const action = raw.action;

if (!action) {
  return [{
    json: {
      action: '__invalid__',
      payload: {},
      requestId: String($execution.id),
      clientId: 'default-demo',
      correlationId: String($execution.id),
      normalizationError: 'action is required'
    }
  }];
}

const allowed = [
  'health.check', 'state.get', 'state.reset',
  'project.create', 'project.sync',
  'task.create', 'task.validate', 'task.sync', 'task.workQueue', 'task.reviewQueue',
  'task.complete', 'task.sendReview', 'task.approve',
  'session.start', 'session.pause', 'session.resume', 'session.stop',
  'revision.create', 'revision.update',
  'timesheet.build', 'timesheet.submit', 'timesheet.reviewQueue',
  'timesheet.approve', 'timesheet.return', 'timesheet.reject',
  'rate.resolve', 'ledger.post',
  'escalation.create', 'escalation.clear',
  'dashboard.refresh', 'reconciliation.run', 'automation.retry'
];

const isAllowed = allowed.includes(action);

return [{
  json: {
    action: isAllowed ? action : '__invalid__',
    payload: raw.payload || {},
    project: raw.project || 'monday-project-ops',
    requestId: raw.requestId || String($execution.id),
    correlationId: raw.correlationId || raw.requestId || String($execution.id),
    clientId: raw.clientId || raw.payload?.clientId || headers['x-portfolio-client'] || 'default-demo',
    normalizationError: isAllowed ? null : `Unsupported action: ${action}`,
    receivedAt: new Date().toISOString()
  }
}];
