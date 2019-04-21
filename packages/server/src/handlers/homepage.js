/**
 * @param {Config} config
 */
function newHandler(config) {
  return function handler(req, res) {
    res.contentType('text/html').render('homepage', {
      apiAuthority: config.api.authority,
      resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
    });
  };
}

export default newHandler;

/**
 * @typedef {import('../config').Config} Config
 */
