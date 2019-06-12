/**
 * @param {Config} config
 */
function newHandler(config) {
  return function handler(req, res) {
    res.contentType('text/html').render('homepage', {
      apiUrl: config.api.url,
      resourcesRoot: config.staticResources.url,
    });
  };
}

export default newHandler;

/**
 * @typedef {import('../config').Config} Config
 */
