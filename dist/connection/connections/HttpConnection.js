"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift = require('thrift');
const HttpTransport_1 = __importDefault(require("../transports/HttpTransport"));
class HttpConnection {
    thrift = thrift;
    connection;
    connect(options, authProvider) {
        const httpTransport = new HttpTransport_1.default({
            transport: thrift.TBufferedTransport,
            protocol: thrift.TBinaryProtocol,
            ...options.options,
            nodeOptions: {
                ...this.getNodeOptions(options.options || {}),
                ...(options.options?.nodeOptions || {}),
            }
        });
        return authProvider.authenticate(httpTransport).then(() => {
            this.connection = this.thrift.createHttpConnection(options.host, options.port, httpTransport.getOptions());
            this.addCookieHandler();
            return this;
        });
    }
    getConnection() {
        return this.connection;
    }
    isConnected() {
        if (this.connection) {
            return true;
        }
        else {
            return false;
        }
    }
    getNodeOptions(options) {
        const { ca, cert, key, https } = options;
        const nodeOptions = {};
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
    addCookieHandler() {
        const responseCallback = this.connection.responseCallback;
        this.connection.responseCallback = (response) => {
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
exports.default = HttpConnection;
//# sourceMappingURL=HttpConnection.js.map