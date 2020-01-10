"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Big = require('big.js');
var Int64 = /** @class */ (function () {
    function Int64(value) {
        this.value = value;
    }
    Int64.prototype.getValue = function () {
        var result = this.toInt64(this.value.buffer, this.value.offset);
        var max = new Big(Number.MAX_SAFE_INTEGER);
        if (result.cmp(max) > 0) {
            return Number.MAX_SAFE_INTEGER;
        }
        else {
            return parseInt(result.toString());
        }
    };
    Int64.prototype.getRawValue = function () {
        return this.value;
    };
    Int64.prototype.getBigValue = function () {
        return this.toInt64(this.value.buffer, this.value.offset);
    };
    Int64.prototype.toInt64 = function (buffer, offset) {
        var b = buffer;
        var o = offset;
        var negate = b[o] & 0x80;
        var value = new Big(0);
        var m = new Big(1);
        var carry = 1;
        for (var i = 7; i >= 0; i -= 1) {
            var v = b[o + i];
            if (negate) {
                v = (v ^ 0xff) + carry;
                carry = v >> 8;
                v &= 0xff;
            }
            value = value.plus((new Big(v)).times(m));
            m = m.times(256);
        }
        if (negate) {
            value = value.times(-1);
        }
        return value;
    };
    return Int64;
}());
exports.default = Int64;
//# sourceMappingURL=Int64.js.map