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
export default interface IHiveSession {
    getInfo(infoType: number): Promise<InfoResponse>;
    executeStatement(statement: string): Promise<IOperation>;
}
