"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaslPackageFactory = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["START"] = 1] = "START";
    StatusCode[StatusCode["OK"] = 2] = "OK";
    StatusCode[StatusCode["BAD"] = 3] = "BAD";
    StatusCode[StatusCode["ERROR"] = 4] = "ERROR";
    StatusCode[StatusCode["COMPLETE"] = 5] = "COMPLETE";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
;
class SaslPackageFactory {
    static create(status, body) {
        const bodyLength = Buffer.alloc(4);
        bodyLength.writeUInt32BE(body.length, 0);
        return Buffer.concat([Buffer.from([status]), bodyLength, body]);
    }
}
exports.SaslPackageFactory = SaslPackageFactory;
//# sourceMappingURL=SaslPackageFactory.js.map