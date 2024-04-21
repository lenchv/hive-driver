"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class GetOperationStatusCommand extends BaseCommand_1.default {
    execute(data) {
        const request = new this.TCLIService_types.TGetOperationStatusReq(data);
        return this.executeCommand(request, this.client.GetOperationStatus);
    }
}
exports.default = GetOperationStatusCommand;
//# sourceMappingURL=GetOperationStatusCommand.js.map