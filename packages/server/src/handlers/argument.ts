import {apiAuthority, resourcesRoot} from '../config';
import {Request, Response} from 'express';

const numRegex = /^[1-9]\d*$/

function handler(req: Request, res: Response): void {
  const id = req.params.id;
  if (!numRegex.test(id)) {
    res.status(404);
    res.contentType('text/plain');
    res.send(`argument with id=${req.params.id} does not exist`);
    return;
  }
  res.render('argument', {
    resourcesRoot,
    apiAuthority,
    id,
    argument: {
      conclusion: 'Socrates is mortal',
      premises: ['All men are mortal', 'Socrates is a man']
    }
  });
}

export default handler;
