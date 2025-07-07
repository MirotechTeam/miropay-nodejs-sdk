export interface IAuthenticator {
  makeSignature(...args: Array<unknown>): Promise<string> | string;
}
