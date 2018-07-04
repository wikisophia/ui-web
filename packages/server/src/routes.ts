import { Request, Response, Router } from 'express';
import { param } from 'express-validator/check';

import addArgument from './handlers/add-argument';
import argument from './handlers/argument';
import argumentsByConclusion from './handlers/arguments';
import contact from './handlers/contact';
import homepage from './handlers/homepage';

export function setRoutes(router: Router): void {
  router.get('/', homepage);
  router.get('/add-arguments', addArgument);
  router.get('/arguments', argumentsByConclusion);
  router.get('/arguments/:id', argument);
  router.get('/arguments/:id/version/:version', argument);
  router.get('/contact', contact);
}
