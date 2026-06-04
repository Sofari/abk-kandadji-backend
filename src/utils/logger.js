// Logger ultra-simple sans dépendances
const logger = {
  info: (data, msg) => console.log(`ℹ️  ${msg || JSON.stringify(data)}`),
  warn: (data, msg) => console.warn(`⚠️  ${msg || JSON.stringify(data)}`),
  error: (data, msg) => console.error(`❌ ${msg || JSON.stringify(data)}`),
  debug: (data, msg) => console.log(`🐛 ${msg || JSON.stringify(data)}`),
};

const logRequest = (req, metadata = {}) => {
  console.log(`📍 ${req.method} ${req.path}`);
};

const logResponse = (req, statusCode, duration) => {
  console.log(`✅ ${req.method} ${req.path} - ${statusCode} (${duration}ms)`);
};

const logError = (message, error) => {
  console.error(`❌ ${message}: ${error?.message}`);
};

const logAudit = (userId, email, action, entity, id) => {
  console.log(`📋 AUDIT: ${email} ${action} ${entity}#${id}`);
};

const logAlertSent = (alertId, deadlineId, type, dest, success) => {
  console.log(`📧 ALERT #${alertId}: ${type} to ${dest} - ${success ? 'OK' : 'FAIL'}`);
};

module.exports = {
  logger,
  logRequest,
  logResponse,
  logError,
  logAudit,
  logAlertSent,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  debug: logger.debug,
};