import { ProgressUpdateResponse } from "../hive/Types";

export default class ProgressUpdateTransformer {
    private progressUpdate: ProgressUpdateResponse;
    private rowWidth: number = 10;

    constructor(progressUpdate: ProgressUpdateResponse) {
        this.progressUpdate = progressUpdate;
    }

    formatRow(row: Array<string>): string {
        return row.map(cell => cell.padEnd(this.rowWidth, ' ')).join('|');
    }

    toString() {
        const header = this.formatRow(this.progressUpdate.headerNames);
        const footer = this.progressUpdate.footerSummary;
        const rows = this.progressUpdate.rows.map((row: Array<string>) => {
            return this.formatRow(row);
        });

        return [ header, ...rows, footer ].join('\n');
    }
}