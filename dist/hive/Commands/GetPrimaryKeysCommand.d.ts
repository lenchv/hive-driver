import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetPrimaryKeysRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName: string;
    tableName: string;
};
export declare type GetPrimaryKeysResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetPrimaryKeysCommand extends BaseCommand {
    execute(data: GetPrimaryKeysRequest): Promise<GetPrimaryKeysResponse>;
}
