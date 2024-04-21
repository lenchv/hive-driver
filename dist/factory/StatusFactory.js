"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Status_1 = __importDefault(require("../dto/Status"));
const StatusError_1 = __importDefault(require("../errors/StatusError"));
class StatusFactory {
    TCLIService_types;
    constructor(TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
    }
    /**
     * @param status thrift status object from API responses
     * @throws {StatusError}
     */
    create(status) {
        if (this.isError(status)) {
            throw new StatusError_1.default(status);
        }
        return new Status_1.default({
            success: this.isSuccess(status),
            executing: this.isExecuting(status),
            infoMessages: status.infoMessages || [],
        });
    }
    isSuccess(status) {
        return (status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_STATUS
            || status.statusCode === this.TCLIService_types.TStatusCode.SUCCESS_WITH_INFO_STATUS);
    }
    isError(status) {
        return (status.statusCode === this.TCLIService_types.TStatusCode.ERROR_STATUS
            || status.statusCode === this.TCLIService_types.TStatusCode.INVALID_HANDLE_STATUS);
    }
    isExecuting(status) {
        return status.statusCode === this.TCLIService_types.TStatusCode.STILL_EXECUTING_STATUS;
    }
}
exports.default = StatusFactory;
//# sourceMappingURL=StatusFactory.js.map