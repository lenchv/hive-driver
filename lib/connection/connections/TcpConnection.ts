const thrift = require('thrift');
const ThriftConnection = thrift.Connection;

import IConnectionOptions from "../contracts/IConnectionOptions";
import TlsTransport from "../transports/TlsTransport";
import TcpTransport from "../transports/TcpTransport";
import IAuthentication from "../contracts/IAuthentication";
import IThriftConnection from "../contracts/IThriftConnection";
import ITransport from "../contracts/ITransport";
import IConnectionProvider from "../contracts/IConnectionProvider";

export default class TcpConnection implements IConnectionProvider, IThriftConnection {
    private connection: any;
    
    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection> {
        const transport = options.options?.ssl
            ? new TlsTransport(options.host, options.port, { ...(options?.options || {}) })
            : new TcpTransport(options.host, options.port);

        return authProvider.authenticate(transport).then(transport => {
            this.connection = this.createConnection(transport, options);

            return this;
        });
    }

    getConnection() {
        return this.connection;
    }

    private createConnection(transport: ITransport, options: IConnectionOptions): any {
        const stream = transport.getTransport();
        const instance = new ThriftConnection(
            stream,
            {
                transport: thrift.TFramedTransport,
			    protocol: thrift.TBinaryProtocol,
                ...(options?.options || {}),
                ...transport.getOptions()
            }
        );

        instance.host = options.host;
        instance.port = options.port;

        transport.emit('connect');

        return instance;
    }
}
