const thrift = require('thrift');

import IThriftConnection from "../contracts/IThriftConnection";
import IConnectionProvider from "../contracts/IConnectionProvider";
import IConnectionOptions, { Options } from "../contracts/IConnectionOptions";
import IAuthentication from "../contracts/IAuthentication";
import HttpTransport from "../transports/HttpTransport";
import { IncomingMessage } from "http";

type NodeOptions = {
    ca?: Buffer | string,
    cert?: Buffer | string,
    key?: Buffer | string,
    rejectUnauthorized?: boolean
};

export default class HttpConnection implements IConnectionProvider, IThriftConnection {
    private thrift: any = thrift;
    private connection: any;

    connect(options: IConnectionOptions, authProvider: IAuthentication): Promise<IThriftConnection> {
        const httpTransport = new HttpTransport({
            transport: thrift.TBufferedTransport,
            protocol: thrift.TBinaryProtocol,
            ...options.options,
            nodeOptions: {
                ...this.getNodeOptions(options.options || {}),
                ...(options.options?.nodeOptions || {}),
            }
        })

        return authProvider.authenticate(httpTransport).then(() => {
            this.connection = this.thrift.createHttpConnection(
                options.host,
                options.port,
                httpTransport.getOptions(),
            );

            this.addCookieHandler();

            return this;
        });
    }

    getConnection() {
        return this.connection;
	}
	
	isConnected(): boolean {
		if (this.connection) {
			return true;
		} else {
			return false;
		}
	}

    private getNodeOptions(options: Options): object {
        const { ca, cert, key, https } = options;
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

        if (https) {
            nodeOptions.rejectUnauthorized = false;
        }

        return nodeOptions;
    }

    private addCookieHandler() {
        const responseCallback = this.connection.responseCallback;

        this.connection.responseCallback = (response: IncomingMessage) => {
            if (Array.isArray(response.headers['set-cookie'])) {
                let cookie = [this.connection.nodeOptions.headers['cookie']];

                this.connection.nodeOptions.headers['cookie'] = cookie.concat(response.headers['set-cookie'])
                    .filter(Boolean)
                    .join(';');
            }

            responseCallback.call(this.connection, response);
        };
    }
}