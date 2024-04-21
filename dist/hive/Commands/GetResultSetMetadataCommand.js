"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class GetResultSetMetadataCommand extends BaseCommand_1.default {
    execute(getResultSetMetadataRequest) {
        const request = new this.TCLIService_types.TGetResultSetMetadataReq(getResultSetMetadataRequest);
        return this.executeCommand(request, this.client.GetResultSetMetadata);
    }
}
exports.default = GetResultSetMetadataCommand;
//# sourceMappingURL=GetResultSetMetadataCommand.js.map