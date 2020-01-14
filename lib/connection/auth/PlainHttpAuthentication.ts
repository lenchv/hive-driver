import IAuthentication from "../contracts/IAuthentication";
import ITransport from "../contracts/ITransport";
import IConnectionOptions from "../contracts/IConnectionOptions";

export default class PlainHttpAuthentication implements IAuthentication {
    private options: IConnectionOptions;
    
    constructor(options: IConnectionOptions) {
        this.options = options;
    }
    
    authenticate(transport: ITransport): Promise<ITransport> {
        transport.setOptions('headers', {
            ...(this.options.options?.headers || {}),
            Authorization: this.getToken(
                this.options.options?.username || 'anonymous',
                this.options.options?.password || 'anonymous',
            )
        });

        return Promise.resolve(transport);
    }

    private getToken(username: string, password: string): string {
        return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }
}