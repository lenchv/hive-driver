"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NullResult_1 = __importDefault(require("../result/NullResult"));
const JsonResult_1 = __importDefault(require("../result/JsonResult"));
class GetResult {
    TCLIService_types;
    operation;
    constructor(operation, TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
        this.operation = operation;
    }
    /**
     * Combines operation schema and data
     *
     * @param resultHandler you may specify your own result combiner to implement IOperationResult and pass as paramenter.
     *                      If resultHandler is not specified, the internal handler will interpret result as Json.
     */
    execute(resultHandler) {
        if (!resultHandler) {
            resultHandler = this.getDefaultHandler();
        }
        resultHandler.setOperation(this.operation);
        return resultHandler;
    }
    getDefaultHandler() {
        const schema = this.operation.getSchema();
        if (schema === null) {
            return new NullResult_1.default();
        }
        else {
            return new JsonResult_1.default(this.TCLIService_types);
        }
    }
}
exports.default = GetResult;
//# sourceMappingURL=GetResult.js.map