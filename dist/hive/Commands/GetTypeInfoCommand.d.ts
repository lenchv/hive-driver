import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export declare type GetTypeInfoRequest = {
    sessionHandle: SessionHandle;
};
export declare type GetTypeInfoResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetTypeInfoCommand extends BaseCommand {
    execute(data: GetTypeInfoRequest): Promise<GetTypeInfoResponse>;
}
