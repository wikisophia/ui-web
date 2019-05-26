import { sanitizeQuery } from 'express-validator/filter';

const paramValidation = [
  sanitizeQuery('premise').customSanitizer(toArray),
];

/**
 * @param {Config} config
 */
export default function newNewArgument(config) {
  return [
    ...paramValidation,
    function handler(req, res) {
      const componentProps = {
        apiAuthority: config.api.authority,
        initialArgument: {
          conclusion: req.query.conclusion,
          premises: req.query.premise,
        },
      };

      res.contentType('text/html').render('new-argument', {
        componentProps: JSON.stringify(componentProps),
        resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
      });
    },
  ];
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}
