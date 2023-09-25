import BaseCommand from "./BaseCommand";
import { Status, SessionHandle, OperationHandle } from "../Types";
export type GetTypeInfoRequest = {
    sessionHandle: SessionHandle;
};
export type GetTypeInfoResponse = {
    status: Status;
    operationHandle: OperationHandle;
};
export default class GetTypeInfoCommand extends BaseCommand {
    execute(data: GetTypeInfoRequest): Promise<GetTypeInfoResponse>;
}
