"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["START"] = 1] = "START";
    StatusCode[StatusCode["OK"] = 2] = "OK";
    StatusCode[StatusCode["BAD"] = 3] = "BAD";
    StatusCode[StatusCode["ERROR"] = 4] = "ERROR";
    StatusCode[StatusCode["COMPLETE"] = 5] = "COMPLETE";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
;
var AuthHelper = /** @class */ (function () {
    function AuthHelper() {
    }
    AuthHelper.createPackage = function (status, body) {
        var bodyLength = new Buffer(4);
        bodyLength.writeUInt32BE(body.length, 0);
        return Buffer.concat([new Buffer([status]), bodyLength, body]);
    };
    return AuthHelper;
}());
exports.default = AuthHelper;
//# sourceMappingURL=AuthHelper.js.map