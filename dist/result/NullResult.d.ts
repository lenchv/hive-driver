import IOperationResult from "./IOperationResult";
import { TableSchema, RowSet } from "../hive/Types";
export default class NullResult implements IOperationResult {
    setSchema(schema: TableSchema): void;
    setData(data: Array<RowSet>): void;
    getValue(): null;
}
