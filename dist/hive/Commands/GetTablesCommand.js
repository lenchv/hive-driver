"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class GetTablesCommand extends BaseCommand_1.default {
    execute(data) {
        const request = new this.TCLIService_types.TGetTablesReq(data);
        return this.executeCommand(request, this.client.GetTables);
    }
}
exports.default = GetTablesCommand;
//# sourceMappingURL=GetTablesCommand.js.map