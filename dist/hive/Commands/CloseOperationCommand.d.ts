import BaseCommand from "./BaseCommand";
import { Status, OperationHandle } from "../Types";
export declare type CloseOperationRequest = {
    operationHandle: OperationHandle;
};
export declare type CloseOperationResponse = {
    status: Status;
};
export default class CloseOperationCommand extends BaseCommand {
    execute(data: CloseOperationRequest): Promise<CloseOperationResponse>;
}
