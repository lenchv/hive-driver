import HiveDriver from "./hive/HiveDriver";
import { GetInfoResponse } from "./hive/Commands/GetInfoCommand";
import IHiveSession from './contracts/IHiveSession';
import { SessionHandle } from "./hive/Types";
import { ExecuteStatementResponse } from "./hive/Commands/ExecuteStatementCommand";
import IOperation from "./contracts/IOperation";
import Operation from "./Operation";

export default class HiveSession implements IHiveSession {
    private driver: HiveDriver;
    private sessionHandle: SessionHandle;

    constructor(driver: HiveDriver, sessionHandle: SessionHandle) {
        this.driver = driver;
        this.sessionHandle = sessionHandle;
    }

    getInfo(infoType: number): Promise<GetInfoResponse> {
        return this.driver.getInfo({
            sessionHandle: this.sessionHandle,
            infoType
        });
    }

    executeStatement(statement: string): Promise<IOperation> {
        return this.driver.executeStatement({
            sessionHandle: this.sessionHandle,
            runAsync: false,
            statement,
        }).then((response: ExecuteStatementResponse) => {
            const operation = new Operation(
                this.driver,
                response.operationHandle
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
    // close(): Status {

    // }
}
