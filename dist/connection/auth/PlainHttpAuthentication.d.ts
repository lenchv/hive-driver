import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import IConnectionOptions from "../contracts/IConnectionOptions";
export default class PlainHttpAuthentication implements IAuthentication {
    private options;
    constructor(options: IConnectionOptions);
    authenticate(transport: ITransport): Promise<ITransport>;
    private getToken;
}
