import { TableSchema, RowSet } from "../hive/Types";

export default interface IOperationResult {
    setSchema(schema: TableSchema): void;
    setData(data: Array<RowSet>): void;
    getValue(): any;
}