"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfoValue {
    value;
    constructor(value) {
        this.value = value;
    }
    getValue() {
        const infoValue = this.value;
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
            return infoValue.lenValue;
        }
        else {
            return null;
        }
    }
}
exports.default = InfoValue;
//# sourceMappingURL=InfoValue.js.map