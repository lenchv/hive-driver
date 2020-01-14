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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var thrift = require('thrift');
var ThriftConnection = thrift.Connection;
var TlsTransport_1 = __importDefault(require("../transports/TlsTransport"));
var TcpTransport_1 = __importDefault(require("../transports/TcpTransport"));
var TcpConnection = /** @class */ (function () {
    function TcpConnection() {
    }
    TcpConnection.prototype.connect = function (options, authProvider) {
        var _this = this;
        var _a, _b;
        var transport = ((_a = options.options) === null || _a === void 0 ? void 0 : _a.ssl) ? new TlsTransport_1.default(options.host, options.port, __assign({}, (((_b = options) === null || _b === void 0 ? void 0 : _b.options) || {})))
            : new TcpTransport_1.default(options.host, options.port);
        return authProvider.authenticate(transport).then(function (transport) {
            _this.connection = _this.createConnection(transport, options);
            return _this;
        });
    };
    TcpConnection.prototype.getConnection = function () {
        return this.connection;
    };
    TcpConnection.prototype.createConnection = function (transport, options) {
        var _a;
        var stream = transport.getTransport();
        var instance = new ThriftConnection(stream, __assign({ transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol }, (((_a = options) === null || _a === void 0 ? void 0 : _a.options) || {})));
        instance.host = options.host;
        instance.port = options.port;
        transport.emit('connect');
        return instance;
    };
    return TcpConnection;
}());
exports.default = TcpConnection;
//# sourceMappingURL=TcpConnection.js.map