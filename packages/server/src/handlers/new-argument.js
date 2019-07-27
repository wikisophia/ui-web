import { sanitizeQuery } from 'express-validator';

const defaultTo = value => input => (typeof input === 'undefined' ? value : input);
const toArray = value => (Array.isArray(value) ? value : [value]);
const sanitizePremises = premises => toArray(defaultTo(['', ''])(premises));

const newArgumentValidation = [
  sanitizeQuery('premise').customSanitizer(sanitizePremises),
  sanitizeQuery('conclusion').customSanitizer(defaultTo('')),
];

/**
 * @param {Config} config
 */
function newHandler(config) {
  return function handler(req, res) {
    const {
      query: {
        premise: premises,
        conclusion,
      },
    } = req;
    const {
      apiArguments: {
        clientUrl: apiArgumentsUrl,
      },
      staticResources: {
        url: resourcesRoot,
      },
    } = config;

    const componentProps = {
      apiArgumentsUrl,
      resourcesRoot,
      initialEditing: true,
      initialArgument: {
        conclusion,
        premises,
        deleted: false,
      },
      initialSeenSoFar: {},
      initialArgumentsForPremises: Array(premises.length).fill(null),
    };

    res.contentType('text/html').render('argument', {
      componentProps,
    });
  };
}

export default function newNewArgumentHandler(config) {
  return [
    ...newArgumentValidation,
    newHandler(config),
  ];
}
