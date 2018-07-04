import {apiAuthority, resourcesRoot} from '../config';
import {Request, Response} from 'express';
import {sanitizeParam, sanitizeQuery} from 'express-validator/filter';

const paramValidation = [
  sanitizeQuery('premise').customSanitizer(toArray),
];

function handler(req: Request, res: Response): void {
  res.contentType('text/html').render('add-argument', {
    resourcesRoot,
    apiAuthority,
    conclusion: req.query.conclusion,
    premises: req.query.premise,
  });
}

export default [
  ...paramValidation,
  handler,
];

function toArray(value: any): Array<any> {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}