import IAuthProvider from './auth/IAuthProvider';

interface IConnectionOptions {
    host: string,
    port: number,
    username: string,
    password: string
}

export default class HiveClient {
    private authProvider: IAuthProvider;

    constructor(authProvider: IAuthProvider) {
        this.authProvider = authProvider;
    }

    connect(options: IConnectionOptions): HiveClient {
        const host = options.host;
        const port = options.port;

        return this;
    }
}