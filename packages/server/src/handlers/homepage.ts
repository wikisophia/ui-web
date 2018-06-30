import {resourcesRoot} from '../environment';
import {Request, Response} from 'express';

function handler(req: Request, res: Response): void {
  res.render('homepage', {
    resourcesRoot,
  });
}

export default handler;
