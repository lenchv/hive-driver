import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';
declare type HttpAuthOptions = AuthOptions & {
    headers?: object;
};
export default class PlainHttpAuthentication implements IAuthentication {
    private username;
    private password;
    private headers;
    constructor(options: HttpAuthOptions);
    authenticate(transport: ITransport): Promise<ITransport>;
    private getToken;
}
export {};
