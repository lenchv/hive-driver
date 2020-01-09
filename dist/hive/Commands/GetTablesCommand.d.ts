import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetTablesRequest = {
    sessionHandle: SessionHandle;
    catalogName?: string;
    schemaName?: string;
    tableName?: string;
    tableTypes?: Array<string>;
};
export declare type GetTablesResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetTablesCommand extends BaseCommand {
    execute(data: GetTablesRequest): Promise<GetTablesResponse>;
}
