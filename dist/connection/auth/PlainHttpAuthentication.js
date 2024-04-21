"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlainHttpAuthentication {
    username;
    password;
    headers;
    constructor(options) {
        this.username = options?.username || 'anonymous';
        this.password = options?.password !== undefined ? options?.password : 'anonymous';
        this.headers = options?.headers || {};
    }
    authenticate(transport) {
        transport.setOptions('headers', {
            ...(this.headers),
            Authorization: this.getToken(this.username, this.password)
        });
        return Promise.resolve(transport);
    }
    getToken(username, password) {
        return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }
}
exports.default = PlainHttpAuthentication;
//# sourceMappingURL=PlainHttpAuthentication.js.map