import axios, { AxiosResponse } from 'axios';
import {apiAuthority} from '../config';

export function getArgument(id: number, version?: number): Promise<Argument> {
  if (version) {
    return axios.get(`http://${apiAuthority}/argument/${id}/version/${version}`, {
      validateStatus: (status) => isSuccess(status) || isBadRequest(status)
    }).
    then(handleGetResponse);
  } else {
    return axios.get(`http://${apiAuthority}/argument/${id}`, {
      validateStatus: (status) => isSuccess(status) || isBadRequest(status)
    }).
    then(handleGetResponse);
  }
}

function handleGetResponse(resp: any) {
  if (isSuccess(resp.status)) {
    return resp.data;
  }
  else if (resp.status == 404) {
    throw FailureType.NotFound;
  } else {
    throw FailureType.ServerFailure;
  }
}

export interface Argument {
  premises: string[];
  conclusion: string;
}

export enum FailureType {
  NotFound,
  ServerFailure,
}

function isSuccess(status: number) {
  return status >= 200 && status < 300;
}

function isBadRequest(status: number) {
  return status >= 400 && status < 500;
}