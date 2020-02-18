import BaseCommand from "./BaseCommand";
import { OperationHandle, Status, RowSet } from "../Types";
/**
 * @param orientation - TCLIService_types.TFetchOrientation
 * @param fetchType - 0 represents Query output. 1 represents Log
 */
export declare type FetchResultsRequest = {
    operationHandle: OperationHandle;
    orientation: number;
    maxRows: number;
    fetchType?: number;
};
export declare type FetchResultsResponse = {
    status: Status;
    hasMoreRows?: boolean;
    results?: RowSet;
};
export default class FetchResultsCommand extends BaseCommand {
    execute(data: FetchResultsRequest): Promise<FetchResultsResponse>;
}
