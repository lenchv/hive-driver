const thrift = require('thrift');

import IThriftConnection from "../contracts/IThriftConnection";
import IConnectionProvider from "../contracts/IConnectionProvider";
import IConnectionOptions, { Options } from "../contracts/IConnectionOptions";
import IAuthentication from "../contracts/IAuthentication";
import HttpTransport from "../transports/HttpTransport";

type NodeOptions = {
    ca?: Buffer | string,
    cert?: Buffer | string,
    key?: Buffer | string,
};

export default class HttpConnection implements IConnectionProvider, IThriftConnection {
    private connection: any;

    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection> {
        const httpTransport = new HttpTransport({
            transport: thrift.TBufferedTransport,
            protocol: thrift.TBinaryProtocol,
            ...options.options,
            nodeOptions: {
                ...(options.options?.nodeOptions || {}),
                ...this.getNodeOptions(options?.options || {})
            }
        })

        return authProvider.authenticate(httpTransport).then(() => {
            this.connection = thrift.createHttpConnection(
                options.host,
                options.port,
                httpTransport.getOptions(),
            );

            return this;
        });
    }

    getConnection() {
        return this.connection;
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