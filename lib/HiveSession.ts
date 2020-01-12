import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes, Status as TStatus, OperationHandle } from "./hive/Types";
import { ExecuteStatementResponse } from "./hive/Commands/ExecuteStatementCommand";
import IOperation from "./contracts/IOperation";
import HiveOperation from "./HiveOperation";
import InfoResponse from "./responses/InfoResponse";
import Status from "./dto/Status";
import StatusFactory from "./factory/StatusFactory";

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
    getInfo(infoType: number): Promise<InfoResponse> {
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType
        }).then(response => {
            return new InfoResponse(response, this.TCLIService_types);
        });
    }

    /**
     * Executes DDL/DML statements
     * 
     * @param statement DDL/DDL statement
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

    getSchemas(schemaName?: string, catalogName?: string): Promise<IOperation> {
        return this.driver.getSchemas({
            sessionHandle: this.sessionHandle,
            catalogName,
            schemaName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getTables(
        catalogName?: string,
        schemaName?: string,
        tableName?: string,
        tableTypes?: Array<string>,
    ): Promise<IOperation> {
        return this.driver.getTables({
            sessionHandle: this.sessionHandle,
            catalogName,
            schemaName,
            tableName,
            tableTypes,
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

    getColumns(
        catalogName?: string,
        schemaName?: string,
        tableName?: string,
        columnName?: string,
    ): Promise<IOperation> {
        return this.driver.getColumns({
            sessionHandle: this.sessionHandle,
            catalogName,
            schemaName,
            tableName,
            columnName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getFunctions(functionName: string, catalogName?: string, schemaName?: string): Promise<IOperation> {
        return this.driver.getFunctions({
            sessionHandle: this.sessionHandle,
            functionName,
            schemaName,
            catalogName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    getPrimaryKeys(schemaName: string, tableName: string, catalogName?: string): Promise<IOperation> {
        return this.driver.getPrimaryKeys({
            sessionHandle: this.sessionHandle,
            catalogName,
            schemaName,
            tableName,
        }).then(response => {
            this.assertStatus(response.status);

            return this.createOperation(response.operationHandle);
        });
    }

    // getCrossReference(request: CrossReferenceRequest): IOperation {

    // }
    // getDelegationToken(owner: string, renewer: string): string {

    // }
    // cancelDelegationToken(token: string): Status {

    // }
    // renewDelegationToken(token: string): Status {

    // }
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
