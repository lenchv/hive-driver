import { TCLIServiceTypes } from "../hive/Types";
import IOperationResult from "./IOperationResult";
import IOperation from "../contracts/IOperation";
export default class JsonResult implements IOperationResult {
    private TCLIService_types;
    private schema;
    private data;
    constructor(TCLIService_types: TCLIServiceTypes);
    setOperation(operation: IOperation): void;
    getValue(): Array<object>;
    private getSchemaColumns;
    private getRows;
    private getSchemaValues;
    private getColumnName;
    private convertData;
    private isNull;
    private toJSON;
    private convertBigInt;
    private getColumnValue;
}
