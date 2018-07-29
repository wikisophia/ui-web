import axios, { AxiosResponse } from 'axios';
import {apiAuthority} from '../config';

export function getArgument(id: number, version?: number): Promise<Argument> {
  if (version) {
    return axios.get(`http://${apiAuthority}/arguments/${id}/version/${version}`, axiosStatuses).then(handleGetResponse);
  } else {
    return axios.get(`http://${apiAuthority}/arguments/${id}`, axiosStatuses).then(handleGetResponse);
  }
}

export function getByConclusion(conclusion: string): Promise<ArgumentFromConclusion[]> {
  return axios.get(`http://${apiAuthority}/arguments?conclusion=${conclusion}`, axiosStatuses).then(handleGetResponse);
}

export function getBestArgument(conclusion: string): Promise<ArgumentFromConclusion> {
  return axios.get(`http://${apiAuthority}/best-argument?conclusion=${conclusion}`, axiosStatuses).then(handleGetResponse);
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

export interface ArgumentFromConclusion extends Argument {
  id: number;
}

export enum FailureType {
  NotFound,
  ServerFailure,
}

const axiosStatuses = {
  validateStatus: (status: number) => isSuccess(status) || isBadRequest(status)
};

function isSuccess(status: number) {
  return status >= 200 && status < 300;
}

function isBadRequest(status: number) {
  return status >= 400 && status < 500;
}