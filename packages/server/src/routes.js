import newNewArgument from './handlers/new-argument';
import newArgument from './handlers/argument';
import newAllArguments from './handlers/all-arguments';
import newContact from './handlers/contact';
import newHomepage from './handlers/homepage';

/**
 *
 * @param {Config} config
 * @param {*} router
 */
export function setRoutes(config, router) {
  router.get('/', newHomepage(config));
  router.get('/new-argument', newNewArgument(config));
  router.get('/arguments', newAllArguments(config));
  const argumentHandler = newArgument(config);
  router.get('/arguments/:id', argumentHandler);
  router.get('/arguments/:id/version/:version', argumentHandler);
  router.get('/contact', newContact(config));
}

/**
 * @typedef {import('./config').Config} Config
 */
