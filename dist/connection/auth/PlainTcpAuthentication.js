"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SaslPackageFactory_1 = require("./helpers/SaslPackageFactory");
var AuthenticationError_1 = __importDefault(require("../../errors/AuthenticationError"));
var PlainTcpAuthentication = /** @class */ (function () {
    function PlainTcpAuthentication(authOptions) {
        var _a, _b, _c;
        this.username = ((_a = authOptions) === null || _a === void 0 ? void 0 : _a.username) || 'anonymous';
        if (((_b = authOptions) === null || _b === void 0 ? void 0 : _b.password) === undefined) {
            this.password = 'anonymous';
        }
        else {
            this.password = (_c = authOptions) === null || _c === void 0 ? void 0 : _c.password;
        }
    }
    PlainTcpAuthentication.prototype.authenticate = function (transport) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var onConnect = function () {
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.START, Buffer.from(PlainTcpAuthentication.AUTH_MECH)));
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.concat([
                    Buffer.from(_this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(_this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(_this.password || ""),
                ])));
            };
            var onData = function (data) {
                var result = data[0];
                if (result === SaslPackageFactory_1.StatusCode.COMPLETE) {
                    onSuccess();
                }
                else {
                    var message = data.slice(5).toString();
                    onError(new AuthenticationError_1.default('Authentication error: ' + message));
                }
            };
            var onSuccess = function () {
                transport.removeListener('connect', onConnect);
                transport.removeListener('data', onData);
                resolve(transport);
            };
            var onError = function (error) {
                transport.end();
                reject(error);
            };
            transport.connect();
            transport.addListener('connect', onConnect);
            transport.addListener('data', onData);
            transport.addListener('error', onError);
        });
    };
    PlainTcpAuthentication.AUTH_MECH = 'PLAIN';
    return PlainTcpAuthentication;
}());
exports.default = PlainTcpAuthentication;
//# sourceMappingURL=PlainTcpAuthentication.js.map