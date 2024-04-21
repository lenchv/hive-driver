"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
class SetClientInfoCommand extends BaseCommand_1.default {
    execute(data) {
        const request = new this.TCLIService_types.TSetClientInfoReq(data);
        return this.executeCommand(request, this.client.SetClientInfo);
    }
}
exports.default = SetClientInfoCommand;
//# sourceMappingURL=SetClientInfoCommand.js.map