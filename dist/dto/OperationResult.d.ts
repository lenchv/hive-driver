import { TCLIServiceTypes, RowSet, TableSchema } from "../hive/Types";
export default class OperationResult {
    private TCLIService_types;
    private schema;
    private data;
    constructor(schema: TableSchema, data: Array<RowSet>, TCLIService_types: TCLIServiceTypes);
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
