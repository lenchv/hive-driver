import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export type GetSchemasRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName?: string;
};
export type GetSchemasResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetSchemasCommand extends BaseCommand {
    execute(data: GetSchemasRequest): Promise<GetSchemasResponse>;
}
