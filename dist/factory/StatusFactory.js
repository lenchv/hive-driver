"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Status_1 = __importDefault(require("../dto/Status"));
var StatusFactory = /** @class */ (function () {
    function StatusFactory(TCLIService_type) {
        this.TCLIService_type = TCLIService_type;
    }
    StatusFactory.prototype.create = function (status) {
        return new Status_1.default(status, this.TCLIService_type);
    };
    return StatusFactory;
}());
exports.default = StatusFactory;
//# sourceMappingURL=StatusFactory.js.map