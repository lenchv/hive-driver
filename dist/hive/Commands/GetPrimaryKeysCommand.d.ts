import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export type GetPrimaryKeysRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName: string;
    tableName: string;
};
export type GetPrimaryKeysResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetPrimaryKeysCommand extends BaseCommand {
    execute(data: GetPrimaryKeysRequest): Promise<GetPrimaryKeysResponse>;
}
