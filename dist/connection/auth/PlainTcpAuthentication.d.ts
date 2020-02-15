import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
export default class PlainTcpAuthentication implements IAuthentication {
    static AUTH_MECH: string;
    private username;
    private password;
    constructor(authOptions?: AuthOptions);
    authenticate(transport: ITransport): Promise<ITransport>;
}
