import IConnectionProvider from "../IConnectionProvider";
const thrift = require('thrift');

import IConnectionOptions, { Options } from "../IConnectionOptions";
import Connection from "../Connection";

type NodeOptions = {
    ca?: Buffer | string,
    cert?: Buffer | string,
    key?: Buffer | string,
};

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
                },
                nodeOptions: {
                    ...(options.options?.nodeOptions || {}),
                    ...this.getNodeOptions(options?.options || {})
                }
            }
        );

        return Promise.resolve(new Connection(connection));
    }

    private getAuthorization(username: string, password: string): string {
        return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }

    private getNodeOptions(options: Options): object {
        const { ca, cert, key } = options;
        const nodeOptions: NodeOptions = {};

        if (ca) {
            nodeOptions.ca = ca;
        }
        if (cert) {
            nodeOptions.cert = cert;
        }
        if (key) {
            nodeOptions.key = key;
        }

        return nodeOptions;
    }
}