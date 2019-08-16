import { check, validationResult } from 'express-validator';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';

const paramValidation = [
  check('id').isInt({ min: 1 }),
  check('version').isInt({ min: 1 }).optional(),
];

export function newHandler(config) {
  const {
    apiArguments: {
      serverUrl: url,
      clientUrl: apiArguments,
    },
    staticResources: {
      url: resourcesRoot,
    },
  } = config;

  const argumentsClient = newClient({
    url,
    fetch,
  });
  return function handler(req, res) {
    const { id, version } = req.params;
    if (!validationResult(req).isEmpty()) {
      res.status(404).contentType('text/plain').send(makeErrorMessage(id, version));
      return;
    }
    argumentsClient.getOne(id, version).then((arg) => {
      if (arg) {
        const {
          argument: {
            conclusion,
            premises,
          },
        } = arg;
        if (version) {
          res.contentType('text/html').render('view-versioned-argument', {
            id,
            premises: premises.map((premise) => ({
              text: premise,
              supported: true, // TODO: Fetch these too
            })),
            conclusion,
            resourcesRoot,
          });
        } else {
          const componentProps = {
            id,
            apiArguments,
            premises: premises.map((premise) => ({
              text: premise,
              supported: 'yes', // TODO: Fetch these too
            })),
            conclusion,
          };
          res.contentType('text/html').render('view-argument', {
            componentProps,
            resourcesRoot,
          });
        }
      } else {
        res.status(404).contentType('text/plain').send(makeErrorMessage(id, version));
      }
    }).catch((err) => {
      res.status(503).contentType('text/plain').send(`Failed fetch from API: ${err.message}`);
    });
  };
}

export default function newArgumentHandler(config) {
  return [
    ...paramValidation,
    newHandler(config),
  ];
}

function makeErrorMessage(id, version) {
  if (version) {
    return `version ${version} of argument ${id} does not exist`;
  }
  return `argument ${id} does not exist`;
}
