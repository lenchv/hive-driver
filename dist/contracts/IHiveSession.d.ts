import { GetInfoResponse } from "../hive/Commands/GetInfoCommand";
import IOperation from "./IOperation";
export declare type CrossReferenceRequest = {
    parentCatalogName: string;
    parentSchemaName: string;
    parentTableName: string;
    foreignCatalogName: string;
    foreignSchemaName: string;
    foreignTableName: string;
};
export default interface IHiveSession {
    getInfo(infoType: number): Promise<GetInfoResponse>;
    executeStatement(statement: string): Promise<IOperation>;
}
