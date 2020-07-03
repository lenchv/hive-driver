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
var KerberosHttpAuthentication = /** @class */ (function () {
    function KerberosHttpAuthentication(options, authProcess) {
        this.username = (options === null || options === void 0 ? void 0 : options.username) || 'anonymous';
        this.password = (options === null || options === void 0 ? void 0 : options.password) !== undefined ? options.password : 'anonymous';
        this.headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
        this.authProcess = authProcess;
    }
    KerberosHttpAuthentication.prototype.authenticate = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.authProcess.init({
                username: _this.username,
                password: _this.password,
                http: true
            }, function (error, client) {
                if (error) {
                    return reject(error);
                }
                client.step('', function (error, token) {
                    if (error) {
                        return reject(error);
                    }
                    transport.setOptions('headers', __assign(__assign({}, (_this.headers)), { Authorization: 'Negotiate : ' + token }));
                    resolve(transport);
                });
            });
        });
    };
    return KerberosHttpAuthentication;
}());
exports.default = KerberosHttpAuthentication;
//# sourceMappingURL=KerberosHttpAuthentication.js.map