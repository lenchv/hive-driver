import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes } from "./hive/Types";
import IOperation from "./contracts/IOperation";
import InfoResponse from "./responses/InfoResponse";
import Status from "./dto/Status";
declare type SchemasRequest = {
    schemaName?: string;
    catalogName?: string;
};
declare type TablesRequest = {
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    tableTypes?: Array<string>;
};
declare type ColumnRequest = {
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    columnName?: string;
};
declare type FunctionNameRequest = {
    functionName: string;
    catalogName?: string;
    schemaName?: string;
};
declare type PrimaryKeysRequest = {
    schemaName: string;
    tableName: string;
    catalogName?: string;
};
export default class HiveSession implements IHiveSession {
    private driver;
    private sessionHandle;
    private TCLIService_types;
    private statusFactory;
    constructor(driver: HiveDriver, sessionHandle: SessionHandle, TCLIService_types: TCLIServiceTypes);
    /**
     * Returns general information about the data source
     *
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    getInfo(infoType: number): Promise<InfoResponse>;
    /**
     * Executes DDL/DML statements
     *
     * @param statement DDL/DDL statement
     * @param options
     */
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>;
    getTypeInfo(): Promise<IOperation>;
    getCatalogs(): Promise<IOperation>;
    getSchemas(request: SchemasRequest): Promise<IOperation>;
    getTables(request: TablesRequest): Promise<IOperation>;
    getTableTypes(): Promise<IOperation>;
    getColumns(request: ColumnRequest): Promise<IOperation>;
    getFunctions(request: FunctionNameRequest): Promise<IOperation>;
    getPrimaryKeys(request: PrimaryKeysRequest): Promise<IOperation>;
    close(): Promise<Status>;
    private createOperation;
    private assertStatus;
}
export {};
