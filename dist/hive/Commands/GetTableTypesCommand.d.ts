import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetTableTypesRequest = {
    sessionHandle: SessionHandle;
};
export declare type GetTableTypesResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetTableTypesCommand extends BaseCommand {
    execute(data: GetTableTypesRequest): Promise<GetTableTypesResponse>;
}
