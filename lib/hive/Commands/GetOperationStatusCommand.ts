import BaseCommand from "./BaseCommand";
import { Status, OperationHandle, ProgressUpdateResponse } from "../Types";

export type GetOperationStatusRequest = {
    operationHandle: OperationHandle,
    getProgressUpdate?: boolean 
};

export type GetOperationStatusResponse = {
    status: Status,
    operationState?: number,
    sqlState?: string,
    errorCode?: number,
    errorMessage?: string,
    taskStatus?: string,
    operationStarted?: Buffer | string,
    operationCompleted?: Buffer | string,
    hasResultSet?: boolean,
    progressUpdateResponse?: ProgressUpdateResponse,
    numModifiedRows?: Buffer | string,
};

export default class GetOperationStatusCommand extends BaseCommand {
    execute(data: GetOperationStatusRequest): Promise<GetOperationStatusResponse> {
        const request = new this.TCLIService_types.TGetOperationStatusReq(data);

        return this.executeCommand<GetOperationStatusResponse>(request, this.client.GetOperationStatus);
    }   
}
