"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class OpenSessionCommand extends BaseCommand_1.default {
    execute(openSessionRequest) {
        const request = new this.TCLIService_types.TOpenSessionReq(openSessionRequest);
        return this.executeCommand(request, this.client.OpenSession);
    }
}
exports.default = OpenSessionCommand;
//# sourceMappingURL=OpenSessionCommand.js.map