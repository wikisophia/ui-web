import newNewArgumentHandler from './handlers/new-argument';
import newArgumentHandler from './handlers/argument';
import newSearchHandler from './handlers/search-arguments';
import newHomepage from './handlers/homepage';

/**
 *
 * @param {Config} config
 * @param {*} router
 */
export function setRoutes(config, router) {
  router.get('/', newHomepage(config));
  router.get('/new-argument', newNewArgumentHandler(config));
  router.get('/arguments', newSearchHandler(config));
  const argumentHandler = newArgumentHandler(config);
  router.get('/arguments/:id', argumentHandler);
  router.get('/arguments/:id/edit', argumentHandler);
  router.get('/arguments/:id/version/:version', argumentHandler);
}

/**
 * @typedef {import('./config').Config} Config
 */
