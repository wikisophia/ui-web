import { Request, Response, Router } from 'express';

import argument from './handlers/argument';
import contact from './handlers/contact';
import homepage from './handlers/homepage';

export function setRoutes(router: Router): void {
  router.get('/', homepage);
  router.get('/contact', contact);
  router.get('/arguments/:id', argument);
  router.get('/arguments/:id/version/:version', argument);
}
