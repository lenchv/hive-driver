import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions, SchemasRequest, TablesRequest, ColumnRequest, PrimaryKeysRequest, FunctionNameRequest } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes } from "./hive/Types";
import IOperation from "./contracts/IOperation";
import Status from "./dto/Status";
import InfoResult from "./result/InfoResult";
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
    getInfo(infoType: number): Promise<InfoResult>;
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
