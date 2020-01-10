import IOperation from "./IOperation";
import InfoResponse from "../responses/InfoResponse";

export type CrossReferenceRequest = {
    parentCatalogName: string,
    parentSchemaName: string,
    parentTableName: string,
    foreignCatalogName: string,
    foreignSchemaName: string,
    foreignTableName: string,
};

export type ExecuteStatementOptions = {
    runAsync?: boolean,
    confOverlay?: Map<string, string>,
    queryTimeout?: Buffer
};

export default interface IHiveSession {
    getInfo(infoType: number): Promise<InfoResponse>,
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>,
    // getTypeInfo(): IOperation,
    // getCatalogs(): IOperation,
    // getSchemas(): IOperation,
    // getTables(): IOperation,
    // getTableTypes(): IOperation,
    // getColumns(): IOperation,
    // getFunctions(functionName: string): IOperation,
    // getPrimaryKeys(dbName: string, tableName: string): IOperation,
    // getCrossReference(request: CrossReferenceRequest): IOperation,
    // getDelegationToken(owner: string, renewer: string): string;
    // cancelDelegationToken(token: string): Status;
    // renewDelegationToken(token: string): Status;
    // close(): Status
}
