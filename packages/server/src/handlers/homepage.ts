import {apiAuthority, resourcesRoot} from '../config';
import {Request, Response} from 'express';

function handler(req: Request, res: Response): void {
  res.contentType('text/html').render('homepage', {
    apiAuthority,
    resourcesRoot,
  });
}

export default handler;
