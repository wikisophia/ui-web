import fs from 'fs';
import https from 'https';
import newApp from './app';
import { log } from './log';
import { load, validate } from './config';
import { Http2SecureServer } from 'http2';

// Load the config once on app startup. Make sure to pass this through
// the app (dependency injection) rather than importing config.js again
// so that the config values are guaranteed to be consistent.
const config = load();
if (!validate(config)) {
  process.exit(1);
}

const app = newApp(config);

if (config.server.useSSL) {
  const server = https.createServer({
    key: fs.readFileSync(config.server.keyPath),
    cert:  fs.readFileSync(config.server.certPath),
  }, app)

  server.listen(config.server.port, config.server.host, () => {
    log(`Server listening on ${config.server.host}:${config.server.port}.`);
  });
} else {
  app.listen(config.server.port, config.server.host, () => {
    log(`Server listening on ${config.server.host}:${config.server.port}.`);
  });
}
