import newApp from './app';
import { log } from './log';
import { load, validate } from './config';

// Load the config once on app startup. Make sure to pass this through
// the app (dependency injection) rather than importing config.js again
// so that the config values are guaranteed to be consistent.
const config = load();
if (!validate(config)) {
  process.exit(1);
}

newApp(config).listen(config.server.port, config.server.host, () => {
  log(`Server listening on port ${config.server.port}.`);
});
