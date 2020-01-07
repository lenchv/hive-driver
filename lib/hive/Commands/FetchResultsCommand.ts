import BaseCommand from "./BaseCommand";
import { OperationHandle, Status, RowSet } from "../Types";

export type FetchResultsRequest = {
    operationHandle: OperationHandle,
    // TCLIService_types.TFetchOrientation
    orientation: number,
    maxRows: number,
    // 0 represents Query output. 1 represents Log
    fetchType?: number
};

export type FetchResultsResponse = {
    status: Status,
    hasMoreRows?: boolean,
    results?: RowSet
};

export default class FetchResultsCommand extends BaseCommand {
    execute(executeStatementRequest: FetchResultsRequest): Promise<FetchResultsResponse> {
        const request = new this.TCLIService_types.TFetchResultsReq(executeStatementRequest);

        return this.executeCommand(request, this.client.FetchResults);
    }   
}
