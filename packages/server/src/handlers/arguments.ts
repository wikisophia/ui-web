import {apiAuthority, resourcesRoot} from '../config';
import {getByConclusion, Argument} from '../api-clients/arguments';
import {Request, Response} from 'express';
import {query, validationResult} from 'express-validator/check';

const paramValidation = [
  query('conclusion').exists().isString(),
];

function handler(req: Request, res: Response): void {
  const conclusion = req.query.conclusion;
  if (!validationResult(req).isEmpty()) {
    res.status(400).contentType('text/plain').send(`request missing required query parameter: conclusion`);
    return;
  }

  getByConclusion(conclusion).then((args: Argument[]) => {
    res.contentType('text/html').render('arguments', {
      resourcesRoot,
      apiAuthority,
      args,
      conclusion,
    });
  }).catch((err) => {
      res.status(503).send(`Failed fetch from arguments service.`);
  });
}

export default [
  ...paramValidation,
  handler,
];
