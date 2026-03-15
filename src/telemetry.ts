import { JSErrors, Logging, Metrics, PageViewEvent, PageViewTiming } from '@newrelic/browser-agent';
import { Agent } from '@newrelic/browser-agent/loaders/agent';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type BrowserLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
type LogAttributes = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    __APP_VERSION__?: string;
  }
}

type BrowserAgentConfig = ConstructorParameters<typeof Agent>[0];

const TELEMETRY_INIT = {
  ajax: { enabled: false },
  generic_events: { enabled: false }
} satisfies NonNullable<BrowserAgentConfig['init']>;

let agent: Agent | null | undefined;

function mapLogLevel(level: LogLevel): BrowserLogLevel {
  switch (level) {
    case 'debug':
      return 'DEBUG';
    case 'warn':
      return 'WARN';
    case 'error':
      return 'ERROR';
    default:
      return 'INFO';
  }
}

function sanitizeAttributes(attributes: LogAttributes = {}): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>;
}

function getBrowserAgentConfig(): BrowserAgentConfig | null {
  const {
    VITE_NEW_RELIC_APPLICATION_ID,
    VITE_NEW_RELIC_LICENSE_KEY,
    VITE_NEW_RELIC_AGENT_ID,
    VITE_NEW_RELIC_ACCOUNT_ID,
    VITE_NEW_RELIC_TRUST_KEY,
    VITE_NEW_RELIC_BEACON,
    VITE_NEW_RELIC_ERROR_BEACON
  } = import.meta.env;

  if (!VITE_NEW_RELIC_APPLICATION_ID || !VITE_NEW_RELIC_LICENSE_KEY) {
    return null;
  }

  return {
    exposed: false,
    init: TELEMETRY_INIT,
    info: {
      applicationID: VITE_NEW_RELIC_APPLICATION_ID,
      licenseKey: VITE_NEW_RELIC_LICENSE_KEY,
      ...(VITE_NEW_RELIC_BEACON ? { beacon: VITE_NEW_RELIC_BEACON } : {}),
      ...(VITE_NEW_RELIC_ERROR_BEACON ? { errorBeacon: VITE_NEW_RELIC_ERROR_BEACON } : {})
    },
    loader_config: {
      applicationID: VITE_NEW_RELIC_APPLICATION_ID,
      licenseKey: VITE_NEW_RELIC_LICENSE_KEY,
      ...(VITE_NEW_RELIC_ACCOUNT_ID ? { accountID: VITE_NEW_RELIC_ACCOUNT_ID } : {}),
      ...(VITE_NEW_RELIC_AGENT_ID ? { agentID: VITE_NEW_RELIC_AGENT_ID } : {}),
      ...(VITE_NEW_RELIC_TRUST_KEY ? { trustKey: VITE_NEW_RELIC_TRUST_KEY } : {})
    },
    features: [JSErrors, Logging, Metrics, PageViewEvent, PageViewTiming]
  };
}

function getAgent(): Agent | null {
  if (agent !== undefined) {
    return agent;
  }

  const config = getBrowserAgentConfig();
  agent = config ? new Agent(config) : null;
  return agent;
}

export function initTelemetry(version: string): void {
  window.__APP_VERSION__ = version;

  const browserAgent = getAgent();
  if (!browserAgent) {
    return;
  }

  browserAgent.setApplicationVersion(version);
  browserAgent.setCustomAttribute('appName', 'rogame');
  browserAgent.log('App loaded', {
    level: 'INFO',
    customAttributes: {
      eventName: 'app_loaded'
    }
  });
}

export function logInfo(message: string, attributes?: LogAttributes): void {
  getAgent()?.log(message, {
    level: mapLogLevel('info'),
    customAttributes: sanitizeAttributes(attributes)
  });
}

export function logWarn(message: string, attributes?: LogAttributes): void {
  getAgent()?.log(message, {
    level: mapLogLevel('warn'),
    customAttributes: sanitizeAttributes(attributes)
  });
}

export function logError(message: string, error?: unknown, attributes?: LogAttributes): void {
  const browserAgent = getAgent();
  if (!browserAgent) {
    return;
  }

  const customAttributes = sanitizeAttributes(attributes);
  browserAgent.log(message, {
    level: mapLogLevel('error'),
    customAttributes
  });

  if (error instanceof Error || typeof error === 'string') {
    browserAgent.noticeError(error, customAttributes);
  }
}

export function isTelemetryEnabled(): boolean {
  return getBrowserAgentConfig() !== null;
}
