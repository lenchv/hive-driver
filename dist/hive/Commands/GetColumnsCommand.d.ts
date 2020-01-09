import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetColumnsRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    columnName?: string;
};
export declare type GetColumnsResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetColumnsCommand extends BaseCommand {
    execute(data: GetColumnsRequest): Promise<GetColumnsResponse>;
}
