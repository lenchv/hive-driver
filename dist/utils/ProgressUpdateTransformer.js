"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
        return __spreadArrays([header], rows, [footer]).join('\n');
    };
    return ProgressUpdateTransformer;
}());
exports.default = ProgressUpdateTransformer;
//# sourceMappingURL=ProgressUpdateTransformer.js.map