import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes } from "./hive/Types";
import IOperation from "./contracts/IOperation";
import InfoResponse from "./responses/InfoResponse";
import Status from "./dto/Status";
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
    getSchemas(schemaName?: string, catalogName?: string): Promise<IOperation>;
    getTables(catalogName?: string, schemaName?: string, tableName?: string, tableTypes?: Array<string>): Promise<IOperation>;
    getTableTypes(): Promise<IOperation>;
    getColumns(catalogName?: string, schemaName?: string, tableName?: string, columnName?: string): Promise<IOperation>;
    getFunctions(functionName: string, catalogName?: string, schemaName?: string): Promise<IOperation>;
    getPrimaryKeys(schemaName: string, tableName: string, catalogName?: string): Promise<IOperation>;
    close(): Promise<Status>;
    private createOperation;
    private assertStatus;
}
