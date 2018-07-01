import {resourcesRoot} from '../config';
import {Request, Response} from 'express';

function handler(req: Request, res: Response): void {
  res.render('contact', {
    resourcesRoot,
  });
}

export default handler;
