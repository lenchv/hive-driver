"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status = /** @class */ (function () {
    function Status(status, TCLIService_types) {
        this.status = status;
        this.TCLIService_types = TCLIService_types;
    }
    Status.prototype.success = function () {
        return (this.status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_STATUS
            || this.status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_WITH_INFO_STATUS);
    };
    Status.prototype.error = function () {
        return (this.status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS
            || this.status.statusCode === this.TCLIService_types.TStatusCode.INVALID_HANDLE_STATUS);
    };
    Status.prototype.executing = function () {
        return this.status.statusCode === this.TCLIService_types.TStatusCode.STILL_EXECUTING_STATUS;
    };
    Status.prototype.getError = function () {
        return {
            message: this.status.errorMessage || '',
            stack: this.status.infoMessages || [],
            code: this.status.errorCode || -1,
        };
    };
    Status.prototype.getInfo = function () {
        return this.status.infoMessages || [];
    };
    return Status;
}());
exports.default = Status;
//# sourceMappingURL=Status.js.map