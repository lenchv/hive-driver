"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var net = require('net');
var TcpTransport = /** @class */ (function () {
    function TcpTransport(host, port) {
        this.host = host;
        this.port = port;
        this.options = {};
    }
    TcpTransport.prototype.getTransport = function () {
        return this.connection;
    };
    TcpTransport.prototype.setOptions = function (option, value) {
        var _a;
        this.options = __assign(__assign({}, this.options), (_a = {}, _a[option] = value, _a));
    };
    TcpTransport.prototype.getOptions = function () {
        return this.options;
    };
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