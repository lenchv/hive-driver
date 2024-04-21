"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift = require('thrift');
const ThriftConnection = thrift.Connection;
const TlsTransport_1 = __importDefault(require("../transports/TlsTransport"));
const TcpTransport_1 = __importDefault(require("../transports/TcpTransport"));
class TcpConnection {
    connection;
    connect(options, authProvider) {
        const transport = options.options?.ssl
            ? new TlsTransport_1.default(options.host, options.port, { ...(options?.options || {}) })
            : new TcpTransport_1.default(options.host, options.port);
        return authProvider.authenticate(transport).then(transport => {
            this.connection = this.createConnection(transport, options);
            return this;
        });
    }
    getConnection() {
        return this.connection;
    }
    isConnected() {
        if (!this.connection) {
            return false;
        }
        else {
            return this.connection.connected;
        }
    }
    createConnection(transport, options) {
        const stream = transport.getTransport();
        const instance = new ThriftConnection(stream, {
            transport: thrift.TFramedTransport,
            protocol: thrift.TBinaryProtocol,
            ...(options?.options || {}),
            ...transport.getOptions()
        });
        instance.host = options.host;
        instance.port = options.port;
        transport.emit('connect');
        return instance;
    }
}
exports.default = TcpConnection;
//# sourceMappingURL=TcpConnection.js.map