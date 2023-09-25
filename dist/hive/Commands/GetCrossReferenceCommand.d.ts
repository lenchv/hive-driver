import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export type GetCrossReferenceRequest = {
    sessionHandle: SessionHandle;
    parentCatalogName?: string;
    parentSchemaName: string;
    parentTableName: string;
    foreignCatalogName?: string;
    foreignSchemaName: string;
    foreignTableName: string;
};
export type GetCrossReferenceResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetCrossReferenceCommand extends BaseCommand {
    execute(data: GetCrossReferenceRequest): Promise<GetCrossReferenceResponse>;
}
