import { TCLIServiceTypes, RowSet, TableSchema } from "../hive/Types";
import IOperationResult from "./IOperationResult";
export default class JsonResult implements IOperationResult {
    private TCLIService_types;
    private schema;
    private data;
    constructor(TCLIService_types: TCLIServiceTypes);
    setSchema(schema: TableSchema): void;
    setData(data: Array<RowSet>): void;
    getValue(): Array<object>;
    private getSchemaColumns;
    private getRows;
    private getSchemaValues;
    private getColumnName;
    private map;
    private eachValue;
    private convertData;
    private toJSON;
    private convertBigInt;
}
