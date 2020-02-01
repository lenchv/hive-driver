/// <reference types="node" />
import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
interface IKerberosAuthProcess {
    init(username: string, password: string, cb: Function): void;
    transition(payload: Buffer | string, cb: Function): void;
}
export default class KerberosTcpAuthentication implements IAuthentication {
    static AUTH_MECH: string;
    private username;
    private password;
    private authProcess;
    constructor(options: AuthOptions, authProcess: IKerberosAuthProcess);
    authenticate(transport: ITransport): Promise<ITransport>;
    private onConnect;
    private nextTransition;
    private thirdTransition;
}
export {};
