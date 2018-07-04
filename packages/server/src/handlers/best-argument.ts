import {apiAuthority, resourcesRoot} from '../config';
import {getBestArgument, ArgumentWithId, FailureType} from '../api-clients/arguments';
import {Request, Response} from 'express';
import {validationResult, query} from 'express-validator/check';

const paramValidation = [
  query('conclusion').exists().isString(),
];

function handler(req: Request, res: Response): void {
  const conclusion = req.query.conclusion;
  if (!validationResult(req).isEmpty()) {
    res.status(400).contentType('text/plain').send(`request missing required query parameter: conclusion`);
    return;
  }

  getBestArgument(conclusion).then((bestArgument: ArgumentWithId) => {
    res.contentType('text/html').render('argument', {
      resourcesRoot,
      apiAuthority,
      id: bestArgument.id,
      argument: bestArgument,
    });
  }).catch((reason) => {
    if (reason === FailureType.NotFound) {
      res.contentType('text/html').render('add-argument', {
        fromSearch: true,
        resourcesRoot,
        apiAuthority,
        conclusion: conclusion,
      });
    } else {
      res.status(503).contentType('text/plain').send(`Failed fetch from arguments service.`);
    }
  });
}

export default [
  ...paramValidation,
  handler,
];

