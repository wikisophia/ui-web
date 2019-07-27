/**
 * @param {Config} config
 */
function newHandler(config) {
  const {
    apiArguments: {
      clientUrl: apiArgumentsUrl,
    },
    staticResources: {
      url: resourcesRoot,
    },
  } = config;

  return function handler(req, res) {
    res.contentType('text/html').render('homepage', {
      apiArgumentsUrl,
      resourcesRoot,
    });
  };
}

export default newHandler;

/**
 * @typedef {import('../config').Config} Config
 */
