"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProgressUpdateTransformer = /** @class */ (function () {
    function ProgressUpdateTransformer(progressUpdate) {
        this.rowWidth = 10;
        this.progressUpdate = progressUpdate;
    }
    ProgressUpdateTransformer.prototype.formatRow = function (row) {
        var _this = this;
        return row.map(function (cell) { return cell.padEnd(_this.rowWidth, ' '); }).join('|');
    };
    ProgressUpdateTransformer.prototype.toString = function () {
        var _this = this;
        var header = this.formatRow(this.progressUpdate.headerNames);
        var footer = this.progressUpdate.footerSummary;
        var rows = this.progressUpdate.rows.map(function (row) {
            return _this.formatRow(row);
        });
        return __spreadArray(__spreadArray([header], rows, true), [footer], false).join('\n');
    };
    return ProgressUpdateTransformer;
}());
exports.default = ProgressUpdateTransformer;
//# sourceMappingURL=ProgressUpdateTransformer.js.map