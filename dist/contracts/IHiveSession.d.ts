/// <reference types="node" />
import IOperation from "./IOperation";
import Status from "../dto/Status";
import InfoValue from "../dto/InfoValue";
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
    /**
     * Returns general information about the data source
     *
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    getInfo(infoType: number): Promise<InfoValue>;
    /**
     * Executes DDL/DML statements
     *
     * @param statement DDL/DML statement
     * @param options
     */
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>;
    /**
     * Informataion about supported data types
     */
    getTypeInfo(): Promise<IOperation>;
    /**
     * Get list of catalogs
     */
    getCatalogs(): Promise<IOperation>;
    /**
     * Get list of databases
     *
     * @param request
     */
    getSchemas(request: SchemasRequest): Promise<IOperation>;
    /**
     * Get list of tables
     *
     * @param request
     */
    getTables(request: TablesRequest): Promise<IOperation>;
    /**
     * Get list of supported table types
     */
    getTableTypes(): Promise<IOperation>;
    /**
     * Get full information about columns of the table
     *
     * @param request
     */
    getColumns(request: ColumnRequest): Promise<IOperation>;
    /**
     * Get information about function
     *
     * @param request
     */
    getFunctions(request: FunctionNameRequest): Promise<IOperation>;
    /**
     * Get primary keys of table
     *
     * @param request
     */
    getPrimaryKeys(request: PrimaryKeysRequest): Promise<IOperation>;
    /**
     * Request information about foreign keys between two tables
     * @param request
     */
    getCrossReference(request: CrossReferenceRequest): Promise<IOperation>;
    /**
     * Get delegation token. For kerberos auth only
     *
     * @param owner
     * @param renewer
     */
    getDelegationToken(owner: string, renewer: string): Promise<string>;
    /**
     * Renew delegation token/ For kerberos auth only
     * @param token
     */
    renewDelegationToken(token: string): Promise<Status>;
    /**
     * Cancel delegation token. For kerberos auth only
     * @param token
     */
    cancelDelegationToken(token: string): Promise<Status>;
    /**
     * closes the session
     */
    close(): Promise<Status>;
}
