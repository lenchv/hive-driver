import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import { AuthOptions } from '../types/AuthOptions';

type HttpAuthOptions = AuthOptions & {
    headers?: object
};

export default class PlainHttpAuthentication implements IAuthentication {
    private username: string;
    private password: string;
    private headers: object;

    constructor(options: HttpAuthOptions) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options?.password : 'anonymous';
        this.headers = options?.headers || {};
    }
    
    authenticate(transport: ITransport): Promise<ITransport> {
        transport.setOptions('headers', {
            ...(this.headers),
            Authorization: this.getToken(
                this.username,
                this.password,
            )
        });

        return Promise.resolve(transport);
    }

    private getToken(username: string, password: string): string {
        return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }
}