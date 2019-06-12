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
      apiUrl: config.api.url,
      initialEditing: true,
      initialArgument: {
        conclusion: req.query.conclusion || '',
        premises: req.query.premise || ['', ''],
        deleted: false,
      },
      initialSeenSoFar: {},
      initialArgumentsForPremises: [null, null],
    };

    res.contentType('text/html').render('argument', {
      argument: {
        premises: ['', ''],
        conclusion: '',
      },
      componentProps: JSON.stringify(componentProps),
      resourcesRoot: config.staticResources.url,
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
