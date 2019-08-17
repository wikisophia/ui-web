const http = require('http');
const http2 = require('http2');
const moment = require('moment');
const path = require('path');

const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';

const host = logAndLoad('WKSPH_UI_SERVER_HOSTNAME', '127.0.0.1');
const port = logAndLoad('WKSPH_UI_SERVER_PORT', 4040);
const useSSL = logAndLoad('WKSPH_UI_SERVER_USE_SSL', false);
const keyPath = logAndLoad('WKSPH_UI_SERVER_KEY_PATH', path.resolve(__dirname, 'certificates', 'key.pem'));
const certPath = logAndLoad('WKSPH_UI_SERVER_CERT_PATH', path.resolve(__dirname, 'certificates', 'cert.pem'));

const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = useSSL
    ? http2.createSecureServer({ keyPath, certPath }, handler)
    : http.createServer(handler);
    server.listen(port, host, (err) => {
      if (err) {
        throw err;
      }
      log(`Server listening on ${useSSL ? 'https' : 'http'}://${host}:${port}.`);
    })
});

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

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`); // eslint-disable-line no-console
}

function timestamp() {
  return moment().format('MMMM Do YYYY, h:mm:ss a');
}