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
    const { id } = req.params;
    const { version } = req.params;
    if (!validationResult(req).isEmpty()) {
      res.status(404).contentType('text/plain').send(makeErrorMessage(id, version));
      return;
    }
    argumentsClient.getOne(id, version).then((arg) => {
      if (arg) {
        const componentProps = {
          id: Number(id),
          version: arg.argument.version ? Number(arg.argument.version) : undefined,
          apiArguments,
          premises: arg.argument.premises.map(premise => ({
            text: premise,
            supported: 'unknown', // TODO: Fetch these too
          })),
          conclusion: arg.argument.conclusion,
        };
        res.contentType('text/html').render('argument', {
          componentProps,
          initialEditing: req.path.includes('edit'),
          resourcesRoot,
        });
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
