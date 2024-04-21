"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Status {
    isSuccess;
    isExecuting;
    infoMessages;
    constructor(data) {
        this.isSuccess = data.success;
        this.isExecuting = data.executing;
        this.infoMessages = data.infoMessages;
    }
    success() {
        return this.isSuccess;
    }
    executing() {
        return this.isExecuting;
    }
    getInfo() {
        return this.infoMessages;
    }
}
exports.default = Status;
//# sourceMappingURL=Status.js.map