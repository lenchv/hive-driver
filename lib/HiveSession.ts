import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions, SchemasRequest, TablesRequest, ColumnRequest, PrimaryKeysRequest, FunctionNameRequest } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes, Status as TStatus, OperationHandle } from "./hive/Types";
import { ExecuteStatementResponse } from "./hive/Commands/ExecuteStatementCommand";
import IOperation from "./contracts/IOperation";
import HiveOperation from "./HiveOperation";
import Status from "./dto/Status";
import StatusFactory from "./factory/StatusFactory";
import InfoResult from "./result/InfoResult";

export default class HiveSession implements IHiveSession {
    private driver: HiveDriver;
    private sessionHandle: SessionHandle;
    private TCLIService_types: TCLIServiceTypes;
    private statusFactory: StatusFactory;

    constructor(driver: HiveDriver, sessionHandle: SessionHandle, TCLIService_types: TCLIServiceTypes) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
        this.TCLIService_types = TCLIService_types;
        this.statusFactory = new StatusFactory(TCLIService_types);
    }

    /**
     * Returns general information about the data source
     * 
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    getInfo(infoType: number): Promise<InfoResult> {
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType
        }).then(response => {
            return new InfoResult(response, this.TCLIService_types);
        });
    }

    /**
     * Executes DDL/DML statements
     * 
     * @param statement DDL/DML statement
     * @param options
     */
    executeStatement(statement: string, options: ExecuteStatementOptions = {}): Promise<IOperation> {
        options = {
            runAsync: false,
            ...options
        };
        
        return this.driver.executeStatement({
            sessionHandle: this.sessionHandle,
            statement,
            ...options
        }).then((response: ExecuteStatementResponse) => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getTypeInfo(): Promise<IOperation> {
        return this.driver.getTypeInfo({
            sessionHandle: this.sessionHandle
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getCatalogs(): Promise<IOperation> {
        return this.driver.getCatalogs({
            sessionHandle: this.sessionHandle
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getSchemas(request: SchemasRequest): Promise<IOperation> {
        return this.driver.getSchemas({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getTables(request: TablesRequest): Promise<IOperation> {
        return this.driver.getTables({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
            tableTypes: request.tableTypes,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getTableTypes(): Promise<IOperation> {
        return this.driver.getTableTypes({
            sessionHandle: this.sessionHandle,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getColumns(request: ColumnRequest): Promise<IOperation> {
        return this.driver.getColumns({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
            columnName: request.columnName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getFunctions(request: FunctionNameRequest): Promise<IOperation> {
        return this.driver.getFunctions({
            sessionHandle: this.sessionHandle,
            functionName: request.functionName,
            schemaName: request.schemaName,
            catalogName: request.catalogName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getPrimaryKeys(request: PrimaryKeysRequest): Promise<IOperation> {
        return this.driver.getPrimaryKeys({
            sessionHandle: this.sessionHandle,
            catalogName: request.catalogName,
            schemaName: request.schemaName,
            tableName: request.tableName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    close(): Promise<Status> {
        return this.driver.closeSession({
            sessionHandle: this.sessionHandle
        }).then((response) => {
            return this.statusFactory.create(response.status);
        });
    }

    private createOperation(handle: OperationHandle): IOperation {
        return new HiveOperation(
            this.driver,
            handle,
            this.TCLIService_types,
        );
    }

    private assertStatus(responseStatus: TStatus): void {
        const status = this.statusFactory.create(responseStatus);

        if (status.error()) {
            throw status.getError();
        }
    }
}
