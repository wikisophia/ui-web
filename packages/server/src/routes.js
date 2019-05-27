import { newArgumentValidation, newNewArgumentHandler } from './handlers/new-argument';
import { argumentValidation, newArgumentHandler } from './handlers/argument';
import newSearchHandler from './handlers/search-arguments';
import newContact from './handlers/contact';
import newHomepage from './handlers/homepage';

/**
 *
 * @param {Config} config
 * @param {*} router
 */
export function setRoutes(config, router) {
  router.get('/', newHomepage(config));
  router.get('/new-argument', newArgumentValidation, newNewArgumentHandler(config));
  router.get('/arguments', newSearchHandler(config));
  const argumentHandler = newArgumentHandler(config);
  router.get('/arguments/:id', argumentValidation, argumentHandler);
  router.get('/arguments/:id/version/:version', argumentValidation, argumentHandler);
  router.get('/contact', newContact(config));
}

/**
 * @typedef {import('./config').Config} Config
 */
