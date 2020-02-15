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
    operationStarted?: Buffer,
    operationCompleted?: Buffer,
    hasResultSet?: boolean,
    progressUpdateResponse?: ProgressUpdateResponse,
    numModifiedRows?: Buffer,
};

export default class GetOperationStatusCommand extends BaseCommand {
    execute(data: GetOperationStatusRequest): Promise<GetOperationStatusResponse> {
        const request = new this.TCLIService_types.TGetOperationStatusReq(data);

        return this.executeCommand<GetOperationStatusResponse>(request, this.client.GetOperationStatus);
    }   
}
