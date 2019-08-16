import { check, validationResult } from 'express-validator';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';

const paramValidation = [
  check('id').isInt({ min: 1 }),
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
    if (!validationResult(req).isEmpty()) {
      res.status(404).contentType('text/plain').send(`argument ${id} does not exist`);
      return;
    }
    argumentsClient.getOne(id).then((arg) => {
      if (arg) {
        const componentProps = {
          apiArguments,
          id: Number(id),
          initialPremises: arg.argument.premises,
          initialConclusion: arg.argument.conclusion,
          deleted: false,
        };
        res.contentType('text/html').render('contribute-argument', {
          id,
          componentProps,
          resourcesRoot,
        });
      } else {
        res.status(404).contentType('text/plain').send(`argument ${id} does not exist`);
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
