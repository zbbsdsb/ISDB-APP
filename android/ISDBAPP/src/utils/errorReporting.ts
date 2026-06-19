import { LogBox, AppState, AppStateStatus } from 'react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

const MAX_LOG_ENTRIES = 100;
const logBuffer: LogEntry[] = [];
let appState: AppStateStatus = AppState.currentState;

function createLogEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata,
  };
}

function addLog(entry: LogEntry) {
  if (logBuffer.length >= MAX_LOG_ENTRIES) {
    logBuffer.shift();
  }
  logBuffer.push(entry);
}

export function logDebug(message: string, metadata?: Record<string, unknown>) {
  const entry = createLogEntry('debug', message, metadata);
  addLog(entry);
  if (__DEV__) {
    console.log(`[DEBUG] ${message}`, metadata ?? '');
  }
}

export function logInfo(message: string, metadata?: Record<string, unknown>) {
  const entry = createLogEntry('info', message, metadata);
  addLog(entry);
  if (__DEV__) {
    console.info(`[INFO] ${message}`, metadata ?? '');
  }
}

export function logWarning(message: string, metadata?: Record<string, unknown>) {
  const entry = createLogEntry('warn', message, metadata);
  addLog(entry);
  if (__DEV__) {
    console.warn(`[WARN] ${message}`, metadata ?? '');
  }
}

export function logError(error: Error | string, metadata?: Record<string, unknown>) {
  const message = typeof error === 'string' ? error : error.message;
  const stack = typeof error === 'object' ? error.stack : undefined;
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message,
    stack,
    metadata,
  };
  addLog(entry);
  if (__DEV__) {
    console.error(`[ERROR] ${message}`, stack ?? '', metadata ?? '');
  }
}

export function getRecentLogs(): LogEntry[] {
  return [...logBuffer];
}

export function clearLogs() {
  logBuffer.length = 0;
}

function setupUnhandledRejectionHandler() {
  if (typeof (globalThis as unknown as { HermesInternal: unknown }).HermesInternal !== 'undefined') {
    const originalHandler = (globalThis as unknown as { onunhandledrejection: unknown }).onunhandledrejection;
    (globalThis as unknown as { onunhandledrejection: (event: { reason: unknown }) => void }).onunhandledrejection = (event: { reason: unknown }) => {
      logError('Unhandled Promise Rejection', { reason: String(event.reason), appState });
      if (originalHandler && typeof originalHandler === 'function') {
        originalHandler.call(globalThis, event);
      }
    };
  }
}

function setupErrorHandling() {
  if (!__DEV__) {
    setupUnhandledRejectionHandler();
  }

  AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
    appState = nextAppState;
    logInfo('App state changed', { appState: nextAppState });
  });

  if (__DEV__) {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Remote debugger is in a background tab',
    ]);
  }
}

export { setupErrorHandling };
