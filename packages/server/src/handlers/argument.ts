import {apiAuthority, resourcesRoot} from '../config';
import {Request, Response} from 'express';
import axios, { AxiosResponse } from 'axios';

const numRegex = /^[1-9]\d*$/

function handler(req: Request, res: Response): void {
  const id = req.params.id;
  if (!numRegex.test(id)) {
    res.status(404);
    res.contentType('text/plain');
    res.send(`argument with id=${req.params.id} does not exist`);
    return;
  }

  axios.get(`http://${apiAuthority}/argument/${id}`, {
    validateStatus: (status) => {
      return (status >= 200 && status < 300) || (status >= 400 && status < 500)
    }
  }).
  then(apiResponseHandler(id, res)).
  catch((err) => {
    res.status(503);
    res.send(`Failed call to arguments service: ${err}`);
  });
}

function apiResponseHandler(id: Number, uiResponse: Response) {
  return (apiResponse: AxiosResponse<any>) => {
    if (apiResponse.status >= 200 && apiResponse.status < 300) {
      uiResponse.render('argument', {
        resourcesRoot,
        apiAuthority,
        id,
        argument: apiResponse.data,
      });
    }
    else if (apiResponse.status === 404) {
      uiResponse.status(apiResponse.status);
      uiResponse.send(`Argument with id=${id} does not exist.`);
    }
    else if (apiResponse.status >= 400 && apiResponse.status < 500) {
      uiResponse.status(apiResponse.status);
      uiResponse.send(apiResponse.data);
    }
  }
}

export default handler;
