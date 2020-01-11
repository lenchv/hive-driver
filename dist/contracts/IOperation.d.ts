import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
import Status from "../dto/Status";
import { TableSchema, RowSet } from "../hive/Types";
export default interface IOperation {
    fetch(): Promise<Status>;
    status(progress: boolean): Promise<GetOperationStatusResponse>;
    cancel(): Promise<Status>;
    close(): Promise<Status>;
    finished(): boolean;
    hasMoreRows(): boolean;
    getSchema(): TableSchema | null;
    getData(): Array<RowSet>;
    getQueryId(): Promise<string>;
}
