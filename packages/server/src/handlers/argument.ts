import {apiAuthority, resourcesRoot} from '../config';
import {getArgument, Argument, FailureType} from '../api-clients/arguments';
import {Request, Response} from 'express';
import axios, { AxiosResponse } from 'axios';

const numRegex = /^[1-9]\d*$/

export default function handler(req: Request, res: Response): void {
  const id = req.params.id;
  if (!numRegex.test(id)) {
    res.status(404);
    res.contentType('text/plain');
    res.send(`argument with id=${req.params.id} does not exist`);
    return;
  }
  getArgument(id).then((arg: Argument) => {
    res.render('argument', {
      resourcesRoot,
      apiAuthority,
      id,
      argument: arg,
    });
  }).catch((err) => {
    if (err === FailureType.NotFound) {
      res.status(404);
      res.send(`Argument with id=${id} does not exist.`);
    } else {
      res.status(503);
      res.send(`Failed fetch from arguments service.`);
    }
  });
}
