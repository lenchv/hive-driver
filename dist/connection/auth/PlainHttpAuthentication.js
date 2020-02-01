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
var PlainHttpAuthentication = /** @class */ (function () {
    function PlainHttpAuthentication(options) {
        var _a, _b, _c, _d;
        this.username = ((_a = options) === null || _a === void 0 ? void 0 : _a.username) || 'anonymous';
        this.password = ((_b = options) === null || _b === void 0 ? void 0 : _b.password) !== undefined ? (_c = options) === null || _c === void 0 ? void 0 : _c.password : 'anonymous';
        this.headers = ((_d = options) === null || _d === void 0 ? void 0 : _d.headers) || {};
    }
    PlainHttpAuthentication.prototype.authenticate = function (transport) {
        transport.setOptions('headers', __assign(__assign({}, (this.headers)), { Authorization: this.getToken(this.username, this.password) }));
        return Promise.resolve(transport);
    };
    PlainHttpAuthentication.prototype.getToken = function (username, password) {
        return 'Basic ' + Buffer.from(username + ":" + password).toString('base64');
    };
    return PlainHttpAuthentication;
}());
exports.default = PlainHttpAuthentication;
//# sourceMappingURL=PlainHttpAuthentication.js.map