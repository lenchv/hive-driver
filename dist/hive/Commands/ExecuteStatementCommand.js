"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class ExecuteStatementCommand extends BaseCommand_1.default {
    execute(executeStatementRequest) {
        const request = new this.TCLIService_types.TExecuteStatementReq(executeStatementRequest);
        return this.executeCommand(request, this.client.ExecuteStatement);
    }
}
exports.default = ExecuteStatementCommand;
//# sourceMappingURL=ExecuteStatementCommand.js.map