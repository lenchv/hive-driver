"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Status_1 = __importDefault(require("../dto/Status"));
var InfoValue_1 = __importDefault(require("../dto/InfoValue"));
var InfoResult = /** @class */ (function () {
    function InfoResult(response, TCLIService_types) {
        this.status = new Status_1.default(response.status, TCLIService_types);
        this.value = new InfoValue_1.default(response.infoValue);
    }
    return InfoResult;
}());
exports.default = InfoResult;
//# sourceMappingURL=InfoResult.js.map