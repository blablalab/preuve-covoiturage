import { TripSearchInterface } from './common/interfaces/TripSearchInterface';

export interface ParamsInterface extends TripSearchInterface {}
export type ResultInterface = string;

export const handlerConfig = {
  service: 'trip',
  method: 'export',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
