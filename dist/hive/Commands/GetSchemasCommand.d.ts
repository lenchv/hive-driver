import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetSchemasRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName?: string;
};
export declare type GetSchemasResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetSchemasCommand extends BaseCommand {
    execute(data: GetSchemasRequest): Promise<GetSchemasResponse>;
}
