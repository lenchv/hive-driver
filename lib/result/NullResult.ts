import IOperationResult from "./IOperationResult";
import { TableSchema, RowSet } from "../hive/Types";

export default class NullResult implements IOperationResult {
    setSchema(schema: TableSchema) {}

    setData(data: Array<RowSet>) {}

    getValue(): null {
        return null;
    }
}
