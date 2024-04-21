"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SaslPackageFactory_1 = require("./helpers/SaslPackageFactory");
const AuthenticationError_1 = __importDefault(require("../../errors/AuthenticationError"));
class KerberosTcpAuthentication {
    static AUTH_MECH = 'GSSAPI';
    username;
    password;
    authProcess;
    constructor(options, authProcess) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options.password : 'anonymous';
        this.authProcess = authProcess;
    }
    authenticate(transport) {
        return new Promise((resolve, reject) => {
            this.authProcess.init({
                password: this.password,
                username: this.username,
            }, (error, client) => {
                if (error) {
                    return reject(error);
                }
                const onError = (err) => {
                    transport.end();
                    reject(err);
                };
                const onSuccess = () => {
                    transport.removeListener('connect', onConnect);
                    transport.removeListener('data', onData);
                    resolve(transport);
                };
                const onConnect = () => {
                    this.onConnect(transport).catch(onError);
                };
                const onData = (data) => {
                    const status = data[0];
                    if (status === SaslPackageFactory_1.StatusCode.OK) {
                        this.nextTransition(transport, data).catch(onError);
                    }
                    else if (status === SaslPackageFactory_1.StatusCode.COMPLETE) {
                        onSuccess();
                    }
                    else {
                        const message = data.slice(5).toString();
                        onError(new AuthenticationError_1.default('Authentication error: ' + message));
                    }
                };
                transport.connect();
                transport.addListener('connect', onConnect);
                transport.addListener('data', onData);
                transport.addListener('error', onError);
            });
        });
    }
    onConnect(transport) {
        return new Promise((resolve, reject) => {
            transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.START, Buffer.from(KerberosTcpAuthentication.AUTH_MECH)));
            this.authProcess.transition('', (err, token) => {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(token || '', 'base64')));
                resolve();
            });
        });
    }
    nextTransition(transport, data) {
        return new Promise((resolve, reject) => {
            const payload = data.slice(5).toString('base64');
            this.authProcess.transition(payload, (err, response) => {
                if (err) {
                    return reject(err);
                }
                transport.write(SaslPackageFactory_1.SaslPackageFactory.create(SaslPackageFactory_1.StatusCode.OK, Buffer.from(response || '', 'base64')));
                resolve();
            });
        });
    }
}
exports.default = KerberosTcpAuthentication;
//# sourceMappingURL=KerberosTcpAuthentication.js.map