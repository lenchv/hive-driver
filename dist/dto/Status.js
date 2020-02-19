"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status = /** @class */ (function () {
    function Status(data) {
        this.isSuccess = data.success;
        this.isError = data.error;
        this.isExecuting = data.executing;
        this.infoMessages = data.infoMessages;
        this.statusError = data.statusError;
    }
    Status.prototype.success = function () {
        return this.isSuccess;
    };
    Status.prototype.error = function () {
        return this.isError;
    };
    Status.prototype.executing = function () {
        return this.isExecuting;
    };
    Status.prototype.getError = function () {
        return this.statusError;
    };
    Status.prototype.getInfo = function () {
        return this.infoMessages;
    };
    return Status;
}());
exports.default = Status;
//# sourceMappingURL=Status.js.map