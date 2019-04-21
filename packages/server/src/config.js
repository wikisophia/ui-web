import { log } from './log';

// This module handles stuff related to the application config.
// Values are loaded from environment variables.

/**
 * Load the config from environment variables.
 *
 * This function should only be called once, to make sure that the whole
 * app sees the same config values.
 */
export function load() {
  return Object.freeze({
    api: Object.freeze({
      scheme: logAndLoad('WKSPH_UI_API_SCHEME', 'http'),
      authority: logAndLoad('WKSPH_UI_API_AUTHORITY', 'localhost:8001'),
    }),
    staticResources: Object.freeze({
      scheme: logAndLoad('WKSPH_UI_STATIC_RESOURCES_SCHEME', 'http'),
      authority: logAndLoad('WKSPH_UI_STATIC_RESOURCES_AUTHORITY', 'localhost:4041'),
    }),
    server: Object.freeze({
      host: logAndLoad('WKSPH_UI_SERVER_HOSTNAME', '127.0.0.1'),
      port: logAndLoad('WKSPH_UI_SERVER_PORT', 4040),
    }),
  });
}

/**
 * Validate the config. Log messages about any invalid values.
 *
 * @param {Config} config
 * @return {boolean} True if the config is valid, and false if not.
 */
export function validate(config) {
  if (!Number.isInteger(config.server.port) || config.server.port < 1) {
    log(`WKSPH_UI_SERVER_PORT must be a positive number. Got "${process.env.WKSPH_UI_SERVER_PORT}".`);
    return false;
  }
  return true;
}

function logAndLoad(env, theDefault) {
  const value = process.env[env] || theDefault;
  log(`${env}: "${value}"`);
  if (Number.isInteger(theDefault)) {
    return parseInt(value, 10);
  }
  return value;
}

/**
 * @typedef Config
 */
