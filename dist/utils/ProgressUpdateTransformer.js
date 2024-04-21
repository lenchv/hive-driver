"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProgressUpdateTransformer {
    progressUpdate;
    rowWidth = 10;
    constructor(progressUpdate) {
        this.progressUpdate = progressUpdate;
    }
    formatRow(row) {
        return row.map(cell => cell.padEnd(this.rowWidth, ' ')).join('|');
    }
    toString() {
        const header = this.formatRow(this.progressUpdate.headerNames);
        const footer = this.progressUpdate.footerSummary;
        const rows = this.progressUpdate.rows.map((row) => {
            return this.formatRow(row);
        });
        return [header, ...rows, footer].join('\n');
    }
}
exports.default = ProgressUpdateTransformer;
//# sourceMappingURL=ProgressUpdateTransformer.js.map