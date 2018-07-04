import {apiAuthority, resourcesRoot} from '../config';
import {getArgument, Argument, FailureType} from '../api-clients/arguments';
import {Request, Response} from 'express';
import {checkSchema, validationResult} from 'express-validator/check';

const paramValidation = checkSchema({
  id: {
    in: ['params'],
    isInt: true,
  },
  version: {
    in: ['params'],
    optional: true,
    isInt: true,
  }
});

function handler(req: Request, res: Response): void {
  const id = req.params.id;
  const version = req.params.version;
  if (!validationResult(req).isEmpty()) {
    res.status(404).contentType('text/plain').send(makeErrorMessage(id, version));
    return;
  }
  getArgument(id, version).then((arg: Argument) => {
    res.contentType('text/html').render('argument', {
      resourcesRoot,
      apiAuthority,
      id,
      argument: arg,
    });
  }).catch((err) => {
    if (err === FailureType.NotFound) {
      res.status(404).contentType('text/plain').send(makeErrorMessage(id, version));
    } else {
      res.status(503).contentType('text/plain').send(`Failed fetch from arguments service.`);
    }
  });
}

function makeErrorMessage(id: any, version?: any) {
  if (version) {
    return `version ${version} of argument ${id} does not exist`
  }
  return `argument ${id} does not exist`;
}

export default [
  ...paramValidation,
  handler,
];
