import { check, validationResult } from 'express-validator/check';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';
import { request } from 'http';

const paramValidation = [
  check('id').isInt({ min: 1 }),
  check('version').isInt({ min: 1 }).optional(),
];

export function newHandler(config) {
  const argumentsClient = newClient({
    url: config.api.url,
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
          apiUrl: config.api.url,
          initialEditing: req.path.includes('edit'),
          initialArgument: {
            id: Number(id),
            conclusion: arg.argument.conclusion,
            premises: arg.argument.premises,
            deleted: false,
          },
          initialSeenSoFar: { [id]: true },
          initialArgumentsForPremises: arg.argument.premises.map(() => null),
        };
        res.contentType('text/html').render('argument', {
          componentProps: JSON.stringify(componentProps),
          resourcesRoot: config.staticResources.url,
          argument: arg.argument,
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
