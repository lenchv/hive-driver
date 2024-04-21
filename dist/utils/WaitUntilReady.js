"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OperationStateError_1 = __importDefault(require("../errors/OperationStateError"));
class WaitUntilReady {
    operation;
    TCLIService_types;
    constructor(operation, TCLIService_types) {
        this.operation = operation;
        this.TCLIService_types = TCLIService_types;
    }
    /**
     * Executes until operation has status finished or has one of the invalid states
     *
     * @param progress flag for operation status command. If it sets true, response will include progressUpdateResponse with progress information
     * @param callback if callback specified it will be called each time the operation status response received and it will be passed as first parameter
     */
    async execute(progress, callback) {
        const response = await this.operation.status(Boolean(progress));
        if (typeof callback === 'function') {
            await this.executeCallback(callback.bind(null, response));
        }
        try {
            const isReady = this.isReady(response);
            if (isReady) {
                return this.operation;
            }
            else {
                return this.execute(progress, callback);
            }
        }
        catch (error) {
            throw error;
        }
    }
    isReady(response) {
        switch (response.operationState) {
            case this.TCLIService_types.TOperationState.INITIALIZED_STATE:
                return false;
            case this.TCLIService_types.TOperationState.RUNNING_STATE:
                return false;
            case this.TCLIService_types.TOperationState.FINISHED_STATE:
                return true;
            case this.TCLIService_types.TOperationState.CANCELED_STATE:
                throw new OperationStateError_1.default('The operation was canceled by a client', response);
            case this.TCLIService_types.TOperationState.CLOSED_STATE:
                throw new OperationStateError_1.default('The operation was closed by a client', response);
            case this.TCLIService_types.TOperationState.ERROR_STATE:
                throw new OperationStateError_1.default('The operation failed due to an error', response);
            case this.TCLIService_types.TOperationState.PENDING_STATE:
                return false;
            case this.TCLIService_types.TOperationState.TIMEDOUT_STATE:
                throw new OperationStateError_1.default('The operation is in a timedout state', response);
            case this.TCLIService_types.TOperationState.UKNOWN_STATE:
            default:
                throw new OperationStateError_1.default('The operation is in an unrecognized state', response);
        }
    }
    executeCallback(callback) {
        const result = callback();
        if (result instanceof Promise) {
            return result;
        }
        else {
            return Promise.resolve(result);
        }
    }
}
exports.default = WaitUntilReady;
//# sourceMappingURL=WaitUntilReady.js.map