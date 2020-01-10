"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeInt64 = require('node-int64');
var Int64 = /** @class */ (function () {
    function Int64(value) {
        this.value = value;
    }
    Int64.prototype.getValue = function () {
        var result = new NodeInt64(this.value);
        return result.toNumber();
    };
    Int64.prototype.getRawValue = function () {
        return this.value;
    };
    Int64.prototype.getInt64 = function () {
        return new NodeInt64(this.value);
    };
    return Int64;
}());
exports.default = Int64;
//# sourceMappingURL=Int64.js.map