import { GetOperationStatusResponse } from "../hive/Commands/GetOperationStatusCommand";
import Status from "../dto/Status";
import { TableSchema, RowSet } from "../hive/Types";
export default interface IOperation {
    /**
     * Fetch schema and a portion of data
     */
    fetch(): Promise<Status>;
    /**
     * Request status of operation
     *
     * @param progress
     */
    status(progress: boolean): Promise<GetOperationStatusResponse>;
    /**
     * Cancel operation
     */
    cancel(): Promise<Status>;
    /**
     * Close operation
     */
    close(): Promise<Status>;
    /**
     * Check if operation is finished
     */
    finished(): boolean;
    /**
     * Check if operation hasMoreRows
     */
    hasMoreRows(): boolean;
    /**
     * Set the max fetch size
     */
    setMaxRows(maxRows: number): void;
    /**
     * Return retrieved schema
     */
    getSchema(): TableSchema | null;
    /**
     * Return retrieved data
     */
    getData(): Array<RowSet>;
    /**
     * Request queryId
     */
    getQueryId(): Promise<string>;
}
