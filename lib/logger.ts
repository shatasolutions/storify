type LogFields = Record<string, unknown>;

function sanitize(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;
  const out: LogFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (/secret|password|token|key|authorization/i.test(k)) {
      out[k] = "[redacted]";
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function logInfo(message: string, fields?: LogFields) {
  console.info(JSON.stringify({ level: "info", message, ...sanitize(fields) }));
}

export function logError(message: string, fields?: LogFields) {
  console.error(JSON.stringify({ level: "error", message, ...sanitize(fields) }));
}

export function logWarn(message: string, fields?: LogFields) {
  console.warn(JSON.stringify({ level: "warn", message, ...sanitize(fields) }));
}
