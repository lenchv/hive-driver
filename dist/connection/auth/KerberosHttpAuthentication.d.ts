import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { IKerberosAuthProcess } from "../contracts/IKerberosAuthProcess";
declare type HttpAuthOptions = AuthOptions & {
    headers?: object;
};
export default class KerberosHttpAuthentication implements IAuthentication {
    private username;
    private password;
    private headers;
    private authProcess;
    constructor(options: HttpAuthOptions, authProcess: IKerberosAuthProcess);
    authenticate(transport: ITransport): Promise<ITransport>;
}
export {};
