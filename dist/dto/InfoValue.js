"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Int64_1 = __importDefault(require("../utils/Int64"));
var InfoValue = /** @class */ (function () {
    function InfoValue(value) {
        this.value = value;
    }
    InfoValue.prototype.getValue = function () {
        var infoValue = this.value;
        if (infoValue.stringValue) {
            return infoValue.stringValue;
        }
        else if (infoValue.smallIntValue) {
            return infoValue.smallIntValue;
        }
        else if (infoValue.integerBitmask) {
            return infoValue.integerBitmask;
        }
        else if (infoValue.integerFlag) {
            return infoValue.integerFlag;
        }
        else if (infoValue.lenValue) {
            return new Int64_1.default(infoValue.lenValue);
        }
        else {
            return null;
        }
    };
    return InfoValue;
}());
exports.default = InfoValue;
//# sourceMappingURL=InfoValue.js.map