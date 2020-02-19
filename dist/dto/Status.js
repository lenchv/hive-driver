"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status = /** @class */ (function () {
    function Status(data) {
        this.isSuccess = data.success;
        this.isExecuting = data.executing;
        this.infoMessages = data.infoMessages;
    }
    Status.prototype.success = function () {
        return this.isSuccess;
    };
    Status.prototype.executing = function () {
        return this.isExecuting;
    };
    Status.prototype.getInfo = function () {
        return this.infoMessages;
    };
    return Status;
}());
exports.default = Status;
//# sourceMappingURL=Status.js.map