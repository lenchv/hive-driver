import { GetInfoResponse } from "../hive/Commands/GetInfoCommand";
import { Status } from "../hive/Types";
import IOperation from "./IOperation";

export type CrossReferenceRequest = {
    parentCatalogName: string,
    parentSchemaName: string,
    parentTableName: string,
    foreignCatalogName: string,
    foreignSchemaName: string,
    foreignTableName: string,
};

export default interface IHiveSession {
    getInfo(infoType: number): Promise<GetInfoResponse>,
    executeStatement(statement: string): Promise<IOperation>,
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
