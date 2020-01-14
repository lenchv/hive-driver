"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require('net');
var TcpTransport = /** @class */ (function () {
    function TcpTransport(host, port) {
        this.host = host;
        this.port = port;
    }
    TcpTransport.prototype.getTransport = function () {
        return this.connection;
    };
    TcpTransport.prototype.setOptions = function () { };
    TcpTransport.prototype.connect = function () {
        this.connection = net.createConnection(this.port, this.host);
    };
    ;
    TcpTransport.prototype.addListener = function (eventName, listener) {
        return this.connection.addListener(eventName, listener);
    };
    TcpTransport.prototype.removeListener = function (eventName, listener) {
        return this.connection.removeListener(eventName, listener);
    };
    TcpTransport.prototype.write = function (data) {
        return this.connection.write(data);
    };
    TcpTransport.prototype.end = function () {
        return this.connection.end();
    };
    TcpTransport.prototype.emit = function (eventName) {
        this.connection.emit(eventName);
    };
    return TcpTransport;
}());
exports.default = TcpTransport;
//# sourceMappingURL=TcpTransport.js.map