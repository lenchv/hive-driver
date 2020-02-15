import { TableSchema, RowSet } from "../hive/Types";
import IOperation from "../contracts/IOperation";

export default interface IOperationResult {
    setOperation(operation: IOperation): void;
    getValue(): any;
}