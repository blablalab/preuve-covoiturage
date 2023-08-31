import { RPCException } from './RPCException';

export class ParseErrorException extends RPCException {
  constructor(data?: any) {
    super('Parse error');
    this.nolog = true;
    this.rpcError = {
      data,
      code: -32700,
      message: this.message,
    };
  }
}
