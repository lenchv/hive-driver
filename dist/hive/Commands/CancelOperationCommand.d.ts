import BaseCommand from "./BaseCommand";
import { Status, OperationHandle } from "../Types";
export declare type CancelOperationRequest = {
    operationHandle: OperationHandle;
};
export declare type CancelOperationResponse = {
    status: Status;
};
export default class CancelOperationCommand extends BaseCommand {
    execute(data: CancelOperationRequest): Promise<CancelOperationResponse>;
}
