export interface ParamsInterface {
  email: string;
  token: string;
}

export type ResultInterface = boolean;

export const configHandler = {
  service: 'user',
  method: 'confirmEmail',
};

export const signature = `${configHandler.service}:${configHandler.method}`;
