import IOperation from "./IOperation";
import InfoResult from "../result/InfoResult";
import Status from "../dto/Status";

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

export type SchemasRequest = {
    schemaName?: string,
    catalogName?: string
};

export type TablesRequest = {
    catalogName?: string,
    schemaName?: string,
    tableName?: string,
    tableTypes?: Array<string>,
};

export type ColumnRequest = {
    catalogName?: string,
    schemaName?: string,
    tableName?: string,
    columnName?: string,
};

export type FunctionNameRequest = {
    functionName: string,
    catalogName?: string,
    schemaName?: string,
};

export type PrimaryKeysRequest = {
    schemaName: string,
    tableName: string,
    catalogName?: string,
};

export default interface IHiveSession {
    getInfo(infoType: number): Promise<InfoResult>,
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>,
    getTypeInfo(): Promise<IOperation>,
    getCatalogs(): Promise<IOperation>,
    getSchemas(request: SchemasRequest): Promise<IOperation>,
    getTables(request: TablesRequest): Promise<IOperation>,
    getTableTypes(): Promise<IOperation>,
    getColumns(request: ColumnRequest): Promise<IOperation>,
    getFunctions(request: FunctionNameRequest): Promise<IOperation>,
    getPrimaryKeys(request: PrimaryKeysRequest): Promise<IOperation>,
    // getCrossReference(request: CrossReferenceRequest): IOperation,
    // getDelegationToken(owner: string, renewer: string): string;
    // cancelDelegationToken(token: string): Status;
    // renewDelegationToken(token: string): Status;
    close(): Promise<Status>
}
