"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HiveDriverError_1 = __importDefault(require("./HiveDriverError"));
class OperationStateError extends HiveDriverError_1.default {
    response;
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}
exports.default = OperationStateError;
//# sourceMappingURL=OperationStateError.js.map