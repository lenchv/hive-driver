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
    /**
     * Returns general information about the data source
     * 
     * @param infoType one of the values TCLIService_types.TGetInfoType
     */
    getInfo(infoType: number): Promise<InfoResult>,
    
    /**
     * Executes DDL/DML statements
     * 
     * @param statement DDL/DML statement
     * @param options
     */
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>,
    
    /**
     * Informataion about supported data types
     */
    getTypeInfo(): Promise<IOperation>,

    /**
     * Get list of catalogs
     */
    getCatalogs(): Promise<IOperation>,

    /**
     * Get list of databases
     * 
     * @param request 
     */
    getSchemas(request: SchemasRequest): Promise<IOperation>,

    /**
     * Get list of tables
     * 
     * @param request 
     */
    getTables(request: TablesRequest): Promise<IOperation>,
    
    /**
     * Get list of supported table types
     */
    getTableTypes(): Promise<IOperation>,

    /**
     * Get full information about columns of the table
     * 
     * @param request 
     */
    getColumns(request: ColumnRequest): Promise<IOperation>,
    
    /**
     * Get information about function
     * 
     * @param request 
     */
    getFunctions(request: FunctionNameRequest): Promise<IOperation>,
    
    /**
     * Get primary keys of table
     * 
     * @param request 
     */
    getPrimaryKeys(request: PrimaryKeysRequest): Promise<IOperation>,

    // getCrossReference(request: CrossReferenceRequest): IOperation,
    // getDelegationToken(owner: string, renewer: string): string;
    // cancelDelegationToken(token: string): Status;
    // renewDelegationToken(token: string): Status;

    /**
     * closes the session
     */
    close(): Promise<Status>
}
