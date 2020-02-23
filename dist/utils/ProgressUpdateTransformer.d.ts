import { ProgressUpdateResponse } from "../hive/Types";
export default class ProgressUpdateTransformer {
    private progressUpdate;
    private rowWidth;
    constructor(progressUpdate: ProgressUpdateResponse);
    formatRow(row: Array<string>): string;
    toString(): string;
}
