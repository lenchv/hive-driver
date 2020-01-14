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
        this.options = options;
    }
    PlainHttpAuthentication.prototype.authenticate = function (transport) {
        var _a, _b, _c;
        transport.setOptions('headers', __assign(__assign({}, (((_a = this.options.options) === null || _a === void 0 ? void 0 : _a.headers) || {})), { Authorization: this.getToken(((_b = this.options.options) === null || _b === void 0 ? void 0 : _b.username) || 'anonymous', ((_c = this.options.options) === null || _c === void 0 ? void 0 : _c.password) || 'anonymous') }));
        return Promise.resolve(transport);
    };
    PlainHttpAuthentication.prototype.getToken = function (username, password) {
        return 'Basic ' + Buffer.from(username + ":" + password).toString('base64');
    };
    return PlainHttpAuthentication;
}());
exports.default = PlainHttpAuthentication;
//# sourceMappingURL=PlainHttpAuthentication.js.map