import HiveDriver from "./hive/HiveDriver";
import IHiveSession, { ExecuteStatementOptions } from './contracts/IHiveSession';
import { SessionHandle, TCLIServiceTypes } from "./hive/Types";
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
            const status = this.statusFactory.create(response.status);

            if (status.error()) {
                return Promise.reject(status.getError());
            }

            const operation = new HiveOperation(
                this.driver,
                response.operationHandle,
                this.TCLIService_types,
            );

            return operation;
        });
    }

    // getTypeInfo(): IOperation {
        
    // }
    // getCatalogs(): IOperation {
        
    // }
    // getSchemas(): IOperation {
        
    // }
    // getTables(): IOperation {
        
    // }
    // getTableTypes(): IOperation {
        
    // }
    // getColumns(): IOperation {
        
    // }
    // getFunctions(functionName: string): IOperation {
        
    // }
    // getPrimaryKeys(dbName: string, tableName: string): IOperation {

    // }
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
}
