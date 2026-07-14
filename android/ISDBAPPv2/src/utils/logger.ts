/**
 * Centralized logger.
 *
 * In production builds (`!__DEV__`) all output is suppressed so we don't leak
 * internal state or add noise. In development it mirrors the console so the
 * DX is unchanged.
 */
type LogFn = (...args: unknown[]) => void;

const noop: LogFn = () => {};

const devLog: LogFn = (...args) => {

  console.log(...(args as unknown[]));
};
const devWarn: LogFn = (...args) => {

  console.warn(...(args as unknown[]));
};
const devError: LogFn = (...args) => {

  console.error(...(args as unknown[]));
};

const active = __DEV__;

export const logger = {
  log: active ? devLog : noop,
  warn: active ? devWarn : noop,
  error: active ? devError : noop,
  info: active ? devLog : noop,
};

export default logger;
