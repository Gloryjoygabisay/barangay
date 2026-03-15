type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogAttributes = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    __APP_VERSION__?: string;
  }
}

const ingestionKey = import.meta.env.VITE_NEW_RELIC_INGESTION_KEY;
const endpoint = import.meta.env.VITE_NEW_RELIC_LOG_ENDPOINT || 'https://log-api.newrelic.com/log/v1';
const enabled = Boolean(ingestionKey);
const sessionId = crypto.randomUUID();

function getIngestionKey(): string | null {
  return ingestionKey ?? null;
}

function serializeError(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack ?? ''
    };
  }

  return {
    errorMessage: typeof error === 'string' ? error : JSON.stringify(error)
  };
}

function postLog(level: LogLevel, message: string, attributes: LogAttributes = {}): void {
  if (!enabled) {
    return;
  }

  const apiKey = getIngestionKey();
  if (!apiKey) {
    return;
  }

  const payload = [
    {
      message,
      level,
      timestamp: Date.now(),
      appName: 'rogame',
      appVersion: window.__APP_VERSION__ ?? 'unknown',
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      sessionId,
      ...attributes
    }
  ];

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], {
      type: 'application/json'
    });

    const sent = navigator.sendBeacon(`${endpoint}?Api-Key=${encodeURIComponent(apiKey)}`, blob);
    if (sent) {
      return;
    }
  }

  void fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey
    },
    body,
    keepalive: true
  }).catch(() => {
    // Telemetry must never break gameplay.
  });
}

export function initTelemetry(version: string): void {
  window.__APP_VERSION__ = version;

  postLog('info', 'App loaded', {
    eventName: 'app_loaded'
  });

  window.addEventListener('error', (event) => {
    postLog('error', 'Unhandled browser error', {
      eventName: 'window_error',
      ...serializeError(event.error ?? event.message),
      source: event.filename ?? '',
      line: event.lineno,
      column: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    postLog('error', 'Unhandled promise rejection', {
      eventName: 'unhandled_rejection',
      ...serializeError(event.reason)
    });
  });
}

export function logInfo(message: string, attributes?: LogAttributes): void {
  postLog('info', message, attributes);
}

export function logWarn(message: string, attributes?: LogAttributes): void {
  postLog('warn', message, attributes);
}

export function logError(message: string, error?: unknown, attributes?: LogAttributes): void {
  postLog('error', message, {
    ...attributes,
    ...(error === undefined ? {} : serializeError(error))
  });
}

export function isTelemetryEnabled(): boolean {
  return enabled;
}
