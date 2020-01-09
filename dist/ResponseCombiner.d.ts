import { TCLIServiceTypes } from "./hive/ThriftService";
import { ExecuteStatementResult } from "./ExecuteStatementResponse";
export default class ResponseCombiner {
    private TCLIService_types;
    constructor(TCLIService_types: TCLIServiceTypes);
    combine(response: ExecuteStatementResult): Array<object>;
    private getSchemaColumns;
    private getRows;
    private getSchemaValues;
    private getColumnName;
    private getValueType;
    private convertData;
    private toJSON;
    private convertBigInt;
    toInt64(buffer: any, offset: any): any;
}
