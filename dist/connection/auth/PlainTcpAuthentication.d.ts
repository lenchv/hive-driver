import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
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
    constructor(username?: string, password?: string);
    authenticate(transport: ITransport): Promise<ITransport>;
    private createPackage;
}
