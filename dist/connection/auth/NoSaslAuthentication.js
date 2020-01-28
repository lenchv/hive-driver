"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var thrift = require('thrift');
var NoSaslAuthentication = /** @class */ (function () {
    function NoSaslAuthentication() {
    }
    NoSaslAuthentication.prototype.authenticate = function (transport) {
        transport.connect();
        transport.setOptions('transport', thrift.TBufferedTransport);
        return Promise.resolve(transport);
    };
    return NoSaslAuthentication;
}());
exports.default = NoSaslAuthentication;
//# sourceMappingURL=NoSaslAuthentication.js.map