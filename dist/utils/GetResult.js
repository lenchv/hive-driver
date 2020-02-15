"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NullResult_1 = __importDefault(require("../result/NullResult"));
var JsonResult_1 = __importDefault(require("../result/JsonResult"));
var GetResult = /** @class */ (function () {
    function GetResult(operation, TCLIService_types) {
        this.TCLIService_types = TCLIService_types;
        this.operation = operation;
    }
    /**
     * Combines operation schema and data
     *
     * @param resultHandler you may specify your own result combiner to implement IOperationResult and pass as paramenter.
     *                      If resultHandler is not specified, the internal handler will interpret result as Json.
     */
    GetResult.prototype.execute = function (resultHandler) {
        if (!resultHandler) {
            resultHandler = this.getDefaultHandler();
        }
        resultHandler.setOperation(this.operation);
        return resultHandler;
    };
    GetResult.prototype.getDefaultHandler = function () {
        var schema = this.operation.getSchema();
        if (schema === null) {
            return new NullResult_1.default();
        }
        else {
            return new JsonResult_1.default(this.TCLIService_types);
        }
    };
    return GetResult;
}());
exports.default = GetResult;
//# sourceMappingURL=GetResult.js.map