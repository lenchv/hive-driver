import BaseCommand from "./BaseCommand";
import { Status, OperationHandle } from "../Types";

export type CloseOperationRequest = {
    operationHandle: OperationHandle,
};

export type CloseOperationResponse = {
    status: Status,
};

export default class CloseOperationCommand extends BaseCommand {
    execute(data: CloseOperationRequest): Promise<CloseOperationResponse> {
        const request = new this.TCLIService_types.TCloseOperationReq(data);

        return this.executeCommand<CloseOperationResponse>(request, this.client.CloseOperation);
    }   
}
