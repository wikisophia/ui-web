import path from 'path';

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
      url: logAndLoad('WKSPH_UI_API_URL', 'http://127.0.0.1:8001'),
    }),
    staticResources: Object.freeze({
      // For prod, see: https://cdn.jsdelivr.net/npm/@wikisophia/api-client/dist
      url: logAndLoad('WKSPH_UI_STATIC_RESOURCES_URL', 'http://127.0.0.1:4041'),
    }),
    server: Object.freeze({
      host: logAndLoad('WKSPH_UI_SERVER_HOSTNAME', '127.0.0.1'),
      port: logAndLoad('WKSPH_UI_SERVER_PORT', 4040),
      useSSL: logAndLoad('WKSPH_UI_SERVER_USE_SSL', false),
      keyPath: logAndLoad('WKSPH_UI_SERVER_KEY_PATH', path.resolve(__dirname, '..', 'certificates', 'key.pem')),
      certPath: logAndLoad('WKSPH_UI_SERVER_CERT_PATH', path.resolve(__dirname, '..', 'certificates', 'cert.pem')),
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
  if (config.server.useSSL === undefined) {
    log(`WKSPH_UI_SERVER_USE_SSL must be "true" or "false". Got: "${process.env.WKSPH_UI_SERVER_USE_SSL}"`);
    return false;
  }
  return true;
}

function logAndLoad(env, theDefault) {
  const value = process.env[env] || theDefault;
  log(`${env}: ${JSON.stringify(value)}`);
  if (Number.isInteger(theDefault)) {
    return parseInt(value, 10);
  }
  if (typeof theDefault === 'boolean') {
    switch (process.env[env]) {
      case 'true':
        return true;
      case 'false':
        return false;
      case undefined:
        return theDefault;
      default:
        return undefined;
    }
  }
  return value;
}

/**
 * @typedef Config
 */
