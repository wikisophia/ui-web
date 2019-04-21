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
      res.contentType('text/html').render('new-argument', {
        resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
        apiAuthority: config.api.authority,
        conclusion: req.query.conclusion,
        premises: req.query.premise,
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
