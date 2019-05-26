import { query, validationResult } from 'express-validator/check';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';

const paramValidation = [
  query('conclusion').exists().isString(),
];

function newHandler(config) {
  const argumentsClient = newClient({
    url: `${config.api.scheme}://${config.api.authority}`,
    fetch,
  });

  return function handler(req, res) {
    const { conclusion } = req.query;
    if (!validationResult(req).isEmpty()) {
      res.status(400).contentType('text/plain').send('request missing required query parameter: conclusion');
      return;
    }
    argumentsClient.getAll(conclusion).then((args) => {
      if (args.arguments.length > 1) {
        res.contentType('text/html').render('all-arguments', {
          resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
          apiAuthority: config.api.authority,
          args: args.arguments,
          conclusion,
        });
      } else if (args.arguments.length === 1) {
        res.contentType('text/html').render('argument', {
          resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
          apiAuthority: config.api.authority,
          id: args.arguments[0].id,
          argument: args.arguments[0],
        });
      } else {
        const componentProps = {
          apiAuthority: config.api.authority,
          initialArgument: {
            conclusion,
            premises: [],
          },
        };

        res.contentType('text/html').render('new-argument', {
          componentProps: JSON.stringify(componentProps),
          fromSearch: true,
          resourcesRoot: `${config.staticResources.scheme}://${config.staticResources.authority}`,
        });
      }
    }).catch((err) => {
      res.status(503).contentType('text/plain').send(`Failed fetch from arguments service: ${err.message}`);
    });
  };
}

export default function newAllArguments(config) {
  return [
    ...paramValidation,
    newHandler(config),
  ];
}
