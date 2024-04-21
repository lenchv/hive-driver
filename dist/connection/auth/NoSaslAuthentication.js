"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift = require('thrift');
class NoSaslAuthentication {
    authenticate(transport) {
        transport.connect();
        transport.setOptions('transport', thrift.TBufferedTransport);
        return Promise.resolve(transport);
    }
}
exports.default = NoSaslAuthentication;
//# sourceMappingURL=NoSaslAuthentication.js.map