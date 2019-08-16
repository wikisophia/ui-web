import { sanitizeQuery } from 'express-validator';

const defaultTo = (value) => (input) => (typeof input === 'undefined' ? value : input);
const toArray = (value) => (Array.isArray(value) ? value : [value]);
const sanitizePremises = (premises) => toArray(defaultTo(['', ''])(premises));

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
        premise: initialPremises,
        conclusion: initialConclusion,
      },
    } = req;
    const {
      apiArguments: {
        clientUrl: apiArguments,
      },
      staticResources: {
        url: resourcesRoot,
      },
    } = config;

    const componentProps = {
      apiArguments,
      initialPremises,
      initialConclusion,
      deleted: false,
    };
    res.contentType('text/html').render('contribute-argument', {
      componentProps,
      resourcesRoot,
    });
  };
}

export default function newNewArgumentHandler(config) {
  return [
    ...newArgumentValidation,
    newHandler(config),
  ];
}
