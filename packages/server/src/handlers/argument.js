import { checkSchema, validationResult } from 'express-validator/check';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';

const paramValidation = checkSchema({
  id: {
    in: ['params'],
    isInt: true,
  },
  version: {
    in: ['params'],
    optional: true,
    isInt: true,
  },
});

function newHandler(config) {
  const argumentsClient = newClient({
    url: `${config.api.scheme}://${config.api.authority}`,
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
          apiAuthority: config.api.authority,
          initialArgument: {
            id,
            conclusion: arg.argument.conclusion,
            premises: arg.argument.premises,
          }
        };
        res.contentType('text/html').render('argument', {
          componentProps: JSON.stringify(componentProps),
          resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
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

function makeErrorMessage(id, version) {
  if (version) {
    return `version ${version} of argument ${id} does not exist`;
  }
  return `argument ${id} does not exist`;
}

export default function newArgument(config) {
  return [
    ...paramValidation,
    newHandler(config),
  ];
}
