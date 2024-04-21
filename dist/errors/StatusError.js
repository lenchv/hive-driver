"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusError {
    name;
    message;
    code;
    stack;
    constructor(status) {
        this.name = 'Status Error';
        this.message = status.errorMessage || '';
        this.code = status.errorCode || -1;
        if (Array.isArray(status.infoMessages)) {
            this.stack = status.infoMessages.join('\n');
        }
    }
}
exports.default = StatusError;
//# sourceMappingURL=StatusError.js.map