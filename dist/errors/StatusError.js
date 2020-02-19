"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusError = /** @class */ (function () {
    function StatusError(status) {
        this.name = 'Status Error';
        this.message = status.errorMessage || '';
        this.code = status.errorCode || -1;
        if (Array.isArray(status.infoMessages)) {
            this.stack = status.infoMessages.join('\n');
        }
    }
    return StatusError;
}());
exports.default = StatusError;
//# sourceMappingURL=StatusError.js.map