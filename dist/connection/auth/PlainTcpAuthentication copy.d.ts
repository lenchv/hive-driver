import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
export declare enum StatusCode {
    START = 1,
    OK = 2,
    BAD = 3,
    ERROR = 4,
    COMPLETE = 5
}
export default class PlainTcpAuthentication implements IAuthentication {
    static AUTH_MECH: string;
    private username;
    private password;
    constructor(authOptions?: AuthOptions);
    authenticate(transport: ITransport): Promise<ITransport>;
    private createPackage;
}
