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
var tls = require('tls');
var constants = require('constants');
var TlsConnection = /** @class */ (function () {
    function TlsConnection(host, port, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c;
        this.host = host;
        this.port = port;
        this.options = __assign({ secureProtocol: 'SSLv23_method', secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3, rejectUnauthorized: false, ca: (_a = options) === null || _a === void 0 ? void 0 : _a.ca, cert: (_b = options) === null || _b === void 0 ? void 0 : _b.cert, key: (_c = options) === null || _c === void 0 ? void 0 : _c.key }, options);
    }
    TlsConnection.prototype.getConnection = function () {
        return this.connection;
    };
    TlsConnection.prototype.connect = function () {
        this.connection = tls.connect(this.port, this.host, this.options);
        this.connection.setMaxSendFragment(65536);
        this.connection.setNoDelay(true);
    };
    ;
    TlsConnection.prototype.addListener = function (eventName, listener) {
        if (eventName === 'connect') {
            return this.connection.addListener('secureConnect', listener);
        }
        else {
            return this.connection.addListener(eventName, listener);
        }
    };
    TlsConnection.prototype.removeListener = function (eventName, listener) {
        if (eventName === 'connect') {
            return this.connection.removeListener('secureConnect', listener);
        }
        else {
            return this.connection.removeListener(eventName, listener);
        }
    };
    TlsConnection.prototype.write = function (data) {
        return this.connection.write(data);
    };
    TlsConnection.prototype.end = function () {
        return this.connection.end();
    };
    TlsConnection.prototype.emit = function (eventName) {
        if (eventName === 'connect') {
            this.connection.emit('secureConnect');
        }
        else {
            this.connection.emit(eventName);
        }
    };
    return TlsConnection;
}());
exports.default = TlsConnection;
//# sourceMappingURL=TlsConnection.js.map