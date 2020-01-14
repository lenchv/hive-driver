"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require('net');
var TcpConnection = /** @class */ (function () {
    function TcpConnection(host, port) {
        this.host = host;
        this.port = port;
    }
    TcpConnection.prototype.getConnection = function () {
        return this.connection;
    };
    TcpConnection.prototype.connect = function () {
        this.connection = net.createConnection(this.port, this.host);
    };
    ;
    TcpConnection.prototype.addListener = function (eventName, listener) {
        return this.connection.addListener(eventName, listener);
    };
    TcpConnection.prototype.removeListener = function (eventName, listener) {
        return this.connection.removeListener(eventName, listener);
    };
    TcpConnection.prototype.write = function (data) {
        return this.connection.write(data);
    };
    TcpConnection.prototype.end = function () {
        return this.connection.end();
    };
    TcpConnection.prototype.emit = function (eventName) {
        this.connection.emit(eventName);
    };
    return TcpConnection;
}());
exports.default = TcpConnection;
//# sourceMappingURL=TcpConnection.js.map