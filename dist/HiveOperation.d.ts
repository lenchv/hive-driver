import IOperation from "./contracts/IOperation";
import HiveDriver from "./hive/HiveDriver";
import { OperationHandle, TCLIServiceTypes, TableSchema, RowSet } from "./hive/Types";
import Status from "./dto/Status";
import { GetOperationStatusResponse } from "./hive/Commands/GetOperationStatusCommand";
export default class HiveOperation implements IOperation {
    private driver;
    private operationHandle;
    private TCLIService_type;
    private schema;
    private data;
    private statusFactory;
    private maxRows;
    private fetchType;
    private _hasMoreRows;
    private state;
    private hasResultSet;
    constructor(driver: HiveDriver, operationHandle: OperationHandle, TCLIService_type: TCLIServiceTypes);
    /**
     * Fetches result and schema from operation
     * @throws {StatusError}
     */
    fetch(): Promise<Status>;
    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    status(progress?: boolean): Promise<GetOperationStatusResponse>;
    /**
     * Cancels operation
     * @throws {StatusError}
     */
    cancel(): Promise<Status>;
    /**
     * Closes operation
     * @throws {StatusError}
     */
    close(): Promise<Status>;
    finished(): boolean;
    hasMoreRows(): boolean;
    setMaxRows(maxRows: number): void;
    setFetchType(fetchType: number): void;
    getSchema(): TableSchema | null;
    getData(): Array<RowSet>;
    getQueryId(): Promise<string>;
    /**
     * Resets `this.data` buffer.
     * Needs to be called when working with massive data.
     */
    flush(): void;
    /**
     * Retrieves schema
     * @throws {StatusError}
     */
    private initializeSchema;
    private firstFetch;
    private nextFetch;
    /**
     * @param response
     * @throws {StatusError}
     */
    private processFetchResponse;
    private checkIfOperationHasMoreRows;
}
