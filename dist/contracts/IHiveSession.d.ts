/// <reference types="node" />
import IOperation from "./IOperation";
import InfoResult from "../result/InfoResult";
import Status from "../dto/Status";
export declare type CrossReferenceRequest = {
    parentCatalogName: string;
    parentSchemaName: string;
    parentTableName: string;
    foreignCatalogName: string;
    foreignSchemaName: string;
    foreignTableName: string;
};
export declare type ExecuteStatementOptions = {
    runAsync?: boolean;
    confOverlay?: Map<string, string>;
    queryTimeout?: Buffer;
};
export declare type SchemasRequest = {
    schemaName?: string;
    catalogName?: string;
};
export declare type TablesRequest = {
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    tableTypes?: Array<string>;
};
export declare type ColumnRequest = {
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    columnName?: string;
};
export declare type FunctionNameRequest = {
    functionName: string;
    catalogName?: string;
    schemaName?: string;
};
export declare type PrimaryKeysRequest = {
    schemaName: string;
    tableName: string;
    catalogName?: string;
};
export default interface IHiveSession {
    getInfo(infoType: number): Promise<InfoResult>;
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
}
