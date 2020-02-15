import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetCrossReferenceRequest = {
    sessionHandle: SessionHandle;
    parentCatalogName?: string;
    parentSchemaName: string;
    parentTableName: string;
    foreignCatalogName?: string;
    foreignSchemaName: string;
    foreignTableName: string;
};
export declare type GetCrossReferenceResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetCrossReferenceCommand extends BaseCommand {
    execute(data: GetCrossReferenceRequest): Promise<GetCrossReferenceResponse>;
}
