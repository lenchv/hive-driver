import { TableSchema, Status, OperationHandle } from "../Types";
import BaseCommand from "./BaseCommand";
export declare type GetResultSetMetadataRequest = {
    operationHandle: OperationHandle;
};
export declare type GetResultSetMetadataResponse = {
    status: Status;
    schema: TableSchema;
};
export default class GetResultSetMetadataCommand extends BaseCommand {
    execute(getResultSetMetadataRequest: GetResultSetMetadataRequest): Promise<GetResultSetMetadataResponse>;
}
