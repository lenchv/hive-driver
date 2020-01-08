import BaseCommand from "./BaseCommand";
import { Status, OperationHandle } from "../Types";

export type CancelOperationRequest = {
    operationHandle: OperationHandle,
};

export type CancelOperationResponse = {
    status: Status,
};

export default class CancelOperationCommand extends BaseCommand {
    execute(data: CancelOperationRequest): Promise<CancelOperationResponse> {
        const request = new this.TCLIService_types.TCancelOperationReq(data);

        return this.executeCommand<CancelOperationResponse>(request, this.client.CancelOperation);
    }   
}
