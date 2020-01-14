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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var thrift = require('thrift');
var ThriftConnection = thrift.Connection;
var TcpConnection_1 = __importDefault(require("../TcpConnection"));
var AuthHelper_1 = __importStar(require("../utils/AuthHelper"));
var Connection_1 = __importDefault(require("../Connection"));
var TlsConnection_1 = __importDefault(require("../TlsConnection"));
var PlainTcpConnection = /** @class */ (function () {
    function PlainTcpConnection() {
    }
    PlainTcpConnection.prototype.connect = function (options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var connection = ((_a = options.options) === null || _a === void 0 ? void 0 : _a.ssl) ? new TlsConnection_1.default(options.host, options.port, __assign({}, (((_b = options) === null || _b === void 0 ? void 0 : _b.options) || {})))
            : new TcpConnection_1.default(options.host, options.port);
        var username = ((_d = (_c = options) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.username) || 'anonymous';
        var password = ((_f = (_e = options) === null || _e === void 0 ? void 0 : _e.options) === null || _f === void 0 ? void 0 : _f.password) || 'anonymous';
        return this.authenticate(connection, username, password).then(function (connection) {
            return _this.createThriftConnection(connection, options);
        });
    };
    PlainTcpConnection.prototype.authenticate = function (connection, username, password) {
        return new Promise(function (resolve, reject) {
            var onConnect = function () {
                connection.write(AuthHelper_1.default.createPackage(AuthHelper_1.StatusCode.START, Buffer.from(PlainTcpConnection.AUTH_MECH)));
                connection.write(AuthHelper_1.default.createPackage(AuthHelper_1.StatusCode.OK, Buffer.concat([
                    new Buffer(username || ""),
                    Buffer.from([0]),
                    new Buffer(username || ""),
                    Buffer.from([0]),
                    new Buffer(password || ""),
                ])));
            };
            var onData = function (data) {
                var result = data[0];
                if (result === AuthHelper_1.StatusCode.COMPLETE) {
                    onSuccess();
                }
                else {
                    var message = data.slice(5).toString();
                    onError(new Error('Authentication error: ' + message));
                }
            };
            var onSuccess = function () {
                connection.removeListener('connect', onConnect);
                connection.removeListener('data', onData);
                resolve(connection);
            };
            var onError = function (error) {
                connection.end();
                reject(error);
            };
            connection.connect();
            connection.addListener('connect', onConnect);
            connection.addListener('data', onData);
            connection.addListener('error', onError);
        });
    };
    PlainTcpConnection.prototype.createThriftConnection = function (connection, options) {
        var _a;
        var stream = connection.getConnection();
        var instance = new ThriftConnection(stream, __assign({ transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol }, (((_a = options) === null || _a === void 0 ? void 0 : _a.options) || {})));
        instance.host = options.host;
        instance.port = options.port;
        connection.emit('connect');
        return new Connection_1.default(instance);
    };
    PlainTcpConnection.AUTH_MECH = 'PLAIN';
    return PlainTcpConnection;
}());
exports.default = PlainTcpConnection;
//# sourceMappingURL=PlainTcpConnection.js.map