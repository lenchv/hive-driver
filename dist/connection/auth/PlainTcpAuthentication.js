"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SaslPackageFactory_1 = require("./helpers/SaslPackageFactory");
const AuthenticationError_1 = __importDefault(require("../../errors/AuthenticationError"));
class PlainTcpAuthentication {
    static AUTH_MECH = 'PLAIN';
    username;
    password;
    constructor(authOptions) {
        this.username = authOptions?.username || 'anonymous';
        if (authOptions?.password === undefined) {
            this.password = 'anonymous';
        }
        else {
            this.password = authOptions?.password;
        }
    }
    authenticate(transport) {
        return new Promise((resolve, reject) => {
            const onConnect = () => {
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.START, Buffer.from(PlainTcpAuthentication.AUTH_MECH)));
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.concat([
                    Buffer.from(this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(this.username || ""),
                    Buffer.from([0]),
                    Buffer.from(this.password || ""),
                ])));
            };
            const onData = (data) => {
                const result = data[0];
                if (result === SaslPackageFactory_1.StatusCode.COMPLETE) {
                    onSuccess();
                }
                else {
                    const message = data.slice(5).toString();
                    onError(new AuthenticationError_1.default('Authentication error: ' + message));
                }
            };
            const onSuccess = () => {
                transport.removeListener('connect', onConnect);
                transport.removeListener('data', onData);
                resolve(transport);
            };
            const onError = (error) => {
                transport.end();
                reject(error);
            };
            transport.connect();
            transport.addListener('connect', onConnect);
            transport.addListener('data', onData);
            transport.addListener('error', onError);
        });
    }
}
exports.default = PlainTcpAuthentication;
//# sourceMappingURL=PlainTcpAuthentication.js.map