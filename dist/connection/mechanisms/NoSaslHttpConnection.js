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
var NoSaslHttpConnection = /** @class */ (function () {
    function NoSaslHttpConnection() {
    }
    NoSaslHttpConnection.prototype.connect = function (options) {
        var _a, _b, _c, _d, _e;
        var connection = thrift.createHttpConnection(options.host, options.port, __assign(__assign({ transport: thrift.TBufferedTransport, protocol: thrift.TBinaryProtocol }, options.options), { headers: __assign(__assign({}, (((_a = options.options) === null || _a === void 0 ? void 0 : _a.headers) || {})), { Authorization: this.getAuthorization(((_b = options.options) === null || _b === void 0 ? void 0 : _b.username) || 'anonymous', ((_c = options.options) === null || _c === void 0 ? void 0 : _c.password) || 'anonymous') }), nodeOptions: __assign(__assign({}, (((_d = options.options) === null || _d === void 0 ? void 0 : _d.nodeOptions) || {})), this.getNodeOptions(((_e = options) === null || _e === void 0 ? void 0 : _e.options) || {})) }));
        return Promise.resolve(new Connection_1.default(connection));
    };
    NoSaslHttpConnection.prototype.getAuthorization = function (username, password) {
        return 'Basic ' + Buffer.from(username + ":" + password).toString('base64');
    };
    NoSaslHttpConnection.prototype.getNodeOptions = function (options) {
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
    return NoSaslHttpConnection;
}());
exports.default = NoSaslHttpConnection;
//# sourceMappingURL=NoSaslHttpConnection.js.map