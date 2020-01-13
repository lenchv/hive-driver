import IConnectionProvider from "../IConnectionProvider";
const thrift = require('thrift');
const ThriftConnection = thrift.Connection; 

import IConnectionOptions from "../IConnectionOptions";
import TcpConnection from "../TcpConnection";
import IConnection from "../IConnection";
import AuthHelper, { StatusCode } from "../utils/AuthHelper";
import Connection from "../Connection";

export default class PlainTcpConnection implements IConnectionProvider {
    static AUTH_MECH: string = 'PLAIN';

    connect(options: IConnectionOptions): Promise<IConnection> {
        // const createConnection = options.options?.ssl ? thrift.createSSLConnection : thrift.createConnection;
        const connection = new TcpConnection(options.host, options.port);
        const username = options?.options?.username || 'anonymous';
        const password = options?.options?.password || 'anonymous';

        return this.authenticate(connection, username, password).then((connection) => {
            return this.createThriftConnection(
                connection,
                options
            );
        });
    }

    private authenticate(connection: IConnection, username: string, password: string): Promise<IConnection> {
        return new Promise((resolve, reject) => {
            const onConnect = () => {
                connection.write(AuthHelper.createPackage(StatusCode.START, Buffer.from(PlainTcpConnection.AUTH_MECH)));
                connection.write(AuthHelper.createPackage(StatusCode.OK, Buffer.concat([
                    new Buffer(username || ""),
                    Buffer.from([0]),
                    new Buffer(username || ""),
                    Buffer.from([0]),
                    new Buffer(password || ""),
                ])));
            };
            const onData = (data: Buffer) => {
                const result = data[0];

                if (result === StatusCode.COMPLETE) {
                    onSuccess();
                } else {
                    const message = data.slice(5).toString();
    
                    onError(new Error('Authentication error: ' + message));
                }
            };
            const onSuccess = () => {
                connection.removeListener('connect', onConnect);
                connection.removeListener('data', onData);

                resolve(connection);
            };
            const onError = (error: Error) => {
                connection.end();

                reject(error);
            };

            connection.connect();

            connection.addListener('connect', onConnect);
            connection.addListener('data', onData);    
            connection.addListener('error', onError);
        });
    }

    private createThriftConnection(connection: IConnection, options: IConnectionOptions): IConnection {
        const stream = connection.getConnection();
        const instance = new ThriftConnection(
            stream,
            {
                transport: thrift.TFramedTransport,
			    protocol: thrift.TBinaryProtocol,
                ...(options?.options || {})
            }
        );

        instance.host = options.host;
        instance.port = options.port;

        stream.emit('connect');

        return new Connection(instance);
    }
}
