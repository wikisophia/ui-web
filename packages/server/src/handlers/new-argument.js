import { sanitizeQuery } from 'express-validator/filter';

const newArgumentValidation = [
  sanitizeQuery('premise').customSanitizer(toArray),
];

/**
 * @param {Config} config
 */
function newHandler(config) {
  return function handler(req, res) {
    const componentProps = {
      apiAuthority: config.api.authority,
      initialEditing: true,
      initialArgument: {
        conclusion: req.query.conclusion || '',
        premises: req.query.premise || [],
        deleted: false,
      },
    };

    res.contentType('text/html').render('new-argument', {
      componentProps: JSON.stringify(componentProps),
      resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
    });
  };
}

export default function newNewArgumentHandler(config) {
  return [
    ...newArgumentValidation,
    newHandler(config),
  ];
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}
