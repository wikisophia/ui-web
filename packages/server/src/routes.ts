import { Request, Response, Router } from 'express';
import { param } from 'express-validator/check';

import newArgument from './handlers/new-argument';
import argument from './handlers/argument';
import allArguments from './handlers/all-arguments';
import contact from './handlers/contact';
import homepage from './handlers/homepage';
import bestArgument from './handlers/best-argument';

export function setRoutes(router: Router): void {
  router.get('/', homepage);
  router.get('/new-argument', newArgument);
  router.get('/argument', bestArgument);
  router.get('/arguments', allArguments);
  router.get('/arguments/:id', argument);
  router.get('/arguments/:id/version/:version', argument);
  router.get('/contact', contact);
}
