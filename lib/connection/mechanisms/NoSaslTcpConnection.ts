import IConnectionProvider from "../IConnectionProvider";
const thrift = require('thrift');

import IConnectionOptions from "../IConnectionOptions";
import Connection from "../Connection";

export default class NoSaslTcpConnection implements IConnectionProvider {
    connect(options: IConnectionOptions): Promise<Connection> {
        const createConnection = options.options?.ssl ? thrift.createSSLConnection : thrift.createConnection;
        const connection = createConnection(
            options.host,
            options.port,
            {
                transport: thrift.TBufferedTransport,
			    protocol: thrift.TBinaryProtocol,
                ...options.options
            }
        );

        return Promise.resolve(new Connection(connection));
    }
}