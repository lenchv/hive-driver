"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoSaslAuthentication = /** @class */ (function () {
    function NoSaslAuthentication() {
    }
    NoSaslAuthentication.prototype.authenticate = function (transport) {
        return Promise.resolve(transport);
    };
    return NoSaslAuthentication;
}());
exports.default = NoSaslAuthentication;
//# sourceMappingURL=NoSaslAuthentication.js.map