import { GetResultSetMetadataResponse } from "../hive/Commands/GetResultSetMetadataCommand";
import { FetchResultsResponse } from "../hive/Commands/FetchResultsCommand";
import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
import { Status } from "../hive/Types";

export default interface IOperation {
    // getResultSetMetadata(): GetResultSetMetadataResponse;
    // fetchResults(maxRows: number, fetchType: number): FetchResultsResponse;
    // getStatus(progress: boolean): GetOperationStatusResponse;
    // getQueryId(): string;
    // cancel(): Status;
    // close(): Status;
}
