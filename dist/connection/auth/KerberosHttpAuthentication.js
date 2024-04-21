"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KerberosHttpAuthentication {
    username;
    password;
    headers;
    authProcess;
    constructor(options, authProcess) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options.password : 'anonymous';
        this.headers = options?.headers || {};
        this.authProcess = authProcess;
    }
    authenticate(transport) {
        return new Promise((resolve, reject) => {
            this.authProcess.init({
                username: this.username,
                password: this.password,
                http: true
            }, (error, client) => {
                if (error) {
                    return reject(error);
                }
                client.step('', (error, token) => {
                    if (error) {
                        return reject(error);
                    }
                    transport.setOptions('headers', {
                        ...(this.headers),
                        Authorization: 'Negotiate : ' + token
                    });
                    resolve(transport);
                });
            });
        });
    }
}
exports.default = KerberosHttpAuthentication;
//# sourceMappingURL=KerberosHttpAuthentication.js.map