import newImproveArgumentHandler from './handlers/improve-argument';
import newNewArgumentHandler from './handlers/new-argument';
import newViewArgumentHandler from './handlers/view-argument';
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
  const viewArgumentHandler = newViewArgumentHandler(config);
  router.get('/arguments/:id', viewArgumentHandler);
  router.get('/arguments/:id/version/:version', viewArgumentHandler);
  router.get('/arguments/:id/improve', newImproveArgumentHandler(config));
}

/**
 * @typedef {import('./config').Config} Config
 */
