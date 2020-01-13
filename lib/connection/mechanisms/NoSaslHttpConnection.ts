import IConnectionProvider from "../IConnectionProvider";
const thrift = require('thrift');

import IConnectionOptions from "../IConnectionOptions";
import Connection from "../Connection";

export default class NoSaslHttpConnection implements IConnectionProvider {
    connect(options: IConnectionOptions): Promise<Connection> {
        const connection = thrift.createHttpConnection(
            options.host,
            options.port,
            {
                transport: thrift.TBufferedTransport,
			    protocol: thrift.TBinaryProtocol,
                ...options.options,
                headers: {
                    ...(options.options?.headers || {}),
                    Authorization: this.getAuthorization(
                        options.options?.username || 'anonymous',
                        options.options?.password || 'anonymous',
                    )
                }
            }
        );

        return Promise.resolve(new Connection(connection));
    }

    private getAuthorization(username: string, password: string): string {
        return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }
}