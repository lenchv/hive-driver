/// <reference types="node" />
import IOperation from "./IOperation";
import InfoResponse from "../responses/InfoResponse";
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
export default interface IHiveSession {
    getInfo(infoType: number): Promise<InfoResponse>;
    executeStatement(statement: string, options?: ExecuteStatementOptions): Promise<IOperation>;
}
