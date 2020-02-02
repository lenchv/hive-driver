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
var HttpTransport_1 = __importDefault(require("../transports/HttpTransport"));
var HttpConnection = /** @class */ (function () {
    function HttpConnection() {
    }
    HttpConnection.prototype.connect = function (options, authProvider) {
        var _this = this;
        var _a, _b;
        var httpTransport = new HttpTransport_1.default(__assign(__assign({ transport: thrift.TBufferedTransport, protocol: thrift.TBinaryProtocol }, options.options), { nodeOptions: __assign(__assign({}, (((_a = options.options) === null || _a === void 0 ? void 0 : _a.nodeOptions) || {})), this.getNodeOptions(((_b = options) === null || _b === void 0 ? void 0 : _b.options) || {})) }));
        return authProvider.authenticate(httpTransport).then(function () {
            _this.connection = thrift.createHttpConnection(options.host, options.port, httpTransport.getOptions());
            _this.addCookieHandler();
            return _this;
        });
    };
    HttpConnection.prototype.getConnection = function () {
        return this.connection;
    };
    HttpConnection.prototype.getNodeOptions = function (options) {
        var ca = options.ca, cert = options.cert, key = options.key;
        var nodeOptions = {};
        if (ca) {
            nodeOptions.ca = ca;
        }
        if (cert) {
            nodeOptions.cert = cert;
        }
        if (key) {
            nodeOptions.key = key;
        }
        return nodeOptions;
    };
    HttpConnection.prototype.addCookieHandler = function () {
        var _this = this;
        var responseCallback = this.connection.responseCallback;
        this.connection.responseCallback = function (response) {
            if (Array.isArray(response.headers['set-cookie'])) {
                var cookie = [_this.connection.nodeOptions.headers['cookie']];
                _this.connection.nodeOptions.headers['cookie'] = cookie.concat(response.headers['set-cookie']).join(';');
            }
            responseCallback.call(_this.connection, response);
        };
    };
    return HttpConnection;
}());
exports.default = HttpConnection;
//# sourceMappingURL=HttpConnection.js.map