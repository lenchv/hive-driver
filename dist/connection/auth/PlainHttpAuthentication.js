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
        this.username = (options === null || options === void 0 ? void 0 : options.username) || 'anonymous';
        this.password = (options === null || options === void 0 ? void 0 : options.password) !== undefined ? options === null || options === void 0 ? void 0 : options.password : 'anonymous';
        this.headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
    }
    PlainHttpAuthentication.prototype.authenticate = function (transport) {
        transport.setOptions('headers', __assign(__assign({}, (this.headers)), { Authorization: this.getToken(this.username, this.password) }));
        return Promise.resolve(transport);
    };
    PlainHttpAuthentication.prototype.getToken = function (username, password) {
        return 'Basic ' + Buffer.from("".concat(username, ":").concat(password)).toString('base64');
    };
    return PlainHttpAuthentication;
}());
exports.default = PlainHttpAuthentication;
//# sourceMappingURL=PlainHttpAuthentication.js.map