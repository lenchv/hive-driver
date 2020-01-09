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
var Connection_1 = __importDefault(require("../Connection"));
var NoSaslTcpConnection = /** @class */ (function () {
    function NoSaslTcpConnection() {
    }
    NoSaslTcpConnection.prototype.connect = function (options) {
        var _a;
        var createConnection = ((_a = options.options) === null || _a === void 0 ? void 0 : _a.ssl) ? thrift.createSSLConnection : thrift.createConnection;
        var connection = createConnection(options.host, options.port, __assign({ transport: thrift.TBufferedTransport, protocol: thrift.TBinaryProtocol }, options.options));
        return Promise.resolve(new Connection_1.default(connection));
    };
    return NoSaslTcpConnection;
}());
exports.default = NoSaslTcpConnection;
//# sourceMappingURL=NoSaslTcpConnection.js.map