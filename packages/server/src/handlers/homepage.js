/**
 * @param {Config} config
 */
function newHandler(config) {
  const {
    api: {
      url: apiUrl,
    },
    staticResources: {
      url: resourcesRoot,
    },
  } = config;

  return function handler(req, res) {
    res.contentType('text/html').render('homepage', {
      apiUrl,
      resourcesRoot,
    });
  };
}

export default newHandler;

/**
 * @typedef {import('../config').Config} Config
 */
