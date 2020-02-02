import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
import { IKerberosAuthProcess } from "../contracts/IKerberosAuthProcess";
export default class KerberosTcpAuthentication implements IAuthentication {
    static AUTH_MECH: string;
    private username;
    private password;
    private authProcess;
    constructor(options: AuthOptions, authProcess: IKerberosAuthProcess);
    authenticate(transport: ITransport): Promise<ITransport>;
    private onConnect;
    private nextTransition;
}
